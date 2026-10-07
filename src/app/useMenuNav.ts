import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE = "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])";

/**
 * Navegação de menu pelo teclado: foco inicial no primeiro item (ou em
 * `[data-autofocus]`), setas para cima/baixo entre itens e Esc para voltar.
 */
export function useMenuNav<T extends HTMLElement>(onBack?: () => void): RefObject<T | null> {
  const ref = useRef<T>(null);
  const backRef = useRef(onBack);
  backRef.current = onBack;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const first = root.querySelector<HTMLElement>("[data-autofocus]") ?? root.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && backRef.current) {
        e.preventDefault();
        backRef.current();
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "SELECT") return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
      items[next].focus();
      e.preventDefault();
    };
    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, []);

  return ref;
}
