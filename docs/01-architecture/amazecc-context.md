---
title: "The AmazeCC context"
description: "The ecosystem family tree - what each repo is for, and the exact twelve endpoints this app consumes."
---

# The AmazeCC context

> **In one line:** Club Hub is a small remote control for one slice of one API - know what the rest of the family does, or you'll wonder why changes here don't stick.

## The family tree in five seconds

| Repo | What it is | One sentence |
|---|---|---|
| `AmazeCC-API` | the backend (the only place with a database) | scrapes VTOP/LMS, serves the JSON everything else uses |
| `AmazeCC` | the student-facing app | the VIT student portal, on your phone |
| `AmazeCC-Dashboard` | the admin panel for ops staff | GoRobo shop, CabShare, transport, QBank moderation - staff-facing |
| `AmazeCC-Club-Hub` | **this repo** | the club-admin console, for club representatives |
| `docs` | the handbook you're reading | a Mintlify site that aggregates every repo's `docs/` |
| `landing` | the public marketing page | one big page |

## The API membrane

Every dynamic byte Club Hub shows crosses `https://api.amazecc.com` (or wherever `NEXT_PUBLIC_API_URL` points). The app contains **zero secrets** and **zero database code**. If a value looks sensitive (`postgres://…`, `VTOP_PASSWORD`, HMAC keys), it belongs in the API's own environment - never in this repo, never in `NEXT_PUBLIC_*`.

## The exact API endpoints this app calls

Twelve calls, tabulated - every single one goes through `apiFetch`:

| Method/Path | Used by | Effect |
|---|---|---|
| `POST /api/login` | `LoginPage` | proves identity, returns club token (+roles) |
| `GET /api/events` | `FeedManager`'s picker | public list of eventhub events |
| `GET /api/club-admin/feed?club_id=` | `FeedManager` | list the timeline |
| `POST /api/club-admin/feed` | `FeedManager` | create a post |
| `DELETE /api/club-admin/feed?post_id=` | `FeedManager` | delete a post |
| `GET /api/club-admin/landing-page?club_id=` | `LandingPageBuilder` | read the showcase config |
| `POST /api/club-admin/landing-page` | `LandingPageBuilder` | upsert the showcase config |
| `GET /api/club-admin/details?club_id=` | `ClubDetailsEditor` | read the public card |
| `POST /api/club-admin/details` | `ClubDetailsEditor` | update the public card |
| `GET /api/club-admin/reps?club_id=` | `RepManager` | list reps |
| `POST /api/club-admin/reps` | `RepManager` | add a rep |
| `DELETE /api/club-admin/reps?vtop_id=…` | `RepManager` | remove a rep |

**That's the entire contract.** If a feature isn't in this list, it's not done here - it lives in the API first, then gets a tab here.

## Who owns what (the only part you must memorize)

| Concern | Owner |
|---|---|
| VTOP password verification | the API |
| Club token signing & checking | the API |
| `club_representatives` table | the API (Postgres) |
| club_feed, club_details, club_landing_pages rows | the API (Postgres) |
| **All UI state:** drafts, previews, which tab you're on | **this repo** (React state) |
| PWA install prompt | this repo (`manifest.json`) |

## Where to next

- **[The auth flow](../03-api-integration/auth-flow.md)** - the login to API bridge, in detail.
- **[API Integration](../03-api-integration/index.md)** - the same list, one page deeper.
