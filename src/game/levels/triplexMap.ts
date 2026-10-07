/**
 * Mapa da Fase 1 em dados. Coordenadas em unidades do mundo; `y` das
 * plataformas e dos objetos é a superfície onde o personagem pisa.
 *
 * Referência de alcance do pulo (ver Player.ts): ~125 de altura com o botão
 * segurado e ~200 de distância horizontal. Os vãos ficam bem abaixo disso.
 *
 * O percurso garante a ordem do roteiro: o tapume só abre depois do
 * empreiteiro; a passagem para os andaimes só aparece depois do contrato; o
 * elevador privativo só anda depois da mala; a saída só abre depois da defesa.
 */

export type PlatformStyle = "ground" | "slab" | "scaffold" | "private";

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

export interface Spot {
  x: number;
  y: number;
}

export interface CheckpointDef extends Spot {
  id: string;
  order: number;
}

export interface GateDef extends Spot {
  id: string;
  h: number;
  /** "tapume": abre sozinho quando a missão anterior termina; "door": abre com interação. */
  kind: "tapume" | "door";
  label: string;
}

export interface BlueprintPieceDef extends Spot {
  id: string;
  label: string;
}

export interface SignDef extends Spot {
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
  start: Spot;
  platforms: PlatformDef[];
  /** Plataforma que só aparece depois do contrato (missão 2). */
  unlockPlatform: PlatformDef;
  moving: MovingPlatformDef[];
  /** ID do elevador privativo em `moving`. */
  privateLiftId: string;
  timed: TimedPlatformDef[];
  checkpoints: CheckpointDef[];
  gates: GateDef[];
  contractor: Spot;
  contract: Spot;
  blueprintPieces: BlueprintPieceDef[];
  bag: Spot;
  defense: Spot;
  exit: Spot;
  signs: SignDef[];
  tutorial: TutorialZone[];
  zones: { label: string; x: number; y: number }[];
}

export const triplexMap: LevelMap = {
  width: 2880,
  height: 1080,
  killY: 1070,
  start: { x: 80, y: 1000 },
  zones: [
    { label: "CALÇADA", x: 24, y: 650 },
    { label: "ESCRITÓRIO DA OBRA", x: 640, y: 650 },
    { label: "ÁREA DE REFORMA", x: 1024, y: 560 },
    { label: "ANDAR PRIVATIVO", x: 1890, y: 290 },
    { label: "TERRAÇO", x: 2125, y: 330 },
  ],
  platforms: [
    // Calçada e escritório
    { x: 0, y: 1000, w: 1000, style: "ground" },
    { x: 260, y: 930, w: 140, style: "slab" },
    { x: 440, y: 870, w: 140, style: "slab" },
    { x: 760, y: 920, w: 120, style: "slab" },
    // Área de reforma (andaimes)
    { x: 1100, y: 800, w: 120, style: "scaffold" },
    { x: 1560, y: 760, w: 170, style: "scaffold" },
    { x: 1480, y: 670, w: 100, style: "scaffold" },
    { x: 1610, y: 590, w: 100, style: "scaffold" },
    { x: 1450, y: 510, w: 110, style: "scaffold" },
    // Andar privativo
    { x: 1880, y: 460, w: 200, style: "private" },
    // Terraço
    { x: 2120, y: 420, w: 150, style: "slab" },
    { x: 2470, y: 210, w: 100, style: "scaffold" },
    { x: 2610, y: 300, w: 270, style: "slab" },
  ],
  unlockPlatform: { x: 900, y: 850, w: 140, style: "scaffold" },
  moving: [
    { id: "andaime-movel", x: 1260, y: 780, w: 100, axis: "x", distance: 180, speed: 70, style: "scaffold" },
    { id: "elevador-privativo", x: 1760, y: 740, w: 100, axis: "y", distance: -270, speed: 65, style: "lift" },
  ],
  privateLiftId: "elevador-privativo",
  timed: [
    { id: "alcapao-1", x: 2310, y: 380, w: 110, onMs: 2600, offMs: 1000, offsetMs: 0 },
    { id: "alcapao-2", x: 2460, y: 340, w: 110, onMs: 2600, offMs: 1000, offsetMs: 1800 },
  ],
  checkpoints: [
    { id: "cp-andaimes", order: 1, x: 1600, y: 760 },
    { id: "cp-desembarque", order: 2, x: 1935, y: 460 },
    { id: "cp-cobertura", order: 3, x: 2165, y: 420 },
  ],
  gates: [
    { id: "tapume", kind: "tapume", x: 600, y: 1000, h: 330, label: "TAPUME\nOBRA OAS" },
    { id: "porta-servico", kind: "door", x: 2050, y: 460, h: 150, label: "SERVIÇO" },
  ],
  contractor: { x: 540, y: 1000 },
  contract: { x: 700, y: 1000 },
  blueprintPieces: [
    { id: "cozinha", label: "Cozinha", x: 1160, y: 800 },
    { id: "elevador", label: "Elevador", x: 1660, y: 590 },
    { id: "escada", label: "Escada", x: 1500, y: 510 },
  ],
  bag: { x: 1700, y: 760 },
  defense: { x: 2690, y: 300 },
  exit: { x: 2820, y: 300 },
  signs: [
    { x: 510, y: 850, text: "ATENDIMENTO PERSONALIZADO.\nCONTROVÉRSIA TAMBÉM." },
    { x: 1160, y: 700, text: "CUIDADO:\nOBRA EM ANDAMENTO" },
    { x: 2420, y: 470, text: "ALÇAPÕES\nCOM PRAZO" },
    { x: 2520, y: 150, text: "VISTA PARA O MAR.\nE PARA O PROCESSO." },
  ],
  tutorial: [
    { id: "mover", x0: 0, x1: 220, keyboard: "A/D ou setas para mover.", touch: "Use ◀ ▶ para mover." },
    {
      id: "pular",
      x0: 220,
      x1: 420,
      keyboard: "Espaço para pular. Segure um pouco para ir mais alto.",
      touch: "Botão de pulo para pular. Segure um pouco para ir mais alto.",
    },
    {
      id: "interagir",
      x0: 420,
      x1: 600,
      keyboard: "Chegue perto do empreiteiro e aperte E.",
      touch: "Chegue perto do empreiteiro e toque em ✋.",
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
