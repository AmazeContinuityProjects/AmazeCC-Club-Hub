---
title: "Security"
description: "What this static website can and cannot protect, where the badge lives, and what attacking looks like - in plain words."
---

# Security

> **In one line:** this site holds one valuable thing (the club token in localStorage); whoever holds it acts as a rep until it expires - so everything here is about keeping it unpossessed.

## What lives in the browser

| Thing | Where | What an attacker does with it |
|---|---|---|
| `club_token` | `localStorage` | everything you can do as a rep — for 7 days |
| `club_roles` | `localStorage` | cosmetic; reveals which clubs you claim |
| your VTOP password | **nowhere** — only in flight to the API over HTTPS | nothing, unless they phish you |

**localStorage has one rule: destroy what's in it with XSS.** A script running in your page's origin can read `localStorage` freely. So there must never be a script injection point in this app.

## Why there is no markdown rendered yet

`react-markdown` is a dependency but nothing imports it. The two markdown fields on the public card (`description`, `hiring_process`) describe the club, not your browser.

**When someone adds markdown rendering here, that's the injection door.** If you do: sanitize (e.g. `skipHtml` + `unwrapDisallowed`) or treat all markdown as untrusted input forever. Public club data is rep-authored (untrusted) text shown to every visitor.

## The three lines of defense

1. **No `dangerouslySetInnerHTML` anywhere.** Find none in the repo (there isn't any). Incident-grade importance if it changes.
2. **All network through `apiFetch`** → every request carries the token; no bespoke fetch with missing headers. Easier to audit.
3. **The API re-checks everything.** The UI is convenience. A rogue frontend can only do what a token can do — which is the same blast radius as a stolen token: one club's admin access for 7 days.

## The secrets you never see

Because this is a static site, there is no `DATABASE_URL`, no `ADMIN_SECRET`, no VTOP password, no HMAC key anywhere in this repo. Gitleaks on CI makes sure it stays that way. If you ever find yourself wanting to "just quickly add the API secret to `.env`" so you can call the API directly — you're building the wrong thing; the app calls the API without secrets because the API is the one with the secrets.

## What you should report immediately

- A mystery new file in `public/` or `.github/`.
- A new `dependency` you didn't ask for.
- `react-markdown` being imported somewhere.
- `.env` gaining a key with the word `SECRET`/`TOKEN`/`PASSWORD` in it.

## Where to next

- **[CI](./ci.md)**
- **[Known issues](../05-reference/known-issues.md)**
