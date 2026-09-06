import { get } from "svelte/store";
import { browser } from "$app/environment";
import type { Theme, ThemeVerification, ColorGroup, ThemeVersion } from "$lib/types/theme";
import { t } from "$lib/i18n";
import { getCachedThemes, setCachedThemes } from "./theme-cache";

const GITHUB_OWNER = "CubicLauncherDevs";
const GITHUB_REPO = "Themes";
const GITHUB_BRANCH = "master";
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/refs/heads/${GITHUB_BRANCH}`;
const THEMES_JSON_URL = `${RAW_BASE}/themes.json`;

let localThemes: Theme[] | null = null;
let localThemesPromise: Promise<Theme[]> | null = null;

async function loadLocalThemes(): Promise<Theme[]> {
  if (localThemes) return localThemes;
  if (localThemesPromise) return localThemesPromise;

  localThemesPromise = (async () => {
    try {
      const mod = await import("$lib/data/themes.json");
      localThemes = normalizeThemes(mod.default as Theme[]);
      return localThemes;
    } catch {
      throw new Error("Local themes not available");
    }
  })();

  return localThemesPromise;
}

export function rawUrl(path: string): string {
  const segments = path.split("/").map((s) => encodeURIComponent(s));
  return `${RAW_BASE}/${segments.join("/")}`;
}

export async function fetchAllThemes(): Promise<Theme[]> {
  if (!browser) {
    // Server/build: prefer local data prepared by prebuild script
    try {
      return await loadLocalThemes();
    } catch {
      // fall through to network if local data is missing
    }
  }

  const cached = await getCachedThemes();
  if (cached) return normalizeThemes(cached);

  const url = `${THEMES_JSON_URL}?_=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(get(t)('themesUtil.fetchError', { values: { status: res.status } }));
  const themes = normalizeThemes(await res.json() as Theme[]);
  await setCachedThemes(themes);
  return themes;
}

export { getCachedThemes, setCachedThemes };

/** Official author name that grants "golden" verification */
export const OFFICIAL_AUTHOR = "CubicLauncher";

/** Calculate the verification level for a theme based on its author.
 *  This is computed locally so the external themes.json repo doesn't need changes. */
export function getThemeVerification(theme: { author: string; verified?: boolean }): ThemeVerification {
  if (theme.author === OFFICIAL_AUTHOR) return "official";
  return theme.verified ? "verified" : "none";
}

function deriveFileUrl(files: ThemeVersion['files'], baseName: string): string | null {
  const match = files.find((file) => {
    if (typeof file === 'string') return false;
    // Skip files inside subfolders to avoid false positives (e.g. icons/preview.png).
    if (file.name.includes('/')) return false;
    const stem = file.name.replace(/\.[^/.]+$/, '').toLowerCase();
    return stem === baseName.toLowerCase();
  });
  return match && typeof match !== 'string' ? match.url : null;
}

/** Enrich an array of themes with their locally-calculated verification level and
 *  derive missing preview/showcase URLs from the version's file list. */
export function normalizeThemes(themes: Theme[]): Theme[] {
  return themes.map((theme) => {
    const versions = theme.versions.map((version) => ({
      ...version,
      previewUrl: version.previewUrl || deriveFileUrl(version.files, 'preview'),
      showcaseUrl: version.showcaseUrl || deriveFileUrl(version.files, 'showcase'),
    }));

    const latestVersion = versions.find((v) => v.version === theme.latestVersion) || versions[0];

    return {
      ...theme,
      verification: getThemeVerification(theme),
      versions,
      previewUrl: theme.previewUrl || latestVersion?.previewUrl || null,
    };
  });
}

/** Build a raw GitHub URL for a file inside a theme version directory */
export function versionFileUrl(version: { dirPath: string }, fileName: string): string {
  return rawUrl(`${version.dirPath}/${fileName}`);
}

/** Get download-able files for a version (handles both old string[] and new {name,url}[] format) */
export function getVersionDownloadFiles(version: { files: (string | { name: string; url: string })[] }): { name: string; url: string }[] {
  return version.files.map((f) => {
    if (typeof f === "string") {
      const dirPath = (version as any).dirPath;
      const url = rawUrl(`${dirPath}/${f}`);
      return { name: f, url };
    }
    return f;
  });
}

export function categorizeVariables(
  variables: Record<string, string>
): ColorGroup[] {
  const $tFn = get(t);
  const groups: { label: string; prefixes: string[] }[] = [
    { label: $tFn('themesUtil.groupBackground'), prefixes: ["--bg-"] },
    { label: $tFn('themesUtil.groupText'), prefixes: ["--text-"] },
    { label: $tFn('themesUtil.groupAccent'), prefixes: ["--accent"] },
    { label: $tFn('themesUtil.groupBorders'), prefixes: ["--border-", "--shadow-", "--glow-"] },
    { label: $tFn('themesUtil.groupState'), prefixes: ["--color-"] },
    { label: $tFn('themesUtil.groupScrollbar'), prefixes: ["--scrollbar-"] },
    { label: $tFn('themesUtil.groupTypography'), prefixes: ["--font-", "--font-size-"] },
    { label: $tFn('themesUtil.groupIcons'), prefixes: ["--icon-"] },
    { label: $tFn('themesUtil.groupTransitions'), prefixes: ["--transition-"] },
  ];

  const result: ColorGroup[] = [];
  const usedKeys = new Set<string>();

  for (const group of groups) {
    const matched: { key: string; value: string }[] = [];
    for (const [key, value] of Object.entries(variables)) {
      if (group.prefixes.some((p) => key.startsWith(p))) {
        matched.push({ key, value });
        usedKeys.add(key);
      }
    }
    if (matched.length > 0) {
      result.push({ label: group.label, vars: matched });
    }
  }

  const other: { key: string; value: string }[] = [];
  for (const [key, value] of Object.entries(variables)) {
    if (!usedKeys.has(key)) {
      other.push({ key, value });
    }
  }
  if (other.length > 0) {
    result.push({ label: $tFn('themesUtil.groupOther'), vars: other });
  }

  return result;
}
