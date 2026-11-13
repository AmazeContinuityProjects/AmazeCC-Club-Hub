---
title: "Data types"
description: "Every interface you'll encounter in the code, copied inline from the source, with one-sentence stories."
---

# Data types

> **In one line:** seven shapes cover everything the app passes around — all declared in their files, nothing funky.

## FeedManager

```ts
interface FeedPost {
  id: number;
  club_id: string;
  content: string;
  links: { url: string; label: string }[];
  image_urls: string[];
  event_id: string | null;
  posted_by: string;
  created_at: string;          // pg timestamptz, ISO-ish string
  promote_count: number;       // arrives as a *string* from pg int8 — don't do math
  has_promoted: boolean;
}

interface SocialLink { url: string; label: string }
interface EventItem { eid: string; title: string; date: string; posterUrl?: string }
```

## LandingPageBuilder

```ts
interface LandingPageItem {
  name: string;
  description: string;
  link?: string;
  date?: string;      // only for events
}
```

## RepManager

```ts
interface Rep {
  id: number;           // client uses Date.now() for optimistic adds
  vtop_id: string;
  role: "representative" | "super-club-rep";
  created_at: string;
}
```

## ClubDetailsEditor

The eleven string fields:

```ts
{
  mission: string;
  description: string;     // markdown field
  hiring_process: string;  // markdown field
  website: string;
  recruitment_link: string;
  instagram: string;
  whatsapp: string;
  poc: string;
  email: string;
  poc_phone: string;
  logo_url: string;
}
```

Nothing exotic anywhere — copy these into a scratch file, rename freely.

## API request/response envelopes (app-wide)

```ts
// wrapped
{ success: boolean; error?: string; message?: string; /* …domain fields */ }

// events picker — the only raw one
Array<{ eid: string; title: string; date: string; posterUrl: string; … }>
```

## Where to next

- **[Known issues](./known-issues.md)**
