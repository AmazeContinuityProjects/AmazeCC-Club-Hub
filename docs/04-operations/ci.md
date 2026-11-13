---
title: "CI"
description: "What runs on every PR - gitleaks, the malware signature scan, lint, typecheck, build, dependency audit - and why the scan exists."
---

# CI

> **In one line:** PRs get secret-scanned, malware-scanned, linted, typechecked and built; pushes to `main` additionally deploy to GitHub Pages.

## `ci.yml` — what every PR and push to main runs

| Job | What it does | Blocking? |
|---|---|---|
| `safety` | **gitleaks** secret scan · **malware signature scan** (see below) | yes |
| `safety` | `pnpm audit --audit-level=high` | **no** (`continue-on-error: true`) |
| `lint` | `pnpm lint` (ESLint flat config) | yes |
| `typecheck` | `pnpm exec tsc --noEmit` | yes |
| `build` | `pnpm build` + verifies `out/index.html` exists | yes |

Runs on PRs to `main` and pushes to `main`. Concurrency group cancels in-flight runs on the same ref.

## The malware signature scan — read this before removing it

```yaml
- name: Malware signature scan
  run: |
    if grep -rIl --exclude-dir=.github … -e 'eth_getBlockByNumber' -e '/0x/cls' …; then
      echo "::error::Suspicious malware markers found in tracked files!"
      exit 1
    fi
```

The comment in the workflow is explicit: this repo previously carried **appended crypto-drainer/C2 droppers** in config files. Someone committed a poisoned config; CI now blocks the known families (`eth_getBlockByNumber`, `x-payload-b64`, `app-vscode-eval`, wallet-drainer C2 patterns). It does not prove the repo is clean — it proves a specific dirty history can't silently return.

<Warning>
**Do not remove this step.** If you ever inherit this repo with a green CI and
don't recognize this check, it is load-bearing. If you want to replace it with
something better (e.g. a real SAST), do that knowingly.
</Warning>

## `nextjs.yml` — what pushes to `main` additionally do

Builds with `actions/configure-pages@v5` (injects `basePath`, disables image optimization), uploads `out/` via `upload-pages-artifact`, deploys to the `github-pages` environment. See [deployment](./deployment.md) for what this means operationally.

## Dependabot

This repo is on Dependabot's weekly schedule (npm_and_yarn group); there are currently ~10 open dependency PRs. Merge them when CI is green — CI is the meaningful gate, not the review.

## Where to next

- **[Deployment](./deployment.md)**
- **[Security](./security.md)**
