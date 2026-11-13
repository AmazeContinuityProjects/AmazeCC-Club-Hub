---
title: "Components"
description: "The eight files that make the UI - what each one does, in reading order, and the one habit they all share."
---

# Components

> **In one line:** this app has exactly one screen, and eight small files that divide it among themselves.

Reading order for a first tour:

| Page | File | Its one job |
|---|---|---|
| [The page & its tabs](./page.md) | `app/page.tsx` | the frame: login gate, club switcher, tab switching |
| [LoginPage](./login-page.md) | `components/LoginPage.tsx` | prove VTOP identity, get a club token |
| [Sidebar](./sidebar.md) | `components/Sidebar.tsx` | the left rail on desktop |
| [ThemeSwitcher](./theme-switcher.md) | `components/ThemeSwitcher.tsx` | a 5-line shim |
| [FeedManager](./feed-manager.md) | `components/FeedManager.tsx` | the feed: compose, list, delete, link events |
| [LandingPageBuilder](./landing-page-builder.md) | `components/LandingPageBuilder.tsx` | the showcase page editor |
| [ClubDetailsEditor](./club-details-editor.md) | `components/ClubDetailsEditor.tsx` | the public card editor |
| [RepManager](./rep-manager.md) | `components/RepManager.tsx` | super-rep-only roster editor |

## The shared skeleton you'll see in four of them

`FeedManager`, `LandingPageBuilder`, `ClubDetailsEditor`, `RepManager` all do data fetching, so they all rhyme:

```tsx
export default function XManager({ clubId }: { clubId: string }) {
  const [loading, setLoading] = useState(true);   // "are we fetching?"
  const [items, setItems] = useState([]);          // "what the server last said"
  const [message, setMessage] = useState({ type: "", text: "" });  // "temporary banner"

  useEffect(() => {                                // "as soon as we appear, fetch"
    const controller = new AbortController();
    fetchData(controller.signal).finally(/* … */);
    return () => controller.abort();               // "if we're leaving, stop caring"
  }, [fetchData]);
```

Once you know this skeleton, each of those pages reads as variations on the same tune: different fields, different endpoints, different rendering. The variations themselves are the interesting part - and they're documented one page per component.

## Two habits the whole UI shares

- **`key={clubId}` on the tab wrapper in `page.tsx`** - switch clubs, and every tab component is destroyed and recreated clean.
- **Failure = empty screen, not broken screen** - failed loads fall back to `[]` and a quiet `console.error`. The UI never shows a crash wall.

## Where to next

- **[The page & its tabs](./page.md)**
