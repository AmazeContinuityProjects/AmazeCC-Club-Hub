---
title: "ClubDetailsEditor"
description: "The public club profile editor - the directory-facing fields, the logo preview, and the save path."
---

# ClubDetailsEditor

**File:** `src/components/ClubDetailsEditor.tsx` · **Tab:** Club Details · **API:** `GET/POST /api/club-admin/details`

> **In one line:** the form that becomes your club's public directory card and community-feed identity - mission, description, recruitment, socials, logo.

## State inventory

| State | Type | Purpose |
|---|---|---|
| `details` | the `INITIAL_DETAILS` object | all eleven fields, bound 1:1 to inputs |
| `loading` | boolean | first-load spinner |
| `saving` | boolean | FAB spinner during save |
| `message` | `{type, text}` | toast banner |
| `logoPreviewError` | boolean | `<Image>` `onError` latch for the logo URL |

`INITIAL_DETAILS` = `{ mission, description, hiring_process, website, recruitment_link, instagram, whatsapp, poc, email, poc_phone, logo_url }` - exactly the columns `club_details` stores (plus `club_id`, supplied by the caller).

## Read path (exactly)

```ts
GET /api/club-admin/details?club_id=<id>   (X-Club-Id: <id>)
// success && details → all eleven fields copied with || "" fallbacks
// success but no details row → INITIAL_DETAILS (a club with no card yet)
// fetch throws → INITIAL_DETAILS again
```

The component **never 404s** - a missing row just means blank fields.

## Write path (exactly)

```ts
POST /api/club-admin/details
{ ...details, club_id: clubId }
```

The API upserts the whole row (`INSERT … ON CONFLICT (club_id) DO UPDATE`) - again **wholesale replace**, so don't hand-edit `details` expecting a patch semantic. On success: green toast; else the API's error text.

## The logo preview

- `logo_url` drives a gold live preview (`<Image>` with `onError` → `logoPreviewError=true` → gray dashed placeholder).
- On `logo_url` edit the error latch resets (`handleChange` clears it).
- A `<Badge variant="danger">Invalid URL</Badge>` renders next to the label when the URL fails.
- "Open in new tab" button only when the URL is considered valid.
- **The file never uploads** - `logo_url` is a remote reference; paste a raw link (e.g. an R2/B2 public object, an image host, a Drive-direct-link). If VTOP/clubs migrate to uploaded logos, the endpoint to extend is `/api/club-admin/details` (accept a fileId, not a URL) - not this frontend.

## Layout & bits worth noting

- Two-column grid (`lg:grid-cols-3`): left = logo card + Basic Information (mission, description) + Recruitment cards; right = Social & Contact (website/Instagram/WhatsApp, then PoC name, phone, email behind a `border-t` divider).
- `Mission Statement` / `Hiring Process` / recruiting link are the **join-facing** fields - what a prospective member reads. Markdown is accepted for `description` and `hiring_process` (badge says so; the **app** renders them as markdown - `react-markdown` is in this repo's deps for future use; the emails/phone fields are plain).
- FAB (`Fab` from amazeui) bottom-right, primary, `onPress={handleSave}`, spins `Loader2` while saving.

## Where to next

- **[RepManager](./rep-manager.md)** - the last tab.
- **[API Integration → club-admin endpoints](../03-api-integration/club-admin-endpoints.md)**
