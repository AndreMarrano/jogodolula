/**
 * Mapa da Fase 1 em dados. Coordenadas em unidades do mundo; `y` das
 * plataformas é a superfície onde o personagem pisa.
 *
 * Referência de alcance do pulo (ver Player.ts): ~125 de altura com o botão
 * segurado e ~200 de distância horizontal. Os vãos ficam bem abaixo disso.
 */

export type PlatformStyle = "ground" | "slab" | "scaffold";

export interface PlatformDef {
  x: number;
  y: number;
  w: number;
  style: PlatformStyle;
}

export interface MovingPlatformDef {
  id: string;
  x: number;
  y: number;
  w: number;
  axis: "x" | "y";
  /** Deslocamento até a outra ponta (pode ser negativo). */
  distance: number;
  speed: number;
  style: "lift" | "scaffold";
}

export interface TimedPlatformDef {
  id: string;
  x: number;
  y: number;
  w: number;
  onMs: number;
  offMs: number;
  offsetMs: number;
}

export interface DocumentDef {
  id: string;
  x: number;
  y: number;
}

export interface CheckpointDef {
  id: string;
  order: number;
  x: number;
  y: number;
}

export interface DoorDef {
  id: string;
  x: number;
  y: number;
  h: number;
}

export interface SignDef {
  x: number;
  y: number;
  text: string;
}

export interface TutorialZone {
  id: string;
  x0: number;
  x1: number;
  keyboard: string;
  touch: string;
}

export interface LevelMap {
  width: number;
  height: number;
  /** Abaixo disso o personagem caiu no mar e volta ao checkpoint. */
  killY: number;
  start: { x: number; y: number };
  requiredDocs: number;
  platforms: PlatformDef[];
  moving: MovingPlatformDef[];
  timed: TimedPlatformDef[];
  documents: DocumentDef[];
  checkpoints: CheckpointDef[];
  doors: DoorDef[];
  exit: { x: number; y: number };
  signs: SignDef[];
  tutorial: TutorialZone[];
  brokenLift: { x: number; y: number };
  sectors: { label: string; x0: number; x1: number }[];
}

export const triplexMap: LevelMap = {
  width: 2880,
  height: 1080,
  killY: 1070,
  start: { x: 80, y: 1000 },
  requiredDocs: 4,
  sectors: [
    { label: "SETOR A — TÉRREO", x0: 0, x1: 1000 },
    { label: "SETOR B — ANDAIMES", x0: 1000, x1: 2090 },
    { label: "SETOR C — COBERTURA", x0: 2090, x1: 2880 },
  ],
  platforms: [
    // Setor A — entrada e tutorial
    { x: 0, y: 1000, w: 1000, style: "ground" },
    { x: 260, y: 930, w: 140, style: "slab" },
    { x: 440, y: 870, w: 140, style: "slab" },
    { x: 760, y: 920, w: 120, style: "slab" },
    { x: 900, y: 850, w: 140, style: "slab" },
    // Setor B — andaimes
    { x: 1100, y: 800, w: 120, style: "scaffold" },
    { x: 1560, y: 760, w: 170, style: "scaffold" },
    { x: 1480, y: 670, w: 100, style: "scaffold" },
    { x: 1610, y: 590, w: 100, style: "scaffold" },
    { x: 1450, y: 510, w: 110, style: "scaffold" },
    { x: 1880, y: 460, w: 200, style: "slab" },
    // Setor C — último andar
    { x: 2120, y: 420, w: 150, style: "slab" },
    { x: 2470, y: 210, w: 100, style: "scaffold" },
    { x: 2610, y: 300, w: 270, style: "slab" },
  ],
  moving: [
    { id: "andaime-movel", x: 1260, y: 780, w: 100, axis: "x", distance: 180, speed: 70, style: "scaffold" },
    { id: "elevador", x: 1760, y: 740, w: 100, axis: "y", distance: -270, speed: 65, style: "lift" },
  ],
  timed: [
    { id: "alcapao-1", x: 2310, y: 380, w: 110, onMs: 2600, offMs: 1000, offsetMs: 0 },
    { id: "alcapao-2", x: 2460, y: 340, w: 110, onMs: 2600, offMs: 1000, offsetMs: 1800 },
  ],
  documents: [
    { id: "doc-1", x: 510, y: 835 },
    { id: "doc-2", x: 1690, y: 725 },
    { id: "doc-3", x: 1500, y: 475 },
    { id: "doc-4", x: 1950, y: 425 },
    { id: "doc-5", x: 2515, y: 305 },
    { id: "doc-6", x: 2520, y: 175 },
  ],
  checkpoints: [
    { id: "cp-andaimes", order: 1, x: 1600, y: 760 },
    { id: "cp-cobertura", order: 2, x: 2165, y: 420 },
  ],
  doors: [{ id: "porta-servico", x: 2050, y: 460, h: 150 }],
  exit: { x: 2820, y: 300 },
  brokenLift: { x: 620, y: 1000 },
  signs: [
    { x: 670, y: 850, text: "ELEVADOR PROCESSUAL\nINDISPONÍVEL" },
    { x: 1160, y: 700, text: "CUIDADO:\nOBRA EM ANDAMENTO" },
    { x: 1810, y: 420, text: "ELEVADOR\n(este funciona)" },
    { x: 2420, y: 470, text: "ALÇAPÕES\nCOM PRAZO" },
  ],
  tutorial: [
    { id: "mover", x0: 0, x1: 220, keyboard: "A/D ou setas para mover.", touch: "Use ◀ ▶ para mover." },
    {
      id: "pular",
      x0: 220,
      x1: 600,
      keyboard: "Espaço para pular. Segure um pouco para ir mais alto.",
      touch: "Botão de pulo para pular. Segure um pouco para ir mais alto.",
    },
    {
      id: "porta",
      x0: 1900,
      x1: 2080,
      keyboard: "Porta de serviço: chegue perto e aperte E.",
      touch: "Porta de serviço: chegue perto e toque em ✋.",
    },
    {
      id: "alcapao",
      x0: 2200,
      x1: 2300,
      keyboard: "Os alçapões piscam antes de abrir. Atenção ao prazo!",
      touch: "Os alçapões piscam antes de abrir. Atenção ao prazo!",
    },
  ],
};
