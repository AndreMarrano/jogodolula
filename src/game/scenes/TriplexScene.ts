import * as Phaser from "phaser";
import type { SceneServices } from "../bridge";
import { Player } from "../entities/Player";
import {
  triplexMap,
  type CheckpointDef,
  type DocumentDef,
  type DoorDef,
  type MovingPlatformDef,
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

const TEXT_SIGN: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "monospace",
  fontSize: "12px",
  fontStyle: "bold",
  color: "#2b1d0e",
  backgroundColor: "#f2e3b3",
  padding: { x: 6, y: 4 },
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

interface Doc {
  def: DocumentDef;
  img: Phaser.GameObjects.Image;
}

interface Flag {
  def: CheckpointDef;
  img: Phaser.GameObjects.Image;
}

interface Door {
  def: DoorDef;
  img: Phaser.GameObjects.Image;
  body: Phaser.Physics.Arcade.StaticBody;
  open: boolean;
}

/**
 * Fase 1 — "Tríplex: Subindo na Vida".
 * Regras ficam em LevelRun; o mapa em levels/triplexMap; o texto editorial em
 * src/content. Esta cena só junta tudo no mundo jogável.
 */
export class TriplexScene extends Phaser.Scene {
  static readonly KEY = "triplex";

  private services!: SceneServices;
  private readonly map = triplexMap;
  private run!: LevelRun;
  private player!: Player;
  private movers: Mover[] = [];
  private timed: Timed[] = [];
  private docs: Doc[] = [];
  private flags: Flag[] = [];
  private doors: Door[] = [];
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
    this.docs = [];
    this.flags = [];
    this.doors = [];
    this.seenTutorials = new Set();
    this.nearExit = false;
    this.busy = false;
    this.finished = false;
    this.endingDone = false;
    this.services.input.clear();

    const m = this.map;
    generateTextures(this);
    this.run = new LevelRun({ start: m.start, documentIds: m.documents.map((d) => d.id), requiredDocs: m.requiredDocs });

    this.physics.world.setBounds(0, 0, m.width, m.height + 200);
    this.physics.world.setBoundsCollision(true, true, false, false);

    this.buildBackground();
    const statics = this.buildPlatforms();
    this.buildMovers();
    this.buildTimed();
    this.buildDoors();
    this.buildPickups();

    this.player = new Player(this, m.start.x, m.start.y);
    this.player.setCollideWorldBounds(true);
    this.player.onJump = () => this.services.playSfx("jump");

    this.physics.add.collider(this.player, statics);
    this.physics.add.collider(this.player, this.timed.map((t) => t.obj));
    this.physics.add.collider(this.player, this.doors.map((d) => d.img));
    this.physics.add.collider(
      this.player,
      this.movers.map((mv) => mv.obj),
      (_p, platform) => {
        const body = (platform as Phaser.GameObjects.TileSprite).body as Phaser.Physics.Arcade.Body;
        if (this.player.body.touching.down) this.player.riding = body;
      },
    );

    this.prompt = this.add
      .text(0, 0, "", { ...TEXT_SIGN, backgroundColor: "#1b1230", color: "#ffffff" })
      .setOrigin(0.5, 1)
      .setDepth(30)
      .setVisible(false);

    const cam = this.cameras.main;
    // Com controles de toque, a câmera pode descer um pouco além do mapa para
    // os botões não cobrirem o personagem no chão.
    cam.setBounds(0, 0, m.width, m.height + (this.services.touchMode() ? TOUCH_EXTRA_BOTTOM : 0));
    cam.startFollow(this.player, true, 0.12, 0.12, 0, 70);
    cam.setDeadzone(60, 40);
    cam.roundPixels = true;

    this.emitHud();
    this.toast("Suba pelos andares e reúna os documentos.");
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

    // Morros ao fundo (parallax)
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

    // Setor A — térreo com fachada e portaria
    g.fillStyle(0xe9dcc0, 1).fillRect(0, 620, 1000, 380);
    g.fillStyle(0xcdbd9b, 1).fillRect(0, 620, 1000, 18);
    g.fillStyle(0x8fc1d6, 1);
    for (let x = 40; x < 960; x += 120) g.fillRect(x, 680, 70, 90);
    g.fillStyle(0x6d9db3, 1);
    for (let x = 40; x < 960; x += 120) g.fillRect(x, 725, 70, 4);
    // Portaria
    g.fillStyle(0x5a4632, 1).fillRect(104, 862, 102, 138);
    g.fillStyle(0x8fc1d6, 1).fillRect(112, 872, 40, 128).fillRect(158, 872, 40, 128);
    g.fillStyle(0xd7ecf5, 0.6).fillRect(116, 876, 8, 60).fillRect(162, 876, 8, 60);

    // Setor B — estrutura em obra
    g.fillStyle(0x8f8f8f, 1);
    for (let x = 1010; x < 2090; x += 135) g.fillRect(x, 380, 16, 640);
    for (let y = 420; y < 1020; y += 110) g.fillRect(1000, y, 1090, 10);
    g.lineStyle(4, 0xf2c230, 0.9);
    for (let x = 1040; x < 2060; x += 135) g.lineBetween(x, 1020, x + 135, 420);

    // Trilhos do elevador
    const lift = m.moving.find((mv) => mv.axis === "y");
    if (lift) {
      g.fillStyle(0x3b4651, 1);
      const top = lift.y + Math.min(0, lift.distance) - 30;
      const bottom = lift.y + Math.max(0, lift.distance) + 40;
      g.fillRect(lift.x + 4, top, 4, bottom - top);
      g.fillRect(lift.x + lift.w - 8, top, 4, bottom - top);
    }

    // Setor C — andares altos e cobertura
    g.fillStyle(0xf0e2c4, 1).fillRect(2090, 300, 790, 720);
    g.fillStyle(0xd6c49f, 1);
    for (let y = 340; y < 1020; y += 90) g.fillRect(2090, y, 790, 8);
    g.fillStyle(0x8fc1d6, 1);
    for (let y = 360; y < 1000; y += 90) for (let x = 2120; x < 2860; x += 90) g.fillRect(x, y, 50, 50);
    // Caixa-d'água sobre a cobertura
    g.fillStyle(0x6c7a86, 1).fillRect(2480, 214, 80, 4);

    // Elevador quebrado no térreo
    const bl = m.brokenLift;
    g.fillStyle(0x6c7a86, 1).fillRect(bl.x, bl.y - 120, 100, 120);
    g.fillStyle(0x93a5b5, 1).fillRect(bl.x + 6, bl.y - 112, 42, 112).fillRect(bl.x + 52, bl.y - 112, 42, 112);
    g.lineStyle(6, 0xf2c230, 1).lineBetween(bl.x, bl.y - 110, bl.x + 100, bl.y - 20);
    g.lineStyle(6, 0x222222, 1).lineBetween(bl.x, bl.y - 90, bl.x + 100, bl.y);

    this.add
      .text(330, 836, "EDIFÍCIO TRÊS INSTÂNCIAS", {
        fontFamily: "monospace",
        fontSize: "20px",
        fontStyle: "bold",
        color: "#c8202f",
        backgroundColor: "#fff6df",
        padding: { x: 10, y: 6 },
      })
      .setOrigin(0.5, 1)
      .setDepth(-19);

    for (const s of m.sectors) {
      const y = s.x0 === 0 ? 650 : s.x0 < 2000 ? 560 : 250;
      this.add
        .text(s.x0 + 24, y, s.label, { fontFamily: "monospace", fontSize: "14px", fontStyle: "bold", color: "#ffffff", backgroundColor: "#00000066", padding: { x: 6, y: 3 } })
        .setDepth(-18);
    }
    for (const s of m.signs) this.add.text(s.x, s.y, s.text, TEXT_SIGN).setOrigin(0.5, 1).setDepth(-5);
  }

  private buildPlatforms(): Phaser.GameObjects.TileSprite[] {
    const list: Phaser.GameObjects.TileSprite[] = [];
    for (const p of this.map.platforms) {
      const h = p.style === "ground" ? GROUND_H : p.style === "scaffold" ? SCAFFOLD_H : SLAB_H;
      const key = p.style === "ground" ? TEX.ground : p.style === "scaffold" ? TEX.scaffold : TEX.slab;
      const obj = this.add.tileSprite(p.x, p.y, p.w, h, key).setOrigin(0).setDepth(2);
      this.physics.add.existing(obj, true);
      if (p.style !== "ground") oneWay(obj.body as Phaser.Physics.Arcade.StaticBody);
      list.push(obj);
    }
    return list;
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
      const dir = Math.sign(def.distance);
      if (def.axis === "x") body.setVelocityX(def.speed * dir);
      else body.setVelocityY(def.speed * dir);
      this.movers.push({ def, obj, body, min: Math.min(start, end), max: Math.max(start, end) });
    }
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

  private buildDoors(): void {
    for (const def of this.map.doors) {
      const img = this.add.image(def.x, def.y, TEX.door).setOrigin(0, 1).setDepth(4);
      this.physics.add.existing(img, true);
      this.doors.push({ def, img, body: img.body as Phaser.Physics.Arcade.StaticBody, open: false });
    }
    const ex = this.map.exit;
    // Escurecida enquanto faltarem documentos (ver emitHud).
    this.exitDoor = this.add.image(ex.x, ex.y, TEX.exit).setOrigin(0.5, 1).setDepth(1).setTint(0x777777);
    this.exitSign = this.add
      .text(ex.x, ex.y - 78, "SAÍDA", { ...TEXT_SIGN, backgroundColor: "#c8202f", color: "#ffffff" })
      .setOrigin(0.5, 1)
      .setDepth(1);
  }

  private buildPickups(): void {
    const reduced = this.services.reducedMotion();
    for (const def of this.map.documents) {
      const img = this.add.image(def.x, def.y, TEX.doc).setDepth(8);
      if (!reduced) {
        this.tweens.add({ targets: img, y: def.y - 6, duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      }
      this.docs.push({ def, img });
    }
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
    this.checkDocuments();
    this.checkCheckpoints();
    this.checkInteractions();
  }

  private updateMovers(): void {
    for (const mv of this.movers) {
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
  }

  private updateTimed(): void {
    const reduced = this.services.reducedMotion();
    for (const t of this.timed) {
      const period = t.def.onMs + t.def.offMs;
      const phase = (this.run.elapsedMs + t.def.offsetMs) % period;
      const on = phase < t.def.onMs;
      if (t.body.enable !== on) t.body.enable = on;
      if (!on) {
        t.obj.setAlpha(0.15);
      } else if (phase > t.def.onMs - TIMED_WARN_MS) {
        // Aviso antes de abrir: pisca (ou fica translúcido, com movimento reduzido).
        t.obj.setAlpha(reduced ? 0.55 : Math.floor(phase / 100) % 2 ? 0.35 : 1);
      } else {
        t.obj.setAlpha(1);
      }
    }
  }

  private feet(): { x: number; y: number } {
    return { x: this.player.x, y: this.player.y };
  }

  private checkTutorials(): void {
    const { x } = this.feet();
    for (const z of this.map.tutorial) {
      if (!this.seenTutorials.has(z.id) && x >= z.x0 && x <= z.x1) {
        this.seenTutorials.add(z.id);
        this.toast(this.services.touchMode() ? z.touch : z.keyboard);
      }
    }
  }

  private checkDocuments(): void {
    const px = this.player.x;
    const py = this.player.y - 21;
    for (const d of this.docs) {
      if (this.run.hasDoc(d.def.id)) continue;
      if (Math.abs(px - d.def.x) < 22 && Math.abs(py - d.def.y) < 34 && this.run.collect(d.def.id)) {
        this.services.playSfx("collect");
        this.tweens.killTweensOf(d.img);
        this.tweens.add({ targets: d.img, y: d.img.y - 30, alpha: 0, duration: 300, onComplete: () => d.img.setVisible(false) });
        const n = this.run.docCount;
        if (n === 1) this.toast("Peça do processo encontrada.", "success");
        else this.toast(`Peça do processo encontrada (${n} de ${this.run.totalDocs}).`, "success");
        if (n === this.run.requiredDocs) this.toast("Saída liberada: siga até o último andar.", "success");
        this.emitHud();
      }
    }
  }

  private checkCheckpoints(): void {
    const { x, y } = this.feet();
    for (const f of this.flags) {
      if (Math.abs(x - f.def.x) < 34 && Math.abs(y - f.def.y) < 50) {
        if (this.run.checkpoints.activate(f.def.id, f.def.order, { x: f.def.x, y: f.def.y })) {
          f.img.setTexture(TEX.flagOn);
          this.services.playSfx("checkpoint");
          this.toast("Ponto de retorno atualizado.", "success");
        }
      }
    }
  }

  private checkInteractions(): void {
    const { x, y } = this.feet();
    const touch = this.services.touchMode();
    const key = touch ? "✋" : "E";
    let promptAt: { x: number; y: number; text: string } | null = null;

    for (const door of this.doors) {
      if (door.open) continue;
      const cx = door.def.x + 12;
      if (Math.abs(x - cx) < 60 && Math.abs(y - door.def.y) < 40) {
        promptAt = { x: cx, y: door.def.y - door.def.h - 6, text: `${key}: abrir` };
        if (this.services.input.consumePress("interact", 150)) this.openDoor(door);
      }
    }

    const ex = this.map.exit;
    const atExit = Math.abs(x - ex.x) < 40 && Math.abs(y - ex.y) < 40;
    if (atExit) {
      const status = this.run.exitStatus();
      promptAt = { x: ex.x, y: ex.y - 104, text: status.open ? `${key}: entrar` : `Faltam ${status.missing}` };
      if (!this.nearExit && !status.open) this.denyExit();
      if (this.services.input.consumePress("interact", 150)) {
        if (status.open) {
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

  private openDoor(door: Door): void {
    door.open = true;
    door.body.enable = false;
    this.services.playSfx("door");
    this.toast("Porta de serviço aberta.");
    if (this.services.reducedMotion()) door.img.setAlpha(0.25);
    else this.tweens.add({ targets: door.img, scaleX: 0.15, alpha: 0.5, duration: 250 });
  }

  private denyExit(): void {
    this.services.playSfx("deny");
    this.toast(`Faltam documentos: encontre pelo menos ${this.run.requiredDocs} de ${this.run.totalDocs}.`, "warn");
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
  // Sequência final: carimbos do percurso judicial

  private startEnding(): void {
    this.finished = true;
    this.prompt.setVisible(false);
    this.player.freeze(true);
    this.services.input.clear();
    this.services.playSfx("complete");
    this.toast("Percurso concluído. Agora confira o que aconteceu.", "success");

    const reduced = this.services.reducedMotion();
    const tint = this.add.rectangle(0, 0, VIEW.w, VIEW.h, 0xc8202f, 0).setOrigin(0).setScrollFactor(0).setDepth(40);
    const stamps: Phaser.GameObjects.Container[] = [];
    const steps: { text: string; color: number; tint: number; extra?: () => void }[] = [
      { text: "CONDENAÇÃO", color: 0xc8202f, tint: 0xc8202f },
      {
        text: "ANULAÇÃO POR INCOMPETÊNCIA",
        color: 0x1f5fa8,
        tint: 0x1f5fa8,
        extra: () => {
          this.strike(stamps[0]);
          this.reorganizeMap(reduced);
          // Ancorada pela direita para não sair da tela (a saída fica no fim do mapa).
          this.exitSign
            .setText("NOVO DESTINO:\nJUÍZO COMPETENTE →")
            .setBackgroundColor("#1f5fa8")
            .setOrigin(1, 1)
            .setX(this.map.exit.x + 30);
        },
      },
      { text: "SUSPEIÇÃO DO JUIZ", color: 0x6b2fa8, tint: 0x6b2fa8, extra: () => this.reaction() },
    ];

    steps.forEach((step, i) => {
      this.time.delayedCall(700 + i * 1500, () => {
        if (this.endingDone) return;
        tint.setFillStyle(step.tint, 0.14);
        const stamp = this.makeStamp(step.text, step.color, 150 + i * 105, i % 2 ? 4 : -6);
        stamps.push(stamp);
        this.services.playSfx("stamp");
        if (reduced) {
          stamp.setAlpha(1);
        } else {
          stamp.setScale(1.8).setAlpha(0);
          this.tweens.add({ targets: stamp, scale: 1, alpha: 1, duration: 180, ease: "Back.easeOut" });
          this.cameras.main.shake(140, 0.004);
        }
        step.extra?.();
      });
    });

    this.add
      .text(VIEW.w / 2, VIEW.h - 24, "Contexto em revisão — os carimbos resumem etapas que ainda serão checadas. Aperte pular para continuar.", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(60);

    this.time.delayedCall(700 + steps.length * 1500 + 1200, () => this.finishLevel());
  }

  private makeStamp(text: string, color: number, y: number, angle: number): Phaser.GameObjects.Container {
    const hex = `#${color.toString(16).padStart(6, "0")}`;
    const label = this.add
      .text(0, 0, text, { fontFamily: "monospace", fontSize: "30px", fontStyle: "bold", color: hex })
      .setOrigin(0.5);
    const w = label.width + 36;
    const h = label.height + 20;
    const frame = this.add.graphics();
    frame.fillStyle(0xfff6df, 0.92).fillRect(-w / 2, -h / 2, w, h);
    frame.lineStyle(5, color, 1).strokeRect(-w / 2, -h / 2, w, h);
    frame.lineStyle(2, color, 1).strokeRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12);
    return this.add.container(VIEW.w / 2, y, [frame, label]).setAngle(angle).setScrollFactor(0).setDepth(50);
  }

  private strike(stamp: Phaser.GameObjects.Container | undefined): void {
    if (!stamp) return;
    const b = stamp.getBounds();
    const line = this.add.graphics().setScrollFactor(0).setDepth(51);
    line.lineStyle(6, 0x1f5fa8, 1).lineBetween(b.x + 10, b.centerY + 8, b.right - 10, b.centerY - 8);
  }

  /** "O mapa se reorganiza": plataformas próximas trocam de lugar. */
  private reorganizeMap(reduced: boolean): void {
    const targets = [...this.timed.map((t) => t.obj), ...this.flags.map((f) => f.img)];
    for (const obj of targets) {
      if (reduced) {
        obj.setAlpha(0.5);
      } else {
        this.tweens.add({ targets: obj, y: obj.y - 40, angle: 8, duration: 400, yoyo: true, hold: 300, ease: "Sine.easeInOut" });
      }
    }
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
      docs: this.run.docCount,
      totalDocs: this.run.totalDocs,
      falls: this.run.falls,
    });
  }

  // ---------------------------------------------------------------------------

  private emitHud(): void {
    const exitOpen = this.run.exitStatus().open;
    if (exitOpen) this.exitDoor.clearTint();
    this.services.bridge.emit("hud", {
      docs: this.run.docCount,
      totalDocs: this.run.totalDocs,
      requiredDocs: this.run.requiredDocs,
      exitOpen,
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
