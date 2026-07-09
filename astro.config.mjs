// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Update `site` to the real production domain when available (used for canonical URLs / OG tags).
export default defineConfig({
  site: 'https://avenzafinancial.com',
  output: 'static',
  adapter: cloudflare({ imageService: 'passthrough' }),
  // Root path redirects to the default locale. Individual locales live under /es and /en.
  redirects: {
    '/': '/es/',
  },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
