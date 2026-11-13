---
title: "CI"
description: "What runs on every pull request, why there's a malware scan, and what 'green CI' actually proves."
---

# CI

> **In one line:** every PR and `main` push gets scanned for leaked secrets, crypto-mining signatures, lint errors, type errors, and a build - then deployed.

## What runs, exactly

| Job | What it checks | If it fails |
|---|---|---|
| **safety** | `gitleaks` + `grep` for known crypto-drainer payloads + `pnpm audit --audit-level=high` (never blocks) | build stops |
| **lint** | `pnpm lint` (eslint) | style accepted nowhere |
| **typecheck** | `pnpm exec tsc --noEmit` | type errors unmergeable |
| **build** | `pnpm build` + `test -f out/index.html` | no deploy |

## The malware scan, explained

```yaml
- name: Malware signature scan
  run: |
    if grep -rIl --exclude-dir=.github … \
      -e 'eth_getBlockByNumber' -e '/0x/cls' -e 'global\.i="A9-971-1"' …; then
      echo "::error::Suspicious malware markers found in tracked files!"
      exit 1
    fi
```

This repo previously shipped **crypto-drainer droppers appended to config files** — someone poisoned the repo on purpose. The scan is a tripwire, not a proof. It detects those specific historical families by their embedded strings: wallet-drainer C2 markers, `eth_getBlockByNumber` (watching for transfers), `app-vscode-eval`, `x-payload-b64`.

**Do not delete this step.** If you see a red X on it on a PR you didn't expect, ask before touching anything - that's why it's there.

## What CI proves, what it doesn't

**Proves:** the repo builds, lints, typechecks, passes basic secret scanning, and has no known flagged patterns.

**Doesn't prove:** that the app actually works against the live API, that a hacked `.env` got cleaned, or that your VTOP session is valid. Those you verify yourself.

## Where to next

- **[Deployment](./deployment.md)**
- **[Security](./security.md)**
