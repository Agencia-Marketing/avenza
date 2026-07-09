# Avenza CMS (Sveltia) — one-time setup

The blog editor lives at `/admin`. It commits Markdown to GitHub; Workers Builds then
redeploys the site automatically. To make login work you need a GitHub OAuth backend.

## 1. Create a GitHub OAuth App

GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App:

- **Application name:** Avenza CMS
- **Homepage URL:** `https://avenzafinancial.com`
- **Authorization callback URL:** `https://avenza-cms-auth.<your-subdomain>.workers.dev/callback`

Save the **Client ID** and generate a **Client Secret**.

## 2. Deploy the OAuth Worker (`sveltia-cms-auth`)

```bash
git clone https://github.com/sveltia/sveltia-cms-auth
cd sveltia-cms-auth
npx wrangler deploy
# then set the secrets:
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
# optional: restrict to your domain
npx wrangler secret put ALLOWED_DOMAINS   # e.g. avenzafinancial.com
```

Note the deployed Worker URL (e.g. `https://avenza-cms-auth.<subdomain>.workers.dev`).

## 3. Point the CMS at it

Edit `public/admin/config.yml`:

- `backend.repo` → `your-github-owner/avenza`
- `backend.base_url` → the OAuth Worker URL from step 2

Commit and push. Visit `https://avenzafinancial.com/admin`, click **Login with GitHub**,
and start publishing. New posts appear under `src/content/blog/es` or `/en`.
