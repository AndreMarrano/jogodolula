/**
 * Modelo de dados do conteúdo editorial (briefing v2, seção 7).
 *
 * Estado de implementação e estado editorial são independentes: uma fase
 * jogável pode continuar com o contexto pendente de revisão.
 *
 * `reviewed` significa que o resumo corresponde ao que a fonte publicou e
 * preserva o contexto. NÃO significa que uma acusação foi provada. Nunca
 * marcar `reviewed` só porque existe uma URL.
 */

export type EditorialStatus = "pending" | "reviewed";

/** `blocked`: a fase depende de pesquisa nova antes de ter conteúdo. */
export type LevelEditorialStatus = EditorialStatus | "blocked";

export type ImplementationStatus = "planned" | "playable" | "complete";

export type LevelMechanic = "platformer" | "exploration" | "logistics" | "timeline" | "stealth";

/** Como a fonte foi acessada na revisão (registro de fontes do briefing). */
export type AccessMode = "full_page" | "search_content" | "document";

export type ClaimCategory = "fact" | "allegation" | "defense" | "legal_outcome";

/** Categorias mostradas ao jogador junto de cada interação. */
export type EventCategory = "news" | "allegation" | "defense" | "decision" | "metaphor";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  author?: string;
  url: string;
  publishedAt?: string;
  /** Data (AAAA-MM-DD) em que uma pessoa conferiu o resumo contra a fonte. */
  checkedAt?: string;
  status: EditorialStatus;
  accessMode?: AccessMode;
  /** O que a fonte sustenta e o que ela não sustenta. */
  scope?: string;
  /** Notas internas: situação da checagem, ressalvas. */
  notes?: string;
}

export interface EditorialClaim {
  id: string;
  text: string;
  category: ClaimCategory;
  /** Para alegações e defesa: quem afirmou e quando. */
  attribution?: string;
  sourceIds: string[];
  status: EditorialStatus;
  toVerify?: string;
}

export type ObjectKind = "npc" | "contract" | "blueprint" | "symbolic_bag" | "elevator" | "defense_card";

/**
 * Uma interação da fase: o objeto/NPC em cena, a fala ficcional do jogo e o
 * resumo atribuído da notícia, ligados pelos mesmos IDs de fonte.
 */
export interface NarrativeEvent {
  id: string;
  /** Título da missão ("Procure o empreiteiro da OAS"). */
  missionTitle: string;
  /** Texto do HUD enquanto esta é a missão atual. */
  hudObjective: string;
  trigger: "proximity" | "interact" | "collect";
  objectKind: ObjectKind;
  /** Nome curto do objeto em cena ("Empreiteiro", "Contratos Petrobras"). */
  objectLabel: string;
  /** Fala ficcional do jogo. Nunca é apresentada como declaração real. */
  satireText: string;
  /** Resumo próprio do que a fonte publicou, com sujeito e data. */
  sourcedSummary: string;
  /** Atribuição curta: "Relato de Léo Pinheiro • UOL • 20/04/2017". */
  attributionLabel: string;
  category: EventCategory;
  sourceIds: string[];
  /** Obrigatória para metáforas e objetos ilustrados. */
  fictionNote?: string;
  required: boolean;
  nextEventId?: string;
}

/** Etapa da sequência final de desfechos. */
export interface OutcomeStep {
  id: string;
  year: string;
  headline: string;
  detail: string;
  sourceIds: string[];
}

export interface LevelDefinition {
  id: string;
  number: number;
  title: string;
  /** Ano do episódio, para fases históricas não parecerem notícia atual. */
  year?: string;
  subtitle?: string;
  summary: string;
  mechanic: LevelMechanic;
  implementationStatus: ImplementationStatus;
  editorialStatus: LevelEditorialStatus;
  objective: string;
  /** Texto de apresentação (redação do jogo). */
  intro: string;
  /** Linha factual atribuída mostrada na abertura da fase. */
  factualLine?: { text: string; sourceIds: string[] };
  /** "O que a fase encena": explica os elementos ficcionais. */
  fictionalizationNote: string;
  claims: EditorialClaim[];
  sourceIds: string[];
  narrativeEvents: NarrativeEvent[];
  outcomes: OutcomeStep[];
  /** Piada final (redação do jogo). */
  finalJoke?: string;
}
