---
title: "Quickstart"
description: "Five minutes from clone to running - then a grand tour of what you're looking at. No webdev experience required."
---

# Quickstart

> **In one line:** clone, install, run on port 3003, open it in your browser, sign in with VTOP - and if you represent a club, you land on the feed manager.

## What you need (and what these things actually are)

| Thing | What it is |
|---|---|
| **Node.js** | the engine that runs JavaScript outside the browser - the "server side" of this app's tooling |
| **pnpm** | a fast package manager (like npm, but stricter and slimmer) - it fetches the libraries this app needs and remembers the exact versions |
| **A VTOP account with club rep privileges** | without it you can start the app, but you'll see "You do not have club representative privileges" after login - because the API tracks which clubs you represent |

## The commands, one at a time

```bash
git clone https://github.com/AmazeContinuityProjects/AmazeCC-Club-Hub.git
# copies this repo's files onto your machine

cd AmazeCC-Club-Hub
# move into the folder you just got

pnpm install
# download every library the app needs (creates node_modules/);
# can take a minute the first time

pnpm dev
# start the development server
```

Open **http://localhost:3003**. (GitHub Pages serves port 3000 for AmazeCC itself; this repo uses **3003** to avoid fighting over the same address.)

## What you'll see when it works

```
┌─────────────────────────────┐
│       AmazeCC Club Hub       │
│   sign in with VTOP creds    │
│                             │
│   [ 21BCE0000        ]      │
│   [ •••              ]      │
│                             │
│   [ Authenticate via VTOP ]  │
└─────────────────────────────┘
```

Every pixel of that screen is rendered by code in this repo - nothing comes from VTOP or the API except your login result.

## The tour (two minutes, well spent)

1. **Log in.** The app POSTs your credentials to the API; the API verifies them against VTOP and answers with (a) whether you represent any clubs and (b) a stamped badge (`clubToken`) if you do.
2. **You land on Feed Manager** - your club's timeline of posts, with a card to write a new one.
3. **Club Details** (left sidebar or the Details tab) - edit your club's public profile.
4. **Landing Page** - curate which projects and events get showcased.
5. **Manage Reps** - only appears if you're a **super** club rep; grant/revoke access to others.

<Warning>
**The committed `.env` tells this app the API lives at `http://localhost:3000`.**
That's a *local* AmazeCC-API. If you don't run the API locally, the app will
just sit there spinning on login. Either run the API locally too (see the
AmazeCC-API handbook's quickstart), or override for your session:

```bash
NEXT_PUBLIC_API_URL=https://api.amazecc.com pnpm dev
```
</Warning>

## Prove your build works (the same checks CI runs)

```bash
pnpm lint         # style issues
pnpm typecheck    # type mistakes
pnpm build        # produce the static site (output → out/)
test -f out/index.html && echo "export OK"   # the file Pages would serve
```

## If something goes wrong

| What you see | Likely truth |
|---|---|
| Blank/spinning page, no error | the API isn't reachable at `NEXT_PUBLIC_API_URL` (see warning above) |
| "You do not have club representative privileges." | login worked; VTOP agrees you exist; the API knows no club links you - talk to your club's super rep |
| "Invalid Captcha" | the API's puzzle-solver failed once; hit submit again |
| "Invalid Username / Password" | VTOP rejected the credentials - check them; after repeated failures VTOP itself may block temporarily |
| `pnpm` not found | install pnpm first: `npm install -g pnpm@11.24.0` (or see pnpm docs) |

## Where to next

- **[How it works, end to end](./how-it-works.md)** - follow one click from tap to API and back.
- **[The auth flow](../03-api-integration/auth-flow.md)** - what the server actually checks.
- **[Conventions](./conventions.md)** - how code in this repo thinks.
