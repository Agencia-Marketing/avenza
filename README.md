# Avenza Financial Consulting

Sitio web bilingüe (ES/EN) + blog, construido con **Astro** y desplegado en **Cloudflare
Workers** (static assets). El copy y el diseño provienen del sitio original de una sola
página (ver `_legacy/`), migrado a una estructura mantenible con blog editable vía CMS.

## Stack

- **Astro 5** (estático, i18n con rutas `/es` y `/en`)
- **@astrojs/cloudflare** → Cloudflare Workers + Static Assets
- **Blog** en Markdown (content collections), editable con **Sveltia CMS** (`/admin`)
- **Formulario de contacto** → endpoint `/api/contact` → **Resend**

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo Astro (http://localhost:4321)
npm run build      # genera ./dist (Worker + assets)
npm run preview    # ejecuta el build con wrangler dev (Worker local)
```

Rutas: `/` redirige a `/es/`. Páginas: `/es|en/`, `/nosotros`, `/servicios`, `/recursos`,
`/contacto`. Recursos incluye el listado y detalle del blog: `/es|en/recursos` y
`/es|en/recursos/<slug>`.

## Contenido

- **Textos UI**: `src/i18n/es.json` y `en.json` (migrados del sitio original).
- **Datos de negocio** (email, teléfono, redes, URL de Calendly): `src/config.ts`.
- **Posts del blog**: `src/content/blog/es/*.md` y `en/*.md`.

## Pendientes de configuración (placeholders a reemplazar)

| Qué | Dónde |
|-----|-------|
| URL real de Calendly | `src/config.ts` → `calendlyUrl` |
| Email / WhatsApp / redes reales | `src/config.ts` |
| Dominio de producción | `astro.config.mjs` → `site` |
| Repo GitHub + OAuth del CMS | `public/admin/config.yml` + `public/admin/README.md` |

## Deploy (Cloudflare Workers)

1. Crear repo en GitHub y hacer push.
2. Configurar el secret de Resend:
   ```bash
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put CONTACT_TO      # opcional: inbox destino
   npx wrangler secret put CONTACT_FROM    # opcional: remitente en dominio verificado en Resend
   ```
3. Deploy manual: `npm run deploy` — o conectar **Workers Builds** al repo (build:
   `npm run build`) para deploy automático en cada push.
4. Configurar dominio custom en el dashboard de Cloudflare.

## CMS del blog

El editor vive en `/admin` (Sveltia CMS). Requiere una GitHub OAuth App + el Worker
`sveltia-cms-auth`. Instrucciones paso a paso en `public/admin/README.md`.
