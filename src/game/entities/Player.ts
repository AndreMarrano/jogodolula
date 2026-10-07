import * as Phaser from "phaser";
import type { InputController } from "../systems/input";
import { PLAYER_SIZE, TEX } from "../textures";

export const PLAYER_TUNING = {
  gravity: 1500,
  runSpeed: 230,
  groundAccel: 2200,
  groundDecel: 2600,
  airAccel: 1500,
  jumpVelocity: 620,
  /** Ao soltar o pulo cedo, a velocidade de subida é multiplicada por isto. */
  jumpCut: 0.45,
  maxFall: 900,
  /** Tolerância para pular logo depois de sair da borda. */
  coyoteMs: 110,
  /** Tolerância para apertar o pulo pouco antes de aterrissar. */
  jumpBufferMs: 130,
};

const BODY = { w: 18, h: 42 };

export class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  private lastGroundedAt = -Infinity;
  private jumping = false;
  private frozen = false;
  /** Plataforma móvel em que o personagem está apoiado neste quadro. */
  riding: Phaser.Physics.Arcade.Body | null = null;
  onJump?: () => void;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEX.player("idle-0"));
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1);
    this.body.setSize(BODY.w, BODY.h);
    this.body.setOffset((PLAYER_SIZE.w - BODY.w) / 2, PLAYER_SIZE.h - BODY.h);
    this.body.setMaxVelocity(PLAYER_TUNING.runSpeed, PLAYER_TUNING.maxFall);
    this.setDepth(10);
    Player.ensureAnimations(scene);
    this.play("lula-idle");
  }

  static ensureAnimations(scene: Phaser.Scene): void {
    const a = scene.anims;
    if (!a.exists("lula-idle")) {
      a.create({ key: "lula-idle", frames: [{ key: TEX.player("idle-0") }, { key: TEX.player("idle-1") }], frameRate: 2, repeat: -1 });
      a.create({
        key: "lula-walk",
        frames: ["walk-0", "walk-1", "walk-2", "walk-3"].map((f) => ({ key: TEX.player(f) })),
        frameRate: 10,
        repeat: -1,
      });
      a.create({ key: "lula-jump", frames: [{ key: TEX.player("jump") }], frameRate: 1 });
      a.create({ key: "lula-fall", frames: [{ key: TEX.player("fall") }], frameRate: 1 });
    }
  }

  get grounded(): boolean {
    return this.body.blocked.down || this.body.touching.down;
  }

  /** Coloca o personagem parado em `x`, com os pés em `y`. */
  placeAt(x: number, y: number): void {
    this.body.reset(x, y);
    this.body.setVelocity(0, 0);
    this.jumping = false;
    this.riding = null;
    this.lastGroundedAt = -Infinity;
  }

  freeze(on: boolean): void {
    this.frozen = on;
    if (on) {
      this.body.setVelocity(0, 0);
      this.body.setAcceleration(0, 0);
    }
    this.body.setAllowGravity(!on);
  }

  step(now: number, delta: number, input: InputController): void {
    if (this.frozen) {
      this.play("lula-idle", true);
      return;
    }
    const body = this.body;
    const dt = delta / 1000;
    const grounded = this.grounded;
    if (grounded) {
      // Apoiado = não está mais pulando, mesmo num elevador subindo
      // (velocidade y negativa herdada da plataforma).
      this.lastGroundedAt = now;
      this.jumping = false;
    }

    // Movimento horizontal com aceleração (resposta rápida, sem patinar).
    const dir = (input.isDown("right") ? 1 : 0) - (input.isDown("left") ? 1 : 0);
    const target = dir * PLAYER_TUNING.runSpeed;
    const accel = grounded ? (dir !== 0 ? PLAYER_TUNING.groundAccel : PLAYER_TUNING.groundDecel) : PLAYER_TUNING.airAccel;
    body.velocity.x = approach(body.velocity.x, target, accel * dt);
    if (dir !== 0) this.setFlipX(dir < 0);

    // Pulo com tolerâncias.
    const canJump = now - this.lastGroundedAt <= PLAYER_TUNING.coyoteMs && !this.jumping;
    if (canJump && input.consumePress("jump", PLAYER_TUNING.jumpBufferMs)) {
      body.velocity.y = -PLAYER_TUNING.jumpVelocity;
      this.jumping = true;
      this.lastGroundedAt = -Infinity;
      this.riding = null;
      this.onJump?.();
    }
    // Altura variável: soltar o botão corta a subida.
    if (this.jumping && !input.isDown("jump") && body.velocity.y < -150) {
      body.velocity.y *= PLAYER_TUNING.jumpCut;
    }

    // Acompanha elevador descendo, para não "quicar" a cada quadro.
    if (this.riding && !this.jumping && this.riding.velocity.y > 0 && body.velocity.y < this.riding.velocity.y) {
      body.velocity.y = this.riding.velocity.y;
    }
    this.riding = null;

    // Animação
    if (!grounded) this.play(body.velocity.y < 0 ? "lula-jump" : "lula-fall", true);
    else if (Math.abs(body.velocity.x) > 20) this.play("lula-walk", true);
    else this.play("lula-idle", true);
  }
}

function approach(value: number, target: number, amount: number): number {
  if (value < target) return Math.min(value + amount, target);
  if (value > target) return Math.max(value - amount, target);
  return value;
}
