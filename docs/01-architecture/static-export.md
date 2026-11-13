---
title: "The static export"
description: "output: 'export' explained - what pnpm build produces, what GitHub Pages serves, and what this means for you."
---

# The static export

> **In one line:** `pnpm build` doesn't start a server - it writes a folder of HTML/CSS/JS that GitHub Pages serves verbatim.

## What `output: 'export'` changes

`next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['@amazecontinuityprojects/amazeui'],
  webpack: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        'react-native$': require.resolve('react-native-web'),
      },
    },
  }),
};
```

With `output: 'export'`:

- **`next build` renders the whole app to static HTML** (`out/`). Any client component pages become HTML shells + JS bundles that React hydrates in the browser.
- **No server, no API routes, no ISR.** Anything needing a network happens client-side after load.
- **`process.env.NEXT_PUBLIC_*` is inlined at build time.** `NEXT_PUBLIC_API_URL` becomes a string literal inside the bundle. Changing it requires a rebuild, not a restart.
- **`trailingSlash: true`** makes `/path/` serve `out/path/index.html` - required for clean static hosting.
- **`out/index.html` existing is the deploy gate** - CI verifies this exact file (`test -f out/index.html && echo "Export OK"`).

## What GitHub Pages serves

`.github/workflows/nextjs.yml` does three things on every push to `main`:

1. `pnpm build` with `actions/configure-pages` **injecting the base path** (for project Pages URLs like `<org>.github.io/<repo>/`) and disabling image optimization,
2. `actions/upload-pages-artifact@v3` with `./out`,
3. `actions/deploy-pages@v4` deploying to the `github-pages` environment.

The site is **fully static** - no SSR, no edge functions. The `manifest.json` points at the same static set (`/logo.png`, theme-color etc. - see `public/manifest.json`).

## Why this app can be fully static (and why it must be)

- **All privileged work happens at `api.amazecc.com`.** The DB, VTOP, and auth all live there. This app is a fancy remote control.
- **Static hosting is free and unbreakable.** GitHub Pages: no cold starts, no server to die.
- **The cost: zero server-side brains.** Everything you need must arrive via `NEXT_PUBLIC_*` or at runtime in the browser. No secrets, ever.

## What you can't do here

- No API routes (`app/api/*/route.ts`) - they would be inert; `output: 'export'` ignores them at build.
- No `next/headers`, no auth cookies, no server actions, no middleware.
- No ISR/SSG revalidation jobs - the static files are the product.
- `next/image` needs `unoptimized` or the Pages `configure-pages` shim (already injected by CI).

## The webpack alias you must not remove

`'react-native$': require.resolve('react-native-web')` - without it, Metro-only React Native imports (`react-native`) resolve to the RN package and the web build dies. The `transpilePackages: ['@amazecontinuityprojects/amazeui']` line makes Next run the library's TS through its compiler so the alias applies there too.

## Where to next

- **[react-native-web & amazeui](./react-native-web.md)**
- **[The AmazeCC context](./amazecc-context.md)**
- **[CI](../04-operations/ci.md)**
