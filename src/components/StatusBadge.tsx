import type { LevelDefinition } from "../content/types";

export function implementationLabel(level: LevelDefinition): { text: string; tone: string } {
  if (level.editorialStatus === "blocked") return { text: "Em pesquisa", tone: "research" };
  if (level.implementationStatus === "planned") return { text: "Planejada", tone: "planned" };
  if (level.implementationStatus === "playable") return { text: "Jogável", tone: "playable" };
  return { text: "Completa", tone: "playable" };
}

export function LevelStatusBadge({ level }: { level: LevelDefinition }) {
  const { text, tone } = implementationLabel(level);
  return <span className={`badge badge--${tone}`}>{text}</span>;
}

export function EditorialBadge({ level }: { level: LevelDefinition }) {
  if (level.editorialStatus === "reviewed") return <span className="badge badge--verified">Contexto revisado</span>;
  if (level.editorialStatus === "blocked") return null;
  return <span className="badge badge--pending">Contexto em revisão</span>;
}
