import * as Phaser from "phaser";
import type { SceneServices } from "./bridge";
import { PLAYER_TUNING } from "./entities/Player";
import { TriplexScene, VIEW } from "./scenes/TriplexScene";

/** Cena Phaser de cada fase jogável, por id de fase (src/content/levels). */
const LEVEL_SCENES: Record<string, { key: string; scene: typeof Phaser.Scene }> = {
  triplex: { key: TriplexScene.KEY, scene: TriplexScene },
};

export function hasScene(levelId: string): boolean {
  return levelId in LEVEL_SCENES;
}

export interface GameHandle {
  pause(): void;
  resume(): void;
  restart(): void;
  destroy(): void;
}

export function createGame(parent: HTMLElement, services: SceneServices): GameHandle {
  const entry = LEVEL_SCENES[services.levelId];
  if (!entry) throw new Error(`Fase sem cena: ${services.levelId}`);

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: VIEW.w,
    height: VIEW.h,
    backgroundColor: "#1b1230",
    pixelArt: true,
    roundPixels: true,
    banner: false,
    // Teclado e toque passam pelo InputController (systems/input.ts).
    input: { keyboard: false },
    audio: { noAudio: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: {
      default: "arcade",
      arcade: { gravity: { x: 0, y: PLAYER_TUNING.gravity }, debug: false },
    },
  });
  game.scene.add(entry.key, entry.scene, true, services);
  if (import.meta.env.DEV) {
    // Só em desenvolvimento: acesso para testes automatizados no navegador.
    (window as unknown as { __lulaverso?: Phaser.Game }).__lulaverso = game;
  }

  const scene = () => game.scene.getScene(entry.key);
  return {
    pause: () => {
      if (game.scene.isActive(entry.key)) game.scene.pause(entry.key);
    },
    resume: () => {
      if (game.scene.isPaused(entry.key)) game.scene.resume(entry.key);
    },
    restart: () => {
      const s = scene();
      if (s) s.scene.restart(services);
    },
    destroy: () => game.destroy(true),
  };
}
