import * as Phaser from "phaser";
import { triplexLevel } from "../../content/levels/triplex";
import type { NarrativeEvent, OutcomeStep } from "../../content/types";
import { requiredEventOrder } from "../../content/validate";
import { canShowSourced } from "../../content/visibility";
import type { SceneServices } from "../bridge";
import { Player } from "../entities/Player";
import {
  triplexMap,
  type BlueprintPieceDef,
  type CheckpointDef,
  type GateDef,
  type MovingPlatformDef,
  type Spot,
  type TimedPlatformDef,
} from "../levels/triplexMap";
import { LevelRun } from "../systems/levelRun";
import { generateTextures, TEX } from "../textures";

export const VIEW = { w: 960, h: 540 };

const SLAB_H = 20;
const SCAFFOLD_H = 16;
const GROUND_H = 80;
const TIMED_WARN_MS = 600;
const TOUCH_EXTRA_BOTTOM = 130;

/** IDs dos eventos do roteiro (src/content/levels/triplex.ts) usados pela cena. */
const EV = {
  contractor: "meet-contractor",
  contract: "find-contract",
  blueprint: "assemble-renovation",
  bag: "symbolic-bag",
  lift: "private-elevator",
  defense: "open-defense",
} as const;

const TEXT_SIGN: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "monospace",
  fontSize: "12px",
  fontStyle: "bold",
  color: "#2b1d0e",
  backgroundColor: "#f2e3b3",
  padding: { x: 6, y: 4 },
  align: "center",
};

const TEXT_LABEL: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "monospace",
  fontSize: "11px",
  fontStyle: "bold",
  color: "#ffffff",
  backgroundColor: "#1b1230",
  padding: { x: 4, y: 2 },
  align: "center",
};

interface Mover {
  def: MovingPlatformDef;
  obj: Phaser.GameObjects.TileSprite;
  body: Phaser.Physics.Arcade.Body;
  min: number;
  max: number;
}

interface Timed {
  def: TimedPlatformDef;
  obj: Phaser.GameObjects.TileSprite;
  body: Phaser.Physics.Arcade.StaticBody;
}

interface Flag {
  def: CheckpointDef;
  img: Phaser.GameObjects.Image;
}

interface Gate {
  def: GateDef;
  img: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
  body: Phaser.Physics.Arcade.StaticBody;
  open: boolean;
}

interface Piece {
  def: BlueprintPieceDef;
  img: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
}

/** Objeto em cena ligado a um evento do roteiro, acionado com "interagir". */
interface Interactable {
  eventId: string;
  at: Spot;
  reach: number;
  verb: string;
  /** Altura do aviso "E: ..." acima do objeto, sem cobrir o rótulo dele. */
  promptOffset: number;
}

/**
 * Fase 1 — "Tríplex: Subindo na Vida", roteiro do briefing v2 (seção 6).
 * Regras ficam em LevelRun; o mapa em levels/triplexMap; textos e fontes em
 * src/content. Esta cena junta tudo no mundo jogável.
 */
export class TriplexScene extends Phaser.Scene {
  static readonly KEY = "triplex";

  private services!: SceneServices;
  private readonly map = triplexMap;
  private readonly level = triplexLevel;
  private storyEvents = new Map<string, NarrativeEvent>();
  private run!: LevelRun;
  private player!: Player;
  private movers: Mover[] = [];
  private timed: Timed[] = [];
  private flags: Flag[] = [];
  private gates: Gate[] = [];
  private pieces: Piece[] = [];
  private interactables: Interactable[] = [];
  private unlockPlatform!: Phaser.GameObjects.TileSprite;
  private lift!: Mover;
  private liftActive = false;
  private onPrivateLift = false;
  private cabin!: Phaser.GameObjects.Image;
  private liftSign!: Phaser.GameObjects.Text;
  private contractor!: Phaser.GameObjects.Sprite;
  private renovationBefore!: Phaser.GameObjects.Graphics;
  private renovationAfter!: Phaser.GameObjects.Container;
  private exitDoor!: Phaser.GameObjects.Image;
  private exitSign!: Phaser.GameObjects.Text;
  private prompt!: Phaser.GameObjects.Text;
  private sea!: Phaser.GameObjects.TileSprite;
  private seenTutorials = new Set<string>();
  private nearExit = false;
  private busy = false; // reaparecendo após queda
  private finished = false;
  private endingDone = false;

  constructor() {
    super({ key: TriplexScene.KEY });
  }

  init(data: SceneServices): void {
    this.services = data;
  }

  create(): void {
    // Campos de instância sobrevivem a scene.restart(); zere tudo aqui.
    this.movers = [];
    this.timed = [];
    this.flags = [];
    this.gates = [];
    this.pieces = [];
    this.interactables = [];
    this.seenTutorials = new Set();
    this.nearExit = false;
    this.busy = false;
    this.finished = false;
    this.endingDone = false;
    this.liftActive = false;
    this.onPrivateLift = false;
    this.services.input.clear();

    const m = this.map;
    this.storyEvents = new Map(this.level.narrativeEvents.map((e) => [e.id, e]));
    const order = requiredEventOrder(this.level);
    for (const id of Object.values(EV)) {
      if (!order.includes(id)) throw new Error(`Evento do roteiro ausente na Fase 1: ${id}`);
    }
    this.run = new LevelRun({
      start: m.start,
      missions: order.map((id) => (id === EV.blueprint ? { id, parts: m.blueprintPieces.map((p) => p.id) } : { id })),
    });

    generateTextures(this);
    this.physics.world.setBounds(0, 0, m.width, m.height + 200);
    this.physics.world.setBoundsCollision(true, true, false, false);

    this.buildBackground();
    const statics = this.buildPlatforms();
    this.buildMovers();
    this.buildTimed();
    this.buildGates();
    this.buildMissionObjects();
    this.buildCheckpoints();

    this.player = new Player(this, m.start.x, m.start.y);
    this.player.setCollideWorldBounds(true);
    this.player.onJump = () => this.services.playSfx("jump");

    this.physics.add.collider(this.player, statics);
    this.physics.add.collider(this.player, this.unlockPlatform);
    this.physics.add.collider(this.player, this.timed.map((t) => t.obj));
    this.physics.add.collider(this.player, this.gates.map((g) => g.img));
    this.physics.add.collider(
      this.player,
      this.movers.map((mv) => mv.obj),
      (_p, platform) => {
        const body = (platform as Phaser.GameObjects.TileSprite).body as Phaser.Physics.Arcade.Body;
        if (this.player.body.touching.down) {
          this.player.riding = body;
          if (body === this.lift.body) this.onPrivateLift = true;
        }
      },
    );

    this.prompt = this.add.text(0, 0, "", { ...TEXT_SIGN, backgroundColor: "#1b1230", color: "#ffffff" }).setOrigin(0.5, 1).setDepth(30).setVisible(false);

    const cam = this.cameras.main;
    // Com controles de toque, a câmera pode descer um pouco além do mapa para
    // os botões não cobrirem o personagem no chão.
    cam.setBounds(0, 0, m.width, m.height + (this.services.touchMode() ? TOUCH_EXTRA_BOTTOM : 0));
    cam.startFollow(this.player, true, 0.12, 0.12, 0, 70);
    cam.setDeadzone(60, 40);
    cam.roundPixels = true;

    this.emitHud();
  }

  // ---------------------------------------------------------------------------
  // Construção do cenário

  private buildBackground(): void {
    const m = this.map;
    this.add.image(0, 0, TEX.sky).setOrigin(0).setDisplaySize(VIEW.w, VIEW.h).setScrollFactor(0).setDepth(-100);
    const sun = this.add.graphics().setScrollFactor(0).setDepth(-99);
    sun.fillStyle(0xfff1b8, 1).fillCircle(790, 110, 46);
    sun.fillStyle(0xffe08a, 0.35).fillCircle(790, 110, 62);
    [
      [80, 70, 0.1],
      [420, 40, 0.15],
      [700, 160, 0.12],
      [1100, 90, 0.18],
    ].forEach(([x, y, sf]) => this.add.image(x, y, TEX.cloud).setScrollFactor(sf, 0.05).setDepth(-98));

    const hills = this.add.graphics().setScrollFactor(0.3).setDepth(-97);
    hills.fillStyle(0x6fa77a, 1);
    const baseY = 420 + 540 * 0.3;
    for (let i = 0; i < 9; i++) {
      const x = i * 220 - 60;
      hills.fillTriangle(x, baseY + 140, x + 150, baseY - 30 - (i % 3) * 25, x + 300, baseY + 140);
    }
    hills.fillStyle(0x4f8a60, 1).fillRect(-100, baseY + 60, 2200, 300);

    this.buildBuilding();

    this.sea = this.add.tileSprite(1000, 1020, m.width - 1000, 60, TEX.sea).setOrigin(0).setDepth(6);
    // Fundo abaixo do mapa (só aparece com a câmera estendida do modo toque).
    this.add.rectangle(0, m.height, 1000, TOUCH_EXTRA_BOTTOM, 0x87785c).setOrigin(0).setDepth(2);
    this.add.rectangle(1000, m.height, m.width - 1000, TOUCH_EXTRA_BOTTOM, 0x1a5f90).setOrigin(0).setDepth(6);
  }

  private buildBuilding(): void {
    const m = this.map;
    const g = this.add.graphics().setDepth(-20);

    // Calçada e escritório: fachada do Solaris
    g.fillStyle(0xe9dcc0, 1).fillRect(0, 620, 1000, 380);
    g.fillStyle(0xcdbd9b, 1).fillRect(0, 620, 1000, 18);
    g.fillStyle(0x8fc1d6, 1);
    for (let x = 40; x < 560; x += 120) g.fillRect(x, 680, 70, 90);
    g.fillStyle(0x6d9db3, 1);
    for (let x = 40; x < 560; x += 120) g.fillRect(x, 725, 70, 4);
    // Portaria
    g.fillStyle(0x5a4632, 1).fillRect(104, 862, 102, 138);
    g.fillStyle(0x8fc1d6, 1).fillRect(112, 872, 40, 128).fillRect(158, 872, 40, 128);
    g.fillStyle(0xd7ecf5, 0.6).fillRect(116, 876, 8, 60).fillRect(162, 876, 8, 60);
    // Escritório da obra: parede de compensado e quadro de empreendimentos
    g.fillStyle(0xc9a878, 1).fillRect(624, 660, 376, 340);
    g.fillStyle(0xb38f5e, 1);
    for (let x = 624; x < 1000; x += 47) g.fillRect(x, 660, 2, 340);
    g.fillStyle(0xf6f1e3, 1).fillRect(800, 700, 150, 80);
    g.fillStyle(0x5a4632, 1).fillRect(800, 700, 150, 4).fillRect(800, 776, 150, 4);
    const pins = [0xc8202f, 0x1f5fa8, 0x2fa84f, 0xf2c230];
    pins.forEach((c, i) => g.fillStyle(c, 1).fillRect(812 + i * 34, 716 + (i % 2) * 22, 22, 16));
    // Capacetes da obra
    g.fillStyle(0xf2c230, 1).fillEllipse(470, 994, 26, 14).fillEllipse(496, 994, 26, 14).fillEllipse(483, 984, 26, 14);

    // Área de reforma: estrutura em obra
    g.fillStyle(0x8f8f8f, 1);
    for (let x = 1010; x < 1880; x += 135) g.fillRect(x, 380, 16, 640);
    for (let y = 420; y < 1020; y += 110) g.fillRect(1000, y, 880, 10);
    g.lineStyle(4, 0xf2c230, 0.9);
    for (let x = 1040; x < 1850; x += 135) g.lineBetween(x, 1020, x + 135, 420);

    // Trilhos do elevador privativo
    const liftDef = m.moving.find((mv) => mv.id === m.privateLiftId)!;
    const top = liftDef.y + Math.min(0, liftDef.distance) - 90;
    const bottom = liftDef.y + Math.max(0, liftDef.distance) + 40;
    g.fillStyle(0x3b4651, 1);
    g.fillRect(liftDef.x + 4, top, 4, bottom - top);
    g.fillRect(liftDef.x + liftDef.w - 8, top, 4, bottom - top);

    // Andar privativo e terraço: fachada mais sofisticada
    g.fillStyle(0xf3e6c8, 1).fillRect(1880, 300, 1000, 720);
    g.fillStyle(0xe8c44a, 1).fillRect(1880, 466, 210, 4);
    g.fillStyle(0xd6c49f, 1);
    for (let y = 340; y < 1020; y += 90) g.fillRect(2090, y, 790, 8);
    g.fillStyle(0x8fc1d6, 1);
    for (let y = 360; y < 1000; y += 90) for (let x = 2120; x < 2860; x += 90) g.fillRect(x, y, 50, 50);
    // Varanda do andar privativo
    g.fillStyle(0x9fd6ef, 0.6).fillRect(1890, 380, 180, 60);
    g.lineStyle(2, 0xe8c44a, 1).strokeRect(1890, 380, 180, 60);

    this.add
      .text(330, 836, "SOLARIS — GUARUJÁ", {
        fontFamily: "monospace",
        fontSize: "20px",
        fontStyle: "bold",
        color: "#1f5fa8",
        backgroundColor: "#fff6df",
        padding: { x: 10, y: 6 },
      })
      .setOrigin(0.5, 1)
      .setDepth(-19);
    this.add.text(483, 966, "OAS", { ...TEXT_LABEL, fontSize: "10px" }).setOrigin(0.5, 1).setDepth(-18);
    this.add.text(875, 696, "EMPREENDIMENTOS", { ...TEXT_LABEL, fontSize: "10px" }).setOrigin(0.5, 1).setDepth(-18);

    for (const z of m.zones) {
      this.add
        .text(z.x, z.y, z.label, { fontFamily: "monospace", fontSize: "14px", fontStyle: "bold", color: "#ffffff", backgroundColor: "#00000066", padding: { x: 6, y: 3 } })
        .setDepth(-18);
    }
    for (const s of m.signs) this.add.text(s.x, s.y, s.text, TEXT_SIGN).setOrigin(0.5, 1).setDepth(-5);

    this.buildRenovationDecor();
  }

  /** Cozinha e escada: contorno "em instalação" antes; montadas depois da planta. */
  private buildRenovationDecor(): void {
    const before = this.add.graphics().setDepth(-15);
    before.lineStyle(2, 0xffffff, 0.8);
    for (let x = 1250; x < 1430; x += 12) before.lineBetween(x, 620, x + 6, 620).lineBetween(x, 700, x + 6, 700);
    for (let y = 620; y < 700; y += 12) before.lineBetween(1250, y, 1250, y + 6).lineBetween(1430, y, 1430, y + 6);
    this.renovationBefore = before;
    const beforeLabel = this.add.text(1340, 660, "COZINHA\n(em instalação)", { ...TEXT_LABEL, backgroundColor: "#00000066" }).setOrigin(0.5).setDepth(-14);

    const k = this.add.graphics();
    // Cozinha: armários, bancada, fogão, azulejos
    k.fillStyle(0xf6f1e3, 1).fillRect(0, 0, 180, 80);
    k.fillStyle(0xbfe3ef, 1);
    for (let x = 0; x < 180; x += 12) for (let y = 0; y < 34; y += 12) k.fillRect(x + 1, y + 1, 10, 10);
    k.fillStyle(0x7a4a26, 1).fillRect(0, 0, 180, 18);
    k.fillStyle(0x93603a, 1);
    for (let x = 4; x < 180; x += 44) k.fillRect(x, 3, 40, 12);
    k.fillStyle(0x3b3b3b, 1).fillRect(0, 40, 180, 6);
    k.fillStyle(0x7a4a26, 1).fillRect(0, 46, 180, 34);
    k.fillStyle(0x93603a, 1);
    for (let x = 4; x < 180; x += 30) k.fillRect(x, 50, 26, 26);
    k.fillStyle(0x222222, 1).fillRect(120, 34, 40, 6);
    k.fillStyle(0xe8c44a, 1).fillRect(126, 36, 6, 2).fillRect(146, 36, 6, 2);
    // Escada de madeira até o mezanino
    // Escada de madeira, ao lado da cozinha
    const stairs = this.add.graphics();
    stairs.fillStyle(0x93603a, 1);
    for (let i = 0; i < 6; i++) stairs.fillRect(i * 8, 72 - i * 14, 18, 5);
    stairs.fillStyle(0x6b4a2c, 1).fillRect(0, 0, 3, 80).fillRect(56, 0, 3, 80);
    stairs.setPosition(186, 0);
    const label = this.add.text(120, -14, "COZINHA E ESCADA PRONTAS", { ...TEXT_LABEL, backgroundColor: "#2fa84f" }).setOrigin(0.5, 1);
    this.renovationAfter = this.add.container(1250, 620, [k, stairs, label]).setDepth(-15).setAlpha(0);
    this.renovationAfter.setData("beforeLabel", beforeLabel);
  }

  private buildPlatforms(): Phaser.GameObjects.TileSprite[] {
    const list: Phaser.GameObjects.TileSprite[] = [];
    for (const p of this.map.platforms) list.push(this.platform(p.x, p.y, p.w, p.style));
    // Passagem para os andaimes: aparece depois do contrato.
    const u = this.map.unlockPlatform;
    this.unlockPlatform = this.platform(u.x, u.y, u.w, u.style).setAlpha(0.2);
    (this.unlockPlatform.body as Phaser.Physics.Arcade.StaticBody).enable = false;
    return list;
  }

  private platform(x: number, y: number, w: number, style: string): Phaser.GameObjects.TileSprite {
    const h = style === "ground" ? GROUND_H : style === "scaffold" ? SCAFFOLD_H : SLAB_H;
    const key = style === "ground" ? TEX.ground : style === "scaffold" ? TEX.scaffold : style === "private" ? TEX.private : TEX.slab;
    const obj = this.add.tileSprite(x, y, w, h, key).setOrigin(0).setDepth(2);
    this.physics.add.existing(obj, true);
    if (style !== "ground") oneWay(obj.body as Phaser.Physics.Arcade.StaticBody);
    return obj;
  }

  private buildMovers(): void {
    for (const def of this.map.moving) {
      const key = def.style === "lift" ? TEX.lift : TEX.scaffold;
      const obj = this.add.tileSprite(def.x, def.y, def.w, 16, key).setOrigin(0).setDepth(3);
      this.physics.add.existing(obj);
      const body = obj.body as Phaser.Physics.Arcade.Body;
      body.setAllowGravity(false).setImmovable(true);
      oneWay(body);
      const start = def.axis === "x" ? def.x : def.y;
      const end = start + def.distance;
      const mover: Mover = { def, obj, body, min: Math.min(start, end), max: Math.max(start, end) };
      if (def.id === this.map.privateLiftId) {
        this.lift = mover; // parado até a missão do elevador
      } else if (def.axis === "x") body.setVelocityX(def.speed * Math.sign(def.distance));
      else body.setVelocityY(def.speed * Math.sign(def.distance));
      this.movers.push(mover);
    }
    this.cabin = this.add.image(this.lift.obj.x, this.lift.obj.y, TEX.cabin).setOrigin(0, 1).setDepth(1).setVisible(false);
    this.liftSign = this.add
      .text(this.lift.def.x + this.lift.def.w / 2, this.lift.def.y + this.lift.def.distance - 100, "ELEVADOR PRIVATIVO\n(aguardando reforma)", TEXT_SIGN)
      .setOrigin(0.5, 1)
      .setDepth(-5);
  }

  private buildTimed(): void {
    for (const def of this.map.timed) {
      const obj = this.add.tileSprite(def.x, def.y, def.w, 16, TEX.timed).setOrigin(0).setDepth(3);
      this.physics.add.existing(obj, true);
      const body = obj.body as Phaser.Physics.Arcade.StaticBody;
      oneWay(body);
      this.timed.push({ def, obj, body });
    }
  }

  private buildGates(): void {
    for (const def of this.map.gates) {
      const img = this.add.image(def.x, def.y, def.kind === "tapume" ? TEX.tapume : TEX.door).setOrigin(0, 1).setDepth(4);
      if (def.kind === "tapume") img.setDisplaySize(24, def.h);
      this.physics.add.existing(img, true);
      const label = this.add.text(def.x + 12, def.y - def.h - 4, def.label, TEXT_LABEL).setOrigin(0.5, 1).setDepth(4);
      this.gates.push({ def, img, label, body: img.body as Phaser.Physics.Arcade.StaticBody, open: false });
    }
    const ex = this.map.exit;
    // Escurecida enquanto houver missões pendentes (ver emitHud).
    this.exitDoor = this.add.image(ex.x, ex.y, TEX.exit).setOrigin(0.5, 1).setDepth(1).setTint(0x777777);
    this.exitSign = this.add.text(ex.x, ex.y - 78, "SAÍDA", { ...TEXT_SIGN, backgroundColor: "#c8202f", color: "#ffffff" }).setOrigin(0.5, 1).setDepth(1);
  }

  private buildMissionObjects(): void {
    const m = this.map;
    const reduced = this.services.reducedMotion();

    // 1. Empreiteiro (personagem fictício)
    if (!this.anims.exists("empreiteiro-idle")) {
      this.anims.create({ key: "empreiteiro-idle", frames: [{ key: TEX.contractor(0) }, { key: TEX.contractor(1) }], frameRate: 2, repeat: -1 });
    }
    this.contractor = this.add.sprite(m.contractor.x, m.contractor.y, TEX.contractor(0)).setOrigin(0.5, 1).setDepth(9).setFlipX(true);
    this.contractor.play("empreiteiro-idle");
    this.add.text(m.contractor.x, m.contractor.y - 52, "EMPREITEIRO", TEXT_LABEL).setOrigin(0.5, 1).setDepth(9);
    this.interactables.push({ eventId: EV.contractor, at: m.contractor, reach: 55, verb: "conversar", promptOffset: 80 });

    // 2. Mesa com a pasta de contratos (ilustração)
    const c = m.contract;
    this.add.image(c.x, c.y, TEX.desk).setOrigin(0.5, 1).setDepth(1);
    this.add.image(c.x - 14, c.y - 40, TEX.folder).setOrigin(0.5, 1).setDepth(2);
    this.add.rectangle(c.x + 22, c.y - 44, 12, 8, 0x2b2b2b).setDepth(2);
    this.add.text(c.x - 14, c.y - 64, "CONTRATOS\nPETROBRAS", { ...TEXT_LABEL, fontSize: "10px", backgroundColor: "#14325a" }).setOrigin(0.5, 1).setDepth(2);
    this.interactables.push({ eventId: EV.contract, at: c, reach: 55, verb: "abrir a pasta", promptOffset: 102 });

    // 3. Peças da planta da reforma
    for (const def of m.blueprintPieces) {
      const img = this.add.image(def.x, def.y - 24, TEX.blueprint).setDepth(8).setAlpha(0.45);
      const label = this.add.text(def.x, def.y - 38, `PLANTA: ${def.label.toUpperCase()}`, { ...TEXT_LABEL, fontSize: "10px", backgroundColor: "#1d5fa8" }).setOrigin(0.5, 1).setDepth(8).setAlpha(0.45);
      if (!reduced) this.tweens.add({ targets: img, y: img.y - 5, duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      this.pieces.push({ def, img, label });
    }

    // 4. Mezanino da acusação: mala simbólica no pedestal, com recorte ilustrado
    const b = m.bag;
    this.add.image(b.x - 52, b.y, TEX.clipping).setOrigin(0.5, 1).setDepth(1);
    this.add.image(b.x, b.y, TEX.pedestal).setOrigin(0.5, 1).setDepth(1);
    this.add.image(b.x, b.y - 30, TEX.bag).setOrigin(0.5, 1).setDepth(2);
    this.add.text(b.x - 20, b.y - 66, "METÁFORA DA ACUSAÇÃO", { ...TEXT_LABEL, backgroundColor: "#c8202f" }).setOrigin(0.5, 1).setDepth(2);
    this.add.text(b.x - 40, b.y - 118, "MEZANINO DA ACUSAÇÃO", { ...TEXT_LABEL, backgroundColor: "#00000088" }).setOrigin(0.5, 1).setDepth(-5);
    this.interactables.push({ eventId: EV.bag, at: b, reach: 50, verb: "examinar a mala", promptOffset: 92 });

    // 6. Balcão da defesa, com o registro de imóveis ao lado
    const d = m.defense;
    this.add.image(d.x - 48, d.y, TEX.registry).setOrigin(0.5, 1).setDepth(1);
    this.add.text(d.x - 48, d.y - 46, "REGISTRO DE IMÓVEIS", { ...TEXT_LABEL, fontSize: "9px", backgroundColor: "#5a6470" }).setOrigin(0.5, 1).setDepth(1);
    this.add.image(d.x, d.y, TEX.defense).setOrigin(0.5, 1).setDepth(1);
    this.add.text(d.x + 4, d.y - 68, "DEFESA DE LULA", { ...TEXT_LABEL, backgroundColor: "#1f6f45" }).setOrigin(0.5, 1).setDepth(1);
    this.interactables.push({ eventId: EV.defense, at: d, reach: 55, verb: "abrir a defesa", promptOffset: 96 });
  }

  private buildCheckpoints(): void {
    for (const def of this.map.checkpoints) {
      const img = this.add.image(def.x, def.y, TEX.flagOff).setOrigin(0.5, 1).setDepth(1);
      this.flags.push({ def, img });
    }
  }

  // ---------------------------------------------------------------------------
  // Ciclo de jogo

  update(time: number, delta: number): void {
    const dt = Math.min(delta, 50);
    this.sea.tilePositionX += dt * 0.02;
    this.updateMovers();

    if (this.finished) {
      if (!this.endingDone && (this.services.input.consumePress("jump", 200) || this.services.input.consumePress("interact", 200))) {
        this.finishLevel();
      }
      this.player.step(time, dt, this.services.input);
      return;
    }

    this.run.tick(dt);
    this.updateTimed();
    this.player.step(time, dt, this.services.input);
    if (this.busy) return;

    if (this.player.y > this.map.killY) {
      this.handleFall();
      return;
    }

    this.checkTutorials();
    this.checkPieces();
    this.checkPrivateLift();
    this.checkCheckpoints();
    this.checkInteractions();
    this.onPrivateLift = false;
  }

  private updateMovers(): void {
    for (const mv of this.movers) {
      if (mv === this.lift && !this.liftActive) continue;
      const pos = mv.def.axis === "x" ? mv.obj.x : mv.obj.y;
      const v = mv.def.axis === "x" ? mv.body.velocity.x : mv.body.velocity.y;
      let next = v;
      if (pos <= mv.min && v < 0) next = mv.def.speed;
      else if (pos >= mv.max && v > 0) next = -mv.def.speed;
      if (next !== v) {
        if (mv.def.axis === "x") mv.body.setVelocityX(next);
        else mv.body.setVelocityY(next);
      }
    }
    if (this.cabin.visible) this.cabin.setPosition(this.lift.obj.x, this.lift.obj.y);
  }

  private updateTimed(): void {
    const reduced = this.services.reducedMotion();
    for (const t of this.timed) {
      const period = t.def.onMs + t.def.offMs;
      const phase = (this.run.elapsedMs + t.def.offsetMs) % period;
      const on = phase < t.def.onMs;
      if (t.body.enable !== on) t.body.enable = on;
      if (!on) t.obj.setAlpha(0.15);
      else if (phase > t.def.onMs - TIMED_WARN_MS) t.obj.setAlpha(reduced ? 0.55 : Math.floor(phase / 100) % 2 ? 0.35 : 1);
      else t.obj.setAlpha(1);
    }
  }

  private checkTutorials(): void {
    const x = this.player.x;
    for (const z of this.map.tutorial) {
      if (!this.seenTutorials.has(z.id) && x >= z.x0 && x <= z.x1) {
        this.seenTutorials.add(z.id);
        this.toast(this.services.touchMode() ? z.touch : z.keyboard);
      }
    }
  }

  private checkPieces(): void {
    if (this.run.currentMission !== EV.blueprint) return;
    const px = this.player.x;
    const py = this.player.y;
    for (const p of this.pieces) {
      if (this.run.hasPart(EV.blueprint, p.def.id)) continue;
      if (Math.abs(px - p.def.x) < 26 && Math.abs(py - p.def.y) < 30 && this.run.addPart(EV.blueprint, p.def.id)) {
        this.services.playSfx("collect");
        this.tweens.killTweensOf(p.img);
        this.tweens.add({ targets: [p.img, p.label], y: "-=30", alpha: 0, duration: 300, onComplete: () => p.img.setVisible(false) });
        const have = this.run.partCount(EV.blueprint);
        const total = this.run.partTotal(EV.blueprint);
        this.toast(`Peça da planta: ${p.def.label} (${have} de ${total}).`, "success");
        if (!this.completeEvent(EV.blueprint)) this.emitHud();
      }
    }
  }

  private checkPrivateLift(): void {
    if (this.onPrivateLift && this.liftActive && this.run.currentMission === EV.lift) this.completeEvent(EV.lift);
  }

  private checkCheckpoints(): void {
    const { x, y } = this.player;
    for (const f of this.flags) {
      if (Math.abs(x - f.def.x) < 50 && Math.abs(y - f.def.y) < 50) {
        if (this.run.checkpoints.activate(f.def.id, f.def.order, { x: f.def.x, y: f.def.y })) {
          f.img.setTexture(TEX.flagOn);
          this.services.playSfx("checkpoint");
          this.toast("Ponto de retorno atualizado.", "success");
        }
      }
    }
  }

  private checkInteractions(): void {
    const { x, y } = this.player;
    const key = this.services.touchMode() ? "✋" : "E";
    const input = this.services.input;
    let promptAt: { x: number; y: number; text: string } | null = null;

    for (const it of this.interactables) {
      if (Math.abs(x - it.at.x) >= it.reach || Math.abs(y - it.at.y) >= 45) continue;
      const done = this.run.isDone(it.eventId);
      const current = this.run.currentMission === it.eventId;
      const text = done ? `${key}: rever` : current ? `${key}: ${it.verb}` : "Siga a missão atual";
      promptAt = { x: it.at.x, y: it.at.y - it.promptOffset, text };
      if (input.consumePress("interact", 150)) {
        if (done) this.services.bridge.emit("interaction", { eventId: it.eventId });
        else if (current) this.completeEvent(it.eventId);
        else this.services.playSfx("deny");
      }
    }

    for (const gate of this.gates) {
      if (gate.open || gate.def.kind !== "door") continue;
      const cx = gate.def.x + 12;
      if (Math.abs(x - cx) < 60 && Math.abs(y - gate.def.y) < 40) {
        promptAt = { x: cx, y: gate.def.y - gate.def.h - 22, text: `${key}: abrir` };
        if (input.consumePress("interact", 150)) {
          this.openGate(gate);
          this.toast("Porta de serviço aberta.");
        }
      }
    }

    const ex = this.map.exit;
    const atExit = Math.abs(x - ex.x) < 40 && Math.abs(y - ex.y) < 40;
    if (atExit) {
      const open = this.run.allDone;
      promptAt = { x: ex.x, y: ex.y - 104, text: open ? `${key}: sair` : "Ainda não" };
      if (!this.nearExit && !open) this.denyExit();
      if (input.consumePress("interact", 150)) {
        if (open) {
          this.startEnding();
          return;
        }
        this.denyExit();
      }
    }
    this.nearExit = atExit;

    if (promptAt) this.prompt.setText(promptAt.text).setPosition(promptAt.x, promptAt.y).setVisible(true);
    else this.prompt.setVisible(false);
  }

  /** Conclui a missão atual, mostra a faixa de notícia e aplica o efeito no cenário. */
  private completeEvent(eventId: string): boolean {
    if (!this.run.complete(eventId)) return false;
    this.services.playSfx("checkpoint");
    this.services.bridge.emit("interaction", { eventId });
    this.applyEffect(eventId);
    this.emitHud();
    return true;
  }

  private applyEffect(eventId: string): void {
    const reduced = this.services.reducedMotion();
    switch (eventId) {
      case EV.contractor: {
        // O empreiteiro abre o tapume do escritório.
        const tapume = this.gates.find((g) => g.def.kind === "tapume");
        if (tapume) this.openGate(tapume);
        this.contractor.setFlipX(false);
        break;
      }
      case EV.contract: {
        // Linha pontilhada "Tese da acusação" liga a pasta à obra; a passagem aparece.
        this.drawAccusationLine();
        const body = this.unlockPlatform.body as Phaser.Physics.Arcade.StaticBody;
        body.enable = true;
        if (reduced) this.unlockPlatform.setAlpha(1);
        else this.tweens.add({ targets: this.unlockPlatform, alpha: 1, duration: 500 });
        for (const p of this.pieces) {
          p.img.setAlpha(1);
          p.label.setAlpha(1);
        }
        this.toast("Passagem para a área de reforma liberada.", "success");
        break;
      }
      case EV.blueprint: {
        // A reforma aparece montada; o elevador ganha acabamento privativo.
        this.renovationBefore.setVisible(false);
        (this.renovationAfter.getData("beforeLabel") as Phaser.GameObjects.Text).setVisible(false);
        if (reduced) this.renovationAfter.setAlpha(1);
        else {
          this.renovationAfter.setScale(0.85);
          this.tweens.add({ targets: this.renovationAfter, alpha: 1, scale: 1, duration: 450, ease: "Back.easeOut" });
        }
        this.lift.obj.setTexture(TEX.liftPrivate);
        this.cabin.setVisible(true);
        this.liftSign.setText("ELEVADOR PRIVATIVO").setBackgroundColor("#e8c44a");
        break;
      }
      case EV.bag: {
        // A partir daqui o elevador privativo funciona.
        this.liftActive = true;
        this.lift.body.setVelocityY(-this.lift.def.speed);
        break;
      }
      case EV.defense: {
        this.exitDoor.clearTint();
        this.toast("Saída liberada: siga para o terraço.", "success");
        break;
      }
    }
  }

  private drawAccusationLine(): void {
    const from = { x: this.map.contract.x - 14, y: this.map.contract.y - 60 };
    const to = { x: 1340, y: 705 };
    const g = this.add.graphics().setDepth(-4);
    g.lineStyle(3, 0xc8202f, 0.9);
    const dist = Phaser.Math.Distance.Between(from.x, from.y, to.x, to.y);
    const steps = Math.floor(dist / 14);
    for (let i = 0; i < steps; i++) {
      const a = i / steps;
      const b = (i + 0.5) / steps;
      g.lineBetween(from.x + (to.x - from.x) * a, from.y + (to.y - from.y) * a, from.x + (to.x - from.x) * b, from.y + (to.y - from.y) * b);
    }
    this.add
      .text((from.x + to.x) / 2, (from.y + to.y) / 2 - 8, "TESE DA ACUSAÇÃO", { ...TEXT_LABEL, backgroundColor: "#c8202f" })
      .setOrigin(0.5, 1)
      .setDepth(-4);
  }

  private openGate(gate: Gate): void {
    gate.open = true;
    gate.body.enable = false;
    this.services.playSfx("door");
    gate.label.setVisible(false);
    if (this.services.reducedMotion()) gate.img.setAlpha(0.25);
    else if (gate.def.kind === "tapume") this.tweens.add({ targets: gate.img, y: gate.def.y - gate.def.h + 20, alpha: 0.3, duration: 450 });
    else this.tweens.add({ targets: gate.img, scaleX: 0.15, alpha: 0.5, duration: 250 });
  }

  private denyExit(): void {
    this.services.playSfx("deny");
    const current = this.run.currentMission;
    const ev = current ? this.storyEvents.get(current) : undefined;
    this.toast(`Antes de sair: ${ev ? ev.hudObjective : "termine as missões."}`, "warn");
  }

  private handleFall(): void {
    this.busy = true;
    this.services.playSfx("fall");
    const spot = this.run.fall();
    const respawn = () => {
      this.player.placeAt(spot.x, spot.y);
      this.busy = false;
      this.toast("Splash! De volta ao ponto de retorno.");
    };
    if (this.services.reducedMotion()) {
      respawn();
      return;
    }
    const cam = this.cameras.main;
    cam.fadeOut(180, 27, 18, 48);
    cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      respawn();
      cam.fadeIn(180, 27, 18, 48);
    });
  }

  // ---------------------------------------------------------------------------
  // Final: a fase muda de regra com os carimbos dos desfechos

  private startEnding(): void {
    this.finished = true;
    this.prompt.setVisible(false);
    this.player.freeze(true);
    this.services.input.clear();
    this.services.playSfx("complete");
    this.services.bridge.emit("ending", {});

    const reduced = this.services.reducedMotion();
    const colors = [0xc8202f, 0x1f5fa8, 0x6b2fa8, 0x1f6f45];
    const tint = this.add.rectangle(0, 0, VIEW.w, VIEW.h, 0x000000, 0).setOrigin(0).setScrollFactor(0).setDepth(40);
    const stamps: Phaser.GameObjects.Container[] = [];
    const STEP_MS = 1500;
    const outcomes = this.level.outcomes;

    outcomes.forEach((out, i) => {
      this.time.delayedCall(500 + i * STEP_MS, () => {
        if (this.endingDone) return;
        const color = colors[i % colors.length];
        tint.setFillStyle(color, 0.12);
        const stamp = this.makeStamp(out, color, 110 + i * 82, i % 2 ? 3 : -4);
        stamps.push(stamp);
        this.services.playSfx("stamp");
        if (reduced) stamp.setAlpha(1);
        else {
          stamp.setScale(1.7).setAlpha(0);
          this.tweens.add({ targets: stamp, scale: 1, alpha: 1, duration: 180, ease: "Back.easeOut" });
          this.cameras.main.shake(120, 0.003);
        }
        if (i === 1) {
          this.strike(stamps[0], color);
          this.reorganizeMap(reduced);
        }
        if (i === 2) this.reaction();
        if (i === outcomes.length - 1) this.newDestinations(reduced);
      });
    });

    const joke = this.add
      .text(VIEW.w / 2, VIEW.h - 46, this.level.finalJoke ?? "", {
        fontFamily: "monospace",
        fontSize: "15px",
        fontStyle: "bold",
        color: "#1b1230",
        backgroundColor: "#fff6df",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(60)
      .setVisible(false);
    this.time.delayedCall(500 + outcomes.length * STEP_MS, () => joke.setVisible(true));

    this.add
      .text(VIEW.w / 2, VIEW.h - 14, "Pule para continuar. Os desfechos ficam na tela de resultado.", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 8, y: 3 },
      })
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(60);

    this.time.delayedCall(500 + outcomes.length * STEP_MS + 2400, () => this.finishLevel());
  }

  private makeStamp(out: OutcomeStep, color: number, y: number, angle: number): Phaser.GameObjects.Container {
    const hex = `#${color.toString(16).padStart(6, "0")}`;
    const visible = canShowSourced(out.sourceIds);
    const headline = visible ? out.headline : "DECISÃO EM REVISÃO";
    const detail = visible ? out.detail : "Conferir a fonte antes de publicar.";
    const title = this.add.text(0, -8, `${out.year} · ${headline}`, { fontFamily: "monospace", fontSize: "22px", fontStyle: "bold", color: hex }).setOrigin(0.5);
    const sub = this.add.text(0, 16, detail, { fontFamily: "monospace", fontSize: "11px", fontStyle: "bold", color: "#2b1d0e" }).setOrigin(0.5);
    const w = Math.max(title.width, sub.width) + 32;
    const h = 62;
    const frame = this.add.graphics();
    frame.fillStyle(0xfff6df, 0.94).fillRect(-w / 2, -h / 2, w, h);
    frame.lineStyle(4, color, 1).strokeRect(-w / 2, -h / 2, w, h);
    frame.lineStyle(1, color, 1).strokeRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10);
    return this.add.container(VIEW.w / 2, y, [frame, title, sub]).setAngle(angle).setScrollFactor(0).setDepth(50);
  }

  private strike(stamp: Phaser.GameObjects.Container | undefined, color: number): void {
    if (!stamp) return;
    const b = stamp.getBounds();
    this.add.graphics().setScrollFactor(0).setDepth(51).lineStyle(5, color, 1).lineBetween(b.x + 12, b.centerY + 6, b.right - 12, b.centerY - 6);
  }

  /** O mapa se reorganiza: alçapões e bandeiras mudam de lugar. */
  private reorganizeMap(reduced: boolean): void {
    for (const obj of [...this.timed.map((t) => t.obj), ...this.flags.map((f) => f.img)]) {
      if (reduced) obj.setAlpha(0.5);
      else this.tweens.add({ targets: obj, y: obj.y - 40, angle: 8, duration: 400, yoyo: true, hold: 300, ease: "Sine.easeInOut" });
    }
  }

  /** Andaimes cedem lugar a portas com novos destinos. */
  private newDestinations(reduced: boolean): void {
    const spots = [
      { x: 2365, y: 380, label: "BRASÍLIA" },
      { x: 2515, y: 340, label: "ARQUIVO 2022" },
      { x: 2520, y: 210, label: "OUTROS\nCAPÍTULOS" },
    ];
    for (const t of this.timed) t.obj.setAlpha(0.15);
    for (const s of spots) {
      const door = this.add.image(s.x, s.y, TEX.exit).setOrigin(0.5, 1).setDepth(5);
      const label = this.add.text(s.x, s.y - 76, s.label, { ...TEXT_LABEL, backgroundColor: "#1f6f45" }).setOrigin(0.5, 1).setDepth(5);
      if (!reduced) {
        door.setScale(1, 0).setAlpha(0);
        label.setAlpha(0);
        this.tweens.add({ targets: door, scaleY: 1, alpha: 1, duration: 300 });
        this.tweens.add({ targets: label, alpha: 1, duration: 300, delay: 200 });
      }
    }
    this.exitSign.setText("NOVO DESTINO:\nOUTROS CAPÍTULOS →").setBackgroundColor("#1f6f45").setOrigin(1, 1).setX(this.map.exit.x + 30);
  }

  private reaction(): void {
    this.add
      .text(this.player.x, this.player.y - 56, "?!", { fontFamily: "monospace", fontSize: "20px", fontStyle: "bold", color: "#1b1230", backgroundColor: "#ffffff", padding: { x: 6, y: 2 } })
      .setOrigin(0.5, 1)
      .setDepth(20);
    this.player.setFlipX(!this.player.flipX);
  }

  private finishLevel(): void {
    if (this.endingDone) return;
    this.endingDone = true;
    this.services.bridge.emit("complete", {
      levelId: this.services.levelId,
      timeMs: Math.round(this.run.elapsedMs),
      interactions: this.run.completedCount,
      totalInteractions: this.run.totalMissions,
      falls: this.run.falls,
    });
  }

  // ---------------------------------------------------------------------------

  private emitHud(): void {
    const current = this.run.currentMission;
    const parts =
      current && this.run.partTotal(current) > 0 ? { have: this.run.partCount(current), total: this.run.partTotal(current) } : null;
    this.services.bridge.emit("hud", {
      missionId: current,
      completed: this.run.completedCount,
      total: this.run.totalMissions,
      parts,
      exitOpen: this.run.allDone,
    });
  }

  private toast(text: string, tone: "info" | "success" | "warn" = "info"): void {
    this.services.bridge.emit("toast", { text, tone });
  }
}

/** Plataforma atravessável por baixo e pelos lados; só segura quem vem de cima. */
function oneWay(body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody): void {
  body.checkCollision.down = false;
  body.checkCollision.left = false;
  body.checkCollision.right = false;
}
