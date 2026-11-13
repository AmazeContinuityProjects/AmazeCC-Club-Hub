---
title: "LandingPageBuilder"
description: "The showcase page editor - two lists that publish to your club's public landing page, staged locally and committed in one Save."
---

# LandingPageBuilder

**File:** `src/components/LandingPageBuilder.tsx` · **Tab:** Landing Page · **Job:** curate the two lists (projects, events) on your club's showcase page

> **In one line:** you're arranging two ordered display lists - the API shows these exact lists on your club's page elsewhere; editing here rewrites what the world sees.

## What your club's landing page actually shows

Someone opens your club in the AmazeCC app and taps "landing". They see your featured **projects** (up to the whole list) and your **popular events**, in the order this app saved them. This component is where that order and content originate.

## The two lists, explained by hand

| List | What you add | Fields | Who it's for |
|---|---|---|---|
| `projects` | your club's notable work | `name`, `description`, optional `link` | visitors evaluating your club |
| `events` | your showcase events | `name`, `description`, optional `link`, optional `date` | visitors deciding to attend |

Each item is `LandingPageItem`: `{ name, description, link?, date? }` - plain text fields only; no uploads, no images (unlike FeedManager, which has an image field).

## The golden rule of this screen

**Everything you edit is local state until you press Save.** The API doesn't see your changes until then. The Save button (a `Fab`, the floating action button in the bottom-right) is the commit; the lists are your staging area.

```tsx
const saveAll = async () => {
  setSaving(true);
  const res = await apiFetch("/api/club-admin/landing-page", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Club-Id": clubId },
    body: JSON.stringify({ club_id: clubId, showcase_projects: projects, popular_events: events }),
  });
```

Note what's NOT here: no `POST` per add, no `DELETE` per remove. One Save carries **both** lists, wholesale (`replace` semantics on the API side: whatever you send is the new truth).

## The editing flow

```tsx
const addItem = () => {
  if (!form.name.trim() || !form.description.trim()) return;   // both required
  const item: LandingPageItem = { name: form.name, description: form.description };
  if (form.link) item.link = form.link;
  if (form.date) item.date = form.date;
  if (showForm === "project") setProjects(prev => [item, ...prev]);  // prepend!
  else setEvents(prev => [item, ...prev]);
  setForm({ name: "", description: "", link: "", date: "" });
  setShowForm(null);
};
```

- Items are **prepended** - the newest appears first in the list and on the public page.
- `date` applies to events only (the field swaps in).
- Removal goes through one shared confirm `Dialog` ("Remove this item from the list?").

## The visual layout

- **Header row**: title + running count (`3 items`), two toggle buttons ("Event"/"Project") choose which form appears.
- **The form**: glass card, animated entry, name/date grid (date only for events), description textarea, link input, Add/Cancel.
- **Projects section** — the first showpiece: icon badge, count badge, timeline-styled cards (`TimelineItem` + `TimelineCard`) with delete icons revealed on hover.
- **Events section** — identical pattern, different amber/icon styling, deletes likewise.
- **Toast** bottom-right on Save result (`Landing page saved!` or the API error).

## The load path

```tsx
const res = await apiFetch(`/api/club-admin/landing-page?club_id=${...}`, { signal, headers: { "X-Club-Id": clubId } });
const data = await res.json();
if (data.success && data.landingPage) {
  setProjects(data.landingPage.showcase_projects || []);
  setEvents(data.landingPage.popular_events || []);
}
```

And if the row doesn't exist yet (first-time clubs), both lists initialize empty with inviting empty-state copy - there is no error UX for "empty club".

## Where to next

- **[ClubDetailsEditor](./club-details-editor.md)**
- **[Landing-page endpoints](../03-api-integration/club-admin-endpoints.md)**
