import type { Theme, AuthorEntry, SearchIndex } from "$lib/types/theme";

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function tokenize(text: string): string[] {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");

  const words = normalized.trim().split(/\s+/).filter(Boolean);
  return Array.from(new Set(words));
}

export function buildSearchIndex(themes: Theme[]): SearchIndex {
  const byWord = new Map<string, Set<string>>();
  const byId = new Map<string, Theme>();

  for (const theme of themes) {
    byId.set(theme.id, theme);

    const terms = new Set<string>();
    tokenize(theme.name).forEach((t) => terms.add(t));
    tokenize(theme.author).forEach((t) => terms.add(t));
    tokenize(theme.slug).forEach((t) => terms.add(t));
    (theme.tags ?? []).forEach((tag) => tokenize(tag).forEach((t) => terms.add(t)));
    if (theme.description) {
      tokenize(theme.description).forEach((t) => terms.add(t));
    }

    for (const term of terms) {
      let set = byWord.get(term);
      if (!set) {
        set = new Set<string>();
        byWord.set(term, set);
      }
      set.add(theme.id);
    }
  }

  return { byWord, byId };
}

function termMatches(word: string, term: string): boolean {
  if (word.startsWith(term)) return true;
  if (term.length >= 3 && word.includes(term)) return true;
  if (term.length <= 5 && word.length >= 3 && term.includes(word)) return true;
  return false;
}

function relevanceScore(theme: Theme, query: string, terms: string[]): number {
  const name = theme.name.toLowerCase();
  const author = theme.author.toLowerCase();
  const slug = theme.slug.toLowerCase();
  const tags = (theme.tags ?? []).map((tag) => tag.toLowerCase());
  const description = (theme.description ?? "").toLowerCase();
  const fullQuery = query.toLowerCase();

  let score = 0;
  if (name === fullQuery) score += 100;
  if (name.startsWith(fullQuery)) score += 50;
  if (author === fullQuery) score += 40;
  if (author.startsWith(fullQuery)) score += 25;

  for (const term of terms) {
    if (name.includes(term)) score += 20;
    if (author.includes(term)) score += 15;
    if (tags.some((tag) => tag.includes(term))) score += 10;
    if (slug.includes(term)) score += 8;
    if (description.includes(term)) score += 3;
  }

  return score;
}

export function searchThemes(query: string, index: SearchIndex): Theme[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  let result: Set<string> | null = null;

  for (const term of terms) {
    const matching = new Set<string>();
    for (const [word, ids] of index.byWord) {
      if (termMatches(word, term)) {
        for (const id of ids) matching.add(id);
      }
    }
    if (matching.size === 0) return [];

    if (result === null) {
      result = matching;
    } else {
      const next = new Set<string>();
      for (const id of result) {
        if (matching.has(id)) next.add(id);
      }
      result = next;
    }

    if (result.size === 0) return [];
  }

  const fullQuery = terms.join(" ");
  const ranked = Array.from(result!)
    .map((id) => index.byId.get(id)!)
    .filter(Boolean)
    .sort((a, b) => {
      const scoreDiff = relevanceScore(b, fullQuery, terms) - relevanceScore(a, fullQuery, terms);
      if (scoreDiff !== 0) return scoreDiff;
      if (a.date && b.date) return b.date.localeCompare(a.date);
      if (a.date) return -1;
      if (b.date) return 1;
      return a.name.localeCompare(b.name);
    });

  return ranked;
}

export function buildAuthorIndex(themes: Theme[]): Map<string, AuthorEntry> {
  const authors = new Map<string, AuthorEntry>();

  for (const theme of themes) {
    const slug = slugify(theme.author);
    const existing = authors.get(slug);
    if (existing) {
      existing.count += 1;
      existing.themes.push(theme);
    } else {
      authors.set(slug, {
        name: theme.author,
        slug,
        count: 1,
        themes: [theme],
      });
    }
  }

  // Sort themes inside each author by date desc (fallback to name)
  for (const entry of authors.values()) {
    entry.themes.sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date);
      if (a.date) return -1;
      if (b.date) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  return authors;
}

export function getAuthorEntries(themes: Theme[]): AuthorEntry[] {
  const index = buildAuthorIndex(themes);
  return Array.from(index.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function getThemesByAuthorSlug(
  themes: Theme[],
  authorSlug: string
): Theme[] {
  const index = buildAuthorIndex(themes);
  return index.get(authorSlug)?.themes ?? [];
}

export function findAuthorBySlug(
  themes: Theme[],
  authorSlug: string
): AuthorEntry | null {
  return buildAuthorIndex(themes).get(authorSlug) ?? null;
}
