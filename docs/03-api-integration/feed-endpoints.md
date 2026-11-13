---
title: "Feed endpoints"
description: "GET/POST/DELETE the feed and the public events picker - exact bodies, responses and gates."
---

# Feed endpoints

> **In one line:** four endpoints run the feed: the list read, the create write, the delete - plus the public events list that powers the link picker.

## `GET /api/club-admin/feed?club_id=<id>`

**Public read** (the AmazeCC app uses it too for the public club page). Returns `{ success: true, feed }`.

Response rows (`club_feed` joined with promotion state):
| Field | Type | Meaning |
|---|---|---|
| `id` | number | post id |
| `club_id` | string | owner club |
| `content` | string | post text |
| `links` | `{url, label}[]` | attachments (stored JSON) |
| `image_urls` | string[] | attachments (stored JSON) |
| `event_id` | string \| null | linked Eventhub eid |
| `posted_by` | string | rep's registration number |
| `created_at` | timestamptz | pg-serialized string |
| `promote_count` | number-ish | COUNT(*) - arrives as **string** from pg |
| `has_promoted` | boolean | whether the *caller's* (or anonymous) hash promoted it |

This app pins no `vtop_id` filter for `has_promoted` - anonymous → always `false`.

## POST /api/club-admin/feed

**Club token required.** Body:

```json
{
  "content": "Sat: workshop with the algo team",
  "links": [{ "url": "https://…", "label": "Form" }],
  "image_urls": ["…"],
  "event_id": "…",
  "club_id": "gdgom"
}
```

- `content` required (400 `Content is required` otherwise)
- `links`/`image_urls` default `[]`
- `club_id` selects the target club; the token's club membership is checked; super-reps may post to any club in their `clubs[]`.
- Success: `{ success: true, post }` (insert, `RETURNING *`).

## `DELETE /api/club-admin/feed?post_id=<id>`

**Club token required.** Query param only. Sets no body. Success: `{ success: true }`; `404 Post not found` if the id doesn't exist or isn't deletable by you (regular reps only in their club).

## GET /api/events

**Public.** A bare JSON array (no envelope) of objects shaped:
| Field | Type | Meaning |
|---|---|---|
| `eid` | string | event id |
| `title` | string | card headline |
| `date` | string | display date (e.g. `"Sat 14 Nov"`) |
| `posterUrl` | string | absolue eventhub image URL (may be `''`) |
| `eligibility`, `type`, `location`, `price` | string | extra metadata (unused in this app) |

Used only for the "link to an event" dropdown in the composer.

<Note>
Field-by-field contract for every one of these is in the
[AmazeCC-API handbook → Response Shapes](https://docs.amazecc.com/amazecc-api/05-reference/response-shapes/clubs-events).
</Note>

## Where to next

- **[Club-admin endpoints](./club-admin-endpoints.md)**
- **[Envelopes & errors](./envelopes-and-errors.md)**
