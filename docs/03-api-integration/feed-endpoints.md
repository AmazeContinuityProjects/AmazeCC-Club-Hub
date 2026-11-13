---
title: "Feed endpoints"
description: "The feed's four calls - GET the timeline, POST a post, DELETE a post, plus the public events list for linking."
---

# Feed endpoints

> **In one line:** the feed is one table, three endpoints, and a public sidebar call for the "link an event" picker.

## GET /api/club-admin/feed?club_id=…

What comes back: `{ success: true, feed: [ … ] }` — an array, newest first.

| Field | You should care because… |
|---|---|
| `id` | dedupe key for double-fetches; also the id you pass to DELETE |
| `content` | the text you render |
| `links` | attached links as `{url, label}[]` - pill chips in the UI |
| `image_urls` | array; this app renders only the first, as an object URL blob today (known issue) |
| `event_id` | optional eventhub id; the badge renders when set |
| `posted_by` | the rep's registration number |
| `created_at` | ISO timestamp string, shown as relative date |
| `promote_count` | how many people "promoted" (upvoted) the post - comes back as string, don't do math on it |

<Note>
The contract for every response shape this app consumes is in the **API handbook** — look up "Clubs & Events" at [docs.amazecc.com/amazecc-api/05-reference/response-shapes/clubs-events](https://docs.amazecc.com/amazecc-api/05-reference/response-shapes/clubs-events).
</Note>

## POST /api/club-admin/feed

Body:

```json
{
  "content": "We won the inter-college hackathon!",
  "links": [{ "url": "https://acme.com/slides", "label": "Slides" }],
  "image_urls": ["https://cdn.example.com/photo.jpg"],
  "event_id": "Eventhub-42",
  "club_id": "gdgom"
}
```

- `content` is the only required field (API answers 400 "Content is required" otherwise).
- Everything else defaults: `links=[]`, `image_urls=[]`, `event_id=null`.
- Response: `{ success: true, post: {…the created row…} }`.

## DELETE /api/club-admin/feed?post_id=42

Just the id in the query string; no body. Response: `{ success: true }`. 404 when the id doesn't exist or you're not allowed to delete it.

## GET /api/events

**No auth needed — public.** A bare JSON array (no envelope): `[{ eid, title, date, posterUrl, … }]`. Used only to fill the "Link to an event" picker. If it fails, the dropdown quietly doesn't render and the feed still works — graceful degradation by accident of cheap code (worth knowing).

## Where to next

- **[Club-admin endpoints](./club-admin-endpoints.md)**
- **[Envelopes & errors](./envelopes-and-errors.md)**
