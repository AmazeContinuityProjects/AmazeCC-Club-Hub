# Writing standard - AmazeCC Club Hub handbook

The audience is a smart junior developer who has never seen this codebase and
doesn't know Next.js, React, react-native-web, or how AmazeCC works. Every page
must leave them with a working mental model AND working code.

## Voice

- Second person, active, concrete. "You click Save; Fab calls `handleSave`…",
  never "one may observe that".
- Spoonfed, but never babyish. Define once ("a *static export* is…"), then use
  the word.
- No marketing. Facts only.
- Reference exact files, components, state keys and storage keys - a junior
  should be able to `Ctrl+F` anything quoted here.

## Page shapes

### Concept pages (start-here, architecture)
1. Frontmatter with `title` + `description` (1-2 sentences, used by llms.txt).
2. `# Title`.
3. An `In one line:` blockquote right under the H1.
4. Body: problem -> explanation -> example -> footguns -> where to next.
5. End with "Where to next" links, not "Conclusion".

### Component walkthrough pages (components/*)
1. What the component does in one line.
2. Where it lives, what renders it (which tab, which `page.tsx` branch).
3. Its state, field by field - types exactly as declared.
4. Every API call it makes, with method, path, body keys and the exact
   `data.success` outcome it branches on.
5. Gotchas - the ones that actually bite in this repo (StrictMode double-effect,
   `X-Club-Id`, `"use client"` boundaries, `key={clubId}` remounts).

## Absolute rules

- **Never invent shapes.** If a payload field isn't in the code, it doesn't
  exist in the docs. Cite `path:line` or a sibling page of the AmazeCC API
  handbook's response-shapes catalog.
- Keep the React Native for Web aliasing straight: primitives come from
  `@/lib/ui` (View/Text/Image/Pressable), not HTML elements.
- LocalStorage keys are contractual: `club_token`, `club_roles`,
  `active_club_id`. Document any new key you touch.
- The `.env` in this repo is committed on purpose for the template - call out
  its consequences rather than silently "fixing" them.
- No secrets, no real registration numbers, no real VTOP credentials.

## Checklist before merging a docs PR

- [ ] `docs/docs.json` is up to date (`node grounding/gen-child-docs.mjs`).
- [ ] New raw `<` in prose are escaped as code or `&lt;` - MDX parses JSX.
- [ ] Links use repo-relative paths with a `.md` suffix (or plain anchors) -
  the docs pipeline rewrites relative links itself.
- [ ] Claims verified against the code at HEAD, not against memory.
