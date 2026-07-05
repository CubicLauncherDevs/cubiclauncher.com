import { get } from "svelte/store";
import type { Theme, ColorGroup } from "$lib/types/theme";
import { t } from "$lib/i18n";

const GITHUB_OWNER = "cubiclauncherdevs";
const GITHUB_REPO = "Themes";
const GITHUB_BRANCH = "master";
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
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

const CACHE_VERSION = 2;
const CACHE_KEY = `cubiclauncher-themes-v${CACHE_VERSION}`;

export function getCachedThemes(): Theme[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as Theme[];
      if (Array.isArray(data) && data.length > 0 && data[0].slug && data[0].versions) {
        return data;
      }
    }
  } catch {
    /* empty */
  }
  return null;
}

export function setCachedThemes(themes: Theme[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(themes));
  } catch {
    /* empty */
  }
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
