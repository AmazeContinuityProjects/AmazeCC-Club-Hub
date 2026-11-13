---
title: "RepManager"
description: "The roster of people who can act on behalf of the club - adding a registration number, and every step that follows."
---

# RepManager

**File:** `src/components/RepManager.tsx` · **Tab:** Manage Representatives · **Visible to:** super club reps only · **Job:** decide who else holds your club's keys

> **In one line:** the list of every registration number trusted to administer your club - and the screen that grants or revokes that trust.

## What "being a rep" unlocks

Anyone on this list can do what you're doing right now: edit the public card, write posts, curate the landing page. **Super reps** (the higher tier) can also open this tab and change the roster. Regular reps cannot - they see five tabs hidden from them on this screen and can only see the four others.

## The three-digit genius of this screen

There is one number that matters per row: `vtop_id` - the student's registration number. Everything else is chrome. Add by typing e.g. `21BCE0000`; remove by clicking a trash icon; done. The API is the actual gate on all of it.

## State and shape

```tsx
interface Rep { id: number; vtop_id: string; role: string; created_at: string; }
```

`reps` mirrors the API's `club_representatives` table (one row per rep per club). `newRole` defaults to `representative`; the only other choice is `super-club-rep`.

## The three flows

**List** (on mount): `GET /api/club-admin/reps?club_id=` → renders a timeline of initials-avatar rows (`21BCE0000`, role badge, "Added N days ago").

**Add**: `POST /api/club-admin/reps { club_id, vtop_id: raw.trim(), role: newRole }` - uppercases server-side; the component prepends a synthetic row with `Date.now()` as a temporary id so the UI feels instant without refetching.

**Remove**: `DELETE /api/club-admin/reps?vtop_id=<id>&club_id=<clubId>` → server removes that row; UI filters it out locally; toast confirms ("Representative removed").

<Warning>
**A super rep can remove themself.** The API enforces only "super reps manage reps" - not "don't remove the last super rep" or "don't remove yourself". Design consequence: a club can lock itself out of rep management. When building on top of this, guard at the API, not here.
</Warning>

## The badge system you'll notice

- `<Badge variant="warning">Super Rep</Badge>` on super-rep rows.
- The whole tab is hidden for regular reps (see [page.tsx](./page.md) and [Sidebar](./sidebar.md) for the isSuperRep computation).

## The confirmation dialog

Deleting has no undo. The dialog names exactly who disappears (`Remove 21BCE0000 from the rep list? They will lose admin access.`). One destructive misclick costs the club a rep; re-adding them takes an API call anyone on this screen can make.

## Where to next

- **[The auth flow](../03-api-integration/auth-flow.md)** - where `super-club-rep` actually comes from at login.
- **[Known issues](../05-reference/known-issues.md)** - the API's one-directional super rep hazard.
