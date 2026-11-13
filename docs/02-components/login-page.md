---
title: "LoginPage"
description: "The VTOP login gate - exact request/response handling, role dedupe, and the two places identity comes from."
---

# LoginPage

**File:** `src/components/LoginPage.tsx` · **Rendered when:** `page.tsx` has no `club_token` in localStorage · **Calls:** `apiFetch("/api/login")`

> **In one line:** VTOP credentials in, club token out - the API (not this page) decides whether you're a club rep.

## Props and state

```tsx
export default function LoginPage({ onLogin }: { onLogin: (token: string, roles: any[]) => void })
```

| State | Type | Meaning |
|---|---|---|
| `username` | string | registration number, auto-uppercased in `onChange`; defaults to `NEXT_PUBLIC_VTOP_USERNAME` if defined (dev convenience) |
| `password` | string | raw password; defaults to `NEXT_PUBLIC_VTOP_PASSWORD` (dev convenience) |
| `loading` | boolean | drives the fullscreen overlay + button disable |
| `error` | string | alert text; empty string hides |

## The submit path, exactly

```ts
const res = await apiFetch("/api/login", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
const data = await res.json();
if (data.success) {
  if (data.clubToken) {
    // dedupe clubRoles by club_id (super-club-rep wins) — same Map trick as page.tsx
    const roleMap = new Map<string, any>();
    for (const r of data.clubRoles || []) {
      if (!r?.club_id) continue;
      const existing = roleMap.get(r.club_id);
      if (!existing || r.role === "super-club-rep") roleMap.set(r.club_id, r);
    }
    const uniqueRoles = Array.from(roleMap.values());
    localStorage.setItem("club_token", data.clubToken);
    localStorage.setItem("club_roles", JSON.stringify(uniqueRoles));
    onLogin(data.clubToken, uniqueRoles);
  } else setError("You do not have club representative privileges.");
} else setError(data.message || data.error || "Login failed");
```

Key facts a junior will trip on:

- **`apiFetch` is used here too** - login sends the (absent) `Authorization` header case harmlessly; the API ignores it on `/api/login`.
- **`data.success` is the gate, not HTTP status.** A 200 with `success:false` means VTOP said no.
- **`clubToken` presence is the club-rep check.** The API only issues it when your authorizedID appears in `club_representatives`. No club rep? `success:true` but no `clubToken` - and this page shows the "no club representative privileges" error.
- **`clubRoles` is stored twice**: raw JSON in `localStorage` (read at boot by `page.tsx`) and as `uniqueRoles` passed to `onLogin` (kept in React state). Identical data, two consumers.
- **Deduplication is duplicated on purpose** (here and in `page.tsx`): `page.tsx` re-derives on boot because devs may hand-edit localStorage.
- The catch-all writes `err.message` into the same banner; `finally` always clears `loading`.

## Rendering details

- Fullscreen glow/orb background, glass `Card` (`variant="glass"`), `LoadingSpinner` overlay during the request with the two-line "VTOP Authentication / Establishing secure gateway…" copy.
- Inputs are uncontrolled-ish controlled with RN-web `Input`; username forced uppercase client-side.
- Button label: "Authenticate via VTOP" (not "Login" - deliberate branding of the VTOP dependency).

## After login

`onLogin` in `page.tsx` sets `token`, dedupes roles again, picks the first club as `active_club_id`, writes it to localStorage - the app then renders the shell. **No token refresh, no expiry handling**: club tokens live 7 days (API-side); when one dies every `apiFetch` comes back 401 (the club-admin routes fail with 401 `Unauthorized Club Access`), components show their empty states, and only a manual logout → re-login refreshes. See [known issues](../05-reference/known-issues.md).

## Where to next

- **[The auth flow](../03-api-integration/auth-flow.md)** - the full contract, both sides.
- **[page.tsx](./page.md)** - what happens after `onLogin`.
