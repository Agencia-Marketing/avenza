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
    '/es/blog': '/es/recursos',
    '/en/blog': '/en/recursos',
    '/es/blog/llc-vs-s-corp': '/es/recursos/llc-vs-s-corp',
    '/es/blog/organiza-tus-finanzas': '/es/recursos/organiza-tus-finanzas',
    '/es/blog/prueba-de-blog': '/es/recursos/prueba-de-blog',
    '/en/blog/llc-vs-s-corp': '/en/recursos/llc-vs-s-corp',
    '/en/blog/organize-your-finances': '/en/recursos/organize-your-finances',
  },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
