import { readFile, writeFile, mkdir, rename, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHANGELOG_REPOSITORY, RELEASES_URL, isChangelogFeed } from '../src/lib/utils/changelog-feed.js';

const DEFAULT_OUTPUT = fileURLToPath(new URL('../static/api/v1/changelogs.json', import.meta.url));
const API_URL = `https://api.github.com/repos/${CHANGELOG_REPOSITORY}/releases`;

export async function fetchAllReleases(fetchImpl = fetch, token = process.env.GITHUB_TOKEN) {
  const releases = new Map();
  for (let page = 1; page <= 100; page++) {
    const response = await fetchImpl(`${API_URL}?per_page=100&page=${page}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`GitHub releases: HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Invalid GitHub releases response');

    for (const entry of data) {
      if (!entry || typeof entry !== 'object') throw new Error('Invalid GitHub release');
      if (entry.draft === true) continue;
      const release = {
        id: entry.id,
        tag: entry.tag_name,
        name: typeof entry.name === 'string' && entry.name.trim() ? entry.name : entry.tag_name,
        body: entry.body ?? '',
        publishedAt: entry.published_at,
        updatedAt: entry.updated_at,
        prerelease: entry.prerelease,
        htmlUrl: `${RELEASES_URL}/tag/${encodeURIComponent(entry.tag_name)}`,
      };
      releases.set(release.id, release);
    }
    if (!/<[^>]+>;\s*rel="next"/.test(response.headers.get('link') ?? '')) {
      return [...releases.values()].sort((a, b) =>
        Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || b.id - a.id);
    }
  }
  throw new Error('GitHub pagination exceeded the limit; refusing to publish an incomplete history');
}

export async function syncChangelogs({ outputPath = DEFAULT_OUTPUT, fetchImpl = fetch, token = process.env.GITHUB_TOKEN } = {}) {
  let previous = null;
  try {
    const data = JSON.parse(await readFile(outputPath, 'utf8'));
    if (isChangelogFeed(data)) previous = data;
  } catch {
    // A valid previous snapshot is optional only when GitHub is available.
  }

  let feed;
  try {
    feed = {
      schemaVersion: 1,
      repository: CHANGELOG_REPOSITORY,
      source: RELEASES_URL,
      generatedAt: new Date().toISOString(),
      notesFormat: 'markdown',
      releases: await fetchAllReleases(fetchImpl, token),
    };
    if (!isChangelogFeed(feed)) throw new Error('Invalid changelog feed');
  } catch (error) {
    if (!previous) throw error;
    console.warn(`Changelog sync failed; keeping snapshot from ${previous.generatedAt}.`, error instanceof Error ? error.message : error);
    return { status: 'stale', count: previous.releases.length };
  }

  if (previous && JSON.stringify(previous.releases) === JSON.stringify(feed.releases)) {
    return { status: 'unchanged', count: feed.releases.length };
  }

  await mkdir(dirname(outputPath), { recursive: true });
  const temporary = `${outputPath}.${process.pid}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(feed, null, 2)}\n`, 'utf8');
    await rename(temporary, outputPath);
  } finally {
    await rm(temporary, { force: true });
  }
  return { status: 'updated', count: feed.releases.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncChangelogs()
    .then(({ status, count }) => console.log(`Changelog feed ${status}: ${count} releases.`))
    .catch((error) => {
      console.error('Unable to generate changelog feed:', error);
      process.exitCode = 1;
    });
}
