---
title: "Layout & theming"
description: "layout.tsx explained - what the root file contributes before any of your screens render."
---

# Layout & theming

> **In one line:** `layout.tsx` is the frame every page sits in - font choices, page title, the PWA manifest link, one theme provider, and nothing else.

## Line-by-line reading

Open `src/app/layout.tsx`. Here is all of it with commentary - in the order a beginner should understand it:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@amazecontinuityprojects/amazeui";
import "./globals.css";
```

**`import type { Metadata }`** - TypeScript's way of saying "trust me, this shape is right" for the object below; no runtime code comes from it.

**`Geist`, `Geist_Mono`** - fonts; Next downloads them **at build time** and self-hosts them. Your readers never hit Google's servers, and the fonts can't fail to load because the internet hiccuped. `variable: "--font-geist-sans"` mints a CSS variable you can reference anywhere.

**`ThemeProvider`** - amazeui's theme context. Everything below it can read `useTheme()`, and it manages persistence.

```tsx
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
```

Create the two font objects. `subsets: ["latin"]` keeps the download small (no Cyrillic glyphs etc.).

```tsx
export const metadata: Metadata = {
  title: "AmazeCC Club Hub",
  description: "Manage your club's presence on AmazeCC",
  manifest: "/manifest.json",
};
```

`metadata` is how HTML `<head>` gets its `<title>` and the PWA manifest link. `manifest.json` (in `public/`) says "this site is installable" - name, icons, theme color. You don't see this object on screen; the browser does.

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
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

- **`suppressHydrationWarning`** - the theme system mutates `<html class="midnight">` before React boots; this tells React "don't complain the HTML doesn't match what I'd have produced" - that's expected behavior for theme-on-html setups.
- **`<body className="min-h-full flex flex-col">`** - every page starts full height, is a flex column; the page's own content decides what happens from there.
- **`attribute="class"`** - themes toggle the `class` on `<html>`; `defaultTheme="midnight"` - first visit is midnight; `enableSystem` - the provider may follow the OS if the user hasn't chosen; `themes` - the three the css-side actually supports.

And that's everything. `layout.tsx` contains **no** nav, **no** header, **no** app logic - those live in `page.tsx`. Think of it as picture-frame molding, not the painting.

## What about `globals.css`?

`layout.tsx` imports it because CSS must exist to style anything. It opens with `@import "@amazecontinuityprojects/amazeui/tailwind.css"`, then a thin scrollbar style, `overscroll-behavior` (so pull-to-refresh doesn't hijack iOS), and keyframes (`fadeIn`, `slideUp`, `shimmer`). The palette tokens you use everywhere - `bg-background`, `text-foreground`, `border-border` - come from the imported amazeui css-vars file; this one is yours to add to, cautiously (append, don't override).

## Where to next

- **[The AmazeCC context](./amazecc-context.md)**
- **[Layout & theming is only meaningful once you've seen a screen](../02-components/page.md)**
