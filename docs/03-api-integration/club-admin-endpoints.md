---
title: "Club-admin endpoints"
description: "Details, landing-page and reps - the exact request/response contract this app depends on."
---

# Club-admin endpoints

> **In one line:** three endpoint families back the three editing tabs - all club-token protected, all answering `{ success, … }`.

## Details - the public club profile

`GET /api/club-admin/details?club_id=<id>` · `POST /api/club-admin/details`

**GET success:** `{ success: true, details }` where `details` is the raw `club_details` row (or 404 `Club not found` for unknown clubs):

| Field | Meaning |
|---|---|
| `mission` | one-line mission |
| `description` | long markdown body |
| `hiring_process` | how to join, markdown |
| `website`, `recruitment_link`, `instagram`, `whatsapp` | links |
| `poc`, `email`, `poc_phone` | point of contact |
| `logo_url` | raw image URL |

**POST body:** the same eleven keys + `club_id`; upserts wholesale; answers `{ success: true, message: "Details updated successfully" }`. The POST upsert means **every save writes every field** - absent keys keep old values (`COALESCE` semantics) except booleans/JSON handled API-side; there is no patch endpoint.

## Landing page - the showcase editor

`GET /api/club-admin/landing-page?club_id=<id>` · `POST /api/club-admin/landing-page`

**GET success:** `{ success: true, landingPage }` - `{ club_id, theme: { primary_color, mode }, showcase_projects: [], popular_events: [], updated_at }` (full row). No row → `landingPage: null` (200, not 404).

**POST body:** `{ club_id, showcase_projects: [ {name, description, link?} ], popular_events: [ {name, description, link?, date?} ], theme? }` - **wholesale replace of both arrays**, JSON-stringified into JSONB; `theme` optional (defaults dark blue palette). Answer: `{ success: true, landingPage }` (upserted row).

## Reps - the roster

`GET /api/club-admin/reps?club_id=<id>` · `POST /api/club-admin/reps` · `DELETE /api/club-admin/reps?vtop_id=<id>&club_id=<clubId>`

**GET success** (club token): `{ success: true, reps, isSuperRep }`
- `reps[]` = `{ id, vtop_id, role, created_at }` from `club_representatives`
- `isSuperRep` computed server-side from token role / token clubs[] / DB role

**POST body:** `{ vtop_id, role?, club_id? }` - registration numbers stored uppercased; role defaults to `representative`; `super-club-rep` honored literally, anything else coerced. **Super-club-rep only** (403 otherwise).

**DELETE:** super-club-rep only; `?vtop_id` + optional `?club_id`; self-removal forbidden with 400 `Cannot remove yourself`.

<Warning>
The UI lets a super rep overwrite anyone - including themself - because the
server only enforces "super reps may manage reps". See the
[RepManager page](../02-components/rep-manager.md).
</Warning>

## Auth errors, as they actually arrive

| Response | Body |
|---|---|
| 401 `Unauthorized Club Access` | missing/invalid/expired club token |
| 403 `Unauthorized for this club` | token valid, club not in your `clubs[]` |
| 403 `Unauthorized: Only super-club-reps can add reps` | POST/DELETE on reps |
| 200 + `{ success: false }` | validation/business rule failure - read `error` |

## Where to next

- **[Envelopes & errors](./envelopes-and-errors.md)**
- Field-by-field responses: [clubs-events catalog](https://docs.amazecc.com/amazecc-api/05-reference/response-shapes/clubs-events)
