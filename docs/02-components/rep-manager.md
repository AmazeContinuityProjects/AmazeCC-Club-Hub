---
title: "RepManager"
description: "Grant and revoke club-admin access - super reps only, exactly what the API and the UI each enforce."
---

# RepManager

**File:** `src/components/RepManager.tsx` · **Tab:** Manage Representatives (super reps only) · **API:** `GET/POST/DELETE /api/club-admin/reps`

> **In one line:** the roster editor - list who can act as club admin, add by registration number, remove with a confirm dialog.

## Access control - both layers

**UI:** the tab renders only when `isSuperRep` (the active club role from the token is exactly `super-club-rep`). `page.tsx` gates the render branch; `Sidebar`/mobile nav gate the entry point.
**API:** `/api/club-admin/reps` is club-token protected and requires **super-club-rep** status on POST/DELETE; GET requires only the club token. Regular reps calling POST/DELETE get `403`. **Do not trust the UI gate alone.**

## State inventory

| State | Type | Purpose |
|---|---|---|
| `reps` | `Rep[]` | the roster; `Rep = {id: number; vtop_id: string; role: string; created_at: string}` |
| `newRep` | string | registration input |
| `newRole` | string | `representative` (default) \| `super-club-rep` |
| `loading` | boolean | first-load spinner |
| `adding` | boolean | add-button spinner |
| `deleting` | string \| null | vtop_id pending removal (dialog open) |
| `showForm` | boolean | the add-bar toggle |
| `message` | `{type, text}` | toast banner |

## Read path (exactly)

```ts
GET /api/club-admin/reps?club_id=<id>   (X-Club-Id: <id>)
// success → setReps(data.reps || []) · else setReps([]) (empty state)
```

## Add path (exactly)

```ts
POST /api/club-admin/reps
{ club_id, vtop_id: newRep.trim(), role: newRole }
```

On success the component **patches local state** (`[...prev, {id: Date.now(), vtop_id, role, created_at: new Date().toISOString()}]`) - note the **synthetic client-side `id`** - re-fetching the list is not attempted, so ids from the server and the client disagree until reload. Harmless for rendering (the roster is keyed on `vtop_id`), but don't build anything that needs the server id.

## Remove path (exactly)

```ts
DELETE /api/club-admin/reps?vtop_id=<id>&club_id=<clubId>   (X-Club-Id: <id>)
```

Query params (not a body), confirmation `Dialog`, then local filter out. Failure shows the API's `error` in the banner.

## Roster rendering

Timeline rows: avatar circle with a `User` icon, registration number in `TimelineTitle`, `<Badge variant="warning">Super Rep</Badge>` for supers, human-relative date (`Added today/yesterday/N days ago`). Delete icon hidden until hover (`group-hover:opacity-100`).

<Warning>
**A super rep can demote/remove another super rep - including themself** - via this UI; the API enforces only "super-rep acts on the club", with **no self-removal guard** (unlike `admin/users`). If you need break-glass protection, enforce it API-side, not here.
</Warning>

## Where to next

- **[ClubDetailsEditor](./club-details-editor.md)**
- **[API Integration → auth flow](../03-api-integration/auth-flow.md)** - where `super-club-rep` comes from.
