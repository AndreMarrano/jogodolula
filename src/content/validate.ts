import type { LevelDefinition, NarrativeEvent, Source } from "./types";

export interface ContentIssue {
  severity: "error" | "warning";
  levelId?: string;
  message: string;
}

/**
 * Checa a consistência do conteúdo editorial.
 *
 * Erros: inconsistências que não podem existir nem em desenvolvimento (IDs
 * inexistentes ou duplicados, `reviewed` sem base, alegação sem atribuição,
 * metáfora sem nota de ficção, fase jogável sem defesa ou sem desfecho).
 * Avisos: pendências editoriais normais de um protótipo.
 */
export function validateContent(levels: LevelDefinition[], sources: Source[]): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const error = (message: string, levelId?: string) => issues.push({ severity: "error", levelId, message });
  const warn = (message: string, levelId?: string) => issues.push({ severity: "warning", levelId, message });

  const sourceMap = new Map<string, Source>();
  for (const s of sources) {
    if (sourceMap.has(s.id)) error(`Fonte duplicada: "${s.id}".`);
    sourceMap.set(s.id, s);
    if (s.status === "reviewed" && !s.checkedAt) {
      error(`Fonte "${s.id}" marcada como revisada sem data de checagem (checkedAt).`);
    }
    if (!/^https?:\/\//.test(s.url)) error(`Fonte "${s.id}" com URL inválida: "${s.url}".`);
    if (s.status === "pending") warn(`Fonte "${s.id}" ainda não revisada.`);
  }

  const checkRefs = (ids: string[], what: string, levelId: string) => {
    for (const id of ids) if (!sourceMap.has(id)) error(`${what} cita fonte inexistente: "${id}".`, levelId);
  };

  const levelIds = new Set<string>();
  const levelNumbers = new Set<number>();
  const claimIds = new Set<string>();
  const eventIds = new Set<string>();

  for (const level of levels) {
    const lid = level.id;
    if (levelIds.has(lid)) error(`Fase duplicada: "${lid}".`, lid);
    levelIds.add(lid);
    if (levelNumbers.has(level.number)) error(`Número de fase repetido: ${level.number}.`, lid);
    levelNumbers.add(level.number);

    checkRefs(level.sourceIds, "Fase", lid);
    if (level.factualLine) checkRefs(level.factualLine.sourceIds, "Linha factual da abertura", lid);
    if (!level.fictionalizationNote.trim()) error("Fase sem nota sobre o que é encenação.", lid);

    const playable = level.implementationStatus !== "planned";
    if (playable) {
      if (level.claims.length === 0) error("Fase jogável sem nenhum conteúdo de contexto.", lid);
      if (level.outcomes.length === 0) error("Fase jogável sem desfecho.", lid);
      if (!level.narrativeEvents.some((e) => e.category === "defense")) {
        error("Fase jogável sem a versão da defesa dentro da fase.", lid);
      }
    }

    if (level.editorialStatus === "blocked") {
      if (level.claims.length > 0 || level.narrativeEvents.length > 0) {
        error("Fase bloqueada para pesquisa não pode ter conteúdo.", lid);
      }
      if (playable) error("Fase bloqueada para pesquisa não pode estar jogável.", lid);
    }

    // Afirmações do painel de contexto
    let pendingClaims = 0;
    for (const claim of level.claims) {
      if (claimIds.has(claim.id)) error(`Afirmação com ID duplicado: "${claim.id}".`, lid);
      claimIds.add(claim.id);
      if (!claim.text.trim()) error(`Afirmação "${claim.id}" sem texto.`, lid);
      checkRefs(claim.sourceIds, `Afirmação "${claim.id}"`, lid);

      if ((claim.category === "allegation" || claim.category === "defense") && !claim.attribution?.trim()) {
        error(`Afirmação "${claim.id}" (${claim.category}) sem autoria/data (attribution).`, lid);
      }

      if (claim.status === "reviewed") {
        if (claim.sourceIds.length === 0) error(`Afirmação "${claim.id}" revisada sem nenhuma fonte.`, lid);
        for (const sid of claim.sourceIds) {
          const s = sourceMap.get(sid);
          if (s && s.status !== "reviewed") error(`Afirmação "${claim.id}" revisada, mas a fonte "${sid}" está pendente.`, lid);
        }
      } else {
        pendingClaims++;
        if (claim.sourceIds.length === 0) warn(`Afirmação "${claim.id}" ainda sem fonte.`, lid);
      }
    }
    if (level.editorialStatus === "reviewed" && pendingClaims > 0) {
      error(`Fase marcada como revisada com ${pendingClaims} afirmação(ões) pendente(s).`, lid);
    }
    if (pendingClaims > 0) warn(`${pendingClaims} afirmação(ões) pendente(s) de revisão.`, lid);

    // Eventos narrativos (interações em cena)
    const levelEventIds = new Set(level.narrativeEvents.map((e) => e.id));
    for (const ev of level.narrativeEvents) {
      if (eventIds.has(ev.id)) error(`Evento com ID duplicado: "${ev.id}".`, lid);
      eventIds.add(ev.id);
      checkRefs(ev.sourceIds, `Evento "${ev.id}"`, lid);
      if (ev.sourceIds.length === 0) error(`Evento "${ev.id}" sem fonte.`, lid);
      if (!ev.attributionLabel.trim()) error(`Evento "${ev.id}" sem atribuição.`, lid);
      if (!ev.satireText.trim() || !ev.sourcedSummary.trim()) error(`Evento "${ev.id}" sem fala ou sem resumo.`, lid);
      const needsFiction = ev.category === "metaphor" || ev.objectKind === "npc" || ev.objectKind === "contract";
      if (needsFiction && !ev.fictionNote?.trim()) {
        error(`Evento "${ev.id}" (${ev.category === "metaphor" ? "metáfora" : ev.objectKind}) sem nota de ficção.`, lid);
      }
      if (ev.nextEventId && !levelEventIds.has(ev.nextEventId)) {
        error(`Evento "${ev.id}" aponta para evento inexistente: "${ev.nextEventId}".`, lid);
      }
    }

    const chain = new Set(requiredEventOrder(level));
    for (const ev of level.narrativeEvents) {
      if (ev.required && !chain.has(ev.id)) error(`Evento obrigatório "${ev.id}" fora da sequência de missões.`, lid);
    }

    // Desfechos
    for (const out of level.outcomes) {
      if (out.sourceIds.length === 0) error(`Desfecho "${out.id}" sem fonte.`, lid);
      checkRefs(out.sourceIds, `Desfecho "${out.id}"`, lid);
    }
  }

  return issues;
}

/** Ordem das missões obrigatórias, seguindo `nextEventId` a partir da primeira. */
export function requiredEventOrder(level: LevelDefinition): string[] {
  const byId = new Map(level.narrativeEvents.map((e) => [e.id, e]));
  const order: string[] = [];
  const seen = new Set<string>();
  let current: NarrativeEvent | undefined = level.narrativeEvents[0];
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    if (current.required) order.push(current.id);
    current = current.nextEventId ? byId.get(current.nextEventId) : undefined;
  }
  return order;
}
