---
title: "FeedManager"
description: "The feed composer + timeline - every state field, every API call, every gotcha."
---

# FeedManager

**File:** `src/components/FeedManager.tsx` (366 lines - the biggest component in the repo) · **Tab:** Feed Manager (`page.tsx` branch `feed`) · **API:** `GET/POST/DELETE /api/club-admin/feed`, `GET /api/events`

> **In one line:** an X-style composer + a vertical Timeline of your club's posts, with event linking, images and delete.

## State inventory (exact names)

| State | Type | Purpose |
|---|---|---|
| `posts` | `FeedPost[]` | the loaded timeline; deduped by `id` |
| `loading` | boolean | first-load spinner |
| `refreshing` | boolean | pull-to-refresh button spinner |
| `showForm` | boolean | composer card visible or not |
| `content` | string | composer draft text |
| `socialLinks` | `SocialLink[]` (`{url,label}`) | 1..N links attached to the draft |
| `selectedEventId` | string | event `eid` to link, `""` = none |
| `events` | `EventItem[]` (`{eid,title,date,posterUrl?}`) | options for the link picker; fetched lazily |
| `imagePreview` | string \| null | object URL (or previously-sent URL) preview |
| `confirmDelete` | string \| null | id in the delete confirmation dialog |

## `FeedPost` (the wire shape this component renders)

```ts
interface FeedPost {
  id: number;
  club_id: string;
  content: string;
  links: { url: string; label: string }[];
  image_urls: string[];
  event_id: string | null;
  posted_by: string;
  created_at: string;
  promote_count: number;      // int8 from the API → string in practice
  has_promoted: boolean;
}
```

## Read path (exactly)

```ts
const res = await apiFetch(`/api/club-admin/feed?club_id=${encodeURIComponent(clubId)}`, {
  signal, headers: { "X-Club-Id": clubId },
});
```

Then: dedupe by `id` with a `seen` Set (bomb-proofs StrictMode double-effect), `AbortError` swallowed, `setRefreshing(false)` only when not aborted.

## Compose → publish (exactly)

1. `POST /api/club-admin/feed` with body `{ content, links, club_id, image_urls?: [url], event_id? }`
2. `links` = `socialLinks` filtered to non-empty `url`
3. **`image_urls` sends the object-URL string directly** - the API stores the reference; it does **not** upload bytes anywhere. (If the preview came from a `URL.createObjectURL`, the "image" is meaningless after your tab closes - see [known issues](../05-reference/known-issues.md#images-are-object-urls).)
4. On `data.success`: reset draft + form, re-`fetchPosts()`; else `alert(data.error || "Failed to create post")`.

## Events picker (exactly)

Lazy-fetched on first open of the composer: `apiFetch("/api/events")` - **no auth headers required** (public), returns a bare JSON array; the picker lists `{eid, title, date}` with "No event linked" as value `""`. On success the selected event renders as a `<Badge variant="warning">` above the post in the timeline (label: event title + date).

## Delete path (exactly)

`DELETE /api/club-admin/feed?post_id=<id>` with `X-Club-Id` - confirmation via a shared `Dialog` (title "Delete Post"), then `fetchPosts()` again. Failing shows `alert(data.error || "Failed to delete post")`.

## Render anatomy

- Toolbar: `SectionHeader` ("Feed" + `N posts`), refresh icon-button (spins while `refreshing`), "New Post" button.
- Composer card (conditional): RN-web `Textarea` bound to `content`, `OptionPicker` for events, link rows (`Input type=url` + label input; "Link" button reveals a second row), file `<input type="file">` hidden behind a label for images, preview `Image` with an X to clear, action bar (Upload icon, cancel, Post).
- Timeline: `Timeline`/`TimelineItem` with a rotating `dotColor` from `["blue","emerald","purple","amber","indigo","pink"]`; each card shows relative date (`Today`/`Yesterday`/`N days ago`/absolute), event badge (if any), content, first image, link pills, footer row (time + `by <posted_by>`).
- Empty state: `<EmptyState>` with a "First Post" CTA.

<Warning>
**No image upload exists.** `imagePreview` is a local object URL; POSTing it stores a string the rest of the world can't dereference. If you need real uploads, wire an S3/B2 endpoint first (AmazeCC-API already has a B2 client - see the API handbook's `b2-and-ocr` internals page).
</Warning>

## Where to next

- **[ClubDetailsEditor](./club-details-editor.md)** - same skeleton, different domain.
- **[RepManager](./rep-manager.md)**
- **[API Integration → feed endpoints](../03-api-integration/feed-endpoints.md)**
