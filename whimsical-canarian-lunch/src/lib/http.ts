const OPAQUE_ERROR =
  /match the expected pattern|unexpected token|JSON|Failed to fetch|NetworkError|Load failed|not valid JSON/i;

export async function readJson<T>(
  response: Response,
  fallback = "Qualcosa è andato storto.",
): Promise<T> {
  const text = await response.text();
  if (!text.trim()) {
    throw new Error(fallback);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(fallback);
  }
}

export function publicError(err: unknown, fallback = "Qualcosa è andato storto."): string {
  const message = err instanceof Error ? err.message.trim() : "";
  if (!message || OPAQUE_ERROR.test(message)) {
    return fallback;
  }
  return message;
}
