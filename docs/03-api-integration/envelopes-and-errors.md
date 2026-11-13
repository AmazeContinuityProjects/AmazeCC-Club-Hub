---
title: "Envelopes & errors"
description: "The two response dialects, the success gate, and every error-handling pattern used in the code - including the ones that swallow."
---

# Envelopes & errors

> **In one line:** wrap your brain in `data.success` - and learn which few endpoints don't have one.

## The wrapped majority (every mutation + most reads)

```ts
const data = await res.json();
if (data.success) { /* … */ } else { /* banner or alert with data.error */ }
```

Failing that gate with a truthy `data.error`/`data.message` gives you a human message. Components surface it verbatim in an `<Alert>` banner or `alert()`.

## The raw exceptions

| Endpoint | Success body | Failure body | Branch on |
|---|---|---|---|
| `GET /api/events` | bare array | anything? unclear - always checked with `res.ok` | `res.ok` |
| (none others consumed by this app) | | | |

That's it - this app is majority `success`-wrapped; the only raw call in active use is the events picker.

## HTTP status meaning in this app

| Status | Body shape | App behavior |
|---|---|---|
| 200 (most) | `{ success: true, … }` | proceed |
| 200 + `success: false` | `{ success: false, error }` | banner/alert |
| 400 | `{ success: false, error: "Content is required" }` etc. | banner/alert |
| 401 | `{ success: false, error: "Unauthorized Club Access" }` | components show empty states (no redirect) |
| 403 | `{ success: false, error: "Unauthorized: Only super-club-reps can …" }` | banner |
| 404 | `{ success: false, error: "Post not found" }` | banner |
| 429 | global rate-limit body (+`Retry-After`) | banner |
| 500/502/504 | `{ error }` or `{ success: false, error }` | banner |

## Errors that deliberately vanish

1. **`AbortError`** - StrictMode's double-effect, or an aborted club switch during fetch: swallowed silently everywhere. `catch (err) { if (err?.name === "AbortError") return; }` - looks like a bug, isn't.
2. **Initial load failures** - `FeedManager`/`RepManager`/etc. on fetch failure set state to `[]` and log to console. The UI renders the empty state; nothing crashes. Deliberate: never block a club admin on a transient 500.
3. **`handleImageSelect`** - object URL assignment can't really fail; no error path exists (fine for blob URLs).

## Toast/banner mechanics

| Helper pattern | Where | Auto-dismiss |
|---|---|---|
| `setMessage({type, text})` + fixed `<Alert>` | LandingPageBuilder, RepManager, ClubDetailsEditor | `setTimeout` 4–5 s |
| `alert(data.error)` | FeedManager compose/delete | OS dialog |
| `""` (empty text) | all | hides the banner |

Banners render above everything (`fixed bottom-24 right-6 z-50`) with slide-in animations. There's no deduplication or stacking - rapid failures toggle the same slot.

## Where to next

- **[LocalStorage keys](../05-reference/localstorage-keys.md)**
- **[Known issues](../05-reference/known-issues.md)**
