import { CATEGORY_LABEL, formatDate, presentEvent, presentOutcome } from "../content/present";
import { sourcesById } from "../content/sources";
import type { ClaimCategory, EditorialClaim, LevelDefinition, Source } from "../content/types";
import { showPending, visibleClaims, visibleSources } from "../content/visibility";

const SECTIONS: { category: ClaimCategory; title: string }[] = [
  { category: "fact", title: "O que aconteceu" },
  { category: "allegation", title: "O que foi alegado" },
  { category: "defense", title: "Defesa" },
  { category: "legal_outcome", title: "Desfecho jurídico" },
];

const ACCESS_LABEL: Record<NonNullable<Source["accessMode"]>, string> = {
  full_page: "página completa",
  search_content: "conteúdo recuperado por busca",
  document: "documento",
};

/** Painel editorial de uma fase. Conteúdo pendente só aparece no modo de revisão. */
export function ContextPanel({ level }: { level: LevelDefinition }) {
  const claims = visibleClaims(level.claims);
  const hidden = level.claims.length - claims.length;

  const allIds = [
    ...level.sourceIds,
    ...claims.flatMap((c) => c.sourceIds),
    ...level.narrativeEvents.flatMap((e) => e.sourceIds),
    ...level.outcomes.flatMap((o) => o.sourceIds),
  ];
  const allSources = Array.from(new Set(allIds))
    .map((id) => sourcesById.get(id))
    .filter((s): s is Source => !!s);
  const shownSources = visibleSources(allSources);
  const hasPending = level.claims.some((c) => c.status === "pending") || allSources.some((s) => s.status === "pending");

  return (
    <article className="context" aria-labelledby={`ctx-${level.id}`}>
      <h2 id={`ctx-${level.id}`} className="context__title">
        Fase {level.number} — {level.title}
        {level.year && !level.title.includes(level.year) ? ` (${level.year})` : ""}
      </h2>

      {level.editorialStatus === "blocked" ? (
        <p className="notice notice--research">
          <strong>Em pesquisa.</strong> O tema desta fase ainda não foi confirmado por fontes revisadas.
        </p>
      ) : hasPending && showPending ? (
        <p className="notice notice--pending">
          <strong>Contexto em revisão — rascunho interno.</strong> Itens marcados como <em>pendente</em> ainda não foram
          conferidos contra as fontes e não aparecem na versão pública. Revisado significa que o resumo corresponde ao que
          a fonte publicou, não que uma acusação foi provada.
        </p>
      ) : hidden > 0 || (claims.length === 0 && level.implementationStatus !== "planned") ? (
        <p className="notice notice--pending">
          <strong>Contexto em revisão.</strong> O contexto factual desta fase será publicado depois da conferência das
          fontes.
        </p>
      ) : level.implementationStatus === "planned" ? (
        <p className="notice notice--research">
          <strong>Fase em desenvolvimento.</strong> {level.summary}
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
                <ClaimItem key={c.id} claim={c} />
              ))}
            </ul>
          </section>
        );
      })}

      {level.narrativeEvents.length > 0 && (
        <section className="context__section">
          <h3>Interações da fase</h3>
          <ol className="events">
            {level.narrativeEvents.map((ev) => {
              const p = presentEvent(ev);
              return (
                <li key={ev.id}>
                  <span className={`cat cat--${ev.category}`}>{CATEGORY_LABEL[ev.category]}</span> <strong>{ev.objectLabel}</strong>
                  <span className="muted"> — {ev.missionTitle}</span>
                  <p className="events__satire">
                    <span className="news__fiction">Fala do jogo:</span> {ev.satireText}
                  </p>
                  <p>
                    {p.pending && <span className="badge badge--pending">pendente</span>} {p.summary}
                  </p>
                  <p className="muted small">{p.attribution}</p>
                  {ev.fictionNote && <p className="small">Encenação: {ev.fictionNote}</p>}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {level.outcomes.length > 0 && (
        <section className="context__section">
          <h3>Sequência final</h3>
          <ol className="outcomes outcomes--plain">
            {level.outcomes.map((o) => {
              const p = presentOutcome(o);
              return (
                <li key={o.id}>
                  <span className="outcomes__year">{o.year}</span>
                  <span>
                    <strong>{p.headline}</strong> — {p.detail} {p.pending && <span className="badge badge--pending">pendente</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <section className="context__section">
        <h3>O que a fase encena</h3>
        <p>{level.fictionalizationNote}</p>
      </section>

      <section className="context__section">
        <h3>Fontes</h3>
        {shownSources.length === 0 ? (
          <p className="muted">Nenhuma fonte revisada publicada ainda.</p>
        ) : (
          <ol className="sources">
            {shownSources.map((s) => (
              <li key={s.id}>
                <span className="muted small">{s.id}</span>{" "}
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>
                <span className="muted">
                  {" "}
                  — {s.publisher}
                  {s.author && ` (${s.author})`}
                  {s.publishedAt && `, ${formatDate(s.publishedAt)}`}
                </span>{" "}
                {s.status === "reviewed" ? (
                  <span className="badge badge--verified">
                    revisada em {formatDate(s.checkedAt)}
                    {s.accessMode && ` · ${ACCESS_LABEL[s.accessMode]}`}
                  </span>
                ) : (
                  <span className="badge badge--pending">não revisada</span>
                )}
                {showPending && s.scope && <small className="todo">Escopo: {s.scope}</small>}
                {showPending && s.notes && <small className="todo">Nota interna: {s.notes}</small>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </article>
  );
}

function ClaimItem({ claim }: { claim: EditorialClaim }) {
  return (
    <li className={claim.status === "pending" ? "claim claim--pending" : "claim"}>
      {claim.status === "pending" && <span className="badge badge--pending">pendente</span>} {claim.text}
      {claim.attribution && <span className="muted"> — {claim.attribution}</span>}
      {claim.sourceIds.length > 0 && <sup className="refs">[{claim.sourceIds.join(", ")}]</sup>}
      {claim.status === "pending" && claim.toVerify && <small className="todo">A verificar: {claim.toVerify}</small>}
    </li>
  );
}
