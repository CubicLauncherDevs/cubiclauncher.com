import type { Theme, ThemePackage } from "$lib/types/theme";

const DB_NAME = "cubiclauncher-themes";
const DB_VERSION = 2;
const STORE_NAME = "themes";
const KEY_THEMES = "themes";
const KEY_TIMESTAMP = "themes-timestamp";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

async function getItem<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db.close();
        resolve((request.result as T) ?? null);
      };

      tx.onabort = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch {
    return null;
  }
}

async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db.close();
        resolve();
      };

      tx.onabort = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch {
    // silent
  }
}

// Legacy localStorage fallback for environments without IndexedDB
const LEGACY_CACHE_VERSION = 3;
const LEGACY_CACHE_KEY = `cubiclauncher-themes-v${LEGACY_CACHE_VERSION}`;

export function getLegacyCachedThemes(): Theme[] | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(LEGACY_CACHE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as Theme[];
      if (Array.isArray(data) && data.length > 0 && data[0].slug && data[0].versions) {
        return data;
      }
    }
  } catch {
    /* empty */
  }
  return null;
}

export function setLegacyCachedThemes(themes: Theme[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(LEGACY_CACHE_KEY, JSON.stringify(themes));
  } catch {
    /* empty */
  }
}

export async function getCachedThemes(): Promise<Theme[] | null> {
  const fromIDB = await getItem<Theme[]>(KEY_THEMES);
  if (fromIDB) return fromIDB;

  const fromLegacy = getLegacyCachedThemes();
  if (fromLegacy) {
    // Migrate to IndexedDB in background
    void setItem(KEY_THEMES, fromLegacy);
    return fromLegacy;
  }

  return null;
}

export async function setCachedThemes(themes: Theme[]) {
  await setItem(KEY_THEMES, themes);
  await setItem(KEY_TIMESTAMP, Date.now());
  setLegacyCachedThemes(themes);
}

export async function getCachedTimestamp(): Promise<number | null> {
  return getItem<number>(KEY_TIMESTAMP);
}

const KEY_PACKAGES = "packages";
const KEY_PACKAGES_TIMESTAMP = "packages-timestamp";

export async function getCachedPackages(): Promise<ThemePackage[] | null> {
  return getItem<ThemePackage[]>(KEY_PACKAGES);
}

export async function setCachedPackages(packages: ThemePackage[]) {
  await setItem(KEY_PACKAGES, packages);
  await setItem(KEY_PACKAGES_TIMESTAMP, Date.now());
}
