import { addMessages, init, locale, t as svelteT } from 'svelte-i18n';
import { browser } from '$app/environment';
import type { Readable } from 'svelte/store';
import es from './es.json';
import en from './en.json';
import fr from './fr.json';

addMessages('es', es);
addMessages('en', en);
addMessages('fr', fr);

init({
  fallbackLocale: 'es',
  initialLocale: browser ? 'es' : 'es',
});

export const t = svelteT as unknown as Readable<(id: string, options?: Record<string, unknown>) => string>;
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
