import type { PageLoad } from './$types';
import type { Theme, AuthorEntry } from '$lib/types/theme';
import { error } from '@sveltejs/kit';
import themesData from '$lib/data/themes.json';
import { buildAuthorIndex } from '$lib/utils/theme-search';

export const prerender = true;

export const entries = () => {
  const themes = themesData as Theme[];
  const authors = buildAuthorIndex(themes);
  return Array.from(authors.values()).map((author) => ({ slug: author.slug }));
};

export const load: PageLoad = ({ params }) => {
  const themes = themesData as Theme[];
  const authors = buildAuthorIndex(themes);
  const author = authors.get(params.slug);

  if (!author) {
    error(404, 'Author not found');
  }

  return {
    author,
    allThemes: themes
  };
};
