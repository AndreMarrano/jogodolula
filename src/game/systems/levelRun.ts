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

export interface LevelRunConfig {
  start: Point;
  documentIds: string[];
  requiredDocs: number;
}

export interface ExitStatus {
  open: boolean;
  missing: number;
}

/**
 * Regras de uma partida, sem dependência do Phaser: documentos coletados,
 * checkpoints, quedas, cronômetro e requisito da saída.
 */
export class LevelRun {
  readonly checkpoints: CheckpointTracker;
  private readonly collected = new Set<string>();
  private readonly validDocs: Set<string>;
  elapsedMs = 0;
  falls = 0;

  constructor(private readonly config: LevelRunConfig) {
    this.checkpoints = new CheckpointTracker(config.start);
    this.validDocs = new Set(config.documentIds);
  }

  get totalDocs(): number {
    return this.validDocs.size;
  }

  get requiredDocs(): number {
    return this.config.requiredDocs;
  }

  get docCount(): number {
    return this.collected.size;
  }

  hasDoc(id: string): boolean {
    return this.collected.has(id);
  }

  /** Retorna `true` só na primeira coleta de um documento válido. */
  collect(id: string): boolean {
    if (!this.validDocs.has(id) || this.collected.has(id)) return false;
    this.collected.add(id);
    return true;
  }

  exitStatus(): ExitStatus {
    const missing = Math.max(0, this.config.requiredDocs - this.collected.size);
    return { open: missing === 0, missing };
  }

  tick(deltaMs: number): void {
    if (deltaMs > 0) this.elapsedMs += deltaMs;
  }

  /** Queda: conta, mantém os documentos e devolve onde reaparecer. */
  fall(): Point {
    this.falls++;
    return this.checkpoints.respawnPoint;
  }

  /** Reinício completo da fase. */
  restart(): void {
    this.collected.clear();
    this.checkpoints.reset();
    this.elapsedMs = 0;
    this.falls = 0;
  }
}
