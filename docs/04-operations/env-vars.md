---
title: "Env vars"
description: "Every env var this app reads, what the committed .env does to your build, and the dev-convenience keys."
---

# Env vars

> **In one line:** one committed var, two dev conveniences, zero secrets - and a production build that needs `NEXT_PUBLIC_API_URL` set to work at all.

## The table

| Var | Read by | Effect when set | Effect when unset |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `src/lib/api.ts` → every request | **baked into the bundle at build time** | falls back to `https://api.amazecc.com` |
| `NEXT_PUBLIC_VTOP_USERNAME` | `LoginPage.tsx` | pre-fills the login input (uppercase, dev convenience) | field starts empty |
| `NEXT_PUBLIC_VTOP_PASSWORD` | `LoginPage.tsx` | pre-fills the password input | field starts empty |

## The committed `.env`

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

This is **committed on purpose** so a fresh clone runs against a local AmazeCC-API without any setup. The consequences:

<Warning>
**A production build made from this repo without overriding the var will bake
`http://localhost:3000` into the JS bundle** — every API call from the deployed
site hits the visitor's own machine. GitHub Pages CI does NOT inject
`NEXT_PUBLIC_API_URL`, so the deployed site **cannot work correctly until either
the committed `.env` is removed/changed or CI supplies the production value.**
If you are preparing the Pages deploy, fix this first (prefer: set
`NEXT_PUBLIC_API_URL=https://api.amazecc.com` in `nextjs.yml`'s build env, or
write an `.env.production`), or every visitor gets a dead app.
</Warning>

## Changing it the right way

```bash
# local dev, pointing at prod (careful — real data, real auth)
NEXT_PUBLIC_API_URL=https://api.amazecc.com pnpm dev

# local dev, pointing at local API (default — run AmazeCC-API on :3000)
pnpm dev
```

**Editing `.env` and committing it is wrong.** Overriding in your shell is fine. The fix that sticks is in CI (see [deployment](./deployment.md)).

## `.env` in git, recap

- No secrets in it. It cannot hold anything sensitive — it's public, baked into the client bundle for anyone to read.
- The dev-convenience `NEXT_PUBLIC_VTOP_*` keys are **not** set anywhere in the repo; they're recognized only if you add them locally (they were clearly used by someone's dev loop).

## Where to next

- **[Deployment](./deployment.md)**
- **[CI](./ci.md)**
