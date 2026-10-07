import { describe, expect, it } from "vitest";
import { triplexMap } from "../levels/triplexMap";
import { CheckpointTracker, LevelRun } from "./levelRun";

const newRun = () =>
  new LevelRun({ start: { x: 10, y: 100 }, documentIds: ["a", "b", "c", "d", "e", "f"], requiredDocs: 4 });

describe("requisito da saída", () => {
  it("só abre com o mínimo de documentos e informa quantos faltam", () => {
    const run = newRun();
    expect(run.exitStatus()).toEqual({ open: false, missing: 4 });
    ["a", "b", "c"].forEach((id) => run.collect(id));
    expect(run.exitStatus()).toEqual({ open: false, missing: 1 });
    run.collect("d");
    expect(run.exitStatus()).toEqual({ open: true, missing: 0 });
    run.collect("e");
    expect(run.exitStatus()).toEqual({ open: true, missing: 0 });
  });

  it("não conta o mesmo documento duas vezes nem documentos desconhecidos", () => {
    const run = newRun();
    expect(run.collect("a")).toBe(true);
    expect(run.collect("a")).toBe(false);
    expect(run.collect("zzz")).toBe(false);
    expect(run.docCount).toBe(1);
  });
});

describe("checkpoints e quedas", () => {
  it("queda antes de qualquer checkpoint volta ao início", () => {
    const run = newRun();
    expect(run.fall()).toEqual({ x: 10, y: 100 });
    expect(run.falls).toBe(1);
  });

  it("queda volta ao último checkpoint e mantém os documentos", () => {
    const run = newRun();
    run.collect("a");
    run.checkpoints.activate("cp1", 1, { x: 500, y: 300 });
    run.collect("b");
    expect(run.fall()).toEqual({ x: 500, y: 300 });
    expect(run.docCount).toBe(2);
    expect(run.hasDoc("a") && run.hasDoc("b")).toBe(true);
  });

  it("voltar a um checkpoint anterior não perde o mais adiantado", () => {
    const cp = new CheckpointTracker({ x: 0, y: 0 });
    expect(cp.activate("cp1", 1, { x: 1, y: 1 })).toBe(true);
    expect(cp.activate("cp2", 2, { x: 2, y: 2 })).toBe(true);
    expect(cp.activate("cp1", 1, { x: 1, y: 1 })).toBe(false);
    expect(cp.activate("cp2", 2, { x: 2, y: 2 })).toBe(false);
    expect(cp.respawnPoint).toEqual({ x: 2, y: 2 });
    expect(cp.activeId).toBe("cp2");
  });

  it("o ponto devolvido é uma cópia (mexer nele não muda o checkpoint)", () => {
    const run = newRun();
    const p = run.fall();
    p.x = 999;
    expect(run.fall().x).toBe(10);
  });
});

describe("reinício", () => {
  it("restaura o estado inicial de forma previsível", () => {
    const run = newRun();
    run.collect("a");
    run.collect("b");
    run.checkpoints.activate("cp1", 1, { x: 500, y: 300 });
    run.tick(1234);
    run.fall();
    run.restart();
    expect(run.docCount).toBe(0);
    expect(run.elapsedMs).toBe(0);
    expect(run.falls).toBe(0);
    expect(run.fall()).toEqual({ x: 10, y: 100 });
    // Depois do reinício, o mesmo checkpoint pode ser ativado de novo.
    expect(run.checkpoints.activate("cp1", 1, { x: 500, y: 300 })).toBe(true);
  });
});

describe("mapa da Fase 1", () => {
  it("tem documentos suficientes, com IDs únicos, para o requisito da saída", () => {
    const ids = triplexMap.documents.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(triplexMap.requiredDocs);
  });

  it("tem tudo dentro dos limites do mundo e acima da linha de queda", () => {
    const m = triplexMap;
    const points = [...m.documents, ...m.checkpoints, m.exit, m.start];
    for (const p of points) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(m.width);
      expect(p.y).toBeLessThan(m.killY);
    }
    for (const p of m.platforms) expect(p.x + p.w).toBeLessThanOrEqual(m.width);
  });

  it("cada checkpoint e a saída ficam sobre uma plataforma fixa", () => {
    const m = triplexMap;
    const onPlatform = (x: number, y: number) => m.platforms.some((p) => p.y === y && x >= p.x && x <= p.x + p.w);
    for (const cp of m.checkpoints) expect(onPlatform(cp.x, cp.y)).toBe(true);
    expect(onPlatform(m.exit.x, m.exit.y)).toBe(true);
    expect(onPlatform(m.start.x, m.start.y)).toBe(true);
  });
});
