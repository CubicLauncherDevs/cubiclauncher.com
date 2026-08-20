import { browser } from "$app/environment";
import { goto } from "$app/navigation";

const STORAGE_KEY = "themes-list-url";

export function saveThemesListUrl(url: string): void {
  if (!browser) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, url);
  } catch {
    // storage unavailable (private mode, etc.) — ignore
  }
}

export function getThemesListUrl(): string {
  if (!browser) return "/themes";
  try {
    return sessionStorage.getItem(STORAGE_KEY) || "/themes";
  } catch {
    return "/themes";
  }
}

export function goToThemesList(event?: { preventDefault: () => void }): void {
  event?.preventDefault();
  goto(getThemesListUrl());
}