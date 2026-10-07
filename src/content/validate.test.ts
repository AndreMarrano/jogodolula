import { describe, expect, it } from "vitest";
import { levels } from "./levels";
import { triplexLevel } from "./levels/triplex";
import { sources } from "./sources";
import type { LevelDefinition, NarrativeEvent, Source } from "./types";
import { requiredEventOrder, validateContent } from "./validate";
import { allReviewed, canShowSourced, visibleClaims, visibleSources } from "./visibility";

const errors = (lv: LevelDefinition[], src: Source[]) =>
  validateContent(lv, src).filter((i) => i.severity === "error").map((i) => i.message);

const source = (over: Partial<Source> = {}): Source => ({
  id: "s1",
  title: "Fonte",
  publisher: "Veículo",
  url: "https://example.org/a",
  status: "pending",
  ...over,
});

const event = (over: Partial<NarrativeEvent> = {}): NarrativeEvent => ({
  id: "e1",
  missionTitle: "Missão",
  hudObjective: "Faça algo.",
  trigger: "interact",
  objectKind: "defense_card",
  objectLabel: "Defesa",
  satireText: "Piada.",
  sourcedSummary: "Resumo.",
  attributionLabel: "Defesa • Veículo • 01/01/2017",
  category: "defense",
  sourceIds: ["s1"],
  required: true,
  ...over,
});

const level = (over: Partial<LevelDefinition> = {}): LevelDefinition => ({
  id: "l1",
  number: 1,
  title: "Fase",
  summary: "",
  mechanic: "platformer",
  implementationStatus: "playable",
  editorialStatus: "pending",
  objective: "",
  intro: "",
  fictionalizationNote: "Encenação.",
  sourceIds: [],
  claims: [{ id: "c1", text: "Algo", category: "fact", sourceIds: ["s1"], status: "pending" }],
  narrativeEvents: [event()],
  outcomes: [{ id: "o1", year: "2022", headline: "X", detail: "Y", sourceIds: ["s1"] }],
  ...over,
});

describe("conteúdo real do jogo", () => {
  it("não tem erros de consistência", () => {
    expect(errors(levels, sources)).toEqual([]);
  });

  it("tem sete fases numeradas de 1 a 7", () => {
    expect(levels.map((l) => l.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("Fase 1 encadeia as seis missões do roteiro, com a defesa por último", () => {
    const order = requiredEventOrder(triplexLevel);
    expect(order).toHaveLength(6);
    expect(order.at(-1)).toBe("open-defense");
    expect(order[0]).toBe("meet-contractor");
  });

  it("Fase 1 termina no arquivamento de 2022, não na condenação de 2017", () => {
    expect(triplexLevel.outcomes.at(-1)?.year).toBe("2022");
  });
});

describe("validateContent", () => {
  it("detecta fontes inexistentes em afirmações, eventos e desfechos", () => {
    const lv = level({
      claims: [{ id: "c1", text: "x", category: "fact", sourceIds: ["a"], status: "pending" }],
      narrativeEvents: [event({ sourceIds: ["b"] })],
      outcomes: [{ id: "o1", year: "2022", headline: "X", detail: "Y", sourceIds: ["c"] }],
    });
    const msgs = errors([lv], [source()]);
    for (const id of ['"a"', '"b"', '"c"']) expect(msgs.some((m) => m.includes(id))).toBe(true);
  });

  it("recusa afirmação revisada apoiada em fonte pendente", () => {
    const lv = level({ claims: [{ id: "c1", text: "x", category: "fact", sourceIds: ["s1"], status: "reviewed" }] });
    expect(errors([lv], [source()])).toHaveLength(1);
    expect(errors([lv], [source({ status: "reviewed", checkedAt: "2026-10-07" })])).toHaveLength(0);
  });

  it("recusa fonte revisada sem data de checagem", () => {
    expect(errors([level()], [source({ status: "reviewed" })]).length).toBeGreaterThan(0);
  });

  it("exige nota de ficção em metáforas", () => {
    const lv = level({ narrativeEvents: [event(), event({ id: "mala", category: "metaphor", objectKind: "symbolic_bag" })] });
    expect(errors([lv], [source()]).some((m) => m.includes("metáfora") && m.includes("nota de ficção"))).toBe(true);
    const ok = level({
      narrativeEvents: [
        event({ nextEventId: "mala" }),
        event({ id: "mala", category: "metaphor", objectKind: "symbolic_bag", fictionNote: "Metáfora." }),
      ],
    });
    expect(errors([ok], [source()])).toEqual([]);
  });

  it("exige atribuição em cada interação e em alegações do painel", () => {
    const lv = level({
      narrativeEvents: [event({ attributionLabel: " " })],
      claims: [{ id: "c1", text: "x", category: "allegation", sourceIds: ["s1"], status: "pending" }],
    });
    const msgs = errors([lv], [source()]);
    expect(msgs.some((m) => m.includes("sem atribuição"))).toBe(true);
    expect(msgs.some((m) => m.includes("sem autoria"))).toBe(true);
  });

  it("recusa fase jogável sem desfecho ou sem defesa em cena", () => {
    expect(errors([level({ outcomes: [] })], [source()])).toContain("Fase jogável sem desfecho.");
    const semDefesa = level({ narrativeEvents: [event({ category: "news" })] });
    expect(errors([semDefesa], [source()]).some((m) => m.includes("defesa"))).toBe(true);
  });

  it("aceita fase planejada sem eventos nem contexto", () => {
    expect(errors([level({ implementationStatus: "planned", claims: [], narrativeEvents: [], outcomes: [] })], [source()])).toEqual([]);
  });

  it("detecta missão obrigatória fora da sequência e próximo evento inexistente", () => {
    const lv = level({ narrativeEvents: [event({ nextEventId: "fantasma" }), event({ id: "solta" })] });
    const msgs = errors([lv], [source()]);
    expect(msgs.some((m) => m.includes('"fantasma"'))).toBe(true);
    expect(msgs.some((m) => m.includes('"solta" fora da sequência'))).toBe(true);
  });

  it("detecta IDs duplicados", () => {
    const msgs = errors([level(), level()], [source(), source()]);
    expect(msgs.some((m) => m.startsWith("Fonte duplicada"))).toBe(true);
    expect(msgs.some((m) => m.startsWith("Fase duplicada"))).toBe(true);
    expect(msgs.some((m) => m.startsWith("Evento com ID duplicado"))).toBe(true);
  });
});

describe("visibilidade de pendências", () => {
  const claims = level().claims.concat({ id: "c2", text: "y", category: "fact", sourceIds: [], status: "reviewed" });
  const registry = new Map([
    ["a", source({ id: "a", status: "reviewed", checkedAt: "2026-10-07" })],
    ["b", source({ id: "b" })],
  ]);

  it("esconde afirmações e fontes pendentes fora do modo de revisão", () => {
    expect(visibleClaims(claims, false).map((c) => c.id)).toEqual(["c2"]);
    expect(visibleSources([source(), source({ id: "s2", status: "reviewed" })], false).map((s) => s.id)).toEqual(["s2"]);
  });

  it("só mostra resumo factual quando todas as fontes foram revisadas", () => {
    expect(allReviewed(["a"], registry)).toBe(true);
    expect(allReviewed(["a", "b"], registry)).toBe(false);
    expect(allReviewed([], registry)).toBe(false);
    expect(canShowSourced(["a", "b"], false, registry)).toBe(false);
    expect(canShowSourced(["a", "b"], true, registry)).toBe(true);
  });
});
