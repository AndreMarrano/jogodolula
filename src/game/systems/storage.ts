/**
 * Persistência local versionada. Qualquer problema (localStorage indisponível,
 * JSON inválido, versão antiga, formato inesperado) volta para o padrão em vez
 * de quebrar o jogo.
 */

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function browserStorage(): StorageLike | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

interface Envelope {
  version: number;
  data: unknown;
}

function isEnvelope(value: unknown): value is Envelope {
  return typeof value === "object" && value !== null && "version" in value && "data" in value;
}

export function loadVersioned<T>(
  key: string,
  version: number,
  parse: (data: unknown) => T | null,
  fallback: () => T,
  storage: StorageLike | null = browserStorage(),
): T {
  if (!storage) return fallback();
  try {
    const raw = storage.getItem(key);
    if (raw === null) return fallback();
    const parsed: unknown = JSON.parse(raw);
    if (!isEnvelope(parsed) || parsed.version !== version) return fallback();
    return parse(parsed.data) ?? fallback();
  } catch {
    return fallback();
  }
}

export function saveVersioned<T>(
  key: string,
  version: number,
  data: T,
  storage: StorageLike | null = browserStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify({ version, data } satisfies Envelope));
  } catch {
    // Cota cheia ou modo privado: o jogo segue sem salvar.
  }
}

export function removeKey(key: string, storage: StorageLike | null = browserStorage()): void {
  try {
    storage?.removeItem(key);
  } catch {
    // ignora
  }
}

export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
