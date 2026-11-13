---
title: "The auth flow"
description: "Credential in, club token out - the complete handshake, both sides, and where it breaks."
---

# The auth flow

> **In one line:** this app POSTs your VTOP credentials to the API; the API checks VTOP, signs a 7-day club JWT, and the app stores it in localStorage forever (until logout).

## Sequence, precisely

```
Club Hub (browser)                          AmazeCC API                      VTOP
  │ POST /api/login {username, password}    │                                │
  │ ─────────────────────────────────────▶  │  solve captcha (offline)      │
  │                                         │ ─── POST /vtop/login ──────▶  │
  │                                         │ ◀── 302 + cookies + csrf ───── │
  │                                         │  parse dashboard              │
  │                                         │  authorizedID from HTML       │
  │                                         │  look up club_representatives │
  │                                         │  (and signClubToken if any)   │
  │ ◀── { success, cookies, csrf,           │                                │
  │        authorizedID, clubToken?,        │                                │
  │        clubRoles? } ──────────────────  │                                │
  │ store: club_token, club_roles,          │                                │
  │        active_club_id                   │                                │
```

**From the client's perspective, only five fields matter:** `success`, `clubToken`, `clubRoles`, `message`/`error`, and (ignored) the rest.

## The exact response (success with club privileges)

```json
{
  "success": true,
  "message": "Login successful!",
  "cookies": "JSESSIONID=…; _csrf=…; Authorization=…",
  "csrf": "<current _csrf>",
  "authorizedID": "21BCE0000",
  "clubToken": "eyJhbGciOi…",
  "clubRoles": [
    { "club_id": "gdgom", "role": "super-club-rep" },
    { "club_id": "vitfc", "role": "representative" }
  ]
}
```

Key properties of `clubToken`:

| Fact | Consequence |
|---|---|
| HMAC-signed JWT, `typ: 'club'` | the API verifies every club-admin call without a DB hit |
| 7-day expiry | week-old sessions silently die; app shows empty states, never a login redirect |
| Carries `vtop_id` + `clubs[]` | `GET /api/club-admin/reps` can answer "am I a super rep" locally |
| Revocable via `club_representatives` delete | not instant - token re-verified against DB only at minting |

## Role deduplication (three copies, one rule)

The API may emit duplicate roles for a club (grant history) - **never trust the raw array**. Both `LoginPage` and `page.tsx` (and conceptually any consumer) apply:

```ts
const map = new Map<string, any>();
for (const r of roles) {
  if (!r?.club_id) continue;
  const existing = map.get(r.club_id);
  if (!existing || r.role === "super-club-rep") map.set(r.club_id, r);
}
// one entry per club_id, super-club-rep wins
```

Net effect: the UI's club list shows exactly one row per club, and `isSuperRep` is true for any club where you hold a super grant.

## localStorage is the session store

| Key | Written when | Read by |
|---|---|---|
| `club_token` | login | every `apiFetch` call (adds `Authorization: Bearer …`) |
| `club_roles` | login | boot effect (`page.tsx`) + login page dedupe |
| `active_club_id` | login/boot/club-switch | every `apiFetch` (adds `X-Club-Id`) |

No refresh flow exists. When the token dies the API answers 401s; the app doesn't redirect - each component shows its own empty/blocked state (see [known issues](../05-reference/known-issues.md)).

## Failure modes and what you should tell a user

| Symptom | Meaning |
|---|---|
| "Invalid Captcha" | the API's solver missed - retry |
| "Invalid Username / Password" | wrong creds or VTOP blocked them |
| "You do not have club representative privileges." | login OK, but zero club grants |
| 502 / 504 | VTOP flake or slow captcha phase |
| 429 | 5 logins/minute/IP exceeded |

## Where to next

- **[Envelopes & errors](./envelopes-and-errors.md)**
- **[Response shapes](https://docs.amazecc.com/amazecc-api/05-reference/response-shapes/auth-system)** - `/api/login` documented field-by-field.
