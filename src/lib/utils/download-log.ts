export interface DownloadLogEntry {
  kind: "started" | "request" | "redirect" | "received" | "packing" | "ready" | "error";
  name?: string;
  url?: string;
  detail?: string;
  timestamp?: number;
  bytes?: number;
  durationMs?: number;
}

export type DownloadLogger = (entry: DownloadLogEntry) => void;

/** Record the requested source and the final URL exposed by the browser. */
export async function fetchLoggedThemeFile(
  name: string,
  url: string,
  signal: AbortSignal,
  log: DownloadLogger,
): Promise<Blob> {
  log({ kind: "request", name, url });
  const started = performance.now();
  let source = url;
  try {
    const response = await fetch(url, { signal });
    source = response.url || url;
    if (response.redirected && source !== url) {
      log({ kind: "redirect", name, url: source });
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    log({ kind: "received", name, url: source, bytes: blob.size, durationMs: performance.now() - started });
    return blob;
  } catch (error) {
    if (!signal.aborted) {
      log({
        kind: "error",
        name,
        url: source,
        detail: error instanceof Error ? error.message : String(error),
      });
    }
    throw error;
  }
}

/** Only make web URLs clickable; display the actual host rather than a provider claim. */
export function downloadSource(url?: string): { href: string; host: string } | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return { href: parsed.href, host: parsed.host };
  } catch {
    return null;
  }
}
