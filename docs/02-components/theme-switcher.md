---
title: "ThemeSwitcher"
description: "A one-file re-export - why it exists and where the real component lives."
---

# ThemeSwitcher

**File:** `src/components/ThemeSwitcher.tsx` · **Size:** 5 lines · **Uses:** `@amazecontinuityprojects/amazeui`

> **In one line:** `export { ThemeSwitcher } from "@amazecontinuityprojects/amazeui"` - a backwards-compatibility shim, nothing more.

## What it contains

```tsx
// This component now delegates to AmazeUI's built-in ThemeSwitcher.
// Kept for backwards-compatibility; prefer importing ThemeSwitcher directly
// from "@amazecontinuityprojects/amazeui".
export { ThemeSwitcher } from "@amazecontinuityprojects/amazeui";
```

## Why it exists and what to do

It pre-dates the centralization in `@/lib/ui.ts`. Nothing in the repo imports it (`page.tsx` and `Sidebar.tsx` import from `@/lib/ui`). It is dead weight kept around for backwards compatibility. If you're cleaning up: delete it, and make sure nothing imports `@/components/ThemeSwitcher` (nothing does). See [known issues](../05-reference/known-issues.md).

## The real component

`ThemeSwitcher` from `@amazecontinuityprojects/amazeui` - the dropdown/cycle control for `light` / `dark` / `midnight` (see [layout & theming](../01-architecture/layout-and-theming.md)).

## Where to next

- **[Layout & theming](../01-architecture/layout-and-theming.md)**
- **[Known issues](../05-reference/known-issues.md)**
