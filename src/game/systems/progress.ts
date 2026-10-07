import { isRecord, loadVersioned, removeKey, saveVersioned, type StorageLike } from "./storage";

export interface LevelProgress {
  completed: boolean;
  bestTimeMs: number | null;
  bestInteractions: number;
}

export interface Progress {
  levels: Record<string, LevelProgress>;
}

const KEY = "lulaverso:progress";
// v2: "documentos" da Fase 1 viraram "interações" do roteiro.
const VERSION = 2;

export const emptyProgress = (): Progress => ({ levels: {} });

function parseLevel(value: unknown): LevelProgress | null {
  if (!isRecord(value)) return null;
  const { completed, bestTimeMs, bestInteractions } = value;
  if (typeof completed !== "boolean") return null;
  const time =
    typeof bestTimeMs === "number" && Number.isFinite(bestTimeMs) && bestTimeMs > 0 ? bestTimeMs : null;
  const found = typeof bestInteractions === "number" && Number.isInteger(bestInteractions) && bestInteractions >= 0 ? bestInteractions : 0;
  return { completed, bestTimeMs: time, bestInteractions: found };
}

/** Entradas inválidas de uma fase são descartadas sem perder as outras. */
export function parseProgress(data: unknown): Progress | null {
  if (!isRecord(data) || !isRecord(data.levels)) return null;
  const levels: Record<string, LevelProgress> = {};
  for (const [id, value] of Object.entries(data.levels)) {
    const parsed = parseLevel(value);
    if (parsed) levels[id] = parsed;
  }
  return { levels };
}

export function recordCompletion(progress: Progress, levelId: string, timeMs: number, interactions: number): Progress {
  const prev = progress.levels[levelId];
  return {
    levels: {
      ...progress.levels,
      [levelId]: {
        completed: true,
        bestTimeMs: prev?.bestTimeMs != null ? Math.min(prev.bestTimeMs, timeMs) : timeMs,
        bestInteractions: Math.max(prev?.bestInteractions ?? 0, interactions),
      },
    },
  };
}

export function loadProgress(storage?: StorageLike | null): Progress {
  return loadVersioned(KEY, VERSION, parseProgress, emptyProgress, storage);
}

export function saveProgress(progress: Progress, storage?: StorageLike | null): void {
  saveVersioned(KEY, VERSION, progress, storage);
}

export function clearProgress(storage?: StorageLike | null): void {
  removeKey(KEY, storage);
}
