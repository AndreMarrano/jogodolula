import type { LevelDefinition } from "../types";
import { plannedLevels } from "./planned";
import { triplexLevel } from "./triplex";

export const levels: LevelDefinition[] = [triplexLevel, ...plannedLevels].sort(
  (a, b) => a.number - b.number,
);

export function getLevel(id: string): LevelDefinition | undefined {
  return levels.find((l) => l.id === id);
}

export function nextLevel(id: string): LevelDefinition | undefined {
  const current = getLevel(id);
  if (!current) return undefined;
  return levels.find((l) => l.number === current.number + 1);
}
