import { Screen } from "../../components/Screen";
import { EditorialBadge } from "../../components/StatusBadge";
import { nextLevel } from "../../content/levels";
import type { LevelDefinition } from "../../content/types";
import type { LevelResult } from "../../game/bridge";
import type { LevelProgress } from "../../game/systems/progress";
import { formatTime } from "../format";
import { isPlayable } from "./MenuScreens";

interface BriefingProps {
  level: LevelDefinition;
  touch: boolean;
  onStart: () => void;
  onContext: () => void;
  onBack: () => void;
}

/** Contexto curto antes da fase. */
export function Briefing({ level, touch, onStart, onContext, onBack }: BriefingProps) {
  return (
    <Screen title={`Fase ${level.number}`} subtitle={level.title} onBack={onBack}>
      <div className="prose">
        <p>{level.intro}</p>
        <p>
          <strong>Objetivo:</strong> {level.objective}
        </p>
        <p className="muted">
          {touch
            ? "Use ◀ ▶ para mover, ⤒ para pular e ✋ para interagir."
            : "A/D ou setas para mover · Espaço para pular · E para interagir · Esc para pausar."}
        </p>
        <div className="badges">
          <EditorialBadge level={level} />
        </div>
      </div>
      <div className="menu menu--row">
        <button type="button" className="btn btn--primary" onClick={onStart}>
          Começar
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
          <dt>Documentos</dt>
          <dd>
            {result.docs} de {result.totalDocs}
          </dd>
        </div>
        <div>
          <dt>Quedas no mar</dt>
          <dd>{result.falls}</dd>
        </div>
        {best?.bestTimeMs != null && !newBest && (
          <div>
            <dt>Melhor tempo</dt>
            <dd>{formatTime(best.bestTimeMs)}</dd>
          </div>
        )}
      </dl>
      <p className="prose">Agora confira o que aconteceu: o que é fato, o que foi alegado e o que é encenação.</p>
      <div className="menu">
        <button type="button" className="btn btn--primary" onClick={onContext}>
          Ver contexto
        </button>
        <button type="button" className="btn" onClick={onRetry}>
          Repetir
        </button>
        {next &&
          (nextReady ? (
            <button type="button" className="btn" onClick={() => onNext(next.id)}>
              Próxima fase
            </button>
          ) : (
            <button type="button" className="btn" onClick={onLevels}>
              Próxima fase: {next.title} ({next.editorialStatus === "blocked" ? "em pesquisa" : "em desenvolvimento"}) — ver mapa
            </button>
          ))}
        <button type="button" className="btn btn--ghost" onClick={onMenu}>
          Menu principal
        </button>
      </div>
    </Screen>
  );
}
