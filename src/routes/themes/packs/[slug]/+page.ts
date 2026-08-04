import type { PageLoad } from './$types';
import type { Theme, ThemePackage } from '$lib/types/theme';
import { error } from '@sveltejs/kit';
import themesData from '$lib/data/themes.json';
import packagesData from '$lib/data/packages.json';
import { resolvePackage } from '$lib/utils/theme-packages';

export const prerender = true;

export const entries = () => {
  const packages = packagesData as ThemePackage[];
  return packages.map((pkg) => ({ slug: pkg.slug }));
};

export const load: PageLoad = ({ params }) => {
  const themes = themesData as Theme[];
  const packages = packagesData as ThemePackage[];
  const pkg = packages.find((p) => p.slug === params.slug);

  if (!pkg) {
    error(404, 'Package not found');
  }

  return {
    resolved: resolvePackage(pkg, themes)
  };
};
