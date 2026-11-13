---
title: "Conventions"
description: "The habits every file in this repo repeats - so once you learn five patterns, the whole codebase reads the same."
---

# Conventions

> **In one line:** this repo has one shape: `use client`, RN-web primitives, a `useEffect` that loads data, an `apiFetch` that talks to the API, a `data.success` gate, and `localStorage` for the session.

Don't try to learn "React" first, then this repo. Learn the five patterns below and this repo teaches itself.

## Pattern 1 - everything is a "client component"

Almost every file starts with the exact line `"use client";`. In Next.js, components are either **server** components (rendered ahead of time, it thinks) or **client** components (live in your browser, respond to clicks). This app is 100% interactive, 100% static-exportable, so every file says `"use client"` and nothing depends on a server render.

If you ever see a component without it that uses `useState`, the build will fail - that's what the marker prevents.

## Pattern 2 - primitives instead of HTML

You won't find `<div>` or `<span>` in this codebase. Instead:

```tsx
import { View, Text, Button } from "@/lib/ui";   // NOT from HTML

<View className="flex flex-row items-center gap-2">
  <Text>Club Hub</Text>
</View>
```

`View` ≈ `<div>`, `Text` ≈ `<span>`/`<p>`. They come from `@amazecontinuityprojects/amazeui` (React Native primitives) compiled for the browser via `react-native-web`. Why? Because the main AmazeCC app is written in the same primitives for phones - one component vocabulary across both. The price you pay is a mental translation layer for the first hour; the pay-off is coherence forever.

HTML elements you *will* see: `<form onSubmit>` in LoginPage, `<label>`+`<input type="file">` in FeedManager's image picker. Everywhere else uses primitives.

## Pattern 3 - `useEffect` + `AbortController` = "load my data"

```tsx
useEffect(() => {
  const controller = new AbortController();           // the "stop button" for fetches
  fetchPosts(controller.signal).finally(() => {
    if (!controller.signal.aborted) setLoading(false);
  });
  return () => controller.abort();                    // when the component unmounts or clubId changes: stop
}, [fetchPosts]);
```

In plain words:

1. When this component first appears, run `fetchPosts`.
2. If the component is about to disappear (or the club changed), cancel any in-flight request so we don't waste work or paint stale data.
3. To make (2) work, fetch accepts a `signal` - a "please stop" wire. When you abort it, fetch rejects with `AbortError`, which the code swallows on purpose (it's not an error, it's a stop signal).

`useCallback` wraps the fetch function so React sees the same function on every render and doesn't re-fire the effect forever. If you memorize one sentence: **the effect runs when the listed dependencies change; keep them stable.**

## Pattern 4 - the `data.success` gate

Every mutating call (create/update/delete) returns `{ success: true|false, ... }`. Code reads it the same way every time:

```tsx
const data = await res.json();
if (data.success) { /* patch local state or refetch */ }
else alert(data.error || "fallback message");   // or set an inline banner
```

The handful of raw GET calls (`/api/events`) skip the envelope and are checked with `res.ok` instead. See [Envelopes & errors](../03-api-integration/envelopes-and-errors.md) for the exact catalog of every shape this app consumes.

## Pattern 5 - `localStorage` is the app's notepad

Three keys: `club_token` (the signed badge), `club_roles` (JSON list of clubs you represent), `active_club_id` (which club you're editing). `apiFetch` reads the first two headers' worth of them on every request. Logout deletes all three. If you clear them, you're instantly logged out and the app behaves as first visit.

## Errors that don't look like errors

- **StrictMode**: in development, React mounts components twice on purpose to catch bugs - which fires the fetch effect twice, which is why you'll sometimes see `AbortError` in dev console logs. It's expected.
- **Deduplication by hand**: `FeedManager` filters posts by `id` after fetching (`seen` set); login dedupes club roles by `club_id`. Both are guards against exactly these double-effects and API quirks.
- **Fail-soft loads**: initial fetch failures set state to `[]` and log to console - the UI shows the empty state, never a broken screen. In this repo, a working-looking empty screen is a *feature*, not a bug hide.

## Where to next

- **[The vocabulary](./the-vocabulary.md)** - if a word here still felt fuzzy.
- **[Components](../02-components/index.md)** - patterns applied, one file at a time.
