import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fetchAllReleases, syncChangelogs } from './fetch-changelogs.mjs';
import { isChangelogFeed } from '../src/lib/utils/changelog-feed.js';

function release(id, extra = {}) {
  return {
    id, tag_name: `v${id}`, name: `Version ${id}`, body: '# Changes\n\nOriginal notes',
    published_at: `2026-09-${String(id).padStart(2, '0')}T12:00:00Z`,
    updated_at: '2026-09-15T12:00:00Z', prerelease: false, draft: false, ...extra,
  };
}

async function outputFor(t) {
  const directory = await mkdtemp(join(tmpdir(), 'changelog-feed-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return join(directory, 'changelogs.json');
}

test('fetches all pages, excludes drafts, sorts by publication and preserves original notes', async () => {
  const requests = [];
  const entries = await fetchAllReleases(async (url, options) => {
    requests.push(url);
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    if (requests.length === 1) {
      return Response.json([release(1), release(9, { draft: true })], {
        headers: { link: '<https://api.github.com/repos/CubicLauncherDevs/CubicLauncher/releases?page=2>; rel="next"' },
      });
    }
    return Response.json([release(2, { body: null, name: '', prerelease: true })]);
  }, 'test-token');
  assert.match(requests[1], /per_page=100&page=2$/);
  assert.deepEqual(entries.map((entry) => entry.id), [2, 1]);
  assert.equal(entries[0].body, '');
  assert.equal(entries[0].name, 'v2');
  assert.equal(entries[0].prerelease, true);
  assert.equal(entries[1].body, '# Changes\n\nOriginal notes');
});

test('unchanged data preserves the snapshot and edited notes update it', async (t) => {
  const outputPath = await outputFor(t);
  const options = { outputPath, token: 'secret', fetchImpl: async () => Response.json([release(1)]) };
  assert.equal((await syncChangelogs(options)).status, 'updated');
  const original = await readFile(outputPath, 'utf8');
  assert.ok(isChangelogFeed(JSON.parse(original)));
  assert.ok(!original.includes('secret'));
  assert.equal((await syncChangelogs(options)).status, 'unchanged');
  assert.equal(await readFile(outputPath, 'utf8'), original);
  const changed = await syncChangelogs({ ...options, fetchImpl: async () => Response.json([release(1, { body: 'Edited notes' })]) });
  assert.equal(changed.status, 'updated');
  assert.equal(JSON.parse(await readFile(outputPath, 'utf8')).releases[0].body, 'Edited notes');
});

test('HTTP errors, invalid data and partial pagination never replace a valid snapshot', async (t) => {
  const outputPath = await outputFor(t);
  await syncChangelogs({ outputPath, fetchImpl: async () => Response.json([release(1)]) });
  const original = await readFile(outputPath, 'utf8');
  let page = 0;
  const failures = [
    async () => new Response('', { status: 403 }),
    async () => { throw new TypeError('Network unavailable'); },
    async () => Response.json({ message: 'Invalid response' }),
    async () => Response.json([release(1, { published_at: 'invalid' })]),
    async () => ++page === 1
      ? Response.json([release(2)], { headers: { link: '<https://api.github.com/next>; rel="next"' } })
      : new Response('', { status: 500 }),
  ];
  for (const fetchImpl of failures) {
    assert.equal((await syncChangelogs({ outputPath, fetchImpl })).status, 'stale');
    assert.equal(await readFile(outputPath, 'utf8'), original);
  }
});

test('fails when neither GitHub nor a valid local snapshot is available', async (t) => {
  const outputPath = await outputFor(t);
  const options = { outputPath, fetchImpl: async () => new Response('', { status: 503 }) };
  await assert.rejects(syncChangelogs(options), /HTTP 503/);
  await writeFile(outputPath, '{invalid JSON');
  await assert.rejects(syncChangelogs(options), /HTTP 503/);
  assert.equal(await readFile(outputPath, 'utf8'), '{invalid JSON');
});

test('the shared contract rejects unsupported schemas, duplicate IDs and unexpected release links', async (t) => {
  const outputPath = await outputFor(t);
  await syncChangelogs({ outputPath, fetchImpl: async () => Response.json([release(1)]) });
  const feed = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(isChangelogFeed({ ...feed, schemaVersion: 2 }), false);
  assert.equal(isChangelogFeed({ ...feed, releases: [feed.releases[0], feed.releases[0]] }), false);
  assert.equal(isChangelogFeed({ ...feed, releases: [{ ...feed.releases[0], htmlUrl: 'javascript:alert(1)' }] }), false);
  assert.equal(isChangelogFeed({ ...feed, releases: [] }), true);
});
