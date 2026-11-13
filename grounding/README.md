# AmazeCC Club Hub - Docs Grounding

Everything under `grounding/` is the working brain of the handbook in `docs/`:
the writing standard, the regeneration script for the child navigation manifest,
and this map. If you change the docs, read this first.

## What these docs are

A junior developer's complete manual for **AmazeCC Club Hub** - the companion
admin console that AmazeCC club representatives use to run their club: the
public directory entry, the community feed, the showcase landing page, and the
representative roster. It is a Next.js static frontend (a client-only SPA
embedded in a static export) that talks directly to the AmazeCC API from the
browser. It knows nothing about AmazeCC's internals except the API contract.

The tone is spoonfed: nobody is assumed to know Next.js, React, react-native-web,
static exports, or the API's auth model. Every page answers the same three
questions: *what is this*, *why is it shaped like this*, *how do I use it*.

The handbook moves to public docs via `AmazeContinuityProjects/docs` (the
Mintlify site at https://docs.amazecc.com). The multirepo sync copies `docs/`
into `amazecc-club-hub/` and merges `docs.json` into the site's
`AmazeCC Club Hub` tab. Do not hand-edit the synced copies - edit here.

## Layout

| File | Purpose |
|---|---|
| `writing-standard.md` | The house style - audience, tone, per-page checklist. |
| `gen-child-docs.mjs` | Regenerates `docs/docs.json` (the child navigation manifest) from the folder layout. Idempotent. |

## The sync loop

1. You edit files under `docs/` on this repo's `modifs` branch (see the open
   PR #5 - the docs ride the same train to `main`).
2. The `Notify docs repo` workflow dispatches `docs-updated` to
   `AmazeContinuityProjects/docs` (needs `DOCS_DISPATCH_TOKEN`, seeded).
3. That repo's `Aggregate docs` workflow re-syncs and Mintlify redeploys.
4. `docs.amazecc.com` reflects it. If anything fails mid-loop, the previous
   deployment stays live - the sync never mutates the site before a new build
   passes validation.

## The honest bits

This repo is early-stage. The docs describe the code as it actually is, not as
the README promises (the README's feature list is aspirational). Where reality
and documentation disagree, the docs say so - see `05-reference/known-issues.md`.
