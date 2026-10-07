import type { ReactNode } from "react";
import { useMenuNav } from "../app/useMenuNav";

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  wide?: boolean;
  children: ReactNode;
}

/** Moldura comum das telas de menu (título, voltar, navegação por teclado). */
export function Screen({ title, subtitle, onBack, backLabel = "Voltar", wide, children }: Props) {
  const ref = useMenuNav<HTMLElement>(onBack);
  return (
    <main ref={ref} className={`screen${wide ? " screen--wide" : ""}`}>
      <header className="screen__header">
        <h1 className="retro-title">{title}</h1>
        {subtitle && <p className="screen__subtitle">{subtitle}</p>}
      </header>
      <div className="screen__body">{children}</div>
      {onBack && (
        <footer className="screen__footer">
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            ← {backLabel}
          </button>
        </footer>
      )}
    </main>
  );
}
