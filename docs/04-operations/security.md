---
title: "Security"
description: "What this static app can and cannot protect - the token model, the .env rule, and the audit trail."
---

# Security

> **In one line:** all authority lives server-side at the API; this app holds only a short-lived token in localStorage - and that is exactly as fragile as it sounds.

## The threat model, honestly

| Asset | Where it lives | Steal it and you… |
|---|---|---|
| VTOP password | never stored; only in the login request body (HTTPS) | log in as the user — for 7 days of club-token minting, or forever if you phish them elsewhere |
| `club_token` | `localStorage` in their browser | act as a club rep until it expires (7 days) — no DB hit needed |
| `active_club_id` | `localStorage` | nothing — it only selects context |

There is no token refresh, no rotation, no server-side session. **XSS = full club takeover** until expiry. Hence:

1. **No `dangerouslySetInnerHTML` anywhere** in this repo (verified — zero hits).
2. **No markdown rendering yet** despite `react-markdown` being a dependency — when you add it, it's an XSS surface: render with `skipHtml`/`unwrapDisallowed` or sanitize (the club `description`/`hiring_process` are rep-authored markdown, i.e. attacker-controlled if a rep turns rogue).
3. **All API calls derive from `apiFetch`** — no bespoke fetch with missing headers to accidentally call the API role-granted elsewhere.

## The .env rule

`.env` in this repo contains **zero secrets** and must stay that way: it's public, baked into the client bundle, readable by anyone on devtools. Anything sensitive belongs to CI's environment or nowhere.

## What the API re-checks (you cannot bypass it)

Even if this app shows you a button, the API independently enforces:

- valid, signed club token on every `/api/club-admin/*` call (else 401),
- club membership in token's `clubs[]` (else 403),
- super-club-rep for rep management (else 403),
- rate limits on `/api/login` (5/min/IP) etc.

**The UI is a convenience layer, not a security boundary.** A modified frontend can only do what the API allows a rep's token - which is the real blast radius.

## Auditability

Every privileged action maps to an API-side audit row (admin_audit_logs for admin actions; club actions don't log VTOP-style, but the API's logs exist on its side). If you need forensic evidence, ask the API team - this app logs nothing.

## The repo's own security hygiene (read this once)

This repo's history includes **appended malware in config files** (see [CI](./ci.md)'s signature scan). If you ever see a mysterious change to a build file that you don't understand: treat it as hostile, `git log -p` it, and tell a maintainer before merging anything that touches it.

## Where to next

- **[Known issues](../05-reference/known-issues.md)**
- **[CI](./ci.md)**
