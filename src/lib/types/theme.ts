export interface Theme {
  id: string;
  name: string;
  author: string;
  previewUrl: string;
  zipUrl: string;
  zipName: string;
  themeJsonUrl: string;
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

export interface GitHubTreeItem {
  path: string;
  type: "blob" | "tree";
  url: string;
}
