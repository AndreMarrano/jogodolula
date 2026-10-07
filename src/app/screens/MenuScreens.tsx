import { useState } from "react";
import { ContextPanel } from "../../components/ContextPanel";
import { Screen } from "../../components/Screen";
import { SettingsForm } from "../../components/SettingsForm";
import { EditorialBadge, LevelStatusBadge } from "../../components/StatusBadge";
import { levels } from "../../content/levels";
import type { LevelDefinition } from "../../content/types";
import { showPending } from "../../content/visibility";
import { hasScene } from "../../game/createGame";
import type { Progress } from "../../game/systems/progress";
import type { Settings } from "../../game/systems/settings";
import { useMenuNav } from "../useMenuNav";
import { formatTime } from "../format";

export const isPlayable = (l: LevelDefinition) => l.implementationStatus !== "planned" && hasScene(l.id);

export function IntroScreen({ onContinue }: { onContinue: () => void }) {
  const ref = useMenuNav<HTMLElement>();
  return (
    <main ref={ref} className="screen screen--intro">
      <p className="intro__kicker">Uma sátira política.</p>
      <h1 className="retro-title retro-title--big">LULAVERSO</h1>
      <p className="screen__subtitle">A Jornada do Companheiro</p>
      <p className="intro__disclaimer">
        Uma sátira política. As cenas são encenações; confira o contexto e as fontes de cada episódio.
      </p>
      {showPending && (
        <p className="notice notice--pending">
          Versão de desenvolvimento: o conteúdo factual ainda está em checagem e aparece marcado como pendente.
        </p>
      )}
      <button type="button" className="btn btn--primary" onClick={onContinue}>
        Continuar
      </button>
    </main>
  );
}

interface MenuProps {
  onPlay: () => void;
  onLevels: () => void;
  onHow: () => void;
  onContext: () => void;
  onAbout: () => void;
  onSettings: () => void;
}

export function MainMenu(p: MenuProps) {
  const ref = useMenuNav<HTMLElement>();
  return (
    <main ref={ref} className="screen screen--menu">
      <h1 className="retro-title retro-title--big">LULAVERSO</h1>
      <p className="screen__subtitle">A Jornada do Companheiro</p>
      <nav className="menu" aria-label="Menu principal">
        <button type="button" className="btn btn--primary" onClick={p.onPlay}>
          Jogar
        </button>
        <button type="button" className="btn" onClick={p.onLevels}>
          Selecionar fase
        </button>
        <button type="button" className="btn" onClick={p.onHow}>
          Como jogar
        </button>
        <button type="button" className="btn" onClick={p.onContext}>
          Contexto e fontes
        </button>
        <button type="button" className="btn" onClick={p.onAbout}>
          Sobre o projeto
        </button>
        <button type="button" className="btn" onClick={p.onSettings}>
          Configurações
        </button>
      </nav>
      <p className="muted small">Protótipo local · sátira · sem fins eleitorais</p>
    </main>
  );
}

interface LevelSelectProps {
  progress: Progress;
  onPlay: (id: string) => void;
  onContext: (id: string) => void;
  onBack: () => void;
}

export function LevelSelect({ progress, onPlay, onContext, onBack }: LevelSelectProps) {
  return (
    <Screen title="Selecionar fase" subtitle="Fases ainda não feitas aparecem como planejadas ou em pesquisa." onBack={onBack} wide>
      <ol className="levels">
        {levels.map((l) => {
          const playable = isPlayable(l);
          const p = progress.levels[l.id];
          return (
            <li key={l.id} className={`level-card${playable ? "" : " level-card--locked"}`}>
              <div className="level-card__head">
                <span className="level-card__num">{l.number}</span>
                <h2>{l.title}</h2>
              </div>
              <p className="level-card__summary">{l.summary}</p>
              <div className="badges">
                <LevelStatusBadge level={l} />
                {playable && <EditorialBadge level={l} />}
                {p?.completed && (
                  <span className="badge badge--done">
                    Concluída{p.bestTimeMs != null ? ` · ${formatTime(p.bestTimeMs)}` : ""}
                  </span>
                )}
              </div>
              <div className="level-card__actions">
                {playable ? (
                  <button type="button" className="btn btn--primary btn--small" onClick={() => onPlay(l.id)}>
                    Jogar
                  </button>
                ) : (
                  <button type="button" className="btn btn--small" disabled>
                    {l.editorialStatus === "blocked" ? "Em pesquisa" : "Em desenvolvimento"}
                  </button>
                )}
                <button type="button" className="btn btn--ghost btn--small" onClick={() => onContext(l.id)}>
                  Contexto
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </Screen>
  );
}

export function HowToPlay({ onBack }: { onBack: () => void }) {
  return (
    <Screen title="Como jogar" onBack={onBack}>
      <table className="controls">
        <thead>
          <tr>
            <th>Ação</th>
            <th>Teclado</th>
            <th>Celular</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mover</td>
            <td>A/D ou ← →</td>
            <td>Botões ◀ ▶</td>
          </tr>
          <tr>
            <td>Pular</td>
            <td>Espaço, W ou ↑</td>
            <td>Botão ⤒</td>
          </tr>
          <tr>
            <td>Interagir</td>
            <td>E</td>
            <td>Botão ✋</td>
          </tr>
          <tr>
            <td>Pausar</td>
            <td>Esc ou P</td>
            <td>Botão ❚❚</td>
          </tr>
        </tbody>
      </table>
      <ul className="tips">
        <li>Segure o pulo para ir mais alto; solte cedo para um pulo curto.</li>
        <li>Plataformas de andaime e lajes podem ser atravessadas por baixo.</li>
        <li>Caiu no mar? Você volta ao último ponto de retorno (bandeira verde) com os documentos que já pegou.</li>
        <li>Cada fase termina com o contexto do episódio e as fontes, separando encenação de fatos.</li>
        <li>No celular, jogue com a tela na horizontal.</li>
      </ul>
    </Screen>
  );
}

export function ContextIndex({ initialId, onBack }: { initialId?: string; onBack: () => void }) {
  const [selected, setSelected] = useState(initialId ?? levels[0].id);
  const level = levels.find((l) => l.id === selected) ?? levels[0];
  return (
    <Screen title="Contexto e fontes" subtitle="O que é fato, o que é alegação e o que é encenação, fase por fase." onBack={onBack} wide>
      <div className="tabs" role="tablist" aria-label="Fases">
        {levels.map((l) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={l.id === level.id}
            data-autofocus={l.id === level.id ? true : undefined}
            className={`tab${l.id === level.id ? " tab--active" : ""}`}
            onClick={() => setSelected(l.id)}
          >
            {l.number}. {l.title}
          </button>
        ))}
      </div>
      <ContextPanel level={level} />
    </Screen>
  );
}

export function AboutScreen({ onBack }: { onBack: () => void }) {
  return (
    <Screen title="Sobre o projeto" onBack={onBack}>
      <div className="prose">
        <p>
          <strong>Lulaverso — A Jornada do Companheiro</strong> é uma sátira política em forma de jogo: episódios públicos
          viram cenários e mecânicas, e cada fase termina com contexto e fontes.
        </p>
        <p>
          As cenas são encenações e caricaturas. O painel de contexto separa o que aconteceu, o que foi alegado (com
          autoria e data), a defesa, o desfecho jurídico e o que é ficção. Conteúdo ainda não checado não é apresentado
          como fato.
        </p>
        <p>
          Não há pedido de voto, recomendação eleitoral, cadastro, ranking online ou coleta de dados. Progresso e
          preferências ficam só neste navegador.
        </p>
        <p>
          Arte e sons são originais e provisórios, gerados no próprio código. Nada foi copiado de outros jogos ou sites.
        </p>
        <p className="muted small">Versão 0.1 — protótipo local.</p>
      </div>
    </Screen>
  );
}

interface SettingsScreenProps {
  settings: Settings;
  onChange: (s: Settings) => void;
  onResetProgress: () => void;
  onBack: () => void;
}

export function SettingsScreen({ settings, onChange, onResetProgress, onBack }: SettingsScreenProps) {
  const [confirm, setConfirm] = useState(false);
  return (
    <Screen title="Configurações" onBack={onBack}>
      <SettingsForm settings={settings} onChange={onChange} />
      <div className="danger-zone">
        {confirm ? (
          <>
            <p>Apagar o progresso salvo neste navegador?</p>
            <button
              type="button"
              className="btn btn--danger btn--small"
              onClick={() => {
                onResetProgress();
                setConfirm(false);
              }}
            >
              Sim, apagar
            </button>
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirm(false)}>
              Cancelar
            </button>
          </>
        ) : (
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirm(true)}>
            Apagar progresso
          </button>
        )}
      </div>
    </Screen>
  );
}
