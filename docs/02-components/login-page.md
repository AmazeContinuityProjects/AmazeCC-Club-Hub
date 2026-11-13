---
title: "LoginPage"
description: "The one gate - the credentials form, the exact JSON the API wants, the exact JSON it sends back, and what happens in each branch."
---

# LoginPage

**File:** `src/components/LoginPage.tsx` · **Shown when:** no `club_token` in localStorage · **Job:** turn your VTOP password into a club admin session

> **In one line:** the screen asks VTOP *"is this person who they say they are, and may they represent clubs?"* - the API answers; this app just relays.

## What you're looking at on screen

- a centered glass card with the AmazeCC logo,
- a **VTOP Username** field (auto-uppercased as you type),
- a **VTOP Password** field,
- one button: **Authenticate via VTOP** - named that way because VTOP is doing the actual work, not us,
- a spinner overlay ("VTOP Authentication / Establishing secure gateway…") while waiting.

## The state, in one table

| State | Type | What it does |
|---|---|---|
| `username` | string | the registration number; `onChange` forces uppercase |
| `password` | string | what you type; starts empty (unless the dev-only `NEXT_PUBLIC_VTOP_PASSWORD` is set) |
| `loading` | boolean | shows the spinner overlay and disables the button while we wait |
| `error` | string | red alert box text; `""` when hidden |

## The submit handler, annotated

```tsx
const res = await apiFetch("/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
const data = await res.json();                       // API answered
```

Then three branches, exactly:

```tsx
if (data.success) {
  if (data.clubToken) {
    // 1) Dedupe club roles by club_id, super-club-rep wins on conflict
    const roleMap = new Map<string, any>();
    for (const r of data.clubRoles || []) {
      if (!r?.club_id) continue;                     // skip malformed entries
      const existing = roleMap.get(r.club_id);
      if (!existing || r.role === 'super-club-rep') roleMap.set(r.club_id, r);
    }
    const uniqueRoles = Array.from(roleMap.values());
    // 2) Persist the session
    localStorage.setItem("club_token", data.clubToken);
    localStorage.setItem("club_roles", JSON.stringify(uniqueRoles));
    // 3) Hand control back to the shell
    onLogin(data.clubToken, uniqueRoles);
  } else {
    setError("You do not have club representative privileges.");
  }
} else {
  setError(data.message || data.error || "Login failed");
}
```

Read the three branches as three truths the API can tell us:

1. **"Yes, you exist, and yes, you represent clubs"** → token + roles. The app stores them and moves on.
2. **"Yes, you exist, but no club privileges"** → you're logged in as a student, just not a rep; the screen tells you so and stops. (You can use VTOP for real things; club admin isn't one of them.)
3. **"No." (`success: false`)** → wrong password, blocked account, or captcha failure; the API's `message`/`error` is shown verbatim.

## Why VTOP does the real work

VTOP already has your password. The API knows how to prove that to VTOP (it solves a CAPTCHA, replays the request, follows redirects - you don't have to care). **Your password never touches this repo** - it's posted once to the API over HTTPS and discarded. This app stores only the club token the API mints afterwards (7-day expiry, HMAC-signed).

## What "you don't have club privileges" really means

The API checks whether your registration number appears in `club_representatives` for at least one club. If it appears anywhere, you get a token listing those clubs; else you get a successful login with no club privileges and no token. The fix for that state exists outside this app: a super rep adds your number (from the Reps tab).

## The dev-only convenience nobody should use in prod

`NEXT_PUBLIC_VTOP_USERNAME` / `NEXT_PUBLIC_VTOP_PASSWORD` pre-fill the form when defined. They're baked in at build time - so if they were ever committed (they aren't), everyone who downloaded the JS would read them. Leave them empty; that's the default.

## Where to next

- **[The page & its tabs](./page.md)** - what happens the instant `onLogin` returns.
- **[Auth flow](../03-api-integration/auth-flow.md)** - the same dance from the API's side.
