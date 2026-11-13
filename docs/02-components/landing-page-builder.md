---
title: "LandingPageBuilder"
description: "The showcase-page editor - projects and popular events, staged locally and upserted in one POST."
---

# LandingPageBuilder

**File:** `src/components/LandingPageBuilder.tsx` · **Tab:** Landing Page Builder · **API:** `GET/POST /api/club-admin/landing-page`

> **In one line:** curate the two lists your club's showcase page displays - projects and popular events - then Save persists both in one call.

## State inventory

| State | Type | Purpose |
|---|---|---|
| `projects` | `LandingPageItem[]` | showcase projects (name, description, link?) |
| `events` | `LandingPageItem[]` | popular events (name, description, link?, date?) |
| `loading` | boolean | first-load spinner |
| `saving` | boolean | FAB spinner during upsert |
| `message` | `{type, text}` | transient toast banner |
| `deleting` | `{index, type: "project"\|"event"}` \| null | remove-confirm dialog target |
| `showForm` | `"project"` \| `"event"` \| null | which add-form is open |
| `form` | `{name, description, link, date}` | add-form draft |

`LandingPageItem` = `{ name: string; description: string; link?: string; date?: string }`.

## Read path (exactly)

```ts
const res = await apiFetch(`/api/club-admin/landing-page?club_id=${encodeURIComponent(clubId)}`, {
  signal, headers: { "X-Club-Id": clubId },
});
// success → setProjects(lp.showcase_projects || []); setEvents(lp.popular_events || []);
// no success flag or no landingPage → both reset to [] (fresh clubs render empty states)
```

## Write path (exactly)

```ts
POST /api/club-admin/landing-page
{ club_id, showcase_projects: projects, popular_events: events }
```

**One shot, both lists.** The API upserts the whole row (`ON CONFLICT (club_id) DO UPDATE`), replacing both arrays. Consequences:

- **Every Save replaces everything** - there is no partial patch endpoint. Local state is the draft; the button is the commit.
- The add forms edit different shapes (events carry `date`), but the wire format is identical.
- On success: green toast + 4 s auto-dismiss; on failure the banner shows the API's error.

## Form mechanics

- Add via `Plus`/`CalendarDays` buttons toggling `showForm`; the form renders conditionally (glass card, animated in).
- Events expose a `type="date"` input; projects don't (by design).
- `name`/`description` are required (checked in `addItem`, not by the API).
- Items are **prepended** (`[item, ...prev]`) so the newest shows first.
- Delete goes through the shared confirm `Dialog` ("Changes are saved when you click Save" - accurate; removing an item is local until you commit).

## Toast & errors

Inline fixed-position `<Alert>` bottom-right (slide-in), not `alert()` - the friendlier pattern this repo uses for expected outcomes. Failure cases get the same surface with red styling.

## Where to next

- **[ClubDetailsEditor](./club-details-editor.md)**
- **[API Integration → club-admin endpoints](../03-api-integration/club-admin-endpoints.md)**
