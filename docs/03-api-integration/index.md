---
title: "API Integration"
description: "What the API is to this app, the two dialects it answers in, and where to find the contract for every endpoint - for someone who's never built against one."
---

# API Integration

> **In one line:** the API is the smart part; this app is its handwriting — these pages teach what it says back to us, and the few traps in between.

If you've never worked with an API before, read the [vocabulary](../00-start-here/the-vocabulary.md) section on *API / endpoint / request / response / JSON* first – everything here assumes it.

| Page | What you learn |
|---|---|
| [The auth flow](./auth-flow.md) | prove you're a club rep, get your badge, carry it everywhere |
| [Feed endpoints](./feed-endpoints.md) | the one feature every student club uses |
| [Club-admin endpoints](./club-admin-endpoints.md) | details / landing page / roster - the rest of the app |
| [Envelopes & errors](./envelopes-and-errors.md) | the two response dialects and every error pattern |

## Why this app has no SDK

The API team publishes a handbook (the adjacent tab of this site) with precise response shapes; this app instead writes three tiny wrappers in `src/lib/api.ts` (`getClubToken`, `apiFetch`, `fetcher`) and does everything else inline in components. That's deliberate and fine at this size: hand-typed contracts, inline, no build step in between. When it grows, an SDK in `src/lib/` is the first thing to add.

## The dozen calls, mapped

| Feature | Calls |
|---|---|
| Login | `POST /api/login` |
| Feed | `GET/POST/DELETE /api/club-admin/feed` + `GET /api/events` |
| Public card | `GET/POST /api/club-admin/details` |
| Showcase page | `GET/POST /api/club-admin/landing-page` |
| Roster | `GET/POST/DELETE /api/club-admin/reps` |

Every one includes `Authorization: Bearer <token>` automatically via `apiFetch`.

## Where to next

- **[The auth flow](./auth-flow.md)** – start here.
