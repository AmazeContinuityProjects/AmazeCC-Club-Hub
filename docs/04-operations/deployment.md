---
title: "Deployment"
description: "How this static site goes from your laptop to github.io — and what to do when it doesn't."
---

# Deployment

> **In one line:** `pnpm build` writes a folder, GitHub uploads it to Pages, and your URL is live in under four minutes — when the two prerequisites hold.

## The two prerequisites

1. **Pages source = "GitHub Actions"** (Repo Settings → Pages → Build and deployment → Source: GitHub Actions). One-time, in the browser.
2. **`NEXT_PUBLIC_API_URL=https://api.amazecc.com` available at build time.** The committed `.env` says localhost — override it in `nextjs.yml`, or every deployed user hits `localhost:3000` on their own machine (see [Env vars](./env-vars.md)).

## The pipeline

```
push to main
  └─► build job
        ├─ setup-node@v4 (node 22)
        ├─ setup-pnpm@v4 (pnpm 11.24.0)
        ├─ configure-pages@v5     ← injects basePath, disables image optimization
        ├─ pnpm install / pnpm build
        └─ upload-pages-artifact@v3 (path: ./out)
  └─► deploy job
        └─ deploy-pages@v4 → github-pages environment
```

`permissions: pages: write, id-token: write` — the Pages OIDC flow. No personal token lives in the repo. `concurrency: pages` never cancels an in-progress production deploy; it queues.

## What `configure-pages` quietly rewrites

It rewrites `next.config` in memory: **`basePath`** for project-style URLs (`org.github.io/repo/`), **`images.unoptimized`**. Your local `pnpm build` does not see those; your production one does. Asset 404s that look impossible locally? That's why.

## Shipping it

```bash
git checkout main
git pull
# make changes
git push origin main          # triggers the workflow
# watch under Actions tab → "Deploy Next.js site to Pages"
```

`out/index.html` appears in the artifact; the URL renders it. Any non-2xx on `out/index.html` means the build silently broke - run `pnpm build && test -f out/index.html` locally first next time.

## Undoing it

Re-run any older green `nextjs.yml` run from the Actions tab, or revert on `main` and push. Pages flips atomically — there's no half-deployed state users can see.

## If it's broken in prod but works locally

- **asset 404s** → `configure-pages` basePath; check repo name vs Pages URL.
- **everything calls localhost:3000** → see [Env vars](./env-vars.md); fix in `nextjs.yml`.
- **can't log in anywhere** → CORS is fine (`api.amazecc.com` allows all); check you have a valid club token; check the console for 401s.

## Where to next

- **[Env vars](./env-vars.md)**
- **[Security](./security.md)**
