import { addMessages, init, locale as svelteLocale, t as svelteT } from 'svelte-i18n';
import { browser } from '$app/environment';
import type { Readable } from 'svelte/store';
import es from './es.json';
import en from './en.json';
import fr from './fr.json';
import de from './de.json';

export const SUPPORTED_LOCALES = ['es', 'en', 'fr', 'de'] as const;
export type AppLocale = typeof SUPPORTED_LOCALES[number];

export function isSupportedLocale(value: string): value is AppLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

const dateLocaleMap: Record<AppLocale, string> = {
  es: 'es-ES',
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE'
};

export function getDateLocale(localeCode: string | null | undefined): string {
  return dateLocaleMap[(localeCode ?? 'es') as AppLocale] ?? 'es-ES';
}

type MessageFormatter = (id: string | { id: string; locale?: string; format?: string; default?: string; values?: Record<string, string | number | boolean | Date | null | undefined> }, options?: { locale?: string; format?: string; default?: string; values?: Record<string, string | number | boolean | Date | null | undefined> }) => string;

addMessages('es', es);
addMessages('en', en);
addMessages('fr', fr);
addMessages('de', de);

function detectInitialLocale(): AppLocale {
  if (!browser) return 'es';

  try {
    const stored = localStorage.getItem('locale');
    if (stored && isSupportedLocale(stored)) return stored;

    const nav = navigator.language || 'es';
    const prefix = nav.split('-')[0].toLowerCase();
    if (isSupportedLocale(prefix)) return prefix;
  } catch {
    // ignore storage / navigator errors
  }

  return 'es';
}

init({
  fallbackLocale: 'es',
  initialLocale: detectInitialLocale(),
  warnOnMissingMessages: true
});

export const t = svelteT as Readable<MessageFormatter>;
export { svelteLocale as currentLocale, svelteLocale as locale };

export function setLocale(localeCode: string) {
  if (!isSupportedLocale(localeCode)) return;

  svelteLocale.set(localeCode);
  if (browser) {
    localStorage.setItem('locale', localeCode);
    document.documentElement.lang = localeCode;
  }
}
