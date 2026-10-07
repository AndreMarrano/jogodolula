import { isRecord, loadVersioned, saveVersioned, type StorageLike } from "./storage";

export type TouchControlsMode = "auto" | "on" | "off";

export interface Settings {
  /** 0 a 1 */
  volume: number;
  muted: boolean;
  reducedMotion: boolean;
  touchControls: TouchControlsMode;
}

const KEY = "lulaverso:settings";
const VERSION = 1;

export function defaultSettings(): Settings {
  let reducedMotion = false;
  try {
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    // fora do navegador
  }
  return { volume: 0.7, muted: false, reducedMotion, touchControls: "auto" };
}

/** Aproveita os campos válidos e completa o resto com o padrão. */
export function parseSettings(data: unknown): Settings | null {
  if (!isRecord(data)) return null;
  const d = defaultSettings();
  const volume = typeof data.volume === "number" && Number.isFinite(data.volume) ? data.volume : d.volume;
  return {
    volume: Math.min(1, Math.max(0, volume)),
    muted: typeof data.muted === "boolean" ? data.muted : d.muted,
    reducedMotion: typeof data.reducedMotion === "boolean" ? data.reducedMotion : d.reducedMotion,
    touchControls:
      data.touchControls === "auto" || data.touchControls === "on" || data.touchControls === "off"
        ? data.touchControls
        : d.touchControls,
  };
}

export function loadSettings(storage?: StorageLike | null): Settings {
  return loadVersioned(KEY, VERSION, parseSettings, defaultSettings, storage);
}

export function saveSettings(settings: Settings, storage?: StorageLike | null): void {
  saveVersioned(KEY, VERSION, settings, storage);
}
