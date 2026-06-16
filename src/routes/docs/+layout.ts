import type { LayoutLoad } from './$types';
import { flatDocs, localeDocDirs, localeSlugMap } from '$lib/docs/structure';

interface DocIndexEntry {
  title: string;
  slug: string;
  category: string;
  content: string;
  locale: string;
}

function buildSlugReverseMap(): Record<string, Record<string, string>> {
  const map: Record<string, Record<string, string>> = {};
  for (const [locale, slugMap] of Object.entries(localeSlugMap)) {
    const dir = localeDocDirs[locale];
    map[dir] = {};
    for (const [canonicalSlug, filePath] of Object.entries(slugMap)) {
      const filename = filePath.split('/').pop() || '';
      map[dir][filename] = canonicalSlug;
    }
  }
  return map;
}

const slugReverseMap = buildSlugReverseMap();

function canonicalSlug(dir: string, filename: string): string {
  const reverse = slugReverseMap[dir];
  if (reverse && reverse[filename]) return reverse[filename];
  return filename === 'introduction' ? '' : filename;
}

function detectLocale(path: string): string {
  for (const [locale, dir] of Object.entries(localeDocDirs)) {
    if (path.includes(`/${dir}/`)) return locale;
  }
  return 'es';
}

export const load: LayoutLoad = async ({ params }) => {
  const rawModules = import.meta.glob('../../lib/docs/**/*.md', { query: '?raw', eager: true }) as Record<string, { default: string }>;

  const docsIndex: DocIndexEntry[] = [];

  for (const [path, mod] of Object.entries(rawModules)) {
    const raw = mod.default;

    const title = raw.match(/^---\s*\n[\s\S]*?title:\s*(.+)\n[\s\S]*?\n---/)?.[1]?.trim() || '';
    const filename = path.match(/([^/]+)\.md$/)?.[1] || '';
    const dir = path.match(/\/([^/]+)\/[^/]+\.md$/)?.[1] || '';
    const locale = detectLocale(path);
    const slug = canonicalSlug(localeDocDirs[locale], filename);
    const category = dir;

    const content = raw
      .replace(/^---[\s\S]*?---\n/, '')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[`*_~>|]/g, '')
      .replace(/\n{2,}/g, ' ')
      .trim()
      .substring(0, 3000);

    docsIndex.push({ title, slug, category, content, locale });
  }

  const currentSlug = params.slug ?? '';
  const currentIndex = flatDocs.findIndex(d => d.slug === currentSlug);
  const prev = currentIndex > 0 ? flatDocs[currentIndex - 1] : null;
  const next = currentIndex < flatDocs.length - 1 ? flatDocs[currentIndex + 1] : null;

  return { docsIndex, prev, next };
};
