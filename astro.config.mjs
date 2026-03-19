import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import remarkBreaks from 'remark-breaks';
import fs from 'node:fs';
import path from 'node:path';

// Build a map of post URLs to their lastmod dates for sitemap
function buildPostDateMap() {
  const postsDir = path.resolve('./src/content/posts');
  const map = new Map();

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const match = content.match(/date:\s*(\d{4}-\d{2}-\d{2})/);
        if (match) {
          const slug = path.relative(postsDir, fullPath).replace(/\.md$/, '');
          map.set(`https://ericwu.co/posts/${slug}/`, new Date(match[1]));
        }
      }
    }
  }

  walk(postsDir);
  return map;
}

const postDates = buildPostDateMap();

export default defineConfig({
  site: 'https://ericwu.co',
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      serialize(item) {
        const date = postDates.get(item.url);
        if (date) {
          item.lastmod = date;
        }
        return item;
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkBreaks],
  },
});
