---
title: "API Integration"
description: "Every call this app makes, the envelope it gets back, and how errors flow - the client-side manual for talking to AmazeCC-API."
---

# API Integration

> **In one line:** one base URL, one `apiFetch` helper, one bearer token, one club header - and two response dialects (wrapped and raw).

| Page | What it covers |
|---|---|
| [The auth flow](./auth-flow.md) | login → clubToken → localStorage → headers on every call |
| [Feed endpoints](./feed-endpoints.md) | list/create/delete posts + the public events picker |
| [Club-admin endpoints](./club-admin-endpoints.md) | details, landing-page, reps - the exact bodies and success gates |
| [Envelopes & errors](./envelopes-and-errors.md) | `data.success` vs raw payloads, alert() vs banners, aborts and StrictMode |

## The one-liner spec for every call

```ts
const res = await apiFetch(path, { method, headers, body, signal });
const data = await res.json();              // or res.text() when raw
if (data.success) { /* mutate local state */ } else { /* banner/alert */ }
```

Nothing else. No SDK, no typed client (the types in this repo are handwritten `any`), no retry logic. If the API contract changes, the fixes live in this table:

| Concern | Where |
|---|---|
| Base URL | `NEXT_PUBLIC_API_URL` at build time ([env vars](../04-operations/env-vars.md)) |
| Headers | `apiFetch` ([how-it-works](../00-start-here/how-it-works.md)) |
| Field-by-field response shapes | [Response shapes](https://docs.amazecc.com/amazecc-api/05-reference/response-shapes) in the AmazeCC-API handbook |

## The target

Default `https://api.amazecc.com` in production; `http://localhost:3000` in this repo's committed `.env`. Always `apiFetch`, never raw `fetch` - you lose the club header otherwise.

## Where to next

- **[The auth flow](./auth-flow.md)**
