import { get } from "svelte/store";
import type { Theme, ThemeCommitInfo, ColorGroup, GitHubTreeItem } from "$lib/types/theme";
import { t } from "$lib/i18n";

const GITHUB_OWNER = "CubicLauncherDevs";
const GITHUB_REPO = "Themes";
const GITHUB_BRANCH = "master";
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const API_TREE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`;
const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

export function parseThemeDirName(dirName: string): { name: string; author: string } {
  const idx = dirName.lastIndexOf(":");
  if (idx === -1) return { name: dirName, author: get(t)('themesUtil.unknownAuthor') };
  return { name: dirName.substring(0, idx), author: dirName.substring(idx + 1) };
}

export function rawUrl(path: string): string {
  const segments = path.split("/").map((s) => encodeURIComponent(s));
  return `${RAW_BASE}/${segments.join("/")}`;
}

export async function fetchThemeTree(): Promise<GitHubTreeItem[]> {
  const res = await fetch(API_TREE_URL);
  if (!res.ok) throw new Error(get(t)('themesUtil.fetchError', { status: res.status }));
  const data = await res.json();
  return data.tree as GitHubTreeItem[];
}

export function buildThemesFromTree(tree: GitHubTreeItem[]): Theme[] {
  const themes: Theme[] = [];
  const themeDirs = tree.filter(
    (item) => item.type === "tree" && item.path.startsWith("src/") && item.path.split("/").length === 3
  );
  const files = tree.filter((item) => item.type === "blob");

  for (const dir of themeDirs) {
    const prefix = dir.path + "/";
    const children = files.filter((f) => {
      if (!f.path.startsWith(prefix)) return false;
      const relative = f.path.substring(prefix.length);
      return relative.length > 0 && !relative.includes("/");
    });
    const zip = children.find((f) => f.path.toLowerCase().endsWith(".zip"));
    const preview = children.find((f) => {
      const name = f.path.split("/").pop() || "";
      return name.toLowerCase() === "showcase.png";
    });

    if (!zip) continue;

    const dirName = dir.path.split("/").pop() || "";
    const { name, author } = parseThemeDirName(dirName);
    const zipName = zip.path.split("/").pop() || "";
    const id = zipName.replace(/\.zip$/i, "");

    themes.push({
      id,
      name,
      author,
      previewUrl: preview ? rawUrl(preview.path) : "",
      zipUrl: rawUrl(zip.path),
      zipName,
      dirPath: dir.path,
    });
  }

  return themes;
}

const CACHE_KEY = "cubiclauncher-themes";

export function getCachedThemes(): Theme[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
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

export async function fetchAllThemes(): Promise<Theme[]> {
  const tree = await fetchThemeTree();
  let themes = buildThemesFromTree(tree);

  try {
    const results = await Promise.allSettled(
      themes.map((t) =>
        t.dirPath ? fetchThemeCommitInfo(t.dirPath) : Promise.resolve(null)
      )
    );
    themes = themes.map((t, i) => {
      const info = results[i].status === "fulfilled" ? results[i].value : null;
      if (info?.date) {
        return { ...t, date: info.date };
      }
      return t;
    });
  } catch {
    /* silent */
  }

  return themes;
}

export async function fetchThemeCommitInfo(dirPath: string): Promise<ThemeCommitInfo | null> {
  try {
    const encodedPath = dirPath.split("/").map((s) => encodeURIComponent(s)).join("/");
    const url = `${API_BASE}/commits?sha=${GITHUB_BRANCH}&path=${encodedPath}&per_page=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const c = data[0].commit;
    return {
      date: c.author?.date || c.committer?.date || "",
      committer: c.author?.name || c.committer?.name || data[0].author?.login || data[0].committer?.login || "",
    };
  } catch {
    return null;
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
