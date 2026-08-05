import { get } from "svelte/store";
import { browser } from "$app/environment";
import type { Theme, ThemePackage, ResolvedThemePackage } from "$lib/types/theme";
import { t } from "$lib/i18n";
import { getCachedPackages, setCachedPackages } from "./theme-cache";

const GITHUB_OWNER = "CubicLauncherDevs";
const GITHUB_REPO = "Themes";
const GITHUB_BRANCH = "master";
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/refs/heads/${GITHUB_BRANCH}`;
const PACKAGES_JSON_URL = `${RAW_BASE}/packages.json`;

let localPackages: ThemePackage[] | null = null;
let localPackagesPromise: Promise<ThemePackage[]> | null = null;

async function loadLocalPackages(): Promise<ThemePackage[]> {
  if (localPackages) return localPackages;
  if (localPackagesPromise) return localPackagesPromise;

  localPackagesPromise = (async () => {
    try {
      const mod = await import("$lib/data/packages.json");
      localPackages = mod.default as ThemePackage[];
      return localPackages;
    } catch {
      throw new Error("Local packages not available");
    }
  })();

  return localPackagesPromise;
}

export async function fetchAllPackages(): Promise<ThemePackage[]> {
  if (!browser) {
    // Server/build: prefer local data prepared by prebuild script
    try {
      return await loadLocalPackages();
    } catch {
      // fall through to network if local data is missing
    }
  }

  const cached = await getCachedPackages();
  if (cached) return cached;

  const url = `${PACKAGES_JSON_URL}?_=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(get(t)('themesUtil.fetchPackagesError', { values: { status: res.status } }));
  }
  const packages = await res.json() as ThemePackage[];
  await setCachedPackages(packages);
  return packages;
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
