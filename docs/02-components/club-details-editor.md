---
title: "ClubDetailsEditor"
description: "The public card every student sees - eleven fields, the logo preview trick, and why Save is all-or-nothing."
---

# ClubDetailsEditor

**File:** `src/components/ClubDetailsEditor.tsx` · **Tab:** Club Details · **Job:** write your club's "About" card that everyone reads before joining

> **In one line:** your club's public profile — mission, two markdown stories, links, contact info, and a remote logo URL.

## The eleven fields

Reading order matches the screen: logo, mission, description, hiring process, recruitment link, website, Instagram, WhatsApp, point-of-contact name, phone, email. Grouped the way the cards on screen do:

**Club Icon (the logo)** — the only field with a preview. You paste **any URL**; the component renders it live next to the input. If the image 404s, an `onError` latch flips to a gray dashed placeholder and a red "Invalid URL" badge. The API itself never uploads or hosts the image - this field is a pointer, not a file upload.

**Basic Information** — `mission` (plain text, one line), `description` (**markdown**; what you write here renders as formatted HTML wherever the public card shows it).

**Recruitment** — `hiring_process` (also markdown: how joining works at your club), `recruitment_link` (where the join form lives - Google Forms is the usual suspect).

**Social & Contact** — `website`, `instagram`, `whatsapp`, then `poc` (name), `poc_phone`, `email`.

## The state that matters (eleven inputs, one object)

```tsx
const [details, setDetails] = useState(INITIAL_DETAILS);   // 11 empty strings
```

That single object is the entire edit surface. Every keystroke is one `setDetails(prev => ({ ...prev, [name]: value }))` - which is why `handleChange` is generic and the file stays short despite eleven fields.

## The load path, exactly

```tsx
const res = await apiFetch(`/api/club-admin/details?club_id=${encodeURIComponent(clubId)}`,
  { signal: controller.signal, headers: { "X-Club-Id": clubId } });
const data = await res.json();
if (data.success && data.details) {
  setDetails({ mission: data.details.mission || "", … });   // copy all eleven with fallbacks
} else setDetails(INITIAL_DETAILS);                          // fresh club = blank fields
```

## The Save path, exactly

```tsx
POST /api/club-admin/details
{ ...details, club_id: clubId }
```

The API **upserts the whole row** on `club_id`. There is no "only send changed fields" path; omitting a field doesn't unset it (server-side COALESCE), so this screen always sends everything. The Save toast ("Details saved successfully!") appears for 5 seconds; errors render as a red banner.

## Who sees this data

Anyone opening your club in the AmazeCC app, or the web landing, before they even join. Your mission statement sells the club in two lines; your hiring process answers "but how do I join?" This is why markdown support exists - the public card renders `description` and `hiring_process` as formatted text, not raw symbols.

## The logo preview, complete explanation

```tsx
const hasValidLogo = details.logo_url && !logoPreviewError;

<Image src={details.logo_url}
       onError={() => setLogoPreviewError(true)} … />
```

1. You paste a URL → preview renders it; `logoPreviewError` starts false.
2. URL 404s → the browser fires `onError` → state flips → placeholder + badge.
3. You edit the field → `handleChange` resets the error latch to false → the preview retries.

**Hot take:** use a square image, ideally 256×256+, PNG/WebP. It appears in the directory and the feed - pixelation looks like a broken club.

## Where to next

- **[LandingPageBuilder](./landing-page-builder.md)**
- **[Club-admin endpoints](../03-api-integration/club-admin-endpoints.md)**
