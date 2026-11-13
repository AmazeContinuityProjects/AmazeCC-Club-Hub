---
title: "Data types"
description: "Every interface this app hands around - exactly as declared, with one-line meanings."
---

# Data types

> **In one line:** the five shapes you actually meet - typed just loosely enough for the API boundary, strictly enough to navigate.

All types below are declared inline in their component files (no shared types module). Reproduced verbatim for reference; `any` appears where the code has it - which is often.

## FeedManager

```ts
interface FeedPost {
  id: number;
  club_id: string;
  content: string;
  links: { url: string; label: string }[];
  image_urls: string[];
  event_id: string | null;
  posted_by: string;          // registration number of the rep who posted
  created_at: string;         // ISO from pg
  promote_count: number;      // arrives as string from pg (int8) - don't do math on it
  has_promoted: boolean;
}

interface SocialLink { url: string; label: string }

interface EventItem {
  eid: string;
  title: string;
  date: string;               // e.g. "Sat 14 Nov"
  posterUrl?: string;
}
```

## RepManager

```ts
interface Rep {
  id: number;                 // server id - but adds use Date.now() client-side (see RepManager)
  vtop_id: string;
  role: string;               // "representative" | "super-club-rep"
  created_at: string;
}
```

## LandingPageBuilder

```ts
interface LandingPageItem {
  name: string;
  description: string;
  link?: string;
  date?: string;              // only set for events
}
```

## ClubDetailsEditor — `INITIAL_DETAILS`

```ts
{
  mission: string;
  description: string;        // markdown
  hiring_process: string;     // markdown
  website: string;
  recruitment_link: string;
  instagram: string;
  whatsapp: string;           // full URL (https://chat.whatsapp.com/…)
  poc: string;
  email: string;
  poc_phone: string;
  logo_url: string;           // raw remote URL - never an uploaded file
}
```

## page.tsx

```ts
// roles are any[] on purpose; the shape is:
// { club_id: string; role: "representative" | "super-club-rep" }

// TAB_LABELS / TAB_DESCRIPTIONS: Record<string, string> keyed by tab id
```

## Props every tab receives

```tsx
{ clubId }: { clubId: string }
```

`key={clubId}` on the parent forces remount on club switch - "stale draft of another club" is impossible by construction.

## Where to next

- **[LocalStorage keys](./localstorage-keys.md)**
- **[Known issues](./known-issues.md)**
