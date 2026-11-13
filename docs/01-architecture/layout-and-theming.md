---
title: "Layout & theming"
description: "layout.tsx line by line - fonts, metadata, ThemeProvider (midnight default), and how globals.css completes the look."
---

# Layout & theming

> **In one line:** `layout.tsx` sets fonts and the theme provider around a single page; everything else is className on amazeui tokens.

## `src/app/layout.tsx`, line by line

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@amazecontinuityprojects/amazeui";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AmazeCC Club Hub",
  description: "Manage your club's presence on AmazeCC",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="midnight"
          enableSystem themes={["light", "dark", "midnight"]}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Line by line:

- **`Geist` / `Geist_Mono` via `next/font/google`** - self-hosted fonts with CSS variables (`--font-geist-sans`, `--font-geist-mono`). `next/font` downloads and subsets at build; no runtime Google Fonts call.
- **`metadata`** - title/description used in the tab strip and social embeds; `manifest: "/manifest.json"` links `public/manifest.json` (name, icons, theme color, display: standalone) - installable as a PWA.
- **`suppressHydrationWarning` on `<html>`** - required because ThemeProvider mutates `<html class>` before React hydrates; without it you'd get dev-mode hydration warnings.
- **`attribute="class"`** - themes toggle the `class` attribute (`light`/`dark`/`midnight`) on `<html>`, which is what Tailwind v4's `dark:`/custom variants key off in amazeui's preset.
- **`defaultTheme="midnight"`** - first paint is midnight; `enableSystem` lets `ThemeSwitcher` offer system-following; `themes` lists the three the app supports.

## The single page

`layout.tsx` provides shell + theme. Everything else happens in `page.tsx` - there is no nested route. `public/manifest.json` (shown in the repo) declares the PWA identity; `globals.css` paints the background and scrollbar aesthetics listed in the [react-native-web page](./react-native-web.md).

## Themes available

| Name | Vibe | When you see it |
|---|---|---|
| `light` | white, indigo accents | explicit choice |
| `dark` | near-black, indigo accents | explicit choice |
| `midnight` | deep navy, glowing accents | **default** |

Switch via the `ThemeSwitcher` component (two copies exist: one exported from `@/lib/ui` (used in Navbar/Sidebar), one legacy re-export file `src/components/ThemeSwitcher.tsx` - see [known issues](../05-reference/known-issues.md)).

## Where to next

- **[The AmazeCC context](./amazecc-context.md)**
- **[react-native-web & amazeui](./react-native-web.md)**
