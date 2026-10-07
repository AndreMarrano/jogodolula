import type { LevelDefinition, Source } from "./types";

export interface ContentIssue {
  severity: "error" | "warning";
  levelId?: string;
  message: string;
}

/**
 * Checa a consistência do conteúdo editorial.
 *
 * Erros: inconsistências que não podem existir nem em desenvolvimento
 * (IDs inexistentes ou duplicados, `verified` sem base, fase jogável sem
 * contexto, conteúdo em fase bloqueada).
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
    if (s.status === "verified" && !s.checkedAt) {
      error(`Fonte "${s.id}" marcada como verificada sem data de checagem (checkedAt).`);
    }
    if (!/^https?:\/\//.test(s.url)) error(`Fonte "${s.id}" com URL inválida: "${s.url}".`);
    if (s.status === "pending") warn(`Fonte "${s.id}" ainda não verificada.`);
  }

  const levelIds = new Set<string>();
  const levelNumbers = new Set<number>();
  const claimIds = new Set<string>();

  for (const level of levels) {
    const lid = level.id;
    if (levelIds.has(lid)) error(`Fase duplicada: "${lid}".`, lid);
    levelIds.add(lid);
    if (levelNumbers.has(level.number)) error(`Número de fase repetido: ${level.number}.`, lid);
    levelNumbers.add(level.number);

    for (const sid of level.sourceIds) {
      if (!sourceMap.has(sid)) error(`Fase cita fonte inexistente: "${sid}".`, lid);
    }

    if (!level.fictionalizationNote.trim()) error("Fase sem nota sobre o que é encenação.", lid);

    const playable = level.implementationStatus !== "planned";
    if (playable && level.claims.length === 0) {
      error("Fase jogável sem nenhum conteúdo de contexto.", lid);
    }

    if (level.editorialStatus === "blocked") {
      if (level.claims.length > 0) error("Fase bloqueada para pesquisa não pode ter afirmações.", lid);
      if (playable) error("Fase bloqueada para pesquisa não pode estar jogável.", lid);
    }

    let pendingClaims = 0;
    for (const claim of level.claims) {
      if (claimIds.has(claim.id)) error(`Afirmação com ID duplicado: "${claim.id}".`, lid);
      claimIds.add(claim.id);

      if (!claim.text.trim()) error(`Afirmação "${claim.id}" sem texto.`, lid);

      for (const sid of claim.sourceIds) {
        if (!sourceMap.has(sid)) error(`Afirmação "${claim.id}" cita fonte inexistente: "${sid}".`, lid);
      }

      if (claim.category === "allegation" && !claim.attribution?.trim()) {
        error(`Alegação "${claim.id}" sem autoria/data (attribution).`, lid);
      }

      if (claim.status === "verified") {
        if (claim.sourceIds.length === 0) {
          error(`Afirmação "${claim.id}" marcada como verificada sem nenhuma fonte.`, lid);
        }
        for (const sid of claim.sourceIds) {
          const s = sourceMap.get(sid);
          if (s && s.status !== "verified") {
            error(`Afirmação "${claim.id}" verificada, mas a fonte "${sid}" está pendente.`, lid);
          }
        }
      } else {
        pendingClaims++;
        if (claim.sourceIds.length === 0) warn(`Afirmação "${claim.id}" ainda sem fonte.`, lid);
      }
    }

    if (level.editorialStatus === "verified" && pendingClaims > 0) {
      error(`Fase marcada como verificada com ${pendingClaims} afirmação(ões) pendente(s).`, lid);
    }
    if (pendingClaims > 0) warn(`${pendingClaims} afirmação(ões) pendente(s) de checagem.`, lid);
  }

  return issues;
}
