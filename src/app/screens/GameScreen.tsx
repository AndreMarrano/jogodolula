import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NewsStrip, PhaseArchive, SourceCard } from "../../components/NewsCards";
import { SettingsForm } from "../../components/SettingsForm";
import { TouchControls } from "../../components/TouchControls";
import type { LevelDefinition } from "../../content/types";
import { Bridge, type HudState, type LevelResult, type ToastTone } from "../../game/bridge";
import { createGame, type GameHandle } from "../../game/createGame";
import { sound } from "../../game/systems/audio";
import { InputController } from "../../game/systems/input";
import type { Settings } from "../../game/systems/settings";
import { useMenuNav } from "../useMenuNav";

interface Props {
  level: LevelDefinition;
  settings: Settings;
  touch: boolean;
  onSettingsChange: (s: Settings) => void;
  onComplete: (r: LevelResult) => void;
  onQuit: () => void;
}

interface Toast {
  id: number;
  text: string;
  tone: ToastTone;
}

const TOAST_MS = 2800;
/** Tempo mínimo da faixa de notícia na tela (briefing: pelo menos 5 s). */
const STRIP_MS = 10000;

function usePortrait(): boolean {
  const query = "(orientation: portrait)";
  const [portrait, setPortrait] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setPortrait(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return portrait;
}

type Modal = { kind: "card"; eventId: string } | { kind: "archive" } | null;

export function GameScreen({ level, settings, touch, onSettingsChange, onComplete, onQuit }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<GameHandle | null>(null);
  const [input] = useState(() => new InputController());
  const [hud, setHud] = useState<HudState | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [paused, setPaused] = useState(false);
  const [strip, setStrip] = useState<{ eventId: string; key: number } | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [discovered, setDiscovered] = useState<ReadonlySet<string>>(new Set());
  const portrait = usePortrait();
  // Alguns apps não deixam girar a tela: dá para jogar em pé mesmo assim.
  const [allowPortrait, setAllowPortrait] = useState(false);
  const blockedByOrientation = touch && portrait && !allowPortrait;
  // Só janelas modais (cartão de fonte, arquivo, pausa) param o jogo; a faixa não.
  const effectivePaused = paused || blockedByOrientation || modal !== null;

  const eventsById = useMemo(() => new Map(level.narrativeEvents.map((e) => [e.id, e])), [level]);

  // Valores lidos pela cena e pelos atalhos, sem recriar o jogo.
  const live = useRef({ settings, touch, onComplete, paused: effectivePaused, modal, strip });
  live.current = { settings, touch, onComplete, paused: effectivePaused, modal, strip };

  const pushToast = useCallback((text: string, tone: ToastTone) => {
    const id = Math.random();
    // O mesmo aviso não aparece duas vezes ao mesmo tempo.
    setToasts((list) => (list.some((t) => t.text === text) ? list : [...list.slice(-2), { id, text, tone }]));
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), TOAST_MS);
  }, []);

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;
    const bridge = new Bridge();
    const detachInput = input.attach(window);
    const offs = [
      bridge.on("hud", (h) => {
        setHud(h);
        // A cena pode terminar de carregar depois de um pedido de pausa.
        if (live.current.paused) handleRef.current?.pause();
      }),
      bridge.on("toast", (t) => pushToast(t.text, t.tone)),
      bridge.on("interaction", ({ eventId }) => {
        setDiscovered((d) => new Set(d).add(eventId));
        setStrip({ eventId, key: Date.now() });
      }),
      bridge.on("ending", () => {
        setStrip(null);
        setToasts([]);
      }),
      bridge.on("complete", (r) => live.current.onComplete(r)),
    ];
    const handle = createGame(parent, {
      levelId: level.id,
      bridge,
      input,
      playSfx: (name) => sound.play(name),
      reducedMotion: () => live.current.settings.reducedMotion,
      touchMode: () => live.current.touch,
    });
    handleRef.current = handle;
    return () => {
      offs.forEach((off) => off());
      detachInput();
      handle.destroy();
      handleRef.current = null;
    };
  }, [level.id, input, pushToast]);

  // A faixa fica pelo menos STRIP_MS na tela (o jogador pode fechar antes).
  useEffect(() => {
    if (!strip) return;
    const t = window.setTimeout(() => setStrip((cur) => (cur?.key === strip.key ? null : cur)), STRIP_MS);
    return () => window.clearTimeout(t);
  }, [strip]);

  useEffect(() => {
    input.clear();
    input.enabled = !effectivePaused;
    if (effectivePaused) handleRef.current?.pause();
    else {
      handleRef.current?.resume();
      // Evita que Espaço "clique" num botão que ficou com foco.
      (document.activeElement as HTMLElement | null)?.blur?.();
    }
  }, [effectivePaused, input]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { modal: openModal, strip: currentStrip, paused: isPaused } = live.current;
      if (e.code === "Escape" && openModal) {
        e.preventDefault();
        setModal(null);
      } else if ((e.code === "Escape" || e.code === "KeyP") && !openModal) {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.code === "KeyF" && currentStrip && !openModal && !isPaused) {
        e.preventDefault();
        setModal({ kind: "card", eventId: currentStrip.eventId });
      }
    };
    const onVisibility = () => {
      if (document.hidden) setPaused(true);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const restart = () => {
    setHud(null);
    setToasts([]);
    setStrip(null);
    setModal(null);
    setDiscovered(new Set());
    handleRef.current?.restart();
    setPaused(false);
  };

  const mission = hud?.missionId ? eventsById.get(hud.missionId) : undefined;
  const objective = hud ? (mission ? mission.hudObjective : "Saia pelo terraço.") : "";
  const stripEvent = strip ? eventsById.get(strip.eventId) : undefined;
  const cardEvent = modal?.kind === "card" ? eventsById.get(modal.eventId) : undefined;

  return (
    <div className="game-screen">
      <div className="stage">
        <div ref={parentRef} className="stage__canvas" />

        <div className="hud">
          <div className="hud__level">
            <strong>Fase {level.number}</strong> <span className="hud__title">{level.title}</span>
          </div>
          {hud && (
            <div className={`hud__mission${hud.exitOpen ? " hud__mission--open" : ""}`} aria-live="polite">
              <span className="hud__label">Missão:</span> {objective}
              {hud.parts && ` (${hud.parts.have}/${hud.parts.total})`}
            </div>
          )}
          <div className="hud__buttons">
            {hud && (
              <button
                type="button"
                className="hud__btn hud__btn--wide"
                aria-label={`Arquivo da fase: ${hud.completed} de ${hud.total} interações`}
                onClick={() => setModal({ kind: "archive" })}
              >
                🗂 {hud.completed}/{hud.total}
              </button>
            )}
            <button
              type="button"
              className="hud__btn"
              aria-label={settings.muted ? "Ligar som" : "Desligar som"}
              onClick={() => onSettingsChange({ ...settings, muted: !settings.muted })}
            >
              {settings.muted ? "🔇" : "🔊"}
            </button>
            <button type="button" className="hud__btn" aria-label="Pausar" onClick={() => setPaused(true)}>
              ❚❚
            </button>
          </div>
        </div>

        <div className="feed">
          {stripEvent && !modal && (
            <NewsStrip
              key={strip!.key}
              ev={stripEvent}
              touch={touch}
              onOpenSource={() => setModal({ kind: "card", eventId: stripEvent.id })}
              onClose={() => setStrip(null)}
            />
          )}
          <div className="toasts" role="status" aria-live="polite">
            {toasts.map((t) => (
              <div key={t.id} className={`toast toast--${t.tone}`}>
                {t.text}
              </div>
            ))}
          </div>
        </div>

        {cardEvent && <SourceCard ev={cardEvent} onClose={() => setModal(null)} />}
        {modal?.kind === "archive" && (
          <PhaseArchive
            events={level.narrativeEvents}
            discovered={discovered}
            onOpen={(eventId) => setModal({ kind: "card", eventId })}
            onClose={() => setModal(null)}
          />
        )}

        {paused && !modal && !blockedByOrientation && (
          <PauseMenu
            settings={settings}
            onSettingsChange={onSettingsChange}
            onResume={() => setPaused(false)}
            onArchive={() => {
              setPaused(false);
              setModal({ kind: "archive" });
            }}
            onRestart={restart}
            onQuit={onQuit}
          />
        )}
      </div>

      {touch && !effectivePaused && <TouchControls input={input} />}

      {blockedByOrientation && (
        <div className="rotate">
          <div className="rotate__icon" aria-hidden="true">
            ⟳
          </div>
          <p>Gire o celular para a horizontal para jogar.</p>
          <button type="button" className="btn btn--ghost" onClick={() => setAllowPortrait(true)}>
            Jogar mesmo assim
          </button>
        </div>
      )}
    </div>
  );
}

interface PauseProps {
  settings: Settings;
  onSettingsChange: (s: Settings) => void;
  onResume: () => void;
  onArchive: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

function PauseMenu({ settings, onSettingsChange, onResume, onArchive, onRestart, onQuit }: PauseProps) {
  const ref = useMenuNav<HTMLDivElement>();
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div ref={ref} className="overlay" role="dialog" aria-modal="true" aria-label="Jogo pausado">
      <div className="overlay__panel">
        <h2 className="retro-title">Pausado</h2>
        <div className="menu">
          <button type="button" className="btn btn--primary" onClick={onResume}>
            Continuar
          </button>
          <button type="button" className="btn" onClick={onArchive}>
            Arquivo da fase
          </button>
          <button type="button" className="btn" onClick={onRestart}>
            Reiniciar fase
          </button>
          <button type="button" className="btn" aria-expanded={showSettings} onClick={() => setShowSettings((s) => !s)}>
            Configurações
          </button>
          {showSettings && <SettingsForm settings={settings} onChange={onSettingsChange} />}
          <button type="button" className="btn btn--ghost" onClick={onQuit}>
            Sair para o menu
          </button>
        </div>
        <p className="muted small">Esc ou P para continuar.</p>
      </div>
    </div>
  );
}
