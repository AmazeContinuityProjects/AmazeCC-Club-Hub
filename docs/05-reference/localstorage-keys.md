---
title: "LocalStorage keys"
description: "The complete storage contract - three keys, exact readers/writers, consequences of deleting."
---

# LocalStorage keys

> **In one line:** this site owns exactly three entries in your browser's localStorage - break them by name and the app resets to a fresh logged-out state.

| Key | Type | Written by | Read by | What happens if you delete it |
|---|---|---|---|---|
| `club_token` | string (JWT, 7-day expiry) | `LoginPage` after `POST /api/login` | every `apiFetch` call, as `Authorization: Bearer …` | any API call is unauthenticated → 401s → empty tabs |
| `club_roles` | JSON string array of `{club_id, role}` | `LoginPage` | the boot effect in `page.tsx` | picker empty, Reps tab hidden, no tab switch |
| `active_club_id` | string (club id like `gdgom`) | `page.tsx` boot effect / login / switcher | `apiFetch` (as `X-Club-Id`) + club picker | defaults to your first-represented club on next boot |

## Who else writes into localStorage

The amazeui theme provider stores its own key for light/dark/midnight — not part of this contract; don't touch it.

## Clearing everything for a fresh start

In devtools console:

```js
localStorage.removeItem("club_token");
localStorage.removeItem("club_roles");
localStorage.removeItem("active_club_id");
// reload — you'll be at the login screen
```

Or open an incognito window — simplest possible "log in as someone else".

## The three rules of this contract

1. **Never add a fourth key without documenting it here.** Small app, one contract.
2. **Never store anything beyond the badge and the picker state.** More stuff = more attack surface for XSS.
3. **The token IS the session.** Treat it exactly like a session cookie, just clumsier.

## Where to next

- **[Data types](./data-types.md)**
- **[Known issues](./known-issues.md)**
