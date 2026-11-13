---
title: "How it works, end to end"
description: "One button click, every hop - browser, JavaScript, fetch, HTTP, the API, Postgres - walked through plainly and precisely at the same time."
---

# How it works, end to end

> **In one line:** you click New Post; the browser asks a distant computer to save that post (via the API); the computer re-checks you're a rep; it writes a row to its database; the browser refreshes the list - all inside two or three seconds.

This page follows **one real click** through every layer: **you press Post → the new card appears in your timeline**. Keep your finger on the code (`src/components/FeedManager.tsx`) while you read.

## Step 1 - the browser sees your click

Every interactive thing on a web page is an event. The Post button is a `<Button>` rendered by this component, and React attached an `onClick` behavior to it - `handleSubmit`.

```tsx
// src/components/FeedManager.tsx (the important idea, abridged)
const handleSubmit = async () => {
  if (!content.trim()) return;               // nothing to post → stop
  const links = socialLinks.filter(l => l.url);
  const body = { content, links, club_id: clubId };
  const res = await apiFetch("/api/club-admin/feed", {
    method: "POST",                            // telling the server "create"
    headers: { "Content-Type": "application/json", "X-Club-Id": clubId },
    body: JSON.stringify(body),                // the message contents, as JSON text
  });
```

Three new things to internalize reading that:

- **`async/await`** - `await` means "pause this function until the network finishes, but don't freeze the page." The rest of the app stays responsive while we wait.
- **`JSON.stringify(body)`** - turns the JavaScript object into the JSON text `{ "content": "…", "links": [...], "club_id": "…" }` because HTTP bodies travel as bytes, not JS objects.
- **`apiFetch`** - the one function in this repo that talks to servers (see Step 2).

## Step 2 - `apiFetch` stamps your identity on the request

`src/lib/api.ts` is the only place that knows the API lives at `https://api.amazecc.com` (or your `NEXT_PUBLIC_API_URL`). Before every request it attaches two headers:

```ts
export function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getClubToken();               // what's in localStorage right now

  if (token && !headers.has("Authorization"))
    headers.set("Authorization", `Bearer ${token}`);   // <- "who I am", cryptographically signed

  if (typeof window !== "undefined") {
    const activeClubId = localStorage.getItem("active_club_id");
    if (activeClubId && !headers.has("X-Club-Id"))
      headers.set("X-Club-Id", activeClubId); // <- "which club I'm acting for"
  }

  return fetch(apiUrl(path), { ...init, headers });    // the browser sends the request
}
```

Read it like a recipe:

1. Take whatever headers the caller gave me, or make a new set.
2. If I have a club token (you logged in earlier), add `Authorization: Bearer <token>`. The API uses it to know you're you without you typing anything.
3. If I know which club you're editing, add `X-Club-Id: <clubId>` - the API uses **this** to know which club's feed to write to.
4. **Actually send the request** with `fetch` - the browser's built-in courier.

<Note>
`fetch` is part of the browser itself - you don't install it. It promises a
`Response` back, and the `Response` contains status + headers + body.
</Note>

## Step 3 - the request crosses the internet

The request travels from your browser to `api.amazecc.com` as raw bytes: method (`POST`), path (`/api/club-admin/feed`), headers (your two identity headers + `Content-Type: application/json`), then the JSON body. The server (a computer in a data center) receives it, passes it through **CORS** first, then to the **route handler** for `POST /api/club-admin/feed`.

## Step 4 - the API checks, stores, answers

(The next pages of this handbook cover these paths in more depth; here's the 5-second recap.)

1. The route handler sees the `Authorization: Bearer` header.
2. It **verifies the token's signature** (HMAC) and reads your identity and club list out of it. No database round-trip needed just to know who you are.
3. It checks: is the club you want in your token's clubs list? If not → `403 Unauthorized for this club`.
4. If content is present, it `INSERT`s a row into `club_feed` (Postgres - a database that stores data as tables, like a super-strict spreadsheet).
5. It answers with `{ "success": true, "post": { …the row we just wrote… } }`.

## Step 5 - the browser gets the answer

Back in `handleSubmit`:

```tsx
  const data = await res.json();               // parse the JSON text into a JS object
  if (data.success) {
    setContent("");                            // clear the composer
    setImagePreview(null);
    await fetchPosts();                        // reload the timeline so the new card shows up
  } else alert(data.error || "Failed to create post");
```

If the API said no (`success: false`), the app shows the API's `error` text in an `alert()` instead - you never "post" without knowing why.

## Step 6 - React quietly re-renders

`fetchPosts` calls the API again, `setPosts(unique)` updates state, and **React redraws the timeline** automatically. That's the whole point of React's state model: you don't command the screen to redraw; you change state and the framework handles the pixels.

## Why this design (and not "render on the server")

- **Static files are unbreakable.** `out/` is just files; GitHub Pages serves them for free forever.
- **All the interesting logic lives in one place** (the API), not split across browser code that you can't secure.
- **The cost:** every privileged decision happens at the API; this app is a glorified remote control. That's the right trade for an app this size.

## One diagram to burn in

```
   YOU            THIS APP                         THE API
  ──────           ────────                        ───────
  click Post ──►   apiFetch('/api/club-admin/feed') ──► checks token, checks club, writes row
                 ◄──────── returned JSON { success } ──┘
  see new card ◄── state update re-renders timeline
```

## Where to next

- **[Conventions](./conventions.md)** - the habits every file here repeats.
- **[The auth flow](../03-api-integration/auth-flow.md)** - steps 3-5 zoomed all the way in.
- **[FeedManager](../02-components/feed-manager.md)** - the component behind Post.
