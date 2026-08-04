import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'lib', 'data');
const STATIC_DIR = join(__dirname, '..', 'static');

const THEMES_URL = 'https://raw.githubusercontent.com/CubicLauncherDevs/Themes/master/themes.json';
const PACKAGES_URL = 'https://raw.githubusercontent.com/CubicLauncherDevs/Themes/master/packages.json';
const BASE_URL = 'https://cubiclauncher.com';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function formatDate(date) {
  if (!date) return undefined;
  try {
    return new Date(date).toISOString();
  } catch {
    return undefined;
  }
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildAuthorIndex(themes) {
  const authors = new Map();
  for (const theme of themes) {
    const slug = slugify(theme.author);
    const existing = authors.get(slug);
    if (existing) {
      existing.count += 1;
      existing.themes.push(theme);
    } else {
      authors.set(slug, {
        name: theme.author,
        slug,
        count: 1,
        themes: [theme]
      });
    }
  }
  return authors;
}

function buildSitemap(themes, packages) {
  const authors = buildAuthorIndex(themes);

  const entries = [
    { loc: '/', priority: 1.0, changefreq: 'weekly' },
    { loc: '/themes', priority: 0.9, changefreq: 'daily' },
    { loc: '/install', priority: 0.8, changefreq: 'weekly' },
    { loc: '/donate', priority: 0.5, changefreq: 'monthly' }
  ];

  for (const theme of themes) {
    entries.push({
      loc: `/themes/${theme.slug}`,
      lastmod: formatDate(theme.date),
      priority: 0.8,
      changefreq: 'weekly'
    });

    for (const version of theme.versions) {
      entries.push({
        loc: `/themes/${theme.slug}/${version.version}`,
        lastmod: formatDate(version.date),
        priority: 0.6,
        changefreq: 'weekly'
      });
    }
  }

  for (const author of authors.values()) {
    entries.push({
      loc: `/themes/author/${author.slug}`,
      lastmod: formatDate(author.themes[0]?.date),
      priority: 0.7,
      changefreq: 'weekly'
    });
  }

  for (const pkg of packages) {
    entries.push({
      loc: `/themes/packs/${pkg.slug}`,
      lastmod: formatDate(pkg.date),
      priority: 0.7,
      changefreq: 'weekly'
    });
  }

  const urlBlocks = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>\n` : '';
      return `  <url>\n    <loc>${escapeXml(BASE_URL + entry.loc)}</loc>\n${lastmod}    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority.toFixed(1)}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlBlocks}\n</urlset>`;
}

async function main() {
  mkdirSync(DATA_DIR, { recursive: true });

  console.log('Fetching themes.json...');
  const themes = await fetchJson(THEMES_URL);
  writeFileSync(join(DATA_DIR, 'themes.json'), JSON.stringify(themes, null, 2));
  console.log(`Saved ${themes.length} themes.`);

  console.log('Fetching packages.json...');
  const packages = await fetchJson(PACKAGES_URL);
  writeFileSync(join(DATA_DIR, 'packages.json'), JSON.stringify(packages, null, 2));
  console.log(`Saved ${packages.length} packages.`);

  console.log('Generating sitemap.xml...');
  const sitemap = buildSitemap(themes, packages);
  writeFileSync(join(STATIC_DIR, 'sitemap.xml'), sitemap);
  console.log(`Generated sitemap with ${sitemap.match(/<url>/g)?.length ?? 0} URLs.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
