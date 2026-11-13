---
title: "Conventions"
description: "The patterns every file in this repo repeats - learn them here and the whole codebase reads the same."
---

# Conventions

> **In one line:** client components, RN-web primitives, `apiFetch` everywhere, `data.success` gates, abortable fetches, and `localStorage` as the session.

## File and folder patterns

| Pattern | Example | Meaning |
|---|---|---|
| `src/app/` | `page.tsx`, `layout.tsx` | the single "route" (a one-page app) |
| `src/components/` | `FeedManager.tsx` | one component per file, default export |
| `src/lib/api.ts` | `apiFetch` | the only network door |
| `src/lib/ui.ts` | re-exports | import primitives from here, never from the package directly |
| `docs/`, `grounding/` | this handbook | never imported by the app |

Every component starts with `"use client";`. Next.js App Router defaults to server components; this app has **no server components** - static export can't run them anywhere anyway.

## Primitives, not HTML

```tsx
import { View, Text, Button, Input } from "@/lib/ui";
```

`View` becomes a `<div>`, `Text` a `<span>`, etc. - through react-native-web. Practical consequences:

- **`className`** works (via `react-native-web`'s style interop + Tailwind), but prefer the tokenized utilities (`bg-background`, `text-foreground`, `border-border`) - the theme owns those.
- **`Pressable`/`onClick`** behave like DOM handlers with RN semantics. Event objects in `onChange` handlers are typed `any` deliberately (`(e: any) => setX(e.target.value)` - untyped RN-web events).
- No `<div>`/`<span>`/`<p>`/`<form>` by convention - the only exceptions are `label`/`input` used inside the compose card (`FeedManager.tsx` uses a raw `<input type="file">` + `<label htmlFor=…>` deliberately for the file picker UX) and a `<form onSubmit>` in `LoginPage.tsx`.

## The `data.success` gate

Almost every mutating call answers `{ success: true|false, ...rest }` (some GETs answer raw - see the [API Integration](../03-api-integration/index.md) pages). Components do exactly one of:

```ts
const data = await res.json();
if (data.success) { /* apply change + local state patch */ }
else alert(data.error || "<fallback message>");
```

Never branch on HTTP status when a `success` flag exists. The handful of raw GETs (`/api/events`) branch on `res.ok` instead.

## Abortable effects, every mount

```tsx
useEffect(() => {
  const controller = new AbortController();
  fetchPosts(controller.signal).finally(/* … */);
  return () => controller.abort();
}, [fetchPosts]);
```

- **Stop** = component unmounts or `clubId` changes.
- `AbortError`s are swallowed on purpose - React StrictMode double-invokes effects in dev, and an `AbortError` on cleanup is normal, not an error.
- `useCallback` pins the fetch to its dependencies so effects don't loop.

## `key={clubId}` remounts

In `page.tsx`, every tab content gets a template-string `key` of tab-name plus the active club id, so React unmounts and remounts the subtree on club switch - no stale posts from the previous club, no cross-club leakage. If you add a tab, give it the same treatment.

## Deduplication at the boundary

`FeedManager` dedupes posts by `id` after fetch (with a `seen` Set) because the API or a StrictMode double-effect could deliver duplicates. Login dedupes `clubRoles` by `club_id` preferring `super-club-rep`. Same habit, two places: **if the source might duplicate, dedupe in the component.**

## Error UX

There is no global error boundary or toast system wired - components use, in rough order of preference:

1. `setMessage({ type, text })` inline `<Alert>` banners (auto-dismissed with `setTimeout`),
2. `alert(...)` for one-off failures (FeedManager's compose/delete paths),
3. `console.error` + `[]`-shaped fallbacks for loads (empty screens are better than crashed ones),
4. FAB/overlay spinners during mutations (`saving`, `adding`, `refreshing`).

## LocalStorage keys are contractual

`club_token`, `club_roles`, `active_club_id` - documented in [LocalStorage keys](../05-reference/localstorage-keys.md). Never write new keys without adding them to that table.

## Where to next

- **[Components](../02-components/index.md)** - these conventions applied, file by file.
- **[API Integration](../03-api-integration/index.md)** - the success/raw envelope zoo.
- **[Known issues](../05-reference/known-issues.md)** - where the code and the docs quietly disagree today.
