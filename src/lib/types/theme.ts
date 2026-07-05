export interface ThemeVersion {
  version: string;
  previewUrl: string;
  zipUrl: string;
  zipName: string;
  dirPath: string;
  date?: string;
  changelog?: string | null;
}

export interface Theme {
  id: string;
  slug: string;
  name: string;
  author: string;
  dirPath: string;
  description?: string | null;
  versions: ThemeVersion[];
  latestVersion: string;
  previewUrl: string;
  zipUrl: string;
  zipName: string;
  date?: string;
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
