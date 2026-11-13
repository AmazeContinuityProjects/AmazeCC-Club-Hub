---
title: "Known issues"
description: "The honest list - every wart, why it is there, and what to do with it - so nobody 'fixes' the wrong thing."
---

# Known issues

> **In one line:** this page is the not-advertised changelog - what is broken, what is deferred, and what nobody dares touch yet.

<a id="images-are-object-urls"></a>

## The image upload is fake

`FeedManager` picks a file, makes a blob URL (`URL.createObjectURL(file)`), and POSTs `image_urls: [blob:…]` to the API. The API stores the string; nobody — not even you after a reload — can dereference it.

**Fix sketch:** upload the file to object storage, send the public URL, or drop images until there's a real upload endpoint.

## Prod builds call localhost

The committed `.env` says `NEXT_PUBLIC_API_URL=http://localhost:3000`, and CI doesn't override it. GitHub Pages serves the built bundle → every deployed visitor's browser calls *their own* local machine.

**Fix sketch:** `env: { NEXT_PUBLIC_API_URL: https://api.amazecc.com }` on the Build step in `nextjs.yml`, or delete `.env` (the code's fallback is already production). See [Env vars](../04-operations/env-vars.md).

## Tokens die on day 7 and nothing notices

The club token expires after 7 days. Every API call starts returning 401. This app doesn't redirect to login or show a banner; each tab silently shows its empty state. Users assume the app is broken.

**Fix sketch:** a shared 401 detector in `apiFetch` that clears storage and reloads — three lines of code, outsized user delight.

## `ThemeSwitcher.tsx` is dead

Nothing imports it; both call sites use `@/lib/ui`. Safe to delete.

## Package name is `temp-club-hub`

Placeholder from day one, never updated. Cosmetic but embarrassing; change when you touch `package.json` next.

## README promises more than exists

Any unlisted feature in the README is aspirational. The shipped set is exactly the four tabs.

## `promote_count` tricked the type system

pg `int8` → string. Treating it as `number` works for display but any arithmetic silently yields NaN. Cast or don't math it.

## `key={clubId}` destroys drafts on club switch

Switching clubs wipes every in-progress edit. Intended (no cross-club bleed), unsurprising once you know it, undocumented before this page.

## `alert()` instead of banners in FeedManager

Everywhere else uses inline `<Alert>`; FeedManager still uses OS dialogs. Cosmetic, jarring, harmless.

## What belongs in the next PR

- `.env` fix (see env-vars) or CI override — **blocker for real prod use**.
- Shared 401 redirect.
- Real image upload (or punt the feature).
- `package.json` name + README refresh.
- Delete `ThemeSwitcher.tsx`.
