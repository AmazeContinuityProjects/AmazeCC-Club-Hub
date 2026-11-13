---
title: "AmazeCC Club Hub, in one paragraph"
description: "What Club Hub is: the client-side admin console AmazeCC club representatives use, and how it fits into the AmazeCC ecosystem."
---

# AmazeCC Club Hub

> **In one line:** the companion website where AmazeCC club representatives log in with their VTOP credentials and run their club's presence - the public details page, the community feed, the showcase landing page, and the rep roster.

AmazeCC is a student portal that replaces VIT's official services for 20,000+ students. AmazeCC Club Hub is its sibling for clubs: a **static web app, hosted on GitHub Pages**, that talks to the AmazeCC API directly from your browser. There is no backend in this repository - every dynamic thing you see is an API call away.

## Who uses this

- **You** - the club representative (or the engineer about to maintain this repo). You have a VTOP account with club representation privileges.
- **Club members and students** - they never see this app; they see the public pages your work produces in the AmazeCC app.

## What this handbook covers

1. **Start here** - this page, a five-minute quickstart, how a click flows through the stack, and the conventions.
2. **Architecture** - the static export, react-native-web, the amazeui component library, theming.
3. **Components** - every component, line by line: what it renders, what state it holds, which API calls it makes.
4. **API Integration** - the club-auth flow and the exact contract for every endpoint the app calls.
5. **Operations** - env vars, build and deploy, CI and the security scans.
6. **Reference** - localStorage keys, data types, known issues (yes, there are some).

## How it fits with the other repos

| Repo | What it is | Talks to this app via |
|---|---|---|
| `AmazeContinuityProjects/AmazeCC-API` | the scraping/JSON backend | this app calls it; it enforces club auth |
| `AmazeContinuityProjects/AmazeCC` | the student-facing app | renders the public club pages this app edits |
| `AmazeContinuityProjects/AmazeCC-Club-Hub` | **this repo** | - |
| `AmazeContinuityProjects/docs` | the Mintlify docs site | builds this handbook |
| `AmazeContinuityProjects/AmazeCC-Dashboard` | the admin portal for ops | same API family, different audience |

<Note>
The API handbook lives in the same docs site under the **AmazeCC-API** tab - the
contract details (exact response fields, typed vs untyped) are documented there
in [Response Shapes](https://docs.amazecc.com/amazecc-api/05-reference/response-shapes).
This handbook points to those pages instead of duplicating field tables.
</Note>

## The shape of the app

One screen, four tabs (three if you're not a super rep):

| Tab | What you do there | Component |
|---|---|---|
| Feed Manager | Post club updates, links, images, linked events | `FeedManager` |
| Club Details | Mission, description, recruitment, socials, logo | `ClubDetailsEditor` |
| Landing Page | Showcase projects & popular events on your club's landing page | `LandingPageBuilder` |
| Manage Reps | Grant/revoke representative access | `RepManager` (super reps only) |

## Where to next

- **[Quickstart](./quickstart.md)** - run it locally.
- **[How it works, end to end](./how-it-works.md)** - the path a click takes.
- **[The AmazeCC-API tab](https://docs.amazecc.com/amazecc-api)** - the backend manual.
