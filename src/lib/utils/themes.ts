import { get } from "svelte/store";
import type { Theme, ColorGroup } from "$lib/types/theme";
import { t } from "$lib/i18n";

const GITHUB_OWNER = "CubicLauncherDevs";
const GITHUB_REPO = "Themes";
const GITHUB_BRANCH = "master";
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/refs/heads/${GITHUB_BRANCH}`;
const THEMES_JSON_URL = `${RAW_BASE}/themes.json`;

export function rawUrl(path: string): string {
  const segments = path.split("/").map((s) => encodeURIComponent(s));
  return `${RAW_BASE}/${segments.join("/")}`;
}

export async function fetchAllThemes(): Promise<Theme[]> {
  const url = `${THEMES_JSON_URL}?_=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(get(t)('themesUtil.fetchError', { values: { status: res.status } }));
  return await res.json() as Theme[];
}

export { getCachedThemes, setCachedThemes } from "./theme-cache";

/** Build a raw GitHub URL for a file inside a theme version directory */
export function versionFileUrl(version: { dirPath: string }, fileName: string): string {
  return rawUrl(`${version.dirPath}/${fileName}`);
}

/** Get download-able files for a version (handles both old string[] and new {name,url}[] format) */
export function getVersionDownloadFiles(version: { files: (string | { name: string; url: string })[] }): { name: string; url: string }[] {
  return version.files.map((f) => {
    if (typeof f === "string") {
      const url = rawUrl(`${version.dirPath}/${f}`);
      (version as any).dirPath; // kept for type compat
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
