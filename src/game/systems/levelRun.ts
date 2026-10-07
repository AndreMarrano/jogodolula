export interface Point {
  x: number;
  y: number;
}

/**
 * Ponto de retorno. Só avança: voltar a um checkpoint anterior não faz o
 * jogador perder o mais adiantado.
 */
export class CheckpointTracker {
  private spawn: Point;
  private order = -1;
  private id: string | null = null;

  constructor(private readonly start: Point) {
    this.spawn = { ...start };
  }

  /** Retorna `true` se o ponto de retorno mudou. */
  activate(id: string, order: number, at: Point): boolean {
    if (order <= this.order) return false;
    this.order = order;
    this.id = id;
    this.spawn = { ...at };
    return true;
  }

  get activeId(): string | null {
    return this.id;
  }

  get respawnPoint(): Point {
    return { ...this.spawn };
  }

  reset(): void {
    this.order = -1;
    this.id = null;
    this.spawn = { ...this.start };
  }
}

export interface MissionDef {
  id: string;
  /** Peças que precisam ser reunidas antes de a missão poder terminar. */
  parts?: string[];
}

export interface LevelRunConfig {
  start: Point;
  /** Missões obrigatórias, na ordem do roteiro. */
  missions: MissionDef[];
}

/**
 * Regras de uma partida, sem dependência do Phaser: missões em ordem, peças,
 * checkpoints, quedas e cronômetro. A saída só abre com todas as missões.
 */
export class LevelRun {
  readonly checkpoints: CheckpointTracker;
  private readonly done = new Set<string>();
  private readonly parts = new Map<string, Set<string>>();
  elapsedMs = 0;
  falls = 0;

  constructor(private readonly config: LevelRunConfig) {
    this.checkpoints = new CheckpointTracker(config.start);
  }

  get missionIds(): string[] {
    return this.config.missions.map((m) => m.id);
  }

  get totalMissions(): number {
    return this.config.missions.length;
  }

  get completedCount(): number {
    return this.done.size;
  }

  /** Primeira missão ainda não concluída, ou `null` se acabaram. */
  get currentMission(): string | null {
    return this.config.missions.find((m) => !this.done.has(m.id))?.id ?? null;
  }

  get allDone(): boolean {
    return this.currentMission === null;
  }

  isDone(id: string): boolean {
    return this.done.has(id);
  }

  private def(id: string): MissionDef | undefined {
    return this.config.missions.find((m) => m.id === id);
  }

  partTotal(missionId: string): number {
    return this.def(missionId)?.parts?.length ?? 0;
  }

  partCount(missionId: string): number {
    return this.parts.get(missionId)?.size ?? 0;
  }

  hasPart(missionId: string, partId: string): boolean {
    return this.parts.get(missionId)?.has(partId) ?? false;
  }

  /** Registra uma peça da missão atual. Retorna `true` só na primeira vez. */
  addPart(missionId: string, partId: string): boolean {
    if (this.currentMission !== missionId) return false;
    if (!this.def(missionId)?.parts?.includes(partId)) return false;
    let set = this.parts.get(missionId);
    if (!set) this.parts.set(missionId, (set = new Set()));
    if (set.has(partId)) return false;
    set.add(partId);
    return true;
  }

  /** A missão pode terminar agora? (é a atual e tem todas as peças) */
  canComplete(missionId: string): boolean {
    return this.currentMission === missionId && this.partCount(missionId) === this.partTotal(missionId);
  }

  /** Conclui a missão atual. Fora de ordem ou com peças faltando, não faz nada. */
  complete(missionId: string): boolean {
    if (!this.canComplete(missionId)) return false;
    this.done.add(missionId);
    return true;
  }

  tick(deltaMs: number): void {
    if (deltaMs > 0) this.elapsedMs += deltaMs;
  }

  /** Queda: conta, mantém missões e peças e devolve onde reaparecer. */
  fall(): Point {
    this.falls++;
    return this.checkpoints.respawnPoint;
  }

  /** Reinício completo da fase: zera o roteiro. */
  restart(): void {
    this.done.clear();
    this.parts.clear();
    this.checkpoints.reset();
    this.elapsedMs = 0;
    this.falls = 0;
  }
}
