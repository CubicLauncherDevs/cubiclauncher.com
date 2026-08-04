import type { PageLoad } from './$types';
import type { Theme } from '$lib/types/theme';
import { error } from '@sveltejs/kit';
import themesData from '$lib/data/themes.json';

export const prerender = true;

export const entries = () => {
  const themes = themesData as Theme[];
  return themes.map((theme) => ({ slug: theme.slug }));
};

export const load: PageLoad = ({ params }) => {
  const themes = themesData as Theme[];
  const theme = themes.find((t) => t.slug === params.slug);

  if (!theme) {
    error(404, 'Theme not found');
  }

  return {
    theme,
    allThemes: themes
  };
};
