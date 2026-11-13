---
title: "The auth flow"
description: "From typed password to working club page - the complete login handshake, explained in human language with the exact bytes exchanged."
---

# The auth flow

> **In one line:** you prove who you are to VTOP once; VTOP's verdict flows back through the API as a 7-day signed badge the browser keeps in localStorage; every later call shows that badge.

## The story in one diagram

```
you                Club Hub (this app)              AmazeCC API                 VTOP
 │  username+password                     │                           │
 │ ───────────────────────────────────►   │  solve captcha (offline)  │
 │                                        │ ──────── POST /login ───► │
 │                                        │ ◄───── 302 + cookies ───── │
 │                                        │  read dashboard           │
 │                                        │  find authorizedID (=you) │
 │                                        │  check club_representatives
 │ ◄───── { success, clubToken, ──────── │                           │
 │          clubRoles }                   │                           │
 │  save badge to localStorage            │                           │
```

## Every field, one on one

**Request** you send:

```json
{ "username": "21BCE0000", "password": "your-password" }
```

**Response** you get back (and what this app does with it):

| Field | You should notice because… |
|---|---|
| `success` | `true` → you authenticated. `false` → VTOP rejected (or captcha broke) – message is in `message`/`error`. |
| `clubToken` | **present only if you represent ≥1 club** – it's the entire reason this screen exists. |
| `clubRoles` | one entry per club you represent: `{ club_id, role }`. Used to populate the picker and gate the Reps tab. |
| `cookies`, `csrf`, `authorizedID` | this app **ignores** them – they're for the API's own VTOP session handling, not for you. |
| `message` | "Login successful!" on success; the failure phrase on `success:false`. |
| `clubRoles[]` role values | exactly `"representative"` or `"super-club-rep"`. Only super-reps can add/remove reps. |

## What happens if you're not a rep

`success: true`, but **no `clubToken`**, and `clubRoles` is empty or absent. This app shows "You do not have club representative privileges." The password was correct; your VTOP account just isn't linked to any club. Nothing this app can do - ask a super rep to add you.

## The badge's job afterwards

```ts
localStorage.setItem("club_token", data.clubToken);       // the badge
localStorage.setItem("club_roles", JSON.stringify(uniqueRoles));
localStorage.setItem("active_club_id", uniqueRoles[0].club_id);
```

Those three lines are the session. From now on every `apiFetch` call adds `Authorization: Bearer <club_token>` and `X-Club-Id: <active_club_id>` automatically - `apiFetch` does it, you never think about it again.

## What the API does with the badge (why it's trusted)

Each club-admin endpoint verifies the token's **HMAC signature** with a server-side secret and reads your identity and club list straight out of it - **no database lookup required**. That's why the API can say "this is Arjun, club `gdgom`, super" in microseconds. The only DB round-trips are the ones that need rows (inserting a post, reading the roster…).

## What dies with a refresh

Nothing of consequence. The token is in localStorage; roles too; the chosen club too. You land back where you were. **Nothing expiring visibly happens to you** until the 7-day token dies - then club-admin calls start 401-ing and this app's tabs silently show empty screens (a known wart - see [known issues](../05-reference/known-issues.md)).

## Where to next

- **[Feed endpoints](./feed-endpoints.md)** – the first thing you'll do with this badge.
- **[Envelopes & errors](./envelopes-and-errors.md)**
