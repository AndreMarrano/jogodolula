/**
 * Efeitos sonoros sintetizados (WebAudio), sem arquivos externos.
 * O AudioContext só é criado depois de uma interação do usuário.
 */

export type SfxName =
  | "ui"
  | "jump"
  | "collect"
  | "checkpoint"
  | "deny"
  | "door"
  | "fall"
  | "stamp"
  | "complete";

interface Note {
  freq: number;
  dur: number;
  type?: OscillatorType;
  slideTo?: number;
  delay?: number;
  gain?: number;
}

const SOUNDS: Record<SfxName, Note[]> = {
  ui: [{ freq: 660, dur: 0.05, type: "square", gain: 0.15 }],
  jump: [{ freq: 300, dur: 0.12, type: "square", slideTo: 560, gain: 0.18 }],
  collect: [
    { freq: 880, dur: 0.07, type: "square", gain: 0.2 },
    { freq: 1320, dur: 0.1, type: "square", delay: 0.07, gain: 0.2 },
  ],
  checkpoint: [
    { freq: 523, dur: 0.1, type: "triangle" },
    { freq: 659, dur: 0.1, type: "triangle", delay: 0.1 },
    { freq: 784, dur: 0.16, type: "triangle", delay: 0.2 },
  ],
  deny: [{ freq: 200, dur: 0.18, type: "sawtooth", slideTo: 140, gain: 0.15 }],
  door: [{ freq: 140, dur: 0.2, type: "triangle", slideTo: 90 }],
  fall: [{ freq: 600, dur: 0.4, type: "sine", slideTo: 120 }],
  stamp: [
    { freq: 90, dur: 0.18, type: "square", slideTo: 50, gain: 0.35 },
    { freq: 1800, dur: 0.03, type: "square", gain: 0.08 },
  ],
  complete: [
    { freq: 523, dur: 0.12, type: "square", gain: 0.18 },
    { freq: 659, dur: 0.12, type: "square", delay: 0.12, gain: 0.18 },
    { freq: 784, dur: 0.12, type: "square", delay: 0.24, gain: 0.18 },
    { freq: 1047, dur: 0.3, type: "square", delay: 0.36, gain: 0.18 },
  ],
};

class SoundBoard {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private volume = 0.7;
  private muted = false;

  /** Chamar a partir de um evento de clique/tecla/toque. */
  unlock(): void {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.connect(this.ctx.destination);
        this.applyVolume();
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
    } catch {
      this.ctx = null;
    }
  }

  configure(volume: number, muted: boolean): void {
    this.volume = volume;
    this.muted = muted;
    this.applyVolume();
  }

  private applyVolume(): void {
    if (this.master) this.master.gain.value = this.muted ? 0 : this.volume * 0.5;
  }

  play(name: SfxName): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master || this.muted || this.volume <= 0 || ctx.state !== "running") return;
    const t0 = ctx.currentTime;
    for (const n of SOUNDS[name]) {
      const start = t0 + (n.delay ?? 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = n.type ?? "sine";
      osc.frequency.setValueAtTime(n.freq, start);
      if (n.slideTo) osc.frequency.exponentialRampToValueAtTime(n.slideTo, start + n.dur);
      gain.gain.setValueAtTime(n.gain ?? 0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + n.dur);
      osc.connect(gain).connect(master);
      osc.start(start);
      osc.stop(start + n.dur + 0.02);
    }
  }
}

export const sound = new SoundBoard();
