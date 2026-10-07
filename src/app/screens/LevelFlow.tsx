import { Screen } from "../../components/Screen";
import { EditorialBadge } from "../../components/StatusBadge";
import { nextLevel } from "../../content/levels";
import { presentOutcome } from "../../content/present";
import type { LevelDefinition } from "../../content/types";
import { canShowSourced } from "../../content/visibility";
import type { LevelResult } from "../../game/bridge";
import type { LevelProgress } from "../../game/systems/progress";
import { formatTime } from "../format";
import { isPlayable } from "./MenuScreens";

interface BriefingProps {
  level: LevelDefinition;
  touch: boolean;
  onStart: () => void;
  onHow: () => void;
  onContext: () => void;
  onBack: () => void;
}

/** Abertura da fase: premissa (redação do jogo) e linha factual atribuída. */
export function Briefing({ level, touch, onStart, onHow, onContext, onBack }: BriefingProps) {
  const factual = level.factualLine && canShowSourced(level.factualLine.sourceIds) ? level.factualLine : null;
  return (
    <Screen title={level.title.toUpperCase()} subtitle={level.subtitle ?? `Fase ${level.number}`} onBack={onBack}>
      <div className="prose briefing">
        <p className="briefing__intro">{level.intro}</p>
        {factual && (
          <p className="briefing__fact">
            {factual.text} <span className="muted small">Fontes: {factual.sourceIds.join(", ")}</span>
          </p>
        )}
        <p>
          <strong>Objetivo:</strong> {level.objective}
        </p>
        <p className="muted">
          {touch
            ? "Use ◀ ▶ para mover, ⤒ para pular e ✋ para interagir."
            : "A/D ou setas para mover · Espaço para pular · E para interagir · F para abrir a fonte · Esc para pausar."}
        </p>
        <p className="briefing__foot">Sátira de acusações e decisões noticiadas. Interações têm fontes.</p>
        <div className="badges">
          <EditorialBadge level={level} />
        </div>
      </div>
      <div className="menu menu--row">
        <button type="button" className="btn btn--primary" onClick={onStart}>
          Entrar no prédio
        </button>
        <button type="button" className="btn" onClick={onHow}>
          Como jogar
        </button>
        <button type="button" className="btn btn--ghost" onClick={onContext}>
          Ver contexto
        </button>
      </div>
    </Screen>
  );
}

interface ResultProps {
  level: LevelDefinition;
  result: LevelResult;
  best: LevelProgress | undefined;
  onRetry: () => void;
  onContext: () => void;
  onNext: (id: string) => void;
  onLevels: () => void;
  onMenu: () => void;
}

export function ResultScreen({ level, result, best, onRetry, onContext, onNext, onLevels, onMenu }: ResultProps) {
  const next = nextLevel(level.id);
  const nextReady = next && isPlayable(next);
  const newBest = best?.bestTimeMs != null && best.bestTimeMs === result.timeMs;
  return (
    <Screen title="Percurso concluído" subtitle={`Fase ${level.number} — ${level.title}`}>
      <dl className="stats">
        <div>
          <dt>Tempo</dt>
          <dd>
            {formatTime(result.timeMs)}
            {newBest && <span className="badge badge--done">recorde</span>}
          </dd>
        </div>
        <div>
          <dt>Interações descobertas</dt>
          <dd>
            {result.interactions} de {result.totalInteractions}
          </dd>
        </div>
        <div>
          <dt>Quedas no mar</dt>
          <dd>{result.falls}</dd>
        </div>
      </dl>

      {level.outcomes.length > 0 && (
        <section className="outcomes" aria-label="Desfechos">
          <h2 className="outcomes__title">Como o caso terminou</h2>
          <ol>
            {level.outcomes.map((o) => {
              const p = presentOutcome(o);
              return (
                <li key={o.id}>
                  <span className="outcomes__year">{o.year}</span>
                  <span>
                    <strong>{p.headline}</strong> — {p.detail}
                    {p.pending && <span className="badge badge--pending">pendente</span>}
                  </span>
                </li>
              );
            })}
          </ol>
          {level.finalJoke && <p className="outcomes__joke">{level.finalJoke}</p>}
        </section>
      )}

      <div className="menu">
        <button type="button" className="btn btn--primary" onClick={onContext}>
          Ver notícias
        </button>
        <button type="button" className="btn" onClick={onRetry}>
          Rejogar
        </button>
        {next &&
          (nextReady ? (
            <button type="button" className="btn" onClick={() => onNext(next.id)}>
              Próxima fase
            </button>
          ) : (
            <button type="button" className="btn" onClick={onLevels}>
              Próxima fase: {next.title} (em desenvolvimento) — ver mapa
            </button>
          ))}
        <button type="button" className="btn btn--ghost" onClick={onMenu}>
          Menu principal
        </button>
      </div>
    </Screen>
  );
}
