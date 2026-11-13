---
title: "ThemeSwitcher"
description: "Five lines of re-export, one dead import - the smallest file in the repo and the clearest cleanup, explained."
---

# ThemeSwitcher

**File:** `src/components/ThemeSwitcher.tsx` · **Size:** 5 lines · **Status:** dead

> **In one line:** it re-exports the theme toggle from the library, and nothing imports it.

## Its entire contents

```tsx
// This component now delegates to AmazeUI's built-in ThemeSwitcher.
// Kept for backwards-compatibility; prefer importing ThemeSwitcher directly
// from "@amazecontinuityprojects/amazeui".
export { ThemeSwitcher } from "@amazecontinuityprojects/amazeui";
```

Read that once more slowly:

- It exports the **exact same `ThemeSwitcher` object** the library ships. No props, no wrapping, no behavior changes.
- Nothing else in this repo imports `src/components/ThemeSwitcher.tsx` - the two call sites (`page.tsx` mobile top bar, `Sidebar` header) import `ThemeSwitcher` from `@/lib/ui`.
- It exists only "for backwards compatibility" - some past code presumably imported `@/components/ThemeSwitcher`. That code is gone now.

## What you should do with it

Delete it. Then `rg "components/ThemeSwitcher"` should show no references (it doesn't), and your build still passes. See [Known issues](../05-reference/known-issues.md).

## The theme toggle it re-exports

The real `ThemeSwitcher` flips between `light` / `dark` / `midnight` by calling the library's `ThemeProvider` methods - no state lives in this file, no localStorage, nothing. The user's choice persists because the provider's config handles that itself.

## Where to next

- **[Layout & theming](../01-architecture/layout-and-theming.md)**
- **[Known issues](../05-reference/known-issues.md)**
