export const CHANGELOG_REPOSITORY = "CubicLauncherDevs/CubicLauncher";
export const RELEASES_URL = `https://github.com/${CHANGELOG_REPOSITORY}/releases`;
export const CHANGELOG_FEED_PATH = "/api/v1/changelogs.json";

/**
 * @typedef {object} LauncherRelease
 * @property {number} id
 * @property {string} tag
 * @property {string} name
 * @property {string} body Original release notes, in Markdown.
 * @property {string} publishedAt
 * @property {string} updatedAt
 * @property {boolean} prerelease
 * @property {string} htmlUrl
 */

/**
 * @typedef {object} ChangelogFeed
 * @property {1} schemaVersion
 * @property {string} repository
 * @property {string} source
 * @property {string} generatedAt Time this snapshot's content was generated.
 * @property {"markdown"} notesFormat
 * @property {LauncherRelease[]} releases Newest publication first.
 */

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** @param {unknown} value @returns {value is string} */
function isDate(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

/** @param {unknown} data @returns {data is ChangelogFeed} */
export function isChangelogFeed(data) {
  if (!isObject(data) || data.schemaVersion !== 1 || data.repository !== CHANGELOG_REPOSITORY ||
    data.source !== RELEASES_URL || data.notesFormat !== "markdown" || !isDate(data.generatedAt) ||
    !Array.isArray(data.releases)) return false;

  const ids = new Set();
  let previousDate = Infinity;
  for (const release of data.releases) {
    if (!isObject(release) || typeof release.id !== "number" || !Number.isSafeInteger(release.id) ||
      release.id <= 0 || ids.has(release.id) || typeof release.tag !== "string" || !release.tag.trim() ||
      typeof release.name !== "string" || typeof release.body !== "string" ||
      !isDate(release.publishedAt) || !isDate(release.updatedAt) || typeof release.prerelease !== "boolean" ||
      release.htmlUrl !== `${RELEASES_URL}/tag/${encodeURIComponent(release.tag)}`) return false;
    const published = Date.parse(release.publishedAt);
    if (published > previousDate) return false;
    previousDate = published;
    ids.add(release.id);
  }
  return true;
}
