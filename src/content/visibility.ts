import type { EditorialClaim, Source } from "./types";

/**
 * Conteúdo pendente só aparece em desenvolvimento (`npm run dev`) ou quando o
 * build é gerado com VITE_SHOW_PENDING=true para revisão interna.
 * Um build comum esconde tudo o que não foi verificado.
 */
export const showPending: boolean =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_PENDING === "true";

export function visibleClaims(claims: EditorialClaim[], includePending = showPending): EditorialClaim[] {
  return claims.filter((c) => includePending || c.status === "verified");
}

export function visibleSources(list: Source[], includePending = showPending): Source[] {
  return list.filter((s) => includePending || s.status === "verified");
}
