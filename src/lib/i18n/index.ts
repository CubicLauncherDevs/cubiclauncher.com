import { addMessages, init, locale, t as svelteT } from 'svelte-i18n';
import { browser } from '$app/environment';
import type { Readable } from 'svelte/store';
import es from './es.json';
import en from './en.json';
import fr from './fr.json';
import de from './de.json';

type MessageFormatter = (id: string | { id: string; locale?: string; format?: string; default?: string; values?: Record<string, string | number | boolean | Date | null | undefined> }, options?: { locale?: string; format?: string; default?: string; values?: Record<string, string | number | boolean | Date | null | undefined> }) => string;

addMessages('es', es);
addMessages('en', en);
addMessages('fr', fr);
addMessages('de', de);

init({
  fallbackLocale: 'es',
  initialLocale: browser ? 'es' : 'es',
});

export const t = svelteT as Readable<MessageFormatter>;
export { locale as currentLocale, locale };

export function setLocale(localeCode: string) {
  locale.set(localeCode);
  if (browser) {
    localStorage.setItem('locale', localeCode);
    document.documentElement.lang = localeCode;
  }
}

export function initLocale(clientLocale?: string) {
  if (browser) {
    const stored = localStorage.getItem('locale');
    const detected = clientLocale || stored || (navigator.language.startsWith('en') ? 'en' : 'es');
    locale.set(detected);
    document.documentElement.lang = detected;
  }
}
