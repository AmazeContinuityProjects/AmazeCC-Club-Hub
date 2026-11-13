---
title: "react-native-web & amazeui"
description: "Why the code says View instead of div - react-native-web, the amazeui library, and the @/lib/ui re-export pattern."
---

# react-native-web & amazeui

> **In one line:** the whole UI is written against React Native's primitives, compiled to the browser through react-native-web, and themed with the same amazeui design system the AmazeCC app uses.

## The three layers

| Layer | What it is | Where you see it |
|---|---|---|
| `react-native` (aliased to `react-native-web`) | the primitive component model: `View`, `Text`, `Pressable`, `Image`, `StyleSheet`, `useWindowDimensions` | `transpilePackages` + webpack alias in `next.config.ts` |
| `@amazecontinuityprojects/amazeui` | the design system: composed components (`Button`, `Card`, `Timeline`, `Sidebar`, `OptionPicker`, `Fab`…) + theming (`ThemeProvider`, `useTheme`) | `globals.css`, `layout.tsx`, every component |
| `@/lib/ui.ts` | **this repo's** single import point - re-exports the library + its prop types | every `.tsx` file here |

## Why React Native primitives on the web?

The AmazeCC app is React Native (iOS/Android). Club Hub exists in the same family, and the org writes one component vocabulary instead of two:

```tsx
// what you write
<View className="flex flex-row items-center gap-2">…</View>

// what the browser serves (via react-native-web)
<div class="flex flex-row items-center gap-2 css-view-175oi2r">…</div>
```

Style is className (Tailwind) - react-native-web passes it through to the DOM. The primitives keep layout props (`flexDirection`, etc.) as props, but this codebase overwhelmingly uses className instead, relying on Tailwind for layout.

## `@/lib/ui.ts` - the indirection you should respect

Every `.tsx` imports from `@/lib/ui`, never from `@amazecontinuityprojects/amazeui` directly. Reasons the codebase does this deliberately:

1. **One upgrade surface.** When the library renames something, one file changes.
2. **Types flow in the same import** (`MobileBottomNavItem`, etc.).
3. **No accidental deep imports** that break when the package's internals move.

The re-export list is long but mechanical - `View`, `Text`, `Image`, the full layout/nav/form/overlay/display families, plus every `*Props` type. If you need a component from the library that isn't re-exported, add it there (alphabetized, with its type).

## Tailwind v4 and `globals.css`

```css
@import "@amazecontinuityprojects/amazeui/tailwind.css";
```

Amazeui ships a Tailwind v4 preset: design tokens like `--background`, `--foreground`, `--card`, `--primary`, `--success`, `--danger`, `--muted` as OKLCH CSS variables, plus dark/light/midnight themes. The classes used throughout (`bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground`, `bg-primary`, `text-success`…) resolve through those tokens, which is why the app looks coherent in every theme and why hand-rolling colors is discouraged.

`globals.css` then adds app-level niceties: thin scrollbars, `overscroll-behavior-y: none`, `user-select: none` (inputs/textareas opt back in), and keyframes (`fadeIn`, `slideUp`, `shimmer`).

## The `midnight` default

`layout.tsx` wraps the app in:

```tsx
<ThemeProvider attribute="class" defaultTheme="midnight" enableSystem
  themes={["light", "dark", "midnight"]}>
```

First visit = `midnight` (dark navy). Users can switch with `<ThemeSwitcher />`; the choice persists wherever amazeui stores it (it manages its own theme key - see `layout-and-theming.md`).

## Component props you will see everywhere

- `className` everywhere (Tailwind).
- `variant="glass"` on `Card` - the glassy translucent card used for compose spaces.
- `size="sm" | "icon"` on `Button` - icon-only buttons are explicitly `size="icon"` with a comment ("no stacking issue") where flex-row wrapping was needed for RN-web.
- `dotColor` on `TimelineItem` - the colored timeline rails; the app cycles six hex colors through a const array.

## Where to next

- **[Layout & theming](./layout-and-theming.md)**
- **[Conventions](../00-start-here/conventions.md)**
