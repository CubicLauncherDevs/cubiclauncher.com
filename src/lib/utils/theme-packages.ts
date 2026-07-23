import { get } from "svelte/store";
import type { Theme, ThemePackage, ResolvedThemePackage } from "$lib/types/theme";
import { t } from "$lib/i18n";
import { getCachedPackages, setCachedPackages } from "./theme-cache";

const GITHUB_OWNER = "cubiclauncherdevs";
const GITHUB_REPO = "Themes";
const GITHUB_BRANCH = "master";
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const PACKAGES_JSON_URL = `${RAW_BASE}/packages.json`;

export async function fetchAllPackages(): Promise<ThemePackage[]> {
  const url = `${PACKAGES_JSON_URL}?_=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(get(t)('themesUtil.fetchPackagesError', { values: { status: res.status } }));
  }
  return (await res.json()) as ThemePackage[];
}

export { getCachedPackages, setCachedPackages };

export function resolvePackage(
  pkg: ThemePackage,
  allThemes: Theme[]
): ResolvedThemePackage {
  const byId = new Map(allThemes.map((t) => [t.id, t]));
  const resolvedThemes: Theme[] = [];
  const missingThemes: string[] = [];

  for (const themeId of pkg.themes) {
    const theme = byId.get(themeId);
    if (theme) {
      resolvedThemes.push(theme);
    } else {
      missingThemes.push(themeId);
    }
  }

  return { ...pkg, resolvedThemes, missingThemes };
}
