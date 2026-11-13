---
title: "Deployment"
description: "How the static export reaches GitHub Pages, what configure-pages does to your build, and the checklist for a working prod URL."
---

# Deployment

> **In one line:** every push to `main` builds the static export and uploads it to GitHub Pages under the `github-pages` environment.

## The pipeline (`nextjs.yml`)

```
push to main
  └─► build job
        ├─ actions/setup-node@v4   (Node 22)
        ├─ actions/setup-pnpm@v4   (pnpm 11.24.0)
        ├─ actions/configure-pages@v5  ← the magic step
        │     • injects basePath for project Pages URLs
        │     • disables next/image optimization
        ├─ pnpm install / pnpm build
        └─ actions/upload-pages-artifact@v3 (path: ./out)
  └─► deploy job
        └─ actions/deploy-pages@v4 → github-pages environment
```

`permissions: pages: write, id-token: write` — the Pages OIDC flow deploys without a personal token. The `concurrency` group never cancels an in-progress production deploy (`cancel-in-progress: false`) — builds queue instead.

## What `configure-pages` changes about *your* build

It rewrites `next.config` in-memory during CI: **`basePath`** for project sites (`<org>.github.io/<repo>/`) and `images.unoptimized`. Your local `pnpm build` does NOT get those — local is always served from `/`. Expect asset URLs to be prefixed in production and not locally.

## The checklist for a working production deploy

1. **`NEXT_PUBLIC_API_URL=https://api.amazecc.com` must be in the Pages build.** The committed `.env` bakes `http://localhost:3000` otherwise (see [env vars](./env-vars.md)). Two clean fixes:
   - set it in `nextjs.yml` as `env:` on the Build step: `NEXT_PUBLIC_API_URL: https://api.amazecc.com`, **or**
   - delete the committed `.env` (the code already falls back to production).
2. **The repo must have Pages enabled** with source = "GitHub Actions" (`Settings → Pages`).
3. **The `github-pages` environment exists** (created automatically on first deploy).
4. **`public/manifest.json`** must reference icons that exist in `public/` (it does: `/logo.png`).

If the site loads but every API call fails: it's (1). If the site itself 404s: it's (2/3). If the site works but the app can't log in: CORS is fine (`api.amazecc.com` allows all origins), so check the token expiry and console.

## Rollback

Redeploy an older successful run from the Actions tab (`Re-run jobs` on any older green `nextjs.yml` run on `main`), or revert the offending commit on `main` and push — the workflow rebuilds and Pages flips atomically.

## Where to next

- **[CI](./ci.md)**
- **[Env vars](./env-vars.md)**
