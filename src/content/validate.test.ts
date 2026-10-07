import { describe, expect, it } from "vitest";
import { levels } from "./levels";
import { sources } from "./sources";
import type { LevelDefinition, Source } from "./types";
import { validateContent } from "./validate";
import { visibleClaims, visibleSources } from "./visibility";

const errors = (lv: LevelDefinition[], src: Source[]) =>
  validateContent(lv, src).filter((i) => i.severity === "error");

const source = (over: Partial<Source> = {}): Source => ({
  id: "s1",
  title: "Fonte",
  publisher: "Órgão",
  url: "https://example.org/a",
  status: "pending",
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
  ...over,
});

describe("conteúdo real do jogo", () => {
  it("não tem erros de consistência", () => {
    expect(errors(levels, sources)).toEqual([]);
  });

  it("tem sete fases numeradas de 1 a 7", () => {
    expect(levels.map((l) => l.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});

describe("validateContent", () => {
  it("detecta fonte inexistente citada por afirmação e por fase", () => {
    const lv = level({ sourceIds: ["nao-existe"], claims: [{ id: "c1", text: "x", category: "fact", sourceIds: ["outra"], status: "pending" }] });
    const msgs = errors([lv], [source()]).map((e) => e.message);
    expect(msgs.some((m) => m.includes('"nao-existe"'))).toBe(true);
    expect(msgs.some((m) => m.includes('"outra"'))).toBe(true);
  });

  it("recusa afirmação verificada apoiada em fonte pendente", () => {
    const lv = level({ claims: [{ id: "c1", text: "x", category: "fact", sourceIds: ["s1"], status: "verified" }] });
    expect(errors([lv], [source()])).toHaveLength(1);
    expect(errors([lv], [source({ status: "verified", checkedAt: "2026-10-07" })])).toHaveLength(0);
  });

  it("recusa afirmação verificada sem fonte", () => {
    const lv = level({ claims: [{ id: "c1", text: "x", category: "fact", sourceIds: [], status: "verified" }] });
    expect(errors([lv], [source()]).some((e) => e.message.includes("sem nenhuma fonte"))).toBe(true);
  });

  it("recusa fonte verificada sem data de checagem", () => {
    expect(errors([level()], [source({ status: "verified" })]).length).toBeGreaterThan(0);
  });

  it("recusa fase jogável sem contexto", () => {
    expect(errors([level({ claims: [] })], [source()]).some((e) => e.message.includes("sem nenhum conteúdo"))).toBe(true);
  });

  it("aceita fase planejada sem contexto", () => {
    expect(errors([level({ implementationStatus: "planned", claims: [] })], [source()])).toEqual([]);
  });

  it("exige autoria em alegações", () => {
    const lv = level({ claims: [{ id: "c1", text: "x", category: "allegation", sourceIds: ["s1"], status: "pending" }] });
    expect(errors([lv], [source()]).some((e) => e.message.includes("sem autoria"))).toBe(true);
  });

  it("não deixa fase bloqueada ter afirmações", () => {
    const lv = level({ implementationStatus: "planned", editorialStatus: "blocked" });
    expect(errors([lv], [source()]).some((e) => e.message.includes("bloqueada"))).toBe(true);
  });

  it("não deixa fase verificada ter afirmações pendentes", () => {
    const lv = level({ editorialStatus: "verified" });
    expect(errors([lv], [source()]).some((e) => e.message.includes("verificada com 1"))).toBe(true);
  });

  it("detecta IDs duplicados", () => {
    const msgs = errors([level(), level()], [source(), source()]).map((e) => e.message);
    expect(msgs.some((m) => m.startsWith("Fonte duplicada"))).toBe(true);
    expect(msgs.some((m) => m.startsWith("Fase duplicada"))).toBe(true);
    expect(msgs.some((m) => m.startsWith("Afirmação com ID duplicado"))).toBe(true);
  });
});

describe("visibilidade de pendências", () => {
  const claims = level().claims.concat({ id: "c2", text: "y", category: "fact", sourceIds: [], status: "verified" });

  it("esconde afirmações e fontes pendentes fora do modo de revisão", () => {
    expect(visibleClaims(claims, false).map((c) => c.id)).toEqual(["c2"]);
    expect(visibleSources([source(), source({ id: "s2", status: "verified" })], false).map((s) => s.id)).toEqual(["s2"]);
  });

  it("mostra tudo no modo de revisão", () => {
    expect(visibleClaims(claims, true)).toHaveLength(2);
  });
});
