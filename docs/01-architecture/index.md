---
title: "Architecture"
description: "How Club Hub is put together: static export, react-native-web, amazeui, theming - and why every choice follows from being an AmazeCC companion."
---

# Architecture

> **In one line:** a one-page static React app written in React Native primitives, themed like AmazeCC, deployed to GitHub Pages, and entirely dependent on the AmazeCC API at runtime.

| Page | Read it when you… |
|---|---|
| [The static export](./static-export.md) | …need to know why there is no server, how `out/` becomes a website, or what `NEXT_PUBLIC_*` baking means for you |
| [react-native-web & amazeui](./react-native-web.md) | …wonder why the code has `View`/`Text` instead of `<div>`/`<span>`, or how to style things |
| [Layout & theming](./layout-and-theming.md) | …touch `layout.tsx`, fonts, or want to understand the `midnight` default theme |
| [The AmazeCC context](./amazecc-context.md) | …need the ecosystem map: which repo owns what, and which API endpoints this app consumes |
