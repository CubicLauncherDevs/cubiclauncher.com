import type { Theme, ThemeVersion } from "$lib/types/theme";

export interface ThemeInheritance {
  extendsId: string;
  baseTheme: Theme | null;
}

export function findThemeByCatalogId(themes: Theme[], id: string): Theme | null {
  const needle = id.trim().toLowerCase();
  if (!needle) return null;
  return (
    themes.find(
      (theme) =>
        theme.id?.toLowerCase() === needle || theme.slug?.toLowerCase() === needle
    ) ?? null
  );
}

export function getThemeInheritance(
  version: Pick<ThemeVersion, "extends" | "extendsTheme"> | null | undefined,
  themes: Theme[]
): ThemeInheritance | null {
  const extendsId = typeof version?.extends === "string" ? version.extends.trim() : "";
  if (!extendsId) return null;

  const extendsTheme =
    typeof version?.extendsTheme === "string" ? version.extendsTheme.trim() : "";
  const baseTheme = extendsTheme ? findThemeByCatalogId(themes, extendsTheme) : null;

  return { extendsId, baseTheme };
}
