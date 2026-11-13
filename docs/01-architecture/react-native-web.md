---
title: "react-native-web & amazeui"
description: "Why this code says View instead of div - the three-layer component stack, explained for someone who has never seen React Native."
---

# react-native-web & amazeui

> **In one line:** this app is written against React Native's vocabulary; a library translates those pieces into browser HTML+CSS at runtime.

## The three layers, top to bottom

### Layer 3 - `@amazecontinuityprojects/amazeui` (the toolkit)

The org's design system: buttons, cards, timelines, sidebars, theme provider, and the design tokens (colors, radii, shadows). This is the vocabulary shared with the actual React Native mobile app (`edu.vit.vitiancc` and `amzcc`). Every interactive element in Club Hub comes from here - `<Button>`, `<Card>`, `<Timeline>`, `<Fab>`, `<OptionPicker>`, `<MobileBottomNav>`.

### Layer 2 - `@/lib/ui.ts` (the import point)

This repo never imports Layer 3 directly. It has **one** file that re-exports every primitive, component and type you may want. The rule is absolute and enforced by habit, not by lint:

```tsx
import { View, Text, Button } from "@/lib/ui";      // yes
import { View, Text } from "@amazecontinuityprojects/amazeui";  // never, actually
```

Why the indirection? When the org updates the library, one file changes, not fifty. And types ride along in the same import. (See that file - it's a plain list, nothing clever.)

### Layer 1 - `react-native` aliased to `react-native-web`

`next.config.ts` webpack block makes `'react-native'` resolve to `'react-native-web'` - the library that turns React Native primitives into DOM elements. So `<View>` becomes a `<div>`, with the same props translated. You never import Layer 1 directly either; it's underneath everything else.

```
your code ──imports──► @/lib/ui ──re-exports──► amazeui ──depends on──► react-native-web ──► HTML
```

## Learning the primitives in five minutes

| Primitive | Browser equivalent | Mental model |
|---|---|---|
| `<View>` | `<div>` | a box that arranges its children |
| `<Text>` | `<span>`/`<p>` | any text |
| `<Pressable>` | `<button>` | tap/click target |
| `<Image>` | `<img>` | image |
| `<TextInput>` (via `<Input>`) | `<input>` | editable field |

You already know all five - it's HTML with different labels.

## Styling: Tailwind v4 through amazeui's tokens

`globals.css` opens with:

```css
@import "@amazecontinuityprojects/amazeui/tailwind.css";
```

That file defines the design tokens as CSS variables: `--background`, `--foreground`, `--card`, `--muted`, `--primary`, `--danger`, `--success`… and the Tailwind v4 classes mapped to them (`bg-background`, `text-foreground`, `border-border`…). **Use them religiously** - they automatically adapt to whichever theme is active (`light`/`dark`/`midnight`). Hand-rolled hex values would freeze one theme in place.

## The `midnight` default

First visit lands on `midnight` (dark navy). The theme switcher component lets the user flip to `light`/`dark`. Theme is stored by the library's own provider (not your code), keyed on `<html class="midnight|dark|light">`.

## If you came from RN instead of web

The translation table you actually need is equally small:

- `flexDirection: 'row'` → `flex-row` in className
- `justifyContent/alignItems` → `justify-*` / `items-*`
- `StyleSheet.create` → avoid it; use className
- `TouchableOpacity` → in this codebase, always `<Button>` or `<Pressable>` from primitives, styled via className

## Where to next

- **[Layout & theming](./layout-and-theming.md)**
- **[Conventions](../00-start-here/conventions.md)**
