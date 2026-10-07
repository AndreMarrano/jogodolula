import type { SfxName } from "./systems/audio";
import type { InputController } from "./systems/input";

export interface HudState {
  docs: number;
  totalDocs: number;
  requiredDocs: number;
  exitOpen: boolean;
}

export type ToastTone = "info" | "success" | "warn";

export interface LevelResult {
  levelId: string;
  timeMs: number;
  docs: number;
  totalDocs: number;
  falls: number;
}

export interface GameEvents {
  hud: HudState;
  toast: { text: string; tone: ToastTone };
  complete: LevelResult;
}

type Handler<T> = (payload: T) => void;

/** Emissor tipado mínimo entre a cena Phaser e a interface React. */
export class Bridge {
  private readonly handlers = new Map<keyof GameEvents, Set<Handler<never>>>();

  on<K extends keyof GameEvents>(event: K, fn: Handler<GameEvents[K]>): () => void {
    let set = this.handlers.get(event);
    if (!set) this.handlers.set(event, (set = new Set()));
    set.add(fn as Handler<never>);
    return () => set.delete(fn as Handler<never>);
  }

  emit<K extends keyof GameEvents>(event: K, payload: GameEvents[K]): void {
    this.handlers.get(event)?.forEach((fn) => (fn as Handler<GameEvents[K]>)(payload));
  }
}

/** O que a cena recebe do lado React. */
export interface SceneServices {
  levelId: string;
  bridge: Bridge;
  input: InputController;
  playSfx: (name: SfxName) => void;
  reducedMotion: () => boolean;
  touchMode: () => boolean;
}
