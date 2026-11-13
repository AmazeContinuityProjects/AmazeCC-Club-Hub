---
title: "AmazeCC Club Hub, in one paragraph"
description: "What Club Hub is, for whom, and the shape of every page in this handbook - written for someone who has never done web development."
---

# AmazeCC Club Hub

> **In one line:** the website club representatives use to manage their club's public presence on AmazeCC - built as a plain static website that talks to the AmazeCC API from the browser.

You open the site in a browser, you log in with the same VTOP username and password you use for everything else at VIT, and you edit your club's public image. That is the entire job of this app. What happens *behind* that sentence is what this handbook teaches.

## What you can actually do with it

| Tab | What you edit | Auth needed |
|---|---|---|
| Feed Manager | Your club's posts on the community feed - text, links, images, linked events | club rep |
| Club Details | Your club's public profile: mission, description, recruitment, socials, logo | club rep |
| Landing Page | Your club's showcase page - featured projects and popular events | club rep |
| Manage Reps | Who can act as your club's admin (add/remove registration numbers) | **super club rep only** |

## What built it, and why it exists

- **AmazeCC** is the student portal that replaces VIT's official services. It has a public club directory where each club is a card with mission, description, contact details, a feed, etc.
- **AmazeCC-API** is the backend that scrapes VTOP and does the clever work; it's where all club data actually lives.
- **Club Hub** is neither - it's the tiny console club admins use to edit that data. It is kept deliberately small: a static website (files only, no server) that calls the API from your browser.
- This handbook teaches **Club Hub** itself - the code in this repo. You need the API handbook too (same docs site, next tab over) - it documents the general backend contract, and this handbook documents how this particular app uses it.

## Who reads this

You: someone who can write HTML/JavaScript but has never built a "proper" web app, doesn't know React, doesn't know Next.js, doesn't know how a browser talks to a server - and is about to work on Club Hub (or just wants to understand it). Every unfamiliar word is defined the first time it appears, and there's a [vocabulary page](./the-vocabulary.md) if you want it up front.

## The shape of every page

Every chapter answers the same three questions:

1. **What is this?** - a plain-English story of the thing.
2. **Why is it shaped like this?** - the decision that made it that way.
3. **How do I actually use it?** - exact files, exact commands, exact code paths.

## Where to next

- **[The vocabulary](./the-vocabulary.md)** - read this first if any word above felt fuzzy.
- **[Quickstart](./quickstart.md)** - run it, log in, break it safely.
- **[How it works, end to end](./how-it-works.md)**
