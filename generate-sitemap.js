import { statSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
const __dirname = import.meta.dirname;


const BASE_URL = 'https://beginwebdev2002.github.io/best-practise/#/';
const docsDir = join(__dirname, 'docs'); // или '.', если файлы в корне

function getFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  files.forEach(file => {
    if (statSync(join(dir, file)).isDirectory()) {
      getFiles(join(dir, file), fileList);
    } else if (file.endsWith('.md') && !file.startsWith('_')) {
      const urlPath = join(dir, file)
        .replace(__dirname, '')
        .replace(/\\/g, '/')
        .replace('.md', '');
      fileList.push(BASE_URL + urlPath.replace(/^\//, ''));
    }
  });
  return fileList;
}

const urls = getFiles(docsDir);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `<url><loc>${url}</loc><changefreq>weekly</changefreq></url>`).join('\n  ')}
</urlset>`;

writeFileSync('sitemap.xml', sitemap);
console.log('Sitemap generated!');