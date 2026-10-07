import { sourcesById } from "./sources";
import type { EditorialClaim, Source } from "./types";

/**
 * Conteúdo pendente só aparece em desenvolvimento (`npm run dev`) ou quando o
 * build é gerado com VITE_SHOW_PENDING=true para revisão interna.
 * Um build comum esconde tudo o que não foi revisado.
 */
export const showPending: boolean =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_PENDING === "true";

export function visibleClaims(claims: EditorialClaim[], includePending = showPending): EditorialClaim[] {
  return claims.filter((c) => includePending || c.status === "reviewed");
}

export function visibleSources(list: Source[], includePending = showPending): Source[] {
  return list.filter((s) => includePending || s.status === "reviewed");
}

/** Todas as fontes existem e foram revisadas. */
export function allReviewed(sourceIds: string[], registry: ReadonlyMap<string, Source> = sourcesById): boolean {
  return sourceIds.length > 0 && sourceIds.every((id) => registry.get(id)?.status === "reviewed");
}

/**
 * Um resumo factual (faixa de notícia, carimbo de desfecho) só aparece se as
 * fontes foram revisadas, ou no modo de revisão.
 */
export function canShowSourced(
  sourceIds: string[],
  includePending = showPending,
  registry: ReadonlyMap<string, Source> = sourcesById,
): boolean {
  return includePending || allReviewed(sourceIds, registry);
}

/** Texto mostrado no lugar de um resumo ainda não revisado. */
export const PENDING_SUMMARY = "Notícia em revisão: o resumo desta interação ainda não foi conferido contra a fonte.";
