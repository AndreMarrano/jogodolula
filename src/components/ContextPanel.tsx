import { sourcesById } from "../content/sources";
import type { ClaimCategory, EditorialClaim, LevelDefinition, Source } from "../content/types";
import { showPending, visibleClaims, visibleSources } from "../content/visibility";

const SECTIONS: { category: ClaimCategory; title: string }[] = [
  { category: "fact", title: "O que aconteceu" },
  { category: "allegation", title: "O que foi alegado" },
  { category: "defense", title: "Defesa" },
  { category: "legal_outcome", title: "Desfecho jurídico" },
];

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

/** Painel editorial de uma fase. Conteúdo pendente só aparece no modo de revisão. */
export function ContextPanel({ level }: { level: LevelDefinition }) {
  const claims = visibleClaims(level.claims);
  const hidden = level.claims.length - claims.length;

  const sourceIds = Array.from(new Set([...claims.flatMap((c) => c.sourceIds), ...level.sourceIds]));
  const allSources = sourceIds.map((id) => sourcesById.get(id)).filter((s): s is Source => !!s);
  const shownSources = visibleSources(allSources);
  const refNumber = new Map(shownSources.map((s, i) => [s.id, i + 1]));

  const hasPending = level.claims.some((c) => c.status === "pending") || allSources.some((s) => s.status === "pending");

  return (
    <article className="context" aria-labelledby={`ctx-${level.id}`}>
      <h2 id={`ctx-${level.id}`} className="context__title">
        Fase {level.number} — {level.title}
      </h2>

      {level.editorialStatus === "blocked" ? (
        <p className="notice notice--research">
          <strong>Em pesquisa.</strong> O tema desta fase ainda não foi confirmado por fontes verificadas. Nada sobre ele
          será publicado no jogo antes disso.
        </p>
      ) : hasPending && showPending ? (
        <p className="notice notice--pending">
          <strong>Contexto em revisão — rascunho interno.</strong> Itens marcados como <em>pendente</em> ainda não foram
          conferidos e não aparecem na versão pública. Não são afirmações confirmadas.
        </p>
      ) : hidden > 0 || claims.length === 0 ? (
        <p className="notice notice--pending">
          <strong>Contexto em revisão.</strong> O contexto factual desta fase ainda está sendo checado e será publicado
          depois da verificação das fontes.
        </p>
      ) : null}

      {SECTIONS.map(({ category, title }) => {
        const list = claims.filter((c) => c.category === category);
        if (list.length === 0) return null;
        return (
          <section key={category} className="context__section">
            <h3>{title}</h3>
            <ul>
              {list.map((c) => (
                <ClaimItem key={c.id} claim={c} refNumber={refNumber} />
              ))}
            </ul>
          </section>
        );
      })}

      <section className="context__section">
        <h3>O que a fase encena</h3>
        <p>{level.fictionalizationNote}</p>
      </section>

      <section className="context__section">
        <h3>Fontes</h3>
        {shownSources.length === 0 ? (
          <p className="muted">Nenhuma fonte verificada publicada ainda.</p>
        ) : (
          <ol className="sources">
            {shownSources.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>
                <span className="muted">
                  {" "}
                  — {s.publisher}
                  {s.publishedAt && `, ${formatDate(s.publishedAt)}`}
                </span>{" "}
                {s.status === "verified" ? (
                  <span className="badge badge--verified">verificada em {formatDate(s.checkedAt)}</span>
                ) : (
                  <span className="badge badge--pending">não verificada</span>
                )}
                {showPending && s.notes && <small className="todo">Nota interna: {s.notes}</small>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </article>
  );
}

function ClaimItem({ claim, refNumber }: { claim: EditorialClaim; refNumber: Map<string, number> }) {
  const refs = claim.sourceIds.map((id) => refNumber.get(id)).filter((n): n is number => n !== undefined);
  return (
    <li className={claim.status === "pending" ? "claim claim--pending" : "claim"}>
      {claim.status === "pending" && <span className="badge badge--pending">pendente</span>} {claim.text}
      {claim.attribution && <span className="muted"> — {claim.attribution}</span>}
      {refs.length > 0 && <sup className="refs">[{refs.join(", ")}]</sup>}
      {claim.status === "pending" && claim.toVerify && <small className="todo">A verificar: {claim.toVerify}</small>}
    </li>
  );
}
