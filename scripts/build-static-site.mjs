import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const outputDir = join(root, 'dist', 'site');

const entries = [
  'assets',
  'components',
  'css',
  'data',
  'docs',
  'js',
  'pages',
  'public',
  'about.html',
  'ads.txt',
  'artikel1.html',
  'artikel2.html',
  'artikel3.html',
  'blogs.html',
  'contact.html',
  'disclaimer.html',
  'eraser.html',
  'index.html',
  'manifest.json',
  'offline.html',
  'penjernih.html',
  'privacy-policy.html',
  'removebg.html',
  'robots.txt',
  'sitemap.xml',
  'sw.js',
  'terms.html'
];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const entry of entries) {
  const source = join(root, entry);
  if (!(await exists(source))) continue;
  await cp(source, join(outputDir, entry), { recursive: true });
}

console.log(`Static site built at ${outputDir}`);
