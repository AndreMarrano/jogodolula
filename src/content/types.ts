/**
 * Modelo de dados do conteúdo editorial.
 *
 * Estado de implementação e estado editorial são independentes: uma fase
 * jogável pode continuar com o contexto pendente de checagem. Nunca marcar
 * algo como `verified` só porque existe uma URL.
 */

export type EditorialStatus = "pending" | "verified";

/** `blocked`: a fase depende de pesquisa nova antes de ter qualquer conteúdo. */
export type LevelEditorialStatus = EditorialStatus | "blocked";

export type ImplementationStatus = "planned" | "playable" | "complete";

export type LevelMechanic = "platformer" | "exploration" | "logistics" | "timeline" | "agenda";

export type ClaimCategory =
  | "fact"
  | "allegation"
  | "defense"
  | "legal_outcome";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedAt?: string;
  /** Data (AAAA-MM-DD) em que uma pessoa leu a fonte e conferiu o conteúdo. */
  checkedAt?: string;
  status: EditorialStatus;
  /** Notas internas: o que falta conferir, trecho que sustenta a afirmação etc. */
  notes?: string;
}

export interface EditorialClaim {
  id: string;
  text: string;
  category: ClaimCategory;
  /** Para alegações: quem alegou e quando. */
  attribution?: string;
  sourceIds: string[];
  status: EditorialStatus;
  /** O que ainda precisa ser conferido antes de a afirmação virar `verified`. */
  toVerify?: string;
}

export interface LevelDefinition {
  id: string;
  number: number;
  title: string;
  summary: string;
  mechanic: LevelMechanic;
  implementationStatus: ImplementationStatus;
  editorialStatus: LevelEditorialStatus;
  objective: string;
  /** Texto curto mostrado antes da fase. */
  intro: string;
  /** "O que a fase encena": explica os elementos ficcionais. */
  fictionalizationNote: string;
  claims: EditorialClaim[];
  sourceIds: string[];
}
