import { useEffect, useState } from "react";
import { getLevel, levels } from "../content/levels";
import type { LevelResult } from "../game/bridge";
import { sound } from "../game/systems/audio";
import { clearProgress, emptyProgress, loadProgress, recordCompletion, saveProgress } from "../game/systems/progress";
import { loadSettings, saveSettings, type Settings } from "../game/systems/settings";
import { GameScreen } from "./screens/GameScreen";
import { Briefing, ResultScreen } from "./screens/LevelFlow";
import {
  AboutScreen,
  ContextIndex,
  HowToPlay,
  IntroScreen,
  isPlayable,
  LevelSelect,
  MainMenu,
  SettingsScreen,
} from "./screens/MenuScreens";

type View =
  | { name: "intro" }
  | { name: "menu" }
  | { name: "levels" }
  | { name: "how"; back?: View }
  | { name: "about" }
  | { name: "settings" }
  | { name: "context"; levelId?: string; back: View }
  | { name: "briefing"; levelId: string }
  | { name: "play"; levelId: string; run: number }
  | { name: "result"; result: LevelResult };

function useTouchDevice(): boolean {
  const [coarse, setCoarse] = useState(() => window.matchMedia("(pointer: coarse)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const on = () => setCoarse(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return coarse;
}

export function App() {
  const [view, setView] = useState<View>({ name: "intro" });
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [progress, setProgress] = useState(() => loadProgress());
  const coarse = useTouchDevice();
  const touch = settings.touchControls === "on" || (settings.touchControls === "auto" && coarse);

  useEffect(() => {
    saveSettings(settings);
    sound.configure(settings.volume, settings.muted);
    document.documentElement.dataset.reducedMotion = String(settings.reducedMotion);
  }, [settings]);

  // O áudio só é criado depois da primeira interação do usuário.
  useEffect(() => {
    const unlock = () => sound.unlock();
    window.addEventListener("pointerdown", unlock, { capture: true });
    window.addEventListener("keydown", unlock, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", unlock, { capture: true });
      window.removeEventListener("keydown", unlock, { capture: true });
    };
  }, []);

  // Som curto de interface em qualquer botão de menu.
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest(".btn, .tab")) sound.play("ui");
    };
    window.addEventListener("click", click);
    return () => window.removeEventListener("click", click);
  }, []);

  const menu = () => setView({ name: "menu" });
  const play = (levelId: string) => setView({ name: "play", levelId, run: Date.now() });
  const briefing = (levelId: string) => setView({ name: "briefing", levelId });

  const complete = (result: LevelResult) => {
    setProgress((p) => {
      const next = recordCompletion(p, result.levelId, result.timeMs, result.interactions);
      saveProgress(next);
      return next;
    });
    setView({ name: "result", result });
  };

  switch (view.name) {
    case "intro":
      return <IntroScreen onContinue={menu} />;

    case "menu":
      return (
        <MainMenu
          onPlay={() => {
            const first = levels.find((l) => isPlayable(l) && !progress.levels[l.id]?.completed) ?? levels.find(isPlayable);
            if (first) briefing(first.id);
            else setView({ name: "levels" });
          }}
          onLevels={() => setView({ name: "levels" })}
          onHow={() => setView({ name: "how" })}
          onContext={() => setView({ name: "context", back: view })}
          onAbout={() => setView({ name: "about" })}
          onSettings={() => setView({ name: "settings" })}
        />
      );

    case "levels":
      return (
        <LevelSelect
          progress={progress}
          onPlay={briefing}
          onContext={(id) => setView({ name: "context", levelId: id, back: view })}
          onBack={menu}
        />
      );

    case "how":
      return <HowToPlay onBack={() => (view.back ? setView(view.back) : menu())} />;

    case "about":
      return <AboutScreen onBack={menu} />;

    case "settings":
      return (
        <SettingsScreen
          settings={settings}
          onChange={setSettings}
          onResetProgress={() => {
            clearProgress();
            setProgress(emptyProgress());
          }}
          onBack={menu}
        />
      );

    case "context":
      return <ContextIndex initialId={view.levelId} onBack={() => setView(view.back)} />;

    case "briefing": {
      const level = getLevel(view.levelId)!;
      return (
        <Briefing
          level={level}
          touch={touch}
          onStart={() => play(level.id)}
          onHow={() => setView({ name: "how", back: view })}
          onContext={() => setView({ name: "context", levelId: level.id, back: view })}
          onBack={() => setView({ name: "levels" })}
        />
      );
    }

    case "play": {
      const level = getLevel(view.levelId)!;
      return (
        <GameScreen
          key={view.run}
          level={level}
          settings={settings}
          touch={touch}
          onSettingsChange={setSettings}
          onComplete={complete}
          onQuit={menu}
        />
      );
    }

    case "result": {
      const level = getLevel(view.result.levelId)!;
      return (
        <ResultScreen
          level={level}
          result={view.result}
          best={progress.levels[level.id]}
          onRetry={() => play(level.id)}
          onContext={() => setView({ name: "context", levelId: level.id, back: view })}
          onNext={briefing}
          onLevels={() => setView({ name: "levels" })}
          onMenu={menu}
        />
      );
    }
  }
}
