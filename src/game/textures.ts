import type * as Phaser from "phaser";

/**
 * Texturas provisórias geradas em canvas: pixel art original, sem assets
 * externos. Para trocar por sprites definitivos, carregue imagens com as
 * mesmas chaves (TEX.*) num preload e remova a chamada a generateTextures.
 */

export const TEX = {
  player: (frame: string) => `lula-${frame}`,
  slab: "tile-slab",
  scaffold: "tile-scaffold",
  ground: "tile-ground",
  lift: "tile-lift",
  timed: "tile-timed",
  doc: "doc",
  flagOff: "flag-off",
  flagOn: "flag-on",
  door: "door-service",
  exit: "door-exit",
  cloud: "cloud",
  sea: "sea",
  sky: "sky",
  contractor: (frame: number) => `empreiteiro-${frame}`,
  folder: "pasta-contratos",
  blueprint: "planta",
  bag: "mala",
  pedestal: "pedestal",
  defense: "balcao-defesa",
  registry: "registro-imoveis",
  desk: "mesa-obra",
  liftPrivate: "tile-lift-private",
  cabin: "cabine-privativa",
  private: "tile-private",
  tapume: "tapume",
  clipping: "recorte",
} as const;

export const PLAYER_FRAMES = ["idle-0", "idle-1", "walk-0", "walk-1", "walk-2", "walk-3", "jump", "fall"] as const;

const PX = 2; // tamanho do "pixel" da arte

const PALETTE: Record<string, string> = {
  h: "#cfcfcf", // cabelo
  H: "#a3a3a3",
  s: "#e2a77b", // pele
  S: "#c4855a",
  n: "#cf8a60", // nariz
  w: "#f5f5f5", // barba
  W: "#d6d6d6",
  e: "#2a1a10", // olhos
  b: "#7a7a7a", // sobrancelha
  r: "#c8202f", // camisa
  R: "#8f1622",
  p: "#2f3a5a", // calça
  P: "#1f2740",
  k: "#3a2414", // sapato
  m: "#7d3b2a", // boca
  y: "#f2c230", // capacete
  Y: "#c99a12",
  o: "#e8742a", // colete
  O: "#b8561a",
  c: "#8a5a32", // prancheta
  x: "#fbf7ea", // papel
  g: "#4a4a4a", // calça do empreiteiro
};

// Cabeça e tronco (16 colunas). Linhas de braço/perna variam por quadro.
const HEAD = [
  "................",
  ".....hhhhhh.....",
  "....hhhhhhhh....",
  "...hhhhhhhhhh...",
  "...hhssssssshh..",
  "...hsbbsssbbsh..",
  "...hsseSssesS...",
  "...hssssssnnS...",
  "...wsssssssswW..",
  "...wwwsmmmswwW..",
  "...wwwwwwwwwwW..",
  "....wwwwwwwwW...",
  ".....wwwwwwW....",
];

const TORSO_IDLE = [
  "....rrrwwwrrr...",
  "...rrrrrrrrrrr..",
  "..srRrrrrrrrrRs.",
  "..sRrrrrrrrrrRs.",
  "..s.rrrrrrrrr.s.",
];
const TORSO_BREATH = [
  "....rrrwwwrrr...",
  "...rrrrrrrrrrr..",
  "..sRrrrrrrrrrRs.",
  "..sRrrrrrrrrrRs.",
  "..s.RrrrrrrrR.s.",
];
const TORSO_SWING_A = [
  "....rrrwwwrrr...",
  "..srrrrrrrrrrr..",
  "..sRrrrrrrrrrR..",
  "...Rrrrrrrrrrs..",
  "....rrrrrrrrrs..",
];
const TORSO_SWING_B = [
  "....rrrwwwrrr...",
  "...rrrrrrrrrrrs.",
  "...Rrrrrrrrrrrs.",
  "..sRrrrrrrrrrR..",
  "..s.rrrrrrrrr...",
];
const TORSO_ARMS_UP = [
  "..s.rrrwwwrrr.s.",
  "..srrrrrrrrrrrs.",
  "...rrrrrrrrrrr..",
  "...RrrrrrrrrrR..",
  "....rrrrrrrrr...",
];

const LEGS_STAND = [
  "....ppppppppp...",
  "....pppPpPppp...",
  "....ppp...ppp...",
  "....ppp...ppp...",
  "...kkkk...kkkk..",
];
const LEGS_STRIDE = [
  "....ppppppppp...",
  "...pppp...pppp..",
  "..ppp.......ppp.",
  "..ppp.......ppp.",
  ".kkkk.......kkkk",
];
const LEGS_PASS = [
  "....ppppppppp...",
  ".....ppppppp....",
  "......ppppp.....",
  "......pPppp.....",
  ".....kkkkkk.....",
];
const LEGS_TUCK = [
  "....ppppppppp...",
  "...ppppppppppp..",
  "...ppp.....ppp..",
  "...kkk.....kkk..",
  "................",
];
const LEGS_DANGLE = [
  "....ppppppppp...",
  "....ppp...ppp...",
  "...ppp.....ppp..",
  "...ppp.....ppp..",
  "..kkk.......kkk.",
];

const FRAMES: Record<(typeof PLAYER_FRAMES)[number], string[]> = {
  "idle-0": [...HEAD, ...TORSO_IDLE, ...LEGS_STAND],
  "idle-1": [...HEAD, ...TORSO_BREATH, ...LEGS_STAND],
  "walk-0": [...HEAD, ...TORSO_SWING_A, ...LEGS_STRIDE],
  "walk-1": [...HEAD, ...TORSO_IDLE, ...LEGS_PASS],
  "walk-2": [...HEAD, ...TORSO_SWING_B, ...LEGS_STRIDE],
  "walk-3": [...HEAD, ...TORSO_IDLE, ...LEGS_PASS],
  jump: [...HEAD, ...TORSO_ARMS_UP, ...LEGS_TUCK],
  fall: [...HEAD, ...TORSO_ARMS_UP, ...LEGS_DANGLE],
};

// Empreiteiro: personagem genérico e fictício (capacete, colete, prancheta).
const CONTRACTOR_BASE = [
  "................",
  ".....yyyyyy.....",
  "....yyyyyyyy....",
  "...yyyyyyyyyy...",
  "..YYYYYYYYYYYY..",
  "....ssssssss....",
  "....sesssess....",
  "....ssssssss....",
  "....sssmmsss....",
  ".....ssssss.....",
  "......ssss......",
  "....oooooooo....",
  "...oooYooYooo...",
];
const CONTRACTOR_ARMS = [
  [
    "..soooYooYooocx.",
    "..sOooYooYoocxx.",
    "..s.ooYooYoocxx.",
    "....oooooooocc..",
    "....OOOOOOOO....",
  ],
  [
    "..soooYooYooo.cx",
    "..sOooYooYooocxx",
    "..s.ooYooYoo.cxx",
    "....oooooooo.cc.",
    "....OOOOOOOO....",
  ],
];
const CONTRACTOR_LEGS = [
  "....gggggggg....",
  "....ggg..ggg....",
  "....ggg..ggg....",
  "....ggg..ggg....",
  "...kkkk..kkkk...",
];
const CONTRACTOR_FRAMES = CONTRACTOR_ARMS.map((arms) => [...CONTRACTOR_BASE, ...arms, ...CONTRACTOR_LEGS]);

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

function canvasTexture(scene: Phaser.Scene, key: string, w: number, h: number, draw: Draw): void {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, w, h);
  if (!tex) return;
  draw(tex.getContext(), w, h);
  tex.refresh();
}

function drawPixelMap(ctx: CanvasRenderingContext2D, rows: string[]): void {
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const color = PALETTE[row[x]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x * PX, y * PX, PX, PX);
    }
  });
}

export const PLAYER_SIZE = { w: 16 * PX, h: 23 * PX };

export function generateTextures(scene: Phaser.Scene): void {
  for (const frame of PLAYER_FRAMES) {
    canvasTexture(scene, TEX.player(frame), PLAYER_SIZE.w, PLAYER_SIZE.h, (ctx) => drawPixelMap(ctx, FRAMES[frame]));
  }

  // Laje de concreto (32×20)
  canvasTexture(scene, TEX.slab, 32, 20, (ctx) => {
    ctx.fillStyle = "#b9ab95";
    ctx.fillRect(0, 0, 32, 20);
    ctx.fillStyle = "#e3d6bf";
    ctx.fillRect(0, 0, 32, 4);
    ctx.fillStyle = "#8a7c68";
    ctx.fillRect(0, 16, 32, 4);
    ctx.fillRect(30, 4, 2, 12);
    ctx.fillStyle = "#a1937d";
    ctx.fillRect(6, 8, 4, 2);
    ctx.fillRect(18, 11, 6, 2);
  });

  // Andaime (32×16): tábua sobre tubo listrado
  canvasTexture(scene, TEX.scaffold, 32, 16, (ctx) => {
    ctx.fillStyle = "#9b6a3c";
    ctx.fillRect(0, 0, 32, 8);
    ctx.fillStyle = "#c08a52";
    ctx.fillRect(0, 0, 32, 2);
    ctx.fillStyle = "#6e4826";
    ctx.fillRect(15, 2, 2, 6);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i % 2 ? "#222" : "#f2c230";
      ctx.fillRect(i * 8, 10, 8, 6);
    }
  });

  // Piso do térreo (32×80)
  canvasTexture(scene, TEX.ground, 32, 80, (ctx) => {
    ctx.fillStyle = "#d8cbb3";
    ctx.fillRect(0, 0, 32, 80);
    ctx.fillStyle = "#efe5d2";
    ctx.fillRect(0, 0, 32, 4);
    ctx.fillStyle = "#c4b597";
    ctx.fillRect(0, 4, 16, 12);
    ctx.fillRect(16, 16, 16, 12);
    ctx.fillStyle = "#9a8a6c";
    ctx.fillRect(0, 28, 32, 52);
    ctx.fillStyle = "#87785c";
    for (let y = 34; y < 80; y += 12) ctx.fillRect(y % 24 === 10 ? 0 : 16, y, 14, 2);
  });

  // Elevador (100×16)
  canvasTexture(scene, TEX.lift, 100, 16, (ctx) => {
    ctx.fillStyle = "#5b6b7a";
    ctx.fillRect(0, 0, 100, 16);
    ctx.fillStyle = "#93a5b5";
    ctx.fillRect(0, 0, 100, 4);
    ctx.fillStyle = "#3b4651";
    for (let x = 4; x < 100; x += 12) ctx.fillRect(x, 7, 6, 6);
  });

  // Alçapão temporizado (32×16)
  canvasTexture(scene, TEX.timed, 32, 16, (ctx) => {
    ctx.fillStyle = "#2f7fb0";
    ctx.fillRect(0, 0, 32, 16);
    ctx.fillStyle = "#7cc6f0";
    ctx.fillRect(0, 0, 32, 4);
    ctx.fillStyle = "#1f5577";
    ctx.fillRect(0, 12, 32, 4);
    ctx.fillRect(15, 4, 2, 8);
  });

  // Documento (20×24)
  canvasTexture(scene, TEX.doc, 20, 24, (ctx) => {
    ctx.fillStyle = "#3a2a1a";
    ctx.fillRect(0, 0, 20, 24);
    ctx.fillStyle = "#fbf7ea";
    ctx.fillRect(2, 2, 16, 20);
    ctx.fillStyle = "#d9cfb4";
    ctx.fillRect(12, 2, 6, 6);
    ctx.fillStyle = "#7a8aa0";
    for (let y = 9; y < 20; y += 3) ctx.fillRect(4, y, y === 18 ? 7 : 12, 1);
    ctx.fillStyle = "#c8202f";
    ctx.fillRect(4, 4, 6, 3);
  });

  // Checkpoint (24×56)
  const flag = (color: string, pole: string): Draw => (ctx) => {
    ctx.fillStyle = pole;
    ctx.fillRect(2, 0, 4, 56);
    ctx.fillStyle = color;
    ctx.fillRect(6, 2, 18, 14);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(6, 12, 18, 4);
  };
  canvasTexture(scene, TEX.flagOff, 24, 56, flag("#8d8d8d", "#5a5a5a"));
  canvasTexture(scene, TEX.flagOn, 24, 56, flag("#2fa84f", "#3d3d3d"));

  // Porta de serviço (24×150)
  canvasTexture(scene, TEX.door, 24, 150, (ctx) => {
    ctx.fillStyle = "#4a3324";
    ctx.fillRect(0, 0, 24, 150);
    ctx.fillStyle = "#7a5638";
    ctx.fillRect(2, 2, 20, 146);
    ctx.fillStyle = "#5e4129";
    ctx.fillRect(4, 10, 16, 50);
    ctx.fillRect(4, 80, 16, 56);
    ctx.fillStyle = "#e8c44a";
    ctx.fillRect(4, 72, 4, 4);
  });

  // Porta de saída (48×72)
  canvasTexture(scene, TEX.exit, 48, 72, (ctx) => {
    ctx.fillStyle = "#2c1d14";
    ctx.fillRect(0, 0, 48, 72);
    ctx.fillStyle = "#1d6b3a";
    ctx.fillRect(4, 14, 40, 58);
    ctx.fillStyle = "#2a8a4c";
    ctx.fillRect(8, 18, 14, 50);
    ctx.fillRect(26, 18, 14, 50);
    ctx.fillStyle = "#f2c230";
    ctx.fillRect(20, 44, 3, 3);
    ctx.fillRect(25, 44, 3, 3);
    ctx.fillStyle = "#c8202f";
    ctx.fillRect(4, 2, 40, 10);
  });

  canvasTexture(scene, TEX.cloud, 96, 32, (ctx) => {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(16, 12, 64, 16);
    ctx.fillRect(28, 4, 28, 12);
    ctx.fillRect(52, 8, 20, 8);
    ctx.fillRect(4, 20, 88, 10);
  });

  canvasTexture(scene, TEX.sea, 64, 60, (ctx) => {
    ctx.fillStyle = "#1f6fa8";
    ctx.fillRect(0, 0, 64, 60);
    ctx.fillStyle = "#4aa3d8";
    ctx.fillRect(0, 0, 64, 4);
    ctx.fillStyle = "#8fd0f2";
    ctx.fillRect(8, 0, 12, 2);
    ctx.fillRect(40, 2, 10, 2);
    ctx.fillStyle = "#1a5f90";
    ctx.fillRect(20, 20, 16, 2);
    ctx.fillRect(48, 36, 12, 2);
  });

  CONTRACTOR_FRAMES.forEach((rows, i) =>
    canvasTexture(scene, TEX.contractor(i), PLAYER_SIZE.w, PLAYER_SIZE.h, (ctx) => drawPixelMap(ctx, rows)),
  );

  // Pasta de contratos (28×20): azul-escura, etiqueta clara
  canvasTexture(scene, TEX.folder, 28, 20, (ctx) => {
    ctx.fillStyle = "#14325a";
    ctx.fillRect(0, 2, 28, 18);
    ctx.fillStyle = "#1f4a80";
    ctx.fillRect(2, 0, 10, 4);
    ctx.fillRect(2, 4, 24, 14);
    ctx.fillStyle = "#fbf7ea";
    ctx.fillRect(6, 8, 16, 6);
    ctx.fillStyle = "#14325a";
    ctx.fillRect(8, 10, 12, 1);
    ctx.fillRect(8, 12, 8, 1);
  });

  // Peça de planta baixa (26×20): papel azul com linhas brancas
  canvasTexture(scene, TEX.blueprint, 26, 20, (ctx) => {
    ctx.fillStyle = "#1d5fa8";
    ctx.fillRect(0, 0, 26, 20);
    ctx.fillStyle = "#7fb3ea";
    for (let x = 4; x < 26; x += 6) ctx.fillRect(x, 0, 1, 20);
    for (let y = 4; y < 20; y += 6) ctx.fillRect(0, y, 26, 1);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(3, 3, 20, 2);
    ctx.fillRect(3, 3, 2, 14);
    ctx.fillRect(3, 15, 12, 2);
    ctx.fillRect(13, 9, 10, 2);
    ctx.fillRect(21, 3, 2, 8);
  });

  // Mala (36×28): couro marrom, alça, cédulas estilizadas saindo
  canvasTexture(scene, TEX.bag, 36, 28, (ctx) => {
    ctx.fillStyle = "#3a2414";
    ctx.fillRect(12, 0, 12, 3);
    ctx.fillRect(12, 0, 2, 7);
    ctx.fillRect(22, 0, 2, 7);
    ctx.fillStyle = "#4fa860";
    ctx.fillRect(6, 5, 10, 4);
    ctx.fillRect(18, 4, 11, 5);
    ctx.fillStyle = "#2f7a3f";
    ctx.fillRect(9, 6, 4, 2);
    ctx.fillRect(22, 5, 4, 2);
    ctx.fillStyle = "#7a4a26";
    ctx.fillRect(0, 8, 36, 20);
    ctx.fillStyle = "#93603a";
    ctx.fillRect(2, 10, 32, 6);
    ctx.fillStyle = "#3a2414";
    ctx.fillRect(0, 17, 36, 2);
    ctx.fillStyle = "#e8c44a";
    ctx.fillRect(15, 15, 6, 6);
  });

  // Pedestal (40×30)
  canvasTexture(scene, TEX.pedestal, 40, 30, (ctx) => {
    ctx.fillStyle = "#d9cdb3";
    ctx.fillRect(0, 0, 40, 6);
    ctx.fillStyle = "#b9ab95";
    ctx.fillRect(6, 6, 28, 20);
    ctx.fillStyle = "#8a7c68";
    ctx.fillRect(2, 26, 36, 4);
  });

  // Recorte de notícia ilustrado (34×40), sem logotipo
  canvasTexture(scene, TEX.clipping, 34, 40, (ctx) => {
    ctx.fillStyle = "#3a2a1a";
    ctx.fillRect(0, 0, 34, 40);
    ctx.fillStyle = "#efe6cf";
    ctx.fillRect(2, 2, 30, 36);
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(5, 5, 24, 4);
    ctx.fillStyle = "#8b8170";
    for (let y = 12; y < 36; y += 3) ctx.fillRect(5, y, y % 6 ? 24 : 16, 1);
  });

  // Balcão da defesa (56×44) com cartão
  canvasTexture(scene, TEX.defense, 56, 44, (ctx) => {
    ctx.fillStyle = "#1f6f45";
    ctx.fillRect(0, 14, 56, 30);
    ctx.fillStyle = "#2fa84f";
    ctx.fillRect(0, 14, 56, 4);
    ctx.fillStyle = "#17553a";
    ctx.fillRect(4, 22, 48, 18);
    ctx.fillStyle = "#fbf7ea";
    ctx.fillRect(16, 0, 24, 16);
    ctx.fillStyle = "#1f6f45";
    ctx.fillRect(19, 3, 18, 2);
    ctx.fillRect(19, 7, 14, 1);
    ctx.fillRect(19, 10, 16, 1);
  });

  // Arquivo de registro de imóveis (30×44)
  canvasTexture(scene, TEX.registry, 30, 44, (ctx) => {
    ctx.fillStyle = "#5a6470";
    ctx.fillRect(0, 0, 30, 44);
    ctx.fillStyle = "#7b8794";
    for (let y = 3; y < 44; y += 14) ctx.fillRect(3, y, 24, 11);
    ctx.fillStyle = "#e8c44a";
    for (let y = 7; y < 44; y += 14) ctx.fillRect(12, y, 6, 2);
  });

  // Mesa da obra (80×40)
  canvasTexture(scene, TEX.desk, 80, 40, (ctx) => {
    ctx.fillStyle = "#6b4a2c";
    ctx.fillRect(0, 0, 80, 6);
    ctx.fillStyle = "#4a3320";
    ctx.fillRect(4, 6, 6, 34);
    ctx.fillRect(70, 6, 6, 34);
    ctx.fillRect(44, 6, 30, 22);
    ctx.fillStyle = "#e8c44a";
    ctx.fillRect(57, 14, 4, 2);
  });

  // Elevador privativo (100×16) e cabine de vidro (100×84)
  canvasTexture(scene, TEX.liftPrivate, 100, 16, (ctx) => {
    ctx.fillStyle = "#2c2c38";
    ctx.fillRect(0, 0, 100, 16);
    ctx.fillStyle = "#e8c44a";
    ctx.fillRect(0, 0, 100, 3);
    ctx.fillRect(0, 13, 100, 3);
    ctx.fillStyle = "#4a4a5c";
    for (let x = 6; x < 100; x += 14) ctx.fillRect(x, 6, 8, 4);
  });
  canvasTexture(scene, TEX.cabin, 100, 84, (ctx) => {
    ctx.fillStyle = "rgba(160, 215, 240, 0.28)";
    ctx.fillRect(0, 0, 100, 84);
    ctx.fillStyle = "#e8c44a";
    ctx.fillRect(0, 0, 100, 4);
    ctx.fillRect(0, 0, 3, 84);
    ctx.fillRect(97, 0, 3, 84);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(10, 10, 4, 40);
    ctx.fillRect(18, 10, 2, 24);
  });

  // Piso do andar privativo (32×20): mármore com friso dourado
  canvasTexture(scene, TEX.private, 32, 20, (ctx) => {
    ctx.fillStyle = "#efe9de";
    ctx.fillRect(0, 0, 32, 20);
    ctx.fillStyle = "#e8c44a";
    ctx.fillRect(0, 0, 32, 3);
    ctx.fillStyle = "#cfc6b6";
    ctx.fillRect(6, 7, 10, 1);
    ctx.fillRect(18, 12, 9, 1);
    ctx.fillStyle = "#b8ad99";
    ctx.fillRect(0, 17, 32, 3);
  });

  // Tapume da obra (24×330)
  canvasTexture(scene, TEX.tapume, 24, 330, (ctx) => {
    ctx.fillStyle = "#3d6b47";
    ctx.fillRect(0, 0, 24, 330);
    ctx.fillStyle = "#4f8a5c";
    for (let y = 0; y < 330; y += 30) ctx.fillRect(2, y + 2, 20, 26);
    ctx.fillStyle = "#f2c230";
    ctx.fillRect(0, 150, 24, 8);
  });

  canvasTexture(scene, TEX.sky, 4, 540, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#ff9a5c");
    g.addColorStop(0.45, "#ffc98a");
    g.addColorStop(1, "#8fd3e8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}
