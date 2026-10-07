import type { PointerEvent } from "react";
import type { Action, InputController } from "../game/systems/input";

interface Props {
  input: InputController;
}

/**
 * Botões de toque. Cada dedo é rastreado pelo pointerId, então dá para
 * segurar ◀/▶ e pular ao mesmo tempo.
 */
export function TouchControls({ input }: Props) {
  const handlers = (action: Action) => ({
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      input.setTouch(action, e.pointerId, true);
    },
    onPointerUp: (e: PointerEvent<HTMLButtonElement>) => input.setTouch(action, e.pointerId, false),
    onPointerCancel: (e: PointerEvent<HTMLButtonElement>) => input.setTouch(action, e.pointerId, false),
    onLostPointerCapture: (e: PointerEvent<HTMLButtonElement>) => input.setTouch(action, e.pointerId, false),
    onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
  });

  return (
    <div className="touch" aria-hidden="true">
      <div className="touch__group">
        <button type="button" tabIndex={-1} className="touch__btn" {...handlers("left")}>
          ◀
        </button>
        <button type="button" tabIndex={-1} className="touch__btn" {...handlers("right")}>
          ▶
        </button>
      </div>
      <div className="touch__group">
        <button type="button" tabIndex={-1} className="touch__btn touch__btn--small" {...handlers("interact")}>
          ✋
        </button>
        <button type="button" tabIndex={-1} className="touch__btn touch__btn--jump" {...handlers("jump")}>
          ⤒
        </button>
      </div>
    </div>
  );
}
