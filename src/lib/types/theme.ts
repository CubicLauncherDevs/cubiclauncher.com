export interface ThemeVersion {
  version: string;
  previewUrl: string | null;
  showcaseUrl: string | null;
  dirPath: string;
  date?: string | null;
  changelog?: string | null;
  files: { name: string; url: string }[];
  injectsCss: boolean;
}

export interface Theme {
  id: string;
  slug: string;
  name: string;
  author: string;
  tags: string[];
  dirPath: string;
  description?: string | null;
  versions: ThemeVersion[];
  latestVersion: string;
  previewUrl: string | null;
  date?: string | null;
}

export interface ThemeJson {
  $schema?: string;
  name: string;
  author?: string;
  type?: "builtin" | "user";
  font?: string;
  bg_image?: string;
  bg_image_blur?: string;
  bg_image_opacity?: number;
  variables: Record<string, string>;
}

export interface ColorGroup {
  label: string;
  vars: { key: string; value: string }[];
}

export interface AuthorEntry {
  name: string;
  slug: string;
  count: number;
  themes: Theme[];
}

export interface SearchIndex {
  byWord: Map<string, Set<string>>;
  byId: Map<string, Theme>;
}

export interface ThemePackage {
  id: string;
  slug: string;
  name: string;
  author: string;
  description?: string | null;
  previewUrl: string;
  date?: string;
  themes: string[];
}

export interface ResolvedThemePackage extends ThemePackage {
  resolvedThemes: Theme[];
  missingThemes: string[];
}
