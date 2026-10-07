import { useCallback, useEffect, useRef, useState } from "react";
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

export function GameScreen({ level, settings, touch, onSettingsChange, onComplete, onQuit }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<GameHandle | null>(null);
  const [input] = useState(() => new InputController());
  const [hud, setHud] = useState<HudState | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [paused, setPaused] = useState(false);
  const portrait = usePortrait();
  // Alguns apps não deixam girar a tela: dá para jogar em pé mesmo assim.
  const [allowPortrait, setAllowPortrait] = useState(false);
  const blockedByOrientation = touch && portrait && !allowPortrait;
  const effectivePaused = paused || blockedByOrientation;

  // Valores lidos pela cena a cada quadro, sem recriar o jogo.
  const live = useRef({ settings, touch, onComplete, paused: effectivePaused });
  live.current = { settings, touch, onComplete, paused: effectivePaused };

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
      if (e.code === "Escape" || e.code === "KeyP") {
        e.preventDefault();
        setPaused((p) => !p);
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
    handleRef.current?.restart();
    setPaused(false);
  };

  return (
    <div className="game-screen">
      <div className="stage">
        <div ref={parentRef} className="stage__canvas" />

        <div className="hud">
          <div className="hud__level">
            <strong>Fase {level.number}</strong> <span className="hud__title">{level.title}</span>
          </div>
          {hud && (
            <div className={`hud__docs${hud.exitOpen ? " hud__docs--open" : ""}`} aria-live="polite">
              <span aria-hidden="true">📄</span> {hud.docs}/{hud.totalDocs}
              <span className="hud__req">
                {hud.exitOpen ? " · saída liberada" : ` · mín. ${hud.requiredDocs} para sair`}
              </span>
            </div>
          )}
          <div className="hud__buttons">
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

        <div className="toasts" role="status" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast--${t.tone}`}>
              {t.text}
            </div>
          ))}
        </div>

        {paused && !blockedByOrientation && (
          <PauseMenu
            settings={settings}
            onSettingsChange={onSettingsChange}
            onResume={() => setPaused(false)}
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
  onRestart: () => void;
  onQuit: () => void;
}

function PauseMenu({ settings, onSettingsChange, onResume, onRestart, onQuit }: PauseProps) {
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
