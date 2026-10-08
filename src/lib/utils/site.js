export const SITE_ORIGIN = 'https://www.cubiclauncher.org';

/** Build a canonical URL from a route pathname, independent of the current host. @param {string} pathname */
export function getCanonicalUrl(pathname) {
  return SITE_ORIGIN + pathname;
}
