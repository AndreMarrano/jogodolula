export type Action = "left" | "right" | "jump" | "interact";

const KEY_TO_ACTION: Record<string, Action> = {
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  Space: "jump",
  KeyW: "jump",
  ArrowUp: "jump",
  KeyE: "interact",
};

const ACTIONS: Action[] = ["left", "right", "jump", "interact"];

/**
 * Junta teclado e botões de toque num estado único, para o jogador se
 * comportar igual nos dois. Cada fonte (tecla ou dedo) é rastreada
 * separadamente, o que permite mover e pular ao mesmo tempo.
 */
export class InputController {
  /** Desligado durante a pausa: as teclas voltam a funcionar nos menus. */
  enabled = true;
  private readonly held = new Map<Action, Set<string>>(ACTIONS.map((a) => [a, new Set()]));
  private readonly pressedAt = new Map<Action, number>();

  constructor(private readonly now: () => number = () => performance.now()) {}

  private press(action: Action, source: string): void {
    const set = this.held.get(action)!;
    if (set.size === 0) this.pressedAt.set(action, this.now());
    set.add(source);
  }

  private release(action: Action, source: string): void {
    this.held.get(action)!.delete(source);
  }

  isDown(action: Action): boolean {
    return this.enabled && this.held.get(action)!.size > 0;
  }

  /**
   * Retorna `true` se a ação foi acionada nos últimos `windowMs` e ainda não
   * foi consumida. Dá a tolerância de "apertar um pouco antes de aterrissar".
   */
  consumePress(action: Action, windowMs = 0): boolean {
    if (!this.enabled) return false;
    const at = this.pressedAt.get(action);
    if (at === undefined || this.now() - at > windowMs) return false;
    this.pressedAt.delete(action);
    return true;
  }

  setTouch(action: Action, pointerId: number, down: boolean): void {
    const source = `touch:${pointerId}`;
    if (down && this.enabled) this.press(action, source);
    else this.release(action, source);
  }

  handleKey(code: string, down: boolean, repeat = false): boolean {
    const action = KEY_TO_ACTION[code];
    if (!action) return false;
    if (!down) {
      this.release(action, code);
      return this.enabled;
    }
    if (!this.enabled) return false;
    if (!repeat) this.press(action, code);
    return true;
  }

  /** Solta tudo (perda de foco, pausa, troca de tela). */
  clear(): void {
    for (const set of this.held.values()) set.clear();
    this.pressedAt.clear();
  }

  attach(target: Window): () => void {
    const down = (e: KeyboardEvent) => {
      if (this.handleKey(e.code, true, e.repeat)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      if (this.handleKey(e.code, false)) e.preventDefault();
    };
    const blur = () => this.clear();
    target.addEventListener("keydown", down);
    target.addEventListener("keyup", up);
    target.addEventListener("blur", blur);
    return () => {
      target.removeEventListener("keydown", down);
      target.removeEventListener("keyup", up);
      target.removeEventListener("blur", blur);
    };
  }
}
