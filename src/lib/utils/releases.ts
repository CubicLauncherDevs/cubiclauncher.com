import { CHANGELOG_FEED_PATH, isChangelogFeed, type ChangelogFeed, type LauncherRelease } from "./changelog-feed.js";
export { RELEASES_URL } from "./changelog-feed.js";
export type { LauncherRelease } from "./changelog-feed.js";
const PAGE_SIZE = 10;
const CACHE_TTL = 5 * 60 * 1000;

interface ReleasePage {
  releases: LauncherRelease[];
  hasMore: boolean;
}

export class ReleaseFetchError extends Error {
  code: "fetchError";

  constructor(code: "fetchError") {
    super(code);
    this.code = code;
  }
}

let cache: { expires: number; data: ChangelogFeed } | null = null;

export async function fetchReleasePage(page: number, signal: AbortSignal): Promise<ReleasePage> {
  signal.throwIfAborted();
  if (!Number.isSafeInteger(page) || page < 1) throw new ReleaseFetchError("fetchError");
  // Keep one snapshot across pagination so a background update cannot skip entries.
  if (!cache || (page === 1 && cache.expires <= Date.now())) {
    const response = await fetch(CHANGELOG_FEED_PATH, { signal, cache: "no-cache" });
    if (!response.ok) throw new ReleaseFetchError("fetchError");
    const data: unknown = await response.json();
    if (!isChangelogFeed(data)) throw new ReleaseFetchError("fetchError");
    cache = { expires: Date.now() + CACHE_TTL, data };
  }
  const start = (page - 1) * PAGE_SIZE;
  return {
    releases: cache.data.releases.slice(start, start + PAGE_SIZE),
    hasMore: start + PAGE_SIZE < cache.data.releases.length,
  };
}
