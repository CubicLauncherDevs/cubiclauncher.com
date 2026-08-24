import { browser } from "$app/environment";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "theme-mode";

function getSystemIsDark(): boolean {
  if (!browser) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readStoredTheme(): ThemeMode {
  if (!browser) return "system";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    // ignore storage errors
  }
  return "system";
}

function applyThemeClass(mode: ThemeMode) {
  if (!browser) return;

  const resolved = mode === "system" ? (getSystemIsDark() ? "dark" : "light") : mode;
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

function persistTheme(mode: ThemeMode) {
  if (!browser) return;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore storage errors
  }
}

class ThemeStore {
  mode = $state<ThemeMode>("system");
  resolved = $derived<"light" | "dark">(
    this.mode === "system" ? (getSystemIsDark() ? "dark" : "light") : this.mode
  );

  private mediaQuery: MediaQueryList | null = null;
  private cleanupSystemListener: (() => void) | null = null;

  constructor() {
    if (browser) {
      this.mode = readStoredTheme();
      applyThemeClass(this.mode);
      this.setupSystemListener();
    }
  }

  private setupSystemListener() {
    if (!browser) return;
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = () => {
      if (this.mode === "system") {
        applyThemeClass("system");
      }
    };

    this.mediaQuery.addEventListener("change", handler);
    this.cleanupSystemListener = () => this.mediaQuery?.removeEventListener("change", handler);
  }

  set(mode: ThemeMode) {
    this.mode = mode;
    persistTheme(mode);
    applyThemeClass(mode);
  }

  toggle() {
    const next: ThemeMode = this.resolved === "dark" ? "light" : "dark";
    this.set(next);
  }

  dispose() {
    this.cleanupSystemListener?.();
  }
}

export const themeStore = new ThemeStore();
