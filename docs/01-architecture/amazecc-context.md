---
title: "The AmazeCC context"
description: "The ecosystem map - what each repo owns, and exactly which API endpoints this app consumes."
---

# The AmazeCC context

> **In one line:** this app is a thin client to the AmazeCC API - the API owns auth, data and business logic; this app owns none of them.

## The family

| Repo | Role | Stack |
|---|---|---|
| **AmazeCC-API** | source of truth: VTOP/LMS scraping, club auth, club admin endpoints, Postgres | Next.js route handlers |
| **AmazeCC** | the student-facing app | React Native |
| **AmazeCC-Dashboard** | the ops/admin portal (GoRobo, CabShare, transport) | Next.js static, similar pattern |
| **AmazeCC-Club-Hub** | **this repo** - the club-admin console | Next.js static export, RN-web |
| **docs** | this handbook site | Mintlify |
| **landing** | the public landing page | static |

<Note>
The API contract lives in the
[AmazeCC-API handbook](https://docs.amazecc.com/amazecc-api) - response field
tables are published there, so this handbook links to them instead of
duplicating them.
</Note>

## Every endpoint this app calls

| Method & path | Used by | Purpose |
|---|---|---|
| `POST /api/login` | `LoginPage.handleLogin` | VTOP-verified login; returns `clubToken` + `clubRoles` |
| `GET /api/events` | `FeedManager.fetchEvents` | public event list for the "link to an event" picker |
| `GET /api/club-admin/feed?club_id=…` | `FeedManager.fetchPosts` | feed timeline for one club (public read, optional club filter) |
| `POST /api/club-admin/feed` | `FeedManager.handleSubmit` | create a post |
| `DELETE /api/club-admin/feed?post_id=…` | `FeedManager.handleDelete` | delete a post |
| `GET /api/club-admin/landing-page?club_id=…` | `LandingPageBuilder.fetchData` | read the showcase page config |
| `POST /api/club-admin/landing-page` | `LandingPageBuilder.saveAll` | upsert the showcase page config |
| `GET /api/club-admin/details?club_id=…` | `ClubDetailsEditor` | read public club details |
| `POST /api/club-admin/details` | `ClubDetailsEditor.handleSave` | update public club details |
| `GET /api/club-admin/reps?club_id=…` | `RepManager.fetchReps` | list representatives |
| `POST /api/club-admin/reps` | `RepManager.handleAdd` | grant representation |
| `DELETE /api/club-admin/reps?vtop_id=…&club_id=…` | `RepManager.handleDelete` | revoke representation |

That's the complete list - 12 calls, every one carrying `Authorization: Bearer <clubToken>` (except `GET /api/events`, which is public) and `X-Club-Id: <active_club_id>`.

## Who owns what, precisely

| Concern | Owner |
|---|---|
| VTOP authentication | AmazeCC-API (`POST /api/login`) |
| Club token issuance & verification | AmazeCC-API (`clubAuth.ts`) |
| `club_representatives` table | AmazeCC-API (Postgres) |
| Feed storage, landing page storage, details storage | AmazeCC-API (Postgres) |
| **All UI state** (drafts, previews, tab selection) | **this repo** (React state) |
| Offline behavior | none - dead connection, dead app |
| Public club pages | the AmazeCC app (reads what this writes via the same tables) |

## Where to next

- **[The auth flow](../03-api-integration/auth-flow.md)**
- **[Response Shapes](https://docs.amazecc.com/amazecc-api/05-reference/response-shapes/clubs-events)** - exact payload fields (events/club-admin routes).
