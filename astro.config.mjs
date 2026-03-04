import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import remarkBreaks from 'remark-breaks';

export default defineConfig({
  site: 'https://ericwu.blog',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkBreaks],
  },
});
