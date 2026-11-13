---
title: "Env vars"
description: "Every knob this app has - what they do, what the committed .env does to your build, and the two rules never to break."
---

# Env vars

> **In one line:** this repo has three public environment variables and one committed default value with a trap door — read this before `pnpm dev`.

## The three vars

| Var | What it does | If missing |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | tells the app where the API lives | falls back to `https://api.amazecc.com` |
| `NEXT_PUBLIC_VTOP_USERNAME` | pre-fills the username box (dev convenience) | starts empty |
| `NEXT_PUBLIC_VTOP_PASSWORD` | pre-fills the password box (dev convenience) | starts empty |

## "Public" means it

Anything named `NEXT_PUBLIC_*` ends up inside the JS bundle that GitHub Pages serves to the entire planet. There is no such thing as a private public var. Treat the prefix as a fluorescent warning label.

## The committed `.env` — read the warning

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

That's all that's in the file. It's committed on purpose: fresh clone → `pnpm install` → `pnpm dev` → the app talks to your local API on port 3000. But:

<Warning>
**A production `pnpm build` exported from this exact tree calls `http://localhost:3000`.**
`actions/configure-pages` on CI does not override it handed to you, and no Pages env exists for it. Every visitor of the deployed site would try to reach their own machine. If you're deploying this, **set `NEXT_PUBLIC_API_URL=https://api.amazecc.com` in `nextjs.yml` just before `pnpm build`** (or delete `.env` and let the fallback do its job). This page is the only place it's said plainly.
</Warning>

## The two rules

1. **Never commit a real credential.** `NEXT_PUBLIC_*` is public; secrets go in the API's env, not here.
2. **Override locally, never by editing `.env` in-place and committing.** `NEXT_PUBLIC_API_URL=https://api.amazecc.com pnpm dev` beats `git diff` noise.

## Where to next

- **[Deployment](./deployment.md)**
- **[CI](./ci.md)**
