import { describe, expect, it } from "vitest";
import { loadProgress, recordCompletion, saveProgress, emptyProgress } from "./progress";
import { loadSettings, saveSettings } from "./settings";
import type { StorageLike } from "./storage";

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = v;
    },
    removeItem: (k) => {
      delete data[k];
    },
  };
}

const throwingStorage: StorageLike = {
  getItem: () => {
    throw new Error("SecurityError");
  },
  setItem: () => {
    throw new Error("QuotaExceeded");
  },
  removeItem: () => {
    throw new Error("SecurityError");
  },
};

describe("progresso", () => {
  it("salva e recarrega", () => {
    const s = memoryStorage();
    const p = recordCompletion(emptyProgress(), "triplex", 90000, 5);
    saveProgress(p, s);
    expect(loadProgress(s)).toEqual(p);
  });

  it("guarda o melhor tempo e o maior número de interações", () => {
    let p = recordCompletion(emptyProgress(), "triplex", 90000, 6);
    p = recordCompletion(p, "triplex", 70000, 4);
    p = recordCompletion(p, "triplex", 80000, 5);
    expect(p.levels.triplex).toEqual({ completed: true, bestTimeMs: 70000, bestInteractions: 6 });
  });

  it.each([
    ["JSON quebrado", "{nao é json"],
    ["versão desconhecida", JSON.stringify({ version: 99, data: { levels: {} } })],
    ["formato antigo (v1, com documentos)", JSON.stringify({ version: 1, data: { levels: { triplex: { completed: true, bestTimeMs: 1, bestDocs: 4 } } } })],
    ["sem envelope", JSON.stringify({ levels: {} })],
    ["levels não é objeto", JSON.stringify({ version: 2, data: { levels: [1, 2] } })],
    ["null", "null"],
  ])("volta ao vazio com dado inválido: %s", (_name, raw) => {
    const s = memoryStorage({ "lulaverso:progress": raw });
    expect(loadProgress(s)).toEqual(emptyProgress());
  });

  it("descarta só a fase corrompida e mantém as outras", () => {
    const raw = JSON.stringify({
      version: 2,
      data: {
        levels: {
          triplex: { completed: true, bestTimeMs: 80000, bestInteractions: 5 },
          sitio: { completed: "sim" },
          outra: { completed: true, bestTimeMs: -5, bestInteractions: 2.5 },
        },
      },
    });
    const p = loadProgress(memoryStorage({ "lulaverso:progress": raw }));
    expect(p.levels.triplex).toEqual({ completed: true, bestTimeMs: 80000, bestInteractions: 5 });
    expect(p.levels.sitio).toBeUndefined();
    expect(p.levels.outra).toEqual({ completed: true, bestTimeMs: null, bestInteractions: 0 });
  });

  it("não quebra quando o localStorage lança erro", () => {
    expect(loadProgress(throwingStorage)).toEqual(emptyProgress());
    expect(() => saveProgress(emptyProgress(), throwingStorage)).not.toThrow();
  });
});

describe("configurações", () => {
  it("salva e recarrega", () => {
    const s = memoryStorage();
    const settings = { volume: 0.3, muted: true, reducedMotion: true, touchControls: "on" as const };
    saveSettings(settings, s);
    expect(loadSettings(s)).toEqual(settings);
  });

  it("corrige campos inválidos sem perder os válidos", () => {
    const raw = JSON.stringify({ version: 1, data: { volume: 7, muted: "x", reducedMotion: true, touchControls: "talvez" } });
    const s = loadSettings(memoryStorage({ "lulaverso:settings": raw }));
    expect(s.volume).toBe(1);
    expect(s.muted).toBe(false);
    expect(s.reducedMotion).toBe(true);
    expect(s.touchControls).toBe("auto");
  });

  it("usa o padrão com JSON quebrado ou storage indisponível", () => {
    expect(loadSettings(memoryStorage({ "lulaverso:settings": "{{" })).muted).toBe(false);
    expect(loadSettings(throwingStorage).volume).toBe(0.7);
    expect(loadSettings(null).touchControls).toBe("auto");
  });
});
