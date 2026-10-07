import { sourcesById } from "./sources";
import type { EventCategory, NarrativeEvent, OutcomeStep, Source } from "./types";
import { allReviewed, canShowSourced, PENDING_SUMMARY, showPending, visibleSources } from "./visibility";

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  news: "Notícia",
  allegation: "Acusação",
  defense: "Defesa",
  decision: "Decisão",
  metaphor: "Metáfora",
};

/** "2017-04-20" → "20/04/2017" */
export function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

export interface EventPresentation {
  summary: string;
  attribution: string;
  /** O resumo ainda não foi conferido contra a fonte. */
  pending: boolean;
  sources: Source[];
}

/**
 * O que mostrar de uma interação. A nota da metáfora é redação do próprio
 * jogo e aparece sempre; resumos de notícia só aparecem revisados ou no modo
 * de revisão.
 */
export function presentEvent(ev: NarrativeEvent): EventPresentation {
  const pending = !allReviewed(ev.sourceIds);
  const visible = ev.category === "metaphor" || canShowSourced(ev.sourceIds);
  const sources = visibleSources(ev.sourceIds.map((id) => sourcesById.get(id)).filter((s): s is Source => !!s));
  return {
    summary: visible ? ev.sourcedSummary : PENDING_SUMMARY,
    attribution: canShowSourced(ev.sourceIds) ? ev.attributionLabel : "Fonte em revisão",
    pending: pending && showPending,
    sources,
  };
}

export function presentOutcome(out: OutcomeStep): { headline: string; detail: string; pending: boolean } {
  const visible = canShowSourced(out.sourceIds);
  return {
    headline: visible ? out.headline : "DECISÃO EM REVISÃO",
    detail: visible ? out.detail : "O desfecho será exibido depois da conferência da fonte.",
    pending: !allReviewed(out.sourceIds) && showPending,
  };
}
