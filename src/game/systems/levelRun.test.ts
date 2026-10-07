import { describe, expect, it } from "vitest";
import { triplexMap } from "../levels/triplexMap";
import { CheckpointTracker, LevelRun } from "./levelRun";

const newRun = () =>
  new LevelRun({
    start: { x: 10, y: 100 },
    missions: [{ id: "npc" }, { id: "contrato" }, { id: "planta", parts: ["a", "b", "c"] }, { id: "defesa" }],
  });

describe("ordem das missões e saída", () => {
  it("só conclui a missão atual, na ordem do roteiro", () => {
    const run = newRun();
    expect(run.currentMission).toBe("npc");
    expect(run.complete("contrato")).toBe(false);
    expect(run.complete("npc")).toBe(true);
    expect(run.complete("npc")).toBe(false);
    expect(run.currentMission).toBe("contrato");
  });

  it("a missão com peças só termina com todas elas", () => {
    const run = newRun();
    run.complete("npc");
    run.complete("contrato");
    expect(run.addPart("planta", "a")).toBe(true);
    expect(run.addPart("planta", "a")).toBe(false);
    expect(run.addPart("planta", "x")).toBe(false);
    run.addPart("planta", "b");
    expect(run.complete("planta")).toBe(false);
    run.addPart("planta", "c");
    expect(run.partCount("planta")).toBe(3);
    expect(run.complete("planta")).toBe(true);
  });

  it("não aceita peças antes de a missão começar", () => {
    const run = newRun();
    expect(run.addPart("planta", "a")).toBe(false);
    expect(run.partCount("planta")).toBe(0);
  });

  it("a saída só abre depois da última missão (a defesa)", () => {
    const run = newRun();
    run.complete("npc");
    run.complete("contrato");
    ["a", "b", "c"].forEach((p) => run.addPart("planta", p));
    run.complete("planta");
    expect(run.allDone).toBe(false);
    expect(run.currentMission).toBe("defesa");
    run.complete("defesa");
    expect(run.allDone).toBe(true);
    expect(run.currentMission).toBeNull();
  });
});

describe("checkpoints e quedas", () => {
  it("queda antes de qualquer checkpoint volta ao início", () => {
    const run = newRun();
    expect(run.fall()).toEqual({ x: 10, y: 100 });
    expect(run.falls).toBe(1);
  });

  it("queda volta ao último checkpoint e preserva missões e peças", () => {
    const run = newRun();
    run.complete("npc");
    run.complete("contrato");
    run.addPart("planta", "a");
    run.checkpoints.activate("cp1", 1, { x: 500, y: 300 });
    expect(run.fall()).toEqual({ x: 500, y: 300 });
    expect(run.isDone("npc") && run.isDone("contrato")).toBe(true);
    expect(run.hasPart("planta", "a")).toBe(true);
    expect(run.currentMission).toBe("planta");
  });

  it("voltar a um checkpoint anterior não perde o mais adiantado", () => {
    const cp = new CheckpointTracker({ x: 0, y: 0 });
    expect(cp.activate("cp1", 1, { x: 1, y: 1 })).toBe(true);
    expect(cp.activate("cp2", 2, { x: 2, y: 2 })).toBe(true);
    expect(cp.activate("cp1", 1, { x: 1, y: 1 })).toBe(false);
    expect(cp.respawnPoint).toEqual({ x: 2, y: 2 });
  });
});

describe("reinício", () => {
  it("zera o roteiro, as peças, os checkpoints e o tempo", () => {
    const run = newRun();
    run.complete("npc");
    run.complete("contrato");
    run.addPart("planta", "a");
    run.checkpoints.activate("cp1", 1, { x: 500, y: 300 });
    run.tick(1234);
    run.fall();
    run.restart();
    expect(run.completedCount).toBe(0);
    expect(run.currentMission).toBe("npc");
    expect(run.partCount("planta")).toBe(0);
    expect(run.elapsedMs).toBe(0);
    expect(run.falls).toBe(0);
    expect(run.fall()).toEqual({ x: 10, y: 100 });
  });
});

describe("mapa da Fase 1", () => {
  it("tem tudo dentro dos limites do mundo e acima da linha de queda", () => {
    const m = triplexMap;
    const points = [m.start, m.exit, m.contractor, m.contract, m.bag, m.defense, ...m.checkpoints, ...m.blueprintPieces];
    for (const p of points) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(m.width);
      expect(p.y).toBeLessThan(m.killY);
    }
  });

  it("todo objeto de missão, checkpoint e a saída ficam sobre uma plataforma fixa", () => {
    const m = triplexMap;
    const all = [...m.platforms, m.unlockPlatform];
    const onPlatform = (x: number, y: number) => all.some((p) => p.y === y && x >= p.x && x <= p.x + p.w);
    const spots = [m.start, m.exit, m.contractor, m.contract, m.bag, m.defense, ...m.checkpoints, ...m.blueprintPieces];
    for (const s of spots) expect(onPlatform(s.x, s.y), `${s.x},${s.y}`).toBe(true);
  });
});
