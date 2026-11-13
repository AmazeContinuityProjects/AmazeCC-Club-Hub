---
title: "Quickstart"
description: "Clone, install, run, and sign in to Club Hub locally - five minutes, needs a VTOP account with club rep privileges."
---

# Quickstart

> **In one line:** clone, `pnpm install`, `pnpm dev`, open port 3003, sign in with your VTOP credentials - and if you represent a club, you land on the feed manager.

## What you need

- **Node.js 22** and **pnpm 11.24.0** (pinned via `packageManager` in `package.json`).
- A **VTOP account with club representative privileges** (the API decides: `club_representatives` rows for your registration number, or you'd represent no club and see nothing). Without one you can still log in - the app just tells you so and stays put.
- The AmazeCC API running at `NEXT_PUBLIC_API_URL`. This repo's committed `.env` points at `http://localhost:3000`, i.e. a local AmazeCC-API. Production uses `https://api.amazecc.com` (the default in `src/lib/api.ts` when unset).

## Run it

```bash
git clone https://github.com/AmazeContinuityProjects/AmazeCC-Club-Hub.git
cd AmazeCC-Club-Hub
pnpm install
pnpm dev
```

Open **http://localhost:3003**. Port 3003 is deliberate (AmazeCC's own dev server owns 3000).

## Sign in

1. Enter your VTOP registration number and password.
2. Submit. The app POSTs them to `${NEXT_PUBLIC_API_URL}/api/login`.
3. The API verifies them against VTOP (solving its captcha server-side) and returns, among other things, a `clubToken` if your account represents at least one club.
4. You land on **Feed Manager** with your first represented club pre-selected.

<Warning>
**If you don't represent a club**, login still succeeds but you'll see the alert
"You do not have club representative privileges." That's the API's answer, not a
bug in this app.
</Warning>

## Check your build

```bash
pnpm lint        # ESLint
pnpm typecheck   # tsc --noEmit
pnpm build       # Next.js static export -> out/
test -f out/index.html && echo "export OK"
```

All three run in CI on every PR (see [CI & security](../04-operations/ci.md)).

## Two things that will trip you up immediately

1. **The committed `.env` points at `http://localhost:3000`.** If you don't run AmazeCC-API locally, set `NEXT_PUBLIC_API_URL=https://api.amazecc.com` in your shell before `pnpm dev`, or edit the `.env` locally. Do not commit your change.
2. **Login hits the real VTOP through the real API** - there is no offline demo mode. Use your own credentials; never paste anyone else's into the login form.

## Where to next

- **[How it works, end to end](./how-it-works.md)**
- **[The auth flow](../03-api-integration/auth-flow.md)** - exactly what the API returns.
