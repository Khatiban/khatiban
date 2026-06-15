import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths so the build works at any URL — GitHub Pages
  // (served from /<repo-name>/), Vercel, Netlify, Cloudflare Pages, etc.
  base: './',
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
