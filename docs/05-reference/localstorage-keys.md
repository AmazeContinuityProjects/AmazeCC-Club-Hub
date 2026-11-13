---
title: "LocalStorage keys"
description: "The three localStorage keys this app owns - exact readers, writers and consequences of clearing."
---

# LocalStorage keys

> **In one line:** three keys, one table each owner - clear them and the app forgets you completely.

| Key | Written by | Read by | Contents | Clearing it… |
|---|---|---|---|---|
| `club_token` | `LoginPage` (on login) | `apiFetch` (every call) | the club JWT (HMAC, `typ: 'club'`, 7-day exp) | every subsequent API call is unauthenticated → 401s → empty tabs; only fix is logging in again |
| `club_roles` | `LoginPage` (deduped) | boot effect (`page.tsx`) | JSON array of `{ club_id, role }` - used for the club picker and super-rep gating | boot falls back to first club; reps tab hides itself |
| `active_club_id` | `page.tsx` (boot fallback, login, switch) | `apiFetch` + club picker | the club being administered | defaults to first represented club on next boot |

## On logout

`handleLogout` deletes all three. Nothing else is cleared (the API is stateless; the keys are all client-side residue).

## Keys this app deliberately does not use

- `vtop_*`, `aura_*`, `amazecc_*` - belong to sibling apps; don't touch.
- Theme preference - managed by `@amazecontinuityprojects/amazeui`'s `ThemeProvider` (its own storage); not part of this contract.

## Rules

1. **Never invent new keys without adding them to this page.** The handbook is the contract.
2. **Never store secrets beyond `club_token`.** It already buys exactly what the API grants - more keys = more blast radius.
3. **Treat `club_roles` as advisory.** The API enforces privilege; the local copy is a UI convenience that can lie.

## Where to next

- **[Auth flow](../03-api-integration/auth-flow.md)**
- **[Data types](./data-types.md)**
