import type { PageLoad } from './$types';
import type { Theme } from '$lib/types/theme';
import { error } from '@sveltejs/kit';
import themesData from '$lib/data/themes.json';

export const prerender = true;

export const entries = () => {
  const themes = themesData as Theme[];
  const entries: { slug: string; version: string }[] = [];

  for (const theme of themes) {
    for (const v of theme.versions) {
      entries.push({ slug: theme.slug, version: v.version });
    }
  }

  return entries;
};

export const load: PageLoad = ({ params }) => {
  const themes = themesData as Theme[];
  const theme = themes.find((t) => t.slug === params.slug);

  if (!theme) {
    error(404, 'Theme not found');
  }

  const version = theme.versions.find((v) => v.version === params.version);

  if (!version) {
    error(404, 'Version not found');
  }

  return {
    theme,
    version
  };
};
