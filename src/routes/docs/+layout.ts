import type { LayoutLoad } from './$types';
import { flatDocs } from '$lib/docs/structure';

interface DocIndexEntry {
  title: string;
  slug: string;
  category: string;
  content: string;
}

export const load: LayoutLoad = async ({ params }) => {
  const rawModules = import.meta.glob('../../lib/docs/**/*.md', { query: '?raw', eager: true }) as Record<string, { default: string }>;

  const docsIndex: DocIndexEntry[] = [];

  for (const [path, mod] of Object.entries(rawModules)) {
    const raw = mod.default;

    const title = raw.match(/^---\s*\n[\s\S]*?title:\s*(.+)\n[\s\S]*?\n---/)?.[1]?.trim() || '';
    const filename = path.match(/([^/]+)\.md$/)?.[1] || '';
    const slug = filename === 'introduction' ? '' : filename;
    const category = path.match(/\/([^/]+)\/[^/]+\.md$/)?.[1] || '';

    const content = raw
      .replace(/^---[\s\S]*?---\n/, '')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[`*_~>|]/g, '')
      .replace(/\n{2,}/g, ' ')
      .trim()
      .substring(0, 3000);

    docsIndex.push({ title, slug, category, content });
  }

  const currentSlug = params.slug ?? '';
  const currentIndex = flatDocs.findIndex(d => d.slug === currentSlug);
  const prev = currentIndex > 0 ? flatDocs[currentIndex - 1] : null;
  const next = currentIndex < flatDocs.length - 1 ? flatDocs[currentIndex + 1] : null;

  return { docsIndex, prev, next };
};
