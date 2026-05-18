# CLAUDE.md

Project rules for Claude Code (and any LLM coding agent) when working in this repository. These are derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on common LLM coding mistakes, adapted for this project.

**Tradeoff:** these guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think before coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity first

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that *your* changes made unused.
- Don't remove pre-existing dead code unless asked.

Test: every changed line should trace directly to the user's request.

## 4. Goal-driven execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [step] → verify: [check]
2. [step] → verify: [check]
3. [step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## Project-specific notes

### What this project is

An opinionated, open source personal website template built on SvelteKit + Sveltia CMS. Designed to be forked, deployed free on Netlify (primary) or Vercel, and edited through a `/admin` UI without writing code.

A more detailed design doc lives outside the repo (in the maintainer's working notes) and may be added under `docs/` later. Until then, the project-specific notes in this file are the source of truth.

### Stack (locked)

- SvelteKit 2 + Svelte 5 (runes syntax: `$props`, `$derived`, `$state`)
- `@sveltejs/adapter-static` — fully prerendered HTML, no SSR, no runtime
- TypeScript + zod for runtime content validation
- Tailwind CSS v4
- Sveltia CMS, loaded from CDN via `static/admin/index.html`
- mdsvex for Markdown blog posts
- Google Fonts: **Newsreader** (headlines/bio) + **IBM Plex Sans** (UI chrome). Explicitly NOT Inter/Geist/Plus Jakarta Sans/Manrope/DM Sans.
- No image optimization pipeline in v0.1 — plain `<img>` with width/height. Image pipeline is v0.2.

### Hard rules

- **Accessibility is the design, not a checklist.** Real screen reader usability, keyboard navigation, semantic HTML, AAA body-text contrast (7:1+). Author-provided `alt` on every image. No JavaScript required to read any content.
- **No animation, no scroll effects, no parallax, no carousels.** `prefers-reduced-motion` is the default behavior, not the exception.
- **Auto-hide is data-driven, not config-driven.** A section renders only if its data file exists and has ≥1 entry. No `enable_books: true` flags. The hiding mechanism is `entries()` returning `[]` from `+page.ts` — one mechanism, not two.
- **Fluid responsive, not breakpoint-snapping.** `clamp()` for font sizes, line heights, container widths. One layout from 360px to 2560px.
- **Premise 6 (JSON Resume):** the resume page uses the JSON Resume schema. Don't extend the schema for books/writings/speaking — those are separate files. JSON Resume is for work/education/skills/projects/certificates only.

### Scope gates

v0.1 ships the foundation. v0.2 features are explicitly out of scope until v0.1 is live and validated by one real deployment.

Specifically deferred to v0.2: image optimization pipeline, dark mode, RSS, Cloudflare Pages / GitHub Pages docs, per-post OG image generation, theme presets, build-time contrast validator, Goodreads integration, i18n, analytics, comments.

### Development commands

```bash
bun install              # install dependencies
bun run dev              # local dev server (http://localhost:5173)
bun run build            # static build to ./build/
bun run preview          # serve the built site locally
bun run lint             # eslint + prettier check
bun run check            # svelte-check + tsc
```

### Before committing

- `bun run build` succeeds (the build is the test for prerender-entry correctness).
- `bun run lint` and `bun run check` are clean.
- For any change to content schemas: verify a fresh fork still builds with the seed content.
- For any change to the accessibility-relevant code: tab through the page; if you can, run VoiceOver or axe-core on the change.

### Branch + commit conventions

- Branch off `main`. Branch names: `feat/...`, `fix/...`, `docs/...`, `chore/...`.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`). Subject line ≤72 chars. Body explains *why*, not *what*.
- Squash on merge; PR title becomes the squash commit message.
