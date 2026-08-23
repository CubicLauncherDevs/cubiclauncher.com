import type { PageLoad } from './$types';
import type { Theme } from '$lib/types/theme';
import { error } from '@sveltejs/kit';
import themesData from '$lib/data/themes.json';
import { slugify, compareVersionsDesc } from '$lib/utils/theme-search';

export const prerender = true;

export const entries = () => {
  const themes = themesData as Theme[];
  return themes.map((theme) => ({ slug: theme.slug }));
};

function getRelatedThemes(theme: Theme, allThemes: Theme[]) {
  return allThemes.filter((t) => t.author === theme.author && t.slug !== theme.slug);
}

function getSortedVersions(theme: Theme) {
  return [...theme.versions].sort((a, b) => compareVersionsDesc(a.version, b.version));
}

export const load: PageLoad = ({ params }) => {
  const themes = themesData as Theme[];
  const theme = themes.find((t) => t.slug === params.slug);

  if (!theme) {
    error(404, 'Theme not found');
  }

  return {
    theme,
    relatedThemes: getRelatedThemes(theme, themes),
    sortedVersions: getSortedVersions(theme),
    authorUrl: `/themes/author/${slugify(theme.author)}`
  };
};
