import { useEffect, useRef } from "react";
import { CATEGORY_LABEL, formatDate, presentEvent } from "../content/present";
import type { NarrativeEvent } from "../content/types";

function CategoryChip({ ev }: { ev: NarrativeEvent }) {
  return <span className={`cat cat--${ev.category}`}>{CATEGORY_LABEL[ev.category]}</span>;
}

interface StripProps {
  ev: NarrativeEvent;
  touch: boolean;
  onOpenSource: () => void;
  onClose: () => void;
}

/**
 * Faixa de notícia mostrada no momento da interação: fala do jogo (ficção),
 * resumo atribuído e fonte. Não pausa o jogo.
 */
export function NewsStrip({ ev, touch, onOpenSource, onClose }: StripProps) {
  const p = presentEvent(ev);
  return (
    <section className={`news news--${ev.category}`} aria-live="polite" aria-label={`${CATEGORY_LABEL[ev.category]}: ${ev.objectLabel}`}>
      <div className="news__head">
        <CategoryChip ev={ev} />
        <strong className="news__object">{ev.objectLabel}</strong>
        <button type="button" tabIndex={-1} className="news__close" aria-label="Fechar faixa" onClick={onClose}>
          ×
        </button>
      </div>
      <p className="news__satire">
        <span className="news__fiction">Fala do jogo:</span> {ev.satireText}
      </p>
      <p className="news__summary">
        {p.pending && <span className="badge badge--pending">pendente</span>} {p.summary}
      </p>
      <div className="news__foot">
        <span className="news__attr">{p.attribution}</span>
        <button type="button" tabIndex={-1} className="news__source" onClick={onOpenSource}>
          {touch ? "Fonte" : "Fonte (F)"}
        </button>
      </div>
    </section>
  );
}

interface CardProps {
  ev: NarrativeEvent;
  onClose: () => void;
}

/** Cartão completo da interação. Abre como janela modal e pausa o jogo. */
export function SourceCard({ ev, onClose }: CardProps) {
  const p = presentEvent(ev);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus({ preventScroll: true }), []);
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby={`card-${ev.id}`}>
      <div className="overlay__panel card">
        <div className="news__head">
          <CategoryChip ev={ev} />
          <h2 id={`card-${ev.id}`} className="card__title">
            {ev.objectLabel}
          </h2>
        </div>
        <p className="card__mission">Missão: {ev.missionTitle}</p>
        <div className="card__block">
          <h3>Fala do jogo (ficção)</h3>
          <p>{ev.satireText}</p>
        </div>
        <div className="card__block">
          <h3>Resumo da notícia</h3>
          <p>
            {p.pending && <span className="badge badge--pending">pendente</span>} {p.summary}
          </p>
          <p className="muted small">{p.attribution}</p>
        </div>
        {ev.fictionNote && (
          <div className="card__block">
            <h3>O que é encenação</h3>
            <p>{ev.fictionNote}</p>
          </div>
        )}
        <div className="card__block">
          <h3>Fontes</h3>
          {p.sources.length === 0 ? (
            <p className="muted">Fonte em revisão.</p>
          ) : (
            <ul className="sources">
              {p.sources.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.title}
                  </a>
                  <span className="muted">
                    {" "}
                    — {s.publisher}
                    {s.publishedAt && `, ${formatDate(s.publishedAt)}`}
                  </span>{" "}
                  {s.status === "reviewed" ? (
                    <span className="badge badge--verified">revisada em {formatDate(s.checkedAt)}</span>
                  ) : (
                    <span className="badge badge--pending">não revisada</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button ref={closeRef} type="button" className="btn btn--primary" onClick={onClose}>
          Voltar ao jogo
        </button>
      </div>
    </div>
  );
}

interface ArchiveProps {
  events: NarrativeEvent[];
  discovered: ReadonlySet<string>;
  onOpen: (id: string) => void;
  onClose: () => void;
}

/** Arquivo da fase: interações já descobertas, para reler a qualquer momento. */
export function PhaseArchive({ events, discovered, onOpen, onClose }: ArchiveProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus({ preventScroll: true }), []);
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Arquivo da fase">
      <div className="overlay__panel card">
        <h2 className="retro-title">Arquivo da fase</h2>
        <ol className="archive">
          {events.map((ev) =>
            discovered.has(ev.id) ? (
              <li key={ev.id}>
                <button type="button" className="archive__item" onClick={() => onOpen(ev.id)}>
                  <CategoryChip ev={ev} /> <strong>{ev.objectLabel}</strong>
                  <span className="muted small"> — {ev.missionTitle}</span>
                </button>
              </li>
            ) : (
              <li key={ev.id} className="archive__locked">
                ??? <span className="muted small">— ainda não descoberta</span>
              </li>
            ),
          )}
        </ol>
        <button ref={closeRef} type="button" className="btn btn--primary" onClick={onClose}>
          Voltar ao jogo
        </button>
      </div>
    </div>
  );
}
