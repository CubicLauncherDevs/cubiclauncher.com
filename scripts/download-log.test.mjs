import assert from 'node:assert/strict';
import test from 'node:test';
import { downloadSource, fetchLoggedThemeFile } from '../src/lib/utils/download-log.ts';

test('records the final source, actual bytes and duration after a redirect', async (t) => {
  const events = [];
  const response = new Response('theme data');
  Object.defineProperties(response, {
    url: { value: 'https://cdn.example.com/theme.toml' },
    redirected: { value: true },
  });
  const signal = new AbortController().signal;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://example.com/theme.toml');
    assert.equal(options.signal, signal);
    return response;
  });
  const blob = await fetchLoggedThemeFile('theme.toml', 'https://example.com/theme.toml', signal, (entry) => events.push(entry));
  assert.deepEqual(events.map((entry) => entry.kind), ['request', 'redirect', 'received']);
  assert.equal(events.at(-1).url, 'https://cdn.example.com/theme.toml');
  assert.equal(events.at(-1).bytes, blob.size);
  assert.equal(events.at(-1).bytes, 10);
  assert.ok(events.at(-1).durationMs >= 0);
});

test('HTTP failures keep the filename and source without reporting a completed file', async (t) => {
  const events = [];
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));
  await assert.rejects(fetchLoggedThemeFile('bg.png', 'https://example.com/bg.png', new AbortController().signal, (entry) => events.push(entry)), /HTTP 503/);
  assert.deepEqual(events.map((entry) => entry.kind), ['request', 'error']);
  assert.equal(events.at(-1).name, 'bg.png');
  assert.equal(events.at(-1).url, 'https://example.com/bg.png');
  assert.equal(events.at(-1).detail, 'HTTP 503');
});

test('an aborted request does not emit a misleading download error', async (t) => {
  const events = [];
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async () => {
    controller.abort();
    controller.signal.throwIfAborted();
  });
  await assert.rejects(fetchLoggedThemeFile('theme.toml', 'https://example.com/theme.toml', controller.signal, (entry) => events.push(entry)), { name: 'AbortError' });
  assert.deepEqual(events.map((entry) => entry.kind), ['request']);
});

test('source links display the actual host and reject non-web URLs', () => {
  assert.deepEqual(downloadSource('https://cdn.example.com:8443/theme.toml'), { href: 'https://cdn.example.com:8443/theme.toml', host: 'cdn.example.com:8443' });
  for (const value of [undefined, '', 'javascript:alert(1)', 'data:text/plain,hello', '/theme.toml']) {
    assert.equal(downloadSource(value), null);
  }
});
