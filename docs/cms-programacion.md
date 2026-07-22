# Guia tecnica: Sveltia CMS para Avenza

Esta guia es para el equipo de programacion. Cubre la configuracion del CMS, OAuth, permisos de GitHub, despliegue y diagnostico de errores comunes.

## Resumen

El sitio usa Sveltia CMS en `/admin` para editar el blog. El CMS guarda cambios directamente en el repositorio de GitHub:

- Repositorio: `Agencia-Marketing/avenza`
- Rama: `main`
- Admin: `https://avenzafinancial.com/admin`
- Worker OAuth: `https://sveltia-cms-auth.joshy212yes.workers.dev`
- Archivos de articulos:
  - Espanol: `src/content/blog/es/*.md`
  - Ingles: `src/content/blog/en/*.md`
- Imagenes subidas desde el CMS: `public/blog-images`
- Los articulos se publican en el sitio bajo `/es|en/recursos/<slug>` (la seccion de blog vive dentro de Recursos).

Cada guardado del CMS crea un commit en GitHub. El pipeline/deploy conectado al repo debe reconstruir el sitio.

## Configuracion del CMS

Archivo principal:

```txt
public/admin/config.yml
```

Backend esperado:

```yaml
backend:
  name: github
  repo: Agencia-Marketing/avenza
  branch: main
  base_url: https://sveltia-cms-auth.joshy212yes.workers.dev
  auth_methods: [oauth]
```

Notas:

- `base_url` debe apuntar al Worker OAuth desplegado en Cloudflare.
- `auth_methods: [oauth]` fuerza el flujo "Sign In with GitHub" y oculta el login por token.
- Para campos `image`, Sveltia CMS usa `multiple: false`; no usar `allow_multiple`.

## Worker OAuth

El Worker usado por el CMS es `sveltia-cms-auth`.

Repositorio oficial:

```txt
https://github.com/sveltia/sveltia-cms-auth
```

Variables requeridas en Cloudflare Workers:

```txt
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

Variable recomendada:

```txt
ALLOWED_DOMAINS=avenzafinancial.com, www.avenzafinancial.com
```

Si el dominio final cambia, actualizar `ALLOWED_DOMAINS` en Cloudflare y verificar que el CMS siga entrando correctamente.

## GitHub OAuth App

La OAuth App debe tener:

```txt
Application name: Avenza CMS
Homepage URL: https://avenzafinancial.com
Authorization callback URL: https://sveltia-cms-auth.joshy212yes.workers.dev/callback
```

El `Authorization callback URL` debe coincidir exactamente con la URL del Worker + `/callback`.

## Permisos de la organizacion

La organizacion `Agencia-Marketing` tiene restringido el acceso de apps OAuth de terceros. Si el CMS permite iniciar sesion pero falla al guardar, revisar:

```txt
https://github.com/organizations/Agencia-Marketing/settings/oauth_application_policy
```

El error tipico es:

```txt
Although you appear to have the correct authorization credentials, the `Agencia-Marketing` organization has enabled OAuth App access restrictions...
```

Solucion recomendada:

1. Entrar como owner de la organizacion.
2. Ir a `Settings` > `Third-party application access policy`.
3. Revisar si aparece una solicitud pendiente para `Avenza CMS`.
4. Aprobarla con `Review` > `Grant access`.
5. Si no aparece, volver a iniciar sesion en `/admin` e intentar guardar para generar la solicitud.

Alternativa menos estricta: usar `Remove restrictions`. No es lo recomendado porque permite mas apps OAuth sin aprobacion individual.

## Acceso para cliente

El cliente debe tener cuenta GitHub con acceso de escritura al repositorio:

```txt
Agencia-Marketing/avenza
```

Permiso minimo recomendado:

```txt
Write
```

No entregar tokens personales al cliente. El flujo correcto es OAuth con GitHub.

## Validacion despues de cambios

Antes de subir cambios de configuracion:

```bash
npm run build
```

Luego:

```bash
git add public/admin/config.yml
git commit -m "Configure Sveltia CMS"
git push origin main
```

Despues del deploy:

1. Entrar a `https://avenzafinancial.com/admin`.
2. Iniciar sesion con GitHub.
3. Crear o editar un articulo de prueba.
4. Guardar.
5. Confirmar que se creo un commit en GitHub.
6. Confirmar que el sitio se redesplego.

## Troubleshooting

### Se ve "Sign In Using Access Token"

Revisar que `auth_methods: [oauth]` este en `public/admin/config.yml` y que el sitio ya tenga el ultimo deploy.

### El login funciona, pero guardar falla

Revisar la politica OAuth de la organizacion y aprobar `Avenza CMS`.

### GitHub muestra "No pending requests"

Volver a entrar al CMS, autorizar la app y hacer un intento de guardado. Luego revisar de nuevo la politica OAuth de la organizacion.

### Error de callback o pantalla de OAuth incorrecta

Verificar que el callback configurado en GitHub sea exactamente:

```txt
https://sveltia-cms-auth.joshy212yes.workers.dev/callback
```

### El CMS no carga o queda en blanco

Revisar:

- Que `/admin/index.html` cargue Sveltia CMS correctamente.
- Que Cloudflare no este rompiendo el script con optimizaciones como Rocket Loader.
- Que el deploy del sitio incluya `public/admin/config.yml`.

## Referencias

- Sveltia CMS GitHub backend: `https://sveltiacms.app/en/docs/backends/github`
- Sveltia CMS Authenticator: `https://github.com/sveltia/sveltia-cms-auth`
- GitHub OAuth app restrictions: `https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/about-oauth-app-access-restrictions`
