---
title: "Components"
description: "Every component in the app, what it renders, what state it owns, which API calls it makes - line by line."
---

# Components

> **In one line:** one page (`page.tsx`) that switches between four tab components - and every one of them is a small, self-contained CRUD panel over the club-admin API.

| Page | Component | Talks to |
|---|---|---|
| [The page & its tabs](./page.md) | `page.tsx` | `getClubToken` (localStorage read) |
| [LoginPage](./login-page.md) | `LoginPage` | `POST /api/login` |
| [Sidebar](./sidebar.md) | `Sidebar` | - (props only) |
| [ThemeSwitcher](./theme-switcher.md) | `ThemeSwitcher` | re-exported AmazeUI |
| [FeedManager](./feed-manager.md) | `FeedManager` | feed list/create/delete, `/api/events` |
| [LandingPageBuilder](./landing-page-builder.md) | `LandingPageBuilder` | landing-page read/upsert |
| [ClubDetailsEditor](./club-details-editor.md) | `ClubDetailsEditor` | details read/update |
| [RepManager](./rep-manager.md) | `RepManager` | reps list/add/remove (super reps) |

## The common skeleton every CRUD tab shares

```tsx
export default function XManager({ clubId }: { clubId: string }) {
  const [items, setItems] = useState(…);       // server state, mirrored locally
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {                            // load on mount & club switch
    const controller = new AbortController();
    fetchData(controller.signal).finally(…);
    return () => controller.abort();
  }, [fetchData]);                             // useCallback pins the fn
```

You'll see this exact shape in `FeedManager`, `LandingPageBuilder`, `ClubDetailsEditor` and `RepManager`, with two variations worth memorizing now:

1. **Keying by `clubId`** - the parent (`page.tsx`) renders tabs with `key={clubId}`, so all state resets when the club changes.
2. **Optimistic-ish UX** - components either patch local state from the response or re-fetch after a mutation (`fetchPosts()`), never trust unverified optimistic writes.

## Where to next

- **[The page & its tabs](./page.md)** to see how the four slots are filled.
