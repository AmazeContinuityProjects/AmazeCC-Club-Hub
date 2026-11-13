---
title: "FeedManager"
description: "The heart of the app - a compose card, a timeline, and every single line of behavior explained in plain words."
---

# FeedManager

**File:** `src/components/FeedManager.tsx` · **Tab:** Feed · **Job:** write, list, delete your club's community-feed posts

> **In one line:** this screen is a notes app that talks to the API - type, choose a file or a link, hit Post; watch the timeline update like a group chat.

## The four questions that drive the code

| Question | State name | What it means |
|---|---|---|
| What's on the wire right now? | `posts` | the posts, in server order (newest handling not by date, just API order) |
| Am I waiting for the network? | `loading` (first load) / `refreshing` (button) | spinners |
| Is there a draft in progress? | `content`, `socialLinks`, `imagePreview`, `selectedEventId` | the compose card's memory |
| What should I show next? | `showForm`, `confirmDelete` | which extra UI is open |

Let's go screen half: **the compose card** (the starter line you tap) then **the timeline** (the list of cards).

## Screen half 1 - the compose card

```tsx
<Textarea placeholder="What's happening with your club?"
          value={content} onChange={setContent-ish} />
```

- `content` is controlled - every keystroke lives in React state, so you can `Ctrl+Z` within the input freely and the submit button enables only when non-empty.
- Below it: an event dropdown (`OptionPicker`), visible only if the events came back from the API (`events.length > 0`).
- **Links** - there is always at least row 1; "Add a link" reveals rows 2+. Each link becomes a chip in the final post.
- **Images** - a hidden `<input type="file">` behind a paperclip label. Choosing a file sets `imagePreview` to a **blob URL** (`URL.createObjectURL(file)`).

<Warning>
**That blob URL is only meaningful in your browser right now.** POSTing it to the API stores the string `blob:https://…`, which nobody else can open. The image doesn't really attach to the post - see [Known issues](../05-reference/known-issues.md).
</Warning>

- The action bar: Paperclip (pick image) · Cancel · **Post** (`handleSubmit`).

## The publish path, line by line

```tsx
const links = socialLinks.filter(l => l.url).map(l => ({ url: l.url, label: l.label }));
const body: any = { content, links, club_id: clubId };
if (imagePreview) body.image_urls = [imagePreview];   // remember: blob URL, not a real upload
if (selectedEventId) body.event_id = selectedEventId;

const res = await apiFetch("/api/club-admin/feed", {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Club-Id": clubId },
  body: JSON.stringify(body),
});
const data = await res.json();
if (data.success) {
  setContent(""); setImagePreview(null); setSelectedEventId("");
  setSocialLinks([{ url: "", label: "" }]); setShowForm(false);
  await fetchPosts();                       // refetch to show the new card
} else alert(data.error || "Failed to create post");
```

Understand 3 things here:

1. **The API expects exactly this JSON shape.** Links must be objects with url+label; empty labels become `""`.
2. **`X-Club-Id` matters more than you think** - it's how the API knows which club's feed to write to even if you passed `club_id` in the body (it double-checks both agree).
3. **On success the draft is wiped and the timeline refetches.** There is no optimistic "insert a fake card and hope" logic - the list is always what the server last said. Slower, always correct.

## Screen half 2 - the timeline

Rendered as an amazeui `Timeline`. Each post renders: relative date ("Today", "Yesterday", "N days ago" or absolute), event badge (`<Badge variant="warning">`) if linked, content text, first image (if any real absolute URL), link pills, and the footer (`Posted <time> · by <reg no>`).

- Posts come **pre-sorted** from the API (`created_at DESC`) - the UI does no sorting; it just paints the array.
- Delete requires a separate confirmation `Dialog` - one tap deletes forever; the dialog is the only friction.
- Deleting calls the API `DELETE /api/club-admin/feed?post_id=<id>` with the same club header, then **local rows are pruned by refetching**, not by filtering client-side optimistically (same philosophy as Post).

## The two silent failure "features"

| Situation | What you see | What the code actually does |
|---|---|---|
| Events API is down | the dropdown just doesn't appear | `fetchEvents` catches, `events` stays `[]` |
| You double-tap Post (or StrictMode remounts) | posts appear only once | `fetchPosts` dedupes by `id` with a `seen` Set |

## Where to next

- **[RepManager](./rep-manager.md)** - super reps only, the other API-mutation tab.
- **[POST/DELETE the feed from the API side](../03-api-integration/feed-endpoints.md)**
