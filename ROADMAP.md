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

### Template variants — developer, designer, author

Right now the template is shaped for a writer/author. The structure
(Profile → Books → Writings → Resume → Blog) makes sense for someone who
publishes long-form work. For other professions, the same foundation should
support different default sections.

**Developer variant.** The default sections become:

- Profile → Skills (standalone) → Projects → Resume → Blog
- "Skills" gets pulled out of `resume.json` into its own first-class section
  (`content/skills.json`) and renders as a top-level page.
- "Projects" becomes a folder collection (`content/projects/*.json`), with
  fields for repo URL, demo URL, screenshots, tech stack, role.
- Resume keeps everything else (work, education, certs).
- Could integrate live data: GitHub contribution graph, latest npm packages,
  star counts — opt-in via `site.json`.

**Designer variant.** The default sections become:

- Profile → Portfolio → Case studies → Clients → Blog
- "Portfolio" is image-heavy: each project is a folder with a hero image,
  a gallery, a short description. (`content/portfolio/<slug>/index.md` +
  images alongside.)
- "Case studies" are long-form posts about specific projects — same
  structure as blog but visually distinct (larger images, less text).
- "Clients" is a simple list of logos / names.

**The Skills section is portable.** Even non-developers benefit from it
(languages spoken, instruments played, technical specialties). The plan is
to make it a section that any variant can include:

- `content/skills.json` with a simple shape (`[{ name, level?, keywords[] }]`)
- Auto-hides if empty, same as every other section
- Can render on its own page (`/skills`) AND optionally as a section on the
  home page (controlled by a `site.json` flag like `showSkillsOnHome: true`)

**Implementation plan:**

- Step 1: Lift Skills out of `resume.json` into `content/skills.json`. Add
  a `/skills` route. Backwards-compatible: if `skills.json` is missing,
  read from `resume.json` as before.
- Step 2: Add a `template_variant` field to `site.json` (`author` |
  `developer` | `designer`). The build reads this to decide which seed
  content shipping, which sections appear by default, and which Sveltia
  collections are active.
- Step 3: Build the developer variant's seed content. Document the
  switch-variant workflow in CLAUDE.md so an LLM can scaffold a developer
  site from "I'm a backend engineer working at X, here's my GitHub."
- Step 4: Same for the designer variant. Image-handling is the harder
  piece — designers will want large, optimized hero images, which depends
  on the image-pipeline mid-term item shipping first.

Each variant should share the same accessibility / SEO / OG / theme-toggle
foundation. Only the default sections and seed content differ.

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
