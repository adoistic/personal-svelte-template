# Roadmap

What's planned for this template after the v0.1 foundation.

## Current state (v0.1)

Shipped:

- All five sections (Profile, Books, Writings, Resume, Blog) with auto-hide
- SvelteKit 2 + Svelte 5 + adapter-static, fully prerendered
- Tailwind CSS v4 with a fluid 42rem reading column
- Light / dark / system theme toggle with no-FOUC inline script
- Hamburger menu below 640px viewport
- Sveltia CMS at `/admin` via **Netlify Identity + Git Gateway** (no-code auth)
- Full SEO meta + JSON-LD on every page
- Automatic per-page OG image generation (Satori + Resvg, ~15 KB PNGs at build)
- Sitemap.xml + llms.txt for search engines and LLM crawlers
- Google Fonts: Newsreader (display) + IBM Plex Sans (UI)
- Markdown rendering for bio and book blurbs
- Karpathy-guideline CLAUDE.md for content setup via LLM agents
- Accessibility-first design: AAA contrast, skip links, focus rings, semantic HTML

## Near-term (next)

### Direct "Login with GitHub" — bypass Netlify Identity

Today the user logs in to `/admin` with a Netlify Identity email/password
(Git Gateway commits as a system user). The future flow:

- User clicks "Login with GitHub" at `/admin`
- GitHub OAuth → authorize the OAuth app
- Commits show up under the user's own GitHub account (proper attribution
  in the history)
- No Netlify Identity middle-step; works on any host

**Implementation plan:**

- Ship `sveltia-cms-auth` as a one-click deployable Cloudflare Worker
  (using `wrangler.toml` checked into a `worker/` subfolder of this repo).
- Document a 5-step OAuth-app setup in `docs/auth-setup-github.md`:
  1. Create a GitHub OAuth App at github.com/settings/developers
  2. `cd worker && wrangler deploy`
  3. `wrangler secret put GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
  4. Update `static/admin/config.yml` → switch backend to `github`, add
     `auth_endpoint` pointing at the Worker URL
  5. Visit `/admin` → "Login with GitHub" works
- Keep Netlify Identity as the default-out-of-the-box path; the GitHub
  OAuth path is an opt-in upgrade for users who want it.

**Why not now:** Netlify Identity is the lower-friction path (no GitHub
OAuth app, no Worker, no `wrangler` install). Most users will be fine with
it. The GitHub OAuth path matters for users who want their commits
attributed to their personal account, or who want to host on Vercel /
Cloudflare Pages / GitHub Pages without Netlify involvement.

## Mid-term

### Image optimization pipeline

Current state: images are served as-is. A 4MB photo from a phone gets
sent to every visitor.

Plan: a build-time pipeline that processes images in `static/images/`:

- Resize to multiple breakpoints (320, 640, 1024, 1600).
- Convert to AVIF + WebP + a JPG fallback.
- Generate `srcset` attributes automatically via an `<OptimizedImg>`
  component wrapper.
- On Netlify, route through Netlify Image CDN as a faster alternative.

### RSS feed for the blog

`/rss.xml` endpoint that lists all non-draft posts with full HTML body.
Picked up by feed readers; gives readers a no-account way to follow.

### Dark-mode-aware OG images

Today the OG image is light-mode only. Generate both `og-light.png` and
`og-dark.png`; pick via `og:image:dark` and CSS `prefers-color-scheme`
in the rendered HTML.

### Theme presets

`site.json` gains a `theme` field with presets — `author` (current
Newsreader + IBM Plex setup), `tech` (mono + sans), `minimal` (system
only). Each preset bundles its font choices and accent color recommendations.

### More section types — Skills, Projects, Portfolio, Case studies

**Principle: sections are completely decoupled.** A developer with a
novel out should be able to show Books AND Projects. A designer with
academic credentials should be able to show Portfolio AND Resume. The
auto-hide rule (a section appears only if its data file has content)
already enforces this — there is no "variant switch" gating any
section. The roadmap below treats each new section as a building block
that any user can opt into, not as part of a profession-specific bundle.

**Skills** — `content/skills.json`. Useful for everyone, not just
developers (languages spoken, instruments played, technical specialties,
materials, software fluency).

- Lift out of `resume.json` into its own file so it can render
  independently. Resume still references it; backwards-compatible.
- Renders at `/skills` as a standalone page.
- Optionally also renders as a section on the home page, controlled by
  `site.json` → `home_sections: ['skills', 'recent_posts', ...]`. The
  home page becomes composable per-user.

**Projects** — `content/projects/<slug>.json` (folder collection, one
file per project).

- Fields: title, description (markdown), tech stack (array), role,
  start/end date, repo URL, demo URL, screenshots.
- Renders at `/projects` with a card layout (image + meta).
- Equally useful for "open source projects I built" and "client work
  I shipped" and "things I made on weekends."

**Portfolio** — `content/portfolio/<slug>/` (folder per case study).

- Image-heavy: each case study has a hero image, a gallery, a written
  narrative.
- Designed for visual work — design, photography, illustration,
  architecture, anything where images carry the meaning.
- Renders at `/portfolio` (grid index) and `/portfolio/<slug>` (detail).
- Depends on the image-pipeline mid-term item shipping first so large
  files don't tank load times.

**Case studies** — long-form writing about specific projects.

- Could simply be blog posts with a `category: case-study` frontmatter,
  surfaced separately. Or its own folder if writers want a clean split
  from the regular blog.
- Decision deferred until users ask for it; the blog covers this for now.

### Mixing sections — composable home page

The current home page renders bio + recent posts. With more section
types, users will want different home-page compositions:

- Author: bio + featured book + recent posts
- Developer: bio + skills + featured project + recent posts
- Designer: bio + portfolio grid + nothing else
- Hybrid: bio + skills + books + recent posts (developer who also writes)

Plan: `site.json` gains a `home_sections` array listing which section
previews appear on the home page, in order. Each section preview is
opt-in. Defaults match the current behavior (bio + recent posts).

### Curated starting points (not architectural variants)

To make scaffolding fast for common profiles, document _starting-point
recipes_ in CLAUDE.md — not a `template_variant` field, just suggested
prompts that an LLM can use to set up a coherent default for someone:

- "Set me up as a writer" → populate profile, books, writings, resume; leave projects/portfolio empty (auto-hide).
- "Set me up as a developer" → populate profile, skills, projects, resume; leave books/portfolio empty.
- "Set me up as a designer" → populate profile, portfolio, case studies, resume; leave books/projects empty.
- "Set me up as a developer who also writes" → populate everything above except portfolio.
- "Hybrid" → any combination. Designer with books, novelist with code projects, professor with portfolio. No section is exclusive to a profile.

The user can mix any of these later by adding files to other folders.
Nothing is gated. This is the right shape because the underlying
architecture is already section-by-section data-driven.

### Implementation order

1. **Skills** out of `resume.json` into `content/skills.json`. Add
   `/skills` route with auto-hide. Backwards-compatible: if `skills.json`
   is missing, read from `resume.json` as before.
2. **Projects** as a folder collection. New `/projects` route. New
   Sveltia collection in `config.yml`.
3. **`home_sections` array** in `site.json` — composable home page.
4. **Portfolio** — needs the image pipeline first, then layout work for
   the image-heavy variant.
5. **Starting-point recipes** documented in `CLAUDE.md` once sections 1-3
   exist, so an LLM has the full toolkit when scaffolding.

Each new section shares the same accessibility / SEO / OG / theme-toggle
foundation. Only the data shape and the renderer differ.

## Far-term

### Cloudflare Pages + GitHub Pages first-class support

Today both work but require manual OAuth-proxy Worker setup. Once the
near-term Worker is in place, add `docs/deploy-cloudflare.md` and
`docs/deploy-github-pages.md` walkthroughs.

### `bun create personal-svelte` CLI

Replaces "Use this template" + manual `OWNER/REPO` replacement with a
one-command setup:

```sh
bun create personal-svelte my-site
# prompts: GitHub repo name, deploy target, name, accent color
```

The CLI scaffolds the repo with all placeholders filled in.

### i18n

Multi-language support for the blog and core pages. A `lang` field on
posts, a language switcher in the header. Out of scope for v0.1 — the
core template should ship in a state where this can be added cleanly,
not requiring a rewrite.

### Analytics opt-in

Plausible / Umami / Cloudflare Web Analytics — privacy-friendly options
toggleable via `site.json`. Renders the analytics snippet only when
enabled.

### Comments

Probably out of scope forever; link to email or a Bluesky/Mastodon thread
instead. But if a clean low-JS option emerges (Webmentions, Cactus
Comments), revisit.

---

## Contributing

If any of the above interests you, open an issue or PR at
[adoistic/personal-svelte-template](https://github.com/adoistic/personal-svelte-template).
