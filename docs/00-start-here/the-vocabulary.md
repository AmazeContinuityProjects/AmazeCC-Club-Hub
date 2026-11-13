---
title: "Words you'll meet in these docs"
description: "The 30 terms this handbook uses all the time, explained once, in plain English, with a real example from this repo for each."
---

# Words you'll meet in these docs

> **In one line:** the vocabulary of web development, explained slowly, using this very app as the example - read this first and every other page becomes readable.

If you know nothing about web development, start here. Nobody memorizes these words; they become obvious once you see where they come from.

## The six big ideas

### Browser
The program you use to open websites - Chrome, Safari, Firefox. Yours is almost certainly Chrome. The browser **downloads files from a server somewhere else** and then **displays them to you** as a website. Club Hub is downloaded from GitHub Pages and displayed by your browser.

### Server and request/response
A **server** is a computer elsewhere that answers questions. Every time your browser wants anything - a webpage, an image, a piece of JSON - it sends a **request**; the server sends back a **response**. Everything in web development is just requests and responses, wearing increasingly fancy clothes.

### Frontend and backend
- **Frontend** = the code that runs inside the browser: the buttons, text and colors you see. Club Hub is frontend.
- **Backend** = the code that runs on a server: the logic, the database, the auth checks. The AmazeCC API is backend.
- They talk **HTTP** - the language of requests and responses (see below).

### HTTP request anatomy

```
POST https://api.amazecc.com/api/login     ← where, and what verb (GET/POST/DELETE)
Authorization: Bearer eyJhbGc…              ← headers (metadata labels)
Content-Type: application/json              ← what kind of body this is

{ "username": "21BCE0000", "password": "…" } ← the body (the actual data)
```

Three parts matter every single time: **where** (the URL), **what** (the method), and **what you send** (the body). "API Integration" pages in this handbook will look exactly like this.

### Status codes
The server answers with a number:

| Range | Meaning | In this app |
|---|---|---|
| 200 | OK | the login worked |
| 400 | you asked wrong | missing content on a post |
| 401 | you are not allowed (bad token) | your club token expired |
| 403 | allowed in general, not for this | a non-rep tried to delete a rep |
| 404 | doesn't exist | post id not found |
| 429 | too many requests | 5 logins a minute max |
| 500/502/504 | the server broke | VTOP is down |

### JSON
The body almost always carries **JSON** - `{ "key": value }`. It is just data written in a shape every programming language can read. `{ "success": true, "name": "CodeChef" }` is a JSON object with two keys.

## The building blocks of this app

### Component
A **component** is a reusable piece of UI - "the login form", "the row in the feed timeline", "the sidebar". In code it's a function that returns what should be on screen. `LoginPage` is a component; so is `FeedManager`.

### Props and state
- **Props** = the inputs you hand a component from its parent, like ingredients handed to a recipe. `FeedManager` gets `clubId` as a prop - that's how it knows which club to load posts for.
- **State** = what the component remembers between its own re-renders - its whiteboard. `FeedManager` keeps `posts` in state; when new posts arrive, the screen updates automatically.
- When state changes, React **re-renders** - calls the function again and redraws the changed parts.

### Hooks
Functions starting with `use` that give components superpowers. The three in this repo:

- `useState` - "give me a state variable and a way to change it."
- `useEffect` - "do something when we first appear, or when something changes." Used here to fetch data on mount.
- `useCallback` - "keep this function stable so the effect doesn't loop forever."

### JSX
HTML-like tags inside JavaScript. `const x = <Button label="Save" />`. The tags look like HTML but are really function calls React understands.

### "use client"
Next.js splits components into **server** and **client** ones. Server components render ahead of time; client ones run in the browser. Nearly every file in this repo starts with `"use client"` - it's telling Next "this runs in the browser; keep it interactive." (This app is 100% client side.)

### localStorage
The browser has a tiny suitcase of key-value pairs, tied to one website, which survives refresh and even closing the tab. This app uses it for exactly three keys: `club_token`, `club_roles`, `active_club_id`. Your VTOP password is never in it (only the club token - see below).

## The API words

### API (Application Programming Interface)
A "machine" on a server with doors you can knock on. This app's API lives at `https://api.amazecc.com`. Each **endpoint** is one door, e.g. **POST /api/login** or **GET /api/club-admin/feed**. Doors have rules: what you may ask, what you must bring, what you get back.

### Authentication vs authorization
- **Authentication** = "who are you?" The login flow proves you're you (VTOP credentials + a club token).
- **Authorization** = "are you allowed to do this particular thing?" The API checks your token on every club-admin call; the UI just hides buttons you wouldn't pass.

### Token and JWT
A **token** is the signed badge the server hands the browser after login. **JWT** (JSON Web Token) is the specific format - think of it as a sealed envelope with your identity and roles inside; nobody can open it without the server's key, so the server can just look at it and know who you are. This app keeps it in `localStorage` under `club_token` and shows it on every request as `Authorization: Bearer <token>`.

### Envelope (and raw)
The API mostly answers with `{ "success": true, ... }` (the "success-wrapped" envelope). A couple of endpoints answer with the raw payload instead (e.g. `/api/events` returns a bare array). You'll always check `data.success` first or `res.ok` where there's no envelope - see [Envelopes & errors](../03-api-integration/envelopes-and-errors.md).

## The build words

### Build
Turning source code into the thing you actually ship - here, plain `.html`, `.css` and `.js` files. Everything the browser will ever see is produced at build time. If you change an env var, you must rebuild.

### Static site / static export
A website made only of files, no server thinking involved. Club Hub builds to the `out/` folder by command; GitHub Pages just hands out those files.

### Environment variables
Values your code reads from "outside" - `NEXT_PUBLIC_API_URL` tells the app where the API lives. Variables starting with `NEXT_PUBLIC_` are baked into the bundle at build time - they are **public**, never put secrets in them. Everything after `NEXT_PUBLIC_` should be stuff you're fine showing anyone.

## Where to next

- **[Quickstart](./quickstart.md)** - run the app and log in.
- **[How it works, end to end](./how-it-works.md)**
- Keep this page open in a second tab until the vocabulary sticks.
