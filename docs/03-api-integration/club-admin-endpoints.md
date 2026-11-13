---
title: "Club-admin endpoints"
description: "Details, landing page, reps - the rest of the API surface this app touches, field by field."
---

# Club-admin endpoints

> **In one line:** three families - profile details, showcase config, rep roster - all behind the club token, all `{ success, … }`.

## Details — GET/POST /api/club-admin/details

- **GET** returns `{ success: true, details: {…} }` - the row from `club_details`, or 404.
- **POST** upserts: `{ mission, description, hiring_process, website, recruitment_link, instagram, whatsapp, poc, email, poc_phone, logo_url, club_id }`.
- **No partial patch.** The app sends the whole object every time; the API stores what you send (COALESCE keeps omitted fields).

## Landing page — GET/POST /api/club-admin/landing-page

- **GET** → `{ success: true, landingPage: { club_id, theme, showcase_projects: [], popular_events: [], updated_at } }` (or `landingPage: null` first visit).
- **POST** → whole-object upsert of `showcase_projects` + `popular_events`; returns the upserted row. Arrays of `{ name, description, link?, date? }`.

## Reps — GET/POST/DELETE /api/club-admin/reps

- **GET** → `{ success: true, reps: [...], isSuperRep: boolean }`.
- **POST** → body `{ vtop_id, role?, club_id? }`; missing role → `representative`; `super-club-rep` honored; anything else coerced. **403 for non-supers.**
- **DELETE** → query `?vtop_id=&club_id=`; super only; self-removal blocked API-side.

## Auth errors you should recognize on sight

| Status | Body |
|---|---|
| 401 | `{ success: false, error: "Unauthorized Club Access" }` |
| 403 | `{ success: false, error: "Unauthorized: Only super-club-reps can add reps" }` |
| 200 with `success:false` | business failure — read `error` |

## Where to next

- **[Envelopes & errors](./envelopes-and-errors.md)**
