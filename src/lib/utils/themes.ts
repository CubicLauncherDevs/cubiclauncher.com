import type { Theme, ColorGroup, GitHubTreeItem } from "$lib/types/theme";

const GITHUB_OWNER = "CubicLauncher";
const GITHUB_REPO = "Themes";
const GITHUB_BRANCH = "main";
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const API_TREE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`;

export function parseThemeDirName(dirName: string): { name: string; author: string } {
  const idx = dirName.lastIndexOf(":");
  if (idx === -1) return { name: dirName, author: "Desconocido" };
  return { name: dirName.substring(0, idx), author: dirName.substring(idx + 1) };
}

export function isPreviewFile(name: string): boolean {
  const lower = name.toLowerCase();
  return /\.(png|jpg|jpeg|gif|webp)$/.test(lower) && !lower.endsWith(".zip");
}

export function rawUrl(path: string): string {
  const segments = path.split("/").map((s) => encodeURIComponent(s));
  return `${RAW_BASE}/${segments.join("/")}`;
}

export async function fetchThemeTree(): Promise<GitHubTreeItem[]> {
  const res = await fetch(API_TREE_URL);
  if (!res.ok) throw new Error(`Error al obtener temas (${res.status})`);
  const data = await res.json();
  return data.tree as GitHubTreeItem[];
}

export function buildThemesFromTree(tree: GitHubTreeItem[]): Theme[] {
  const themes: Theme[] = [];
  const dirs = tree.filter((item) => item.type === "tree");
  const files = tree.filter((item) => item.type === "blob");

  for (const dir of dirs) {
    const prefix = dir.path + "/";
    const children = files.filter((f) => {
      if (!f.path.startsWith(prefix)) return false;
      const relative = f.path.substring(prefix.length);
      return relative.length > 0 && !relative.includes("/");
    });
    const zip = children.find((f) => f.path.toLowerCase().endsWith(".zip"));
    const preview = children.find((f) => isPreviewFile(f.path));

    if (!zip) continue;

    const { name, author } = parseThemeDirName(dir.path);
    themes.push({
      id: dir.path,
      name,
      author,
      previewUrl: preview ? rawUrl(preview.path) : "",
      zipUrl: rawUrl(zip.path),
      zipName: zip.path.split("/").pop() || "",
      themeJsonUrl: rawUrl(`${dir.path}/theme.json`),
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

export function categorizeVariables(
  variables: Record<string, string>
): ColorGroup[] {
  const groups: { label: string; prefixes: string[] }[] = [
    { label: "Fondo", prefixes: ["--bg-"] },
    { label: "Texto", prefixes: ["--text-"] },
    { label: "Acento", prefixes: ["--accent"] },
    { label: "Bordes y Sombras", prefixes: ["--border-", "--shadow-", "--glow-"] },
    { label: "Estado", prefixes: ["--color-"] },
    { label: "Scrollbar", prefixes: ["--scrollbar-"] },
    { label: "Tipografía", prefixes: ["--font-", "--font-size-"] },
    { label: "Iconos", prefixes: ["--icon-"] },
    { label: "Transiciones", prefixes: ["--transition-"] },
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
    result.push({ label: "Otras", vars: other });
  }

  return result;
}
