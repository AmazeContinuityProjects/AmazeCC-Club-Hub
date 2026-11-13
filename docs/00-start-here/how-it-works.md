---
title: "How it works, end to end"
description: "From a click on New Post to a row in your club's feed: every hop through React, react-native-web, fetch and the API."
---

# How it works, end to end

> **In one line:** a browser-side React app renders react-native primitives on the web, every action becomes a `fetch` to the AmazeCC API with your club token in the header, and the API is the only thing that ever touches a database or VTOP.

## The 60-second version

1. **You open `https://<club-hub-url>/`** - a static HTML+JS file served by GitHub Pages. No server-side rendering happens here.
2. **`src/app/page.tsx` renders.** It's a client component (`"use client"`) - everything happens in the browser.
3. **If no token in `localStorage`, `LoginPage` renders.** You authenticate; the API verifies VTOP and returns a `clubToken`.
4. **The app stores `club_token`, `club_roles`, `active_club_id` in `localStorage`** and renders the four tabs.
5. **Every data read/write goes through `apiFetch`** (`src/lib/api.ts`), which adds `Authorization: Bearer <club_token>` and `X-Club-Id: <active_club_id>` to every request.
6. **The API does the work** - reads/writes its Postgres, talks to VTOP, enforces the club token. You get JSON back.

## The pieces, one by one

### Static export, no Next.js server

`next.config.ts` sets `output: 'export'` with `trailingSlash: true`. `pnpm build` produces a plain `out/` directory - static files. `nextjs.yml` uploads `out/` to GitHub Pages. There is no Node server in production: no API routes, no server actions, no middleware - just files. That's why `.env` only needs `NEXT_PUBLIC_*` values (they're inlined into the JS bundle at build time) and why every piece of state can reset on hard refresh.

### React, but written with primitives

The components import `View`, `Text`, `Image`, `Button` from `@/lib/ui` - not from HTML. `@amazecontinuityprojects/amazeui` is a React Native-style component library that compiles to the web through `react-native-web` (aliased in `next.config.ts`'s webpack block). So the "HTML" you see in the browser is RN-Web's emulation of native primitives. The project's answer to "but the app is RN too" is deliberate code reuse - the AmazeCC app is React Native.

### `apiFetch` is the only door out

```ts
// src/lib/api.ts (exactly as it exists)
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.amazecc.com";

export function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getClubToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (typeof window !== "undefined") {
    const activeClubId = localStorage.getItem("active_club_id");
    if (activeClubId && !headers.has("X-Club-Id")) {
      headers.set("X-Club-Id", activeClubId);
    }
  }
  return fetch(apiUrl(path), { ...init, headers });
}
```

Every component calls the API through this function (or `apiFetch` via a shared `signal` for cancellation). Notice:

- **The club token is attached automatically.** Components never think about auth.
- **`X-Club-Id` selects which club you act on** - essential because a rep may represent multiple clubs. The API scopes the mutation to that club.
- **The base URL comes from env at build time** (`NEXT_PUBLIC_API_URL`), falling back to production.

### The club switch

`active_club_id` in `localStorage` is the single source of truth for "which club am I editing". Switching clubs remounts the tab content with `key={clubId}` - wiping all local component state (draft posts, half-typed forms) deliberately. The sidebar and the mobile top bar both switch it via `OptionPicker`.

### LocalStorage is the session

| Key | Written by | Contents |
|---|---|---|
| `club_token` | `LoginPage.handleLogin` | JWT-shaped club token (7-day expiry, from `POST /api/login`) |
| `club_roles` | `LoginPage.handleLogin` | JSON array of `{ club_id, role }` (deduped, super wins) |
| `active_club_id` | `page.tsx` / login | the club id currently being administered |

There is no logout endpoint - logout deletes the keys. The API has no session to kill server-side for club tokens either (they expire naturally).

## What a full login → post round trip looks like

```
Browser                      Club Hub                AmazeCC API
  |  submit login form  ->      |                          |
  |                        apiFetch('/api/login', POST)     |
  |                                                   |──► VTOP (captcha solved here)
  |                                                   |──► UPDATE/insert club_representatives? no - reads it
  |                          ◄── { success, clubToken, clubRoles }
  |  localStorage: club_token, club_roles, active_club_id
  |  FeedManager mounts, apiFetch('/api/club-admin/feed?club_id=…')
  |                                                   |──► SELECT club_feed …
  |                          ◄── { success, feed: [ … ] }
  |  renders Timeline with your posts
```

The interesting bits:
- **The API decides everything privileged.** The client *believes* it's a super rep because the token says so; the API re-checks on every request anyway.
- **Club roles ride in the token and in localStorage** - the UI uses localStorage for instant reads and the API uses the token for enforcement.

## Where to next

- **[The auth flow](../03-api-integration/auth-flow.md)** - the login contract in detail.
- **[Conventions](./conventions.md)** - patterns this codebase repeats everywhere.
- **[Components](../02-components/index.md)** - the walkthroughs.
