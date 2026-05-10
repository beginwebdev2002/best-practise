import { statSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'node:url';

const __dirname = import.meta.dirname;

const BASE_URL = 'https://beginwebdev2002.github.io/best-practise/';
const ROOT_DIR = __dirname;

const SCAN_DIRS = ['docs', 'architectures', 'frontend', 'backend', 'benchmarks'];

const EXCLUDE_PATTERNS = [
  /^_/,
  /^readme\.md$/i,
  /node_modules/,
  /\.git/,
];

export function shouldExclude(filePath) {
  const basename = filePath.split(/[\\/]/).pop();
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(basename));
}

export function getLastMod(filePath) {
  try {
    return statSync(filePath).mtime.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export function getPriority(urlPath) {
  const segments = urlPath.split('/').filter(Boolean).length;
  if (segments <= 1) return '1.0';
  if (segments === 2) return '0.8';
  return '0.6';
}

export function getFiles(dir, fileList = []) {
  if (!statSync(dir).isDirectory()) return fileList;
  const files = readdirSync(dir);
  files.forEach(file => {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (shouldExclude(fullPath)) return;
    if (stat.isDirectory()) {
      getFiles(fullPath, fileList);
    } else if (file.endsWith('.md')) {
      const relativePath = fullPath
        .replace(ROOT_DIR, '')
        .replace(/\\/g, '/')
        .replace(/^\//, '')
        .replace(/\.md$/, '');
      fileList.push({
        url: `${BASE_URL}#/${relativePath}`,
        lastmod: getLastMod(fullPath),
        priority: getPriority(relativePath),
      });
    }
  });
  return fileList;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    const today = new Date().toISOString().split('T')[0];
    const entries = [
      { url: BASE_URL, lastmod: today, priority: '1.0', changefreq: 'daily' },
    ];

    for (const dir of SCAN_DIRS) {
      const fullDir = join(ROOT_DIR, dir);
      try {
        getFiles(fullDir, entries);
      } catch {
        console.warn(`Skipping ${dir} — directory not found`);
      }
    }

    const urlsXml = entries
      .map(
        ({ url, lastmod, priority, changefreq = 'weekly' }) =>
          `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
      )
      .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlsXml}
</urlset>`;

    writeFileSync('sitemap.xml', sitemap, 'utf-8');
    console.log(`✅ Sitemap generated with ${entries.length} URLs → sitemap.xml`);
}
