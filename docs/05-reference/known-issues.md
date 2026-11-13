---
title: "Known issues"
description: "The honest debt list - what doesn't work, what's fragile, and what's merely embarrassing."
---

# Known issues

> **In one line:** nothing here is undiscovered - it's all deliberate-or-deferred, and documented so nobody "fixes" the wrong thing first.


## Images in posts are object URLs

`FeedManager.handleImageSelect` does `URL.createObjectURL(file)` and stores the resulting `blob:…` string via `image_urls: [url]` in the feed create body. After any reload (or from any other browser), that URL is meaningless. The API stores the string without complaint.

**Impact:** images in club posts are placeholders only; nothing renders them cross-session.
**Fix sketch:** upload via a B2/S3 endpoint (AmazeCC-API already has one) and store the public URL; or drop the image feature until then.

## The committed `.env` bakes localhost into prod builds

`.env` in git contains `NEXT_PUBLIC_API_URL=http://localhost:3000`; Pages CI does not override it; `next build` inlines it. Production sites built from this tree call localhost from each visitor's machine.

**Fix:** see [deployment](../04-operations/deployment.md) — set `NEXT_PUBLIC_API_URL=https://api.amazecc.com` in `nextjs.yml` or delete `.env`.

## Club tokens have no refresh

The API issues 7-day club tokens and there is no refresh endpoint. When the token dies, every club-admin call 401s; the UI silently degrades to empty states and the user may think the app is broken.

**Fix sketch:** on a shared 401 detector in `apiFetch`, clear localStorage and hard-redirect to `/` (one `window.location.href = "/"`); or add a `/api/club-admin/renew` endpoint.

## `LoginPage` accepts dev-convenience env credentials

`NEXT_PUBLIC_VTOP_USERNAME`/`NEXT_PUBLIC_VTOP_PASSWORD` pre-fill the login form if set. Harmless by design (public env), but they should never ship in a shared build. They aren't committed anywhere in the repo — keep it that way.

## `ThemeSwitcher.tsx` is a dead shim

`src/components/ThemeSwitcher.tsx` re-exports `@amazecontinuityprojects/amazeui`'s component "for backwards compatibility"; nothing imports it. Delete whenever convenient (check with `rg "components/ThemeSwitcher"`).

## `temp-club-hub` is the package name

`package.json` still says `name: "temp-club-hub"`. Cosmetic, but the npm identity is placeholder; align with the repo name when touching `package.json` next.

## The README's feature list is aspirational

README says "??? Club discovery…" — the app has no discovery, no events *creation* (link-only), no announcements/broadcasts, no analytics. Only what's documented in [Components](../02-components/index.md) exists.

## Promote flow is read-only here

The API serves `promote_count`/`has_promoted`; this app shows neither — the tally is a server-side concern for other surfaces.

## `key={clubId}` remount UX

Switching clubs discards any in-progress draft on the landing page (form state, compose state). Intentional (no cross-club bleed), but surprising; a "you have unsaved changes" guard would be kind to users.

## `alert()` as an error surface

`FeedManager` still uses OS dialogs for failures while every other tab uses inline banners. Cosmetic inconsistency.

## What is *not* broken

- Deduplication logic (roles, posts) — intentional, correct.
- `react-native` in `package.json` deps — required for the web alias; not a bug.
- `public/manifest.json` — valid PWA manifest.
- CI's malware signature scan — load-bearing; do not remove.

## Reporting more

File an issue in `AmazeContinuityProjects/AmazeCC-Club-Hub` with a repro — the API contract lives in the AmazeCC-API handbook; this one is the truth of the client.
