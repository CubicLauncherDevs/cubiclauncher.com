import type { PageLoad } from './$types';
import type { Theme, ThemePackage } from '$lib/types/theme';
import themesData from '$lib/data/themes.json';
import packagesData from '$lib/data/packages.json';
import { getAuthorEntries } from '$lib/utils/theme-search';

export const prerender = true;

export const load: PageLoad = () => {
  const themes = themesData as Theme[];
  const packages = packagesData as ThemePackage[];

  return {
    themes,
    packages,
    authorEntries: getAuthorEntries(themes)
  };
};
