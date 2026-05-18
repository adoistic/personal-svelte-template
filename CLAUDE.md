# CLAUDE.md

> A guide for Claude (or any LLM coding agent) to set up this personal website
> from a user's raw materials — a resume, a bio, a list of books, anything.
> The user does not need to learn the CMS first. You will edit the content
> files directly; the CMS becomes optional ongoing maintenance.

---

## How to use this file

When a user opens this repo with you (Claude Code, Cursor, an agent), they
will say something like:

> "Here's my resume PDF — set up this site for me."
> "My name is X, I've written these books, here are some essays I've
> published. Make this my site."
> "Drop in my photo and bio, leave the blog empty for now."

Your job: edit the content files directly so that running `bun run dev`
shows them a working personalized site. After that, they can use `/admin`
(Sveltia CMS) to edit going forward — but they do **not** need it for setup.

---

## What the site is

A static, opinionated, accessibility-first personal website built on
SvelteKit. Content lives in `/content/` as JSON and Markdown. Each section
auto-hides if it has no content. There is no server, no database — every
page is prerendered HTML.

Five top-level sections:

| Section  | What it is                                   | Auto-hides when           |
| -------- | -------------------------------------------- | ------------------------- |
| Profile  | Name, bio, photo, social links               | Always shown (required)   |
| Books    | Books the user has written                   | `content/books/` is empty |
| Writings | External essays/articles published elsewhere | `content/writings/` empty |
| Resume   | Career history, education, skills            | All sections empty        |
| Blog     | Long-form posts written on this site         | No published `.md` files  |

Section navigation links and routes appear only when the section has data.

---

## Setup workflow

Follow these steps in order. Skip any step where the user has nothing yet —
empty sections auto-hide; no need to pretend.

### Step 1. Profile — always required

Edit `content/profile.json`:

```jsonc
{
	"name": "Full Name", // required
	"tagline": "One short line (≤60 chars)", // optional
	"bio": "Markdown supported. **Bold**, *italic*, [links](url), paragraph breaks via blank lines.",
	"photo": "/images/me.jpg", // path under static/. Use SVG/JPG/PNG/WebP.
	"photoAlt": "Required alt text describing the photo for screen readers",
	"location": "City, Country", // optional
	"email": "you@example.com", // optional, becomes a mailto link
	"social": [
		{ "platform": "Bluesky", "url": "https://bsky.app/profile/..." },
		{ "platform": "GitHub", "url": "https://github.com/...", "label": "GitHub" }
	]
}
```

**If the user provides a photo:** save it to `static/images/<filename>` and
reference it as `/images/<filename>` in `photo`. **Always ask for or write
descriptive alt text** — `photoAlt` is required for screen reader users.
Never leave it empty when a photo is set.

### Step 2. Site config — title, description, accent color

Edit `content/site.json`:

```jsonc
{
	"title": "Same as profile.name in most cases", // browser tab title
	"description": "One-line site description (used for SEO meta + OG image)",
	"url": "https://userdomain.com", // user's final deployed URL
	"accent": "#0f4c81" // hex color for links/UI accents
}
```

Pick an `accent` that has good contrast against both light and dark
backgrounds. If unsure, ask the user; otherwise default to a calm
mid-tone color.

### Step 3. Resume — if the user has one

This site renders the [JSON Resume](https://jsonresume.org/schema/) schema.
The renderer uses `work`, `education`, `skills`, and `projects`. If the
user provides a resume in any format (PDF, plain text, a paragraph), convert
it into this shape and save to `content/resume.json`:

```jsonc
{
	"basics": {
		"name": "Full Name",
		"label": "Senior Engineer", // job title / one-line role
		"email": "you@example.com",
		"summary": "Optional short summary paragraph."
	},
	"work": [
		{
			"name": "Company Name",
			"position": "Job Title",
			"url": "https://company.com", // optional
			"startDate": "2022-01", // YYYY or YYYY-MM (ISO 8601)
			"endDate": "2024-06", // omit `endDate` entirely for current roles
			"summary": "What this role was about.",
			"highlights": ["Specific accomplishment", "Another one"]
		}
	],
	"education": [
		{
			"institution": "University Name",
			"studyType": "MFA", // BA, BS, MA, MFA, PhD, etc.
			"area": "Field of study",
			"startDate": "2010",
			"endDate": "2014"
		}
	],
	"skills": [
		{ "name": "Programming", "keywords": ["TypeScript", "Python", "Go"] },
		{ "name": "Languages", "keywords": ["English", "Hindi"] }
	],
	"projects": [
		{
			"name": "Project Name",
			"description": "What it is, one sentence.",
			"url": "https://project.com",
			"startDate": "2023-06",
			"endDate": "2024-01"
		}
	]
}
```

**Rules:**

- Dates: `YYYY-MM` or `YYYY` only. Never use "Present" as a string — omit
  `endDate` entirely for current roles.
- `name` in `basics` should match the profile name.
- If the user has no resume yet, replace the file with the **minimal empty
  template** below so the section auto-hides:
  ```json
  {
  	"basics": { "name": "Same as profile" },
  	"work": [],
  	"education": [],
  	"skills": [],
  	"projects": []
  }
  ```

### Step 4. Books — one file per book

For each book the user has written, create a file at
`content/books/<kebab-case-title>.json`:

```jsonc
{
	"title": "Book Title",
	"year": 2025, // integer
	"cover": "/images/books/book-cover.jpg", // optional but recommended
	"coverAlt": "Required if cover is set. Describe the cover image.",
	"blurb": "Markdown supported. **Quotes**, *italics*, links allowed.\n\nParagraph breaks via blank lines.",
	"links": [
		{ "label": "Bookshop.org", "url": "https://bookshop.org/..." },
		{ "label": "Publisher", "url": "https://publisher.com/..." }
	]
}
```

If the user has no books, leave `content/books/` empty (just the
`.gitkeep` file). The Books section disappears from the site.

### Step 5. Writings — external publications

For each external essay/article/interview the user has published elsewhere,
create a file at `content/writings/<kebab-case-title>.json`:

```jsonc
{
	"title": "Essay Title",
	"publisher": "The Paris Review", // optional
	"year": 2024, // integer, optional
	"url": "https://theparisreview.org/...", // required, external link
	"excerpt": "One-line description shown under the title. Optional."
}
```

If the user only mentions writings casually ("I've been in The Atlantic and
Granta"), ask for URLs and titles — don't fabricate them.

### Step 6. Blog — Markdown posts (optional)

If the user wants to start with a blog post, create
`content/blog/<kebab-case-slug>.md`:

```markdown
---
title: Post Title
date: 2026-05-18
cover: /images/blog/cover.jpg # optional
coverAlt: Required if cover is set
excerpt: Short summary shown on the blog index card
draft: false
---

The post body in **Markdown**. Headings, lists, code blocks, links — all work.

## A subheading

A paragraph. More words. _Italic._ **Bold.** [A link](https://example.com).
```

- `draft: true` hides the post from the live site.
- Filename's kebab-case slug becomes the URL (`/blog/post-title`).
- Date format: `YYYY-MM-DD` only.

If no blog posts exist, the Blog section and `/blog` route auto-hide.

---

## Cleaning up the seed content

The template ships with sample content for a fictional writer named
**Avery Morrow**. When setting up a real user's site, **delete or replace**
all of these:

- `content/profile.json` — overwrite
- `content/site.json` — overwrite
- `content/resume.json` — overwrite (or replace with the empty template)
- `content/books/the-quiet-sky.json` — delete (unless the user has a book
  named exactly that, which would be a coincidence)
- `content/writings/*.json` — delete all three sample writings
- `content/blog/*.md` — delete all three sample posts
- `static/images/seed/*.svg` — delete unless the user wants to keep a
  placeholder avatar

After cleanup, only the user's own content remains.

---

## Photos and images

- Save user-uploaded images to `static/images/` (or a subfolder like
  `static/images/books/`).
- Reference them in JSON/Markdown as `/images/<path>` (the `/static`
  prefix is dropped at runtime).
- Supported: SVG, PNG, JPG, WebP. SVG is best for logos/icons, JPG/WebP
  for photos.
- **Always include an `alt`/`coverAlt`/`photoAlt` field.** This is a hard
  rule, not a suggestion. Screen-reader users depend on it.
- Image optimization is intentionally not in v0.1 — keep image dimensions
  reasonable (max width ~1600px for photos, ~800px for book covers).

---

## After setup: verify the site builds

Run these commands after editing content:

```bash
bun install           # if a fresh fork
bun run dev           # see your work at http://localhost:5173
bun run build         # verify the production build is clean
```

If `bun run build` fails on validation, the error message tells you which
file and field is wrong. Common causes:

- `name` missing in `profile.json`
- Invalid URL in any `url` field (must start with `http://` or `https://`)
- A book/writing JSON file with a missing required field (`title`, `url`)

---

## Deploying to GitHub + Netlify

After the content is in place:

1. Push the user's commits to their GitHub repo.
2. Update `static/admin/config.yml` — replace `OWNER/REPO` with their
   actual GitHub path (e.g. `janedoe/janedoe-site`).
3. Walk them through: Netlify → "Import from GitHub" → pick the repo.
   Netlify auto-detects SvelteKit and deploys.
4. The `/admin` page on the live site lets them edit through Sveltia CMS
   going forward.

---

## Common scenarios

### "I don't have a resume yet"

Use the minimal `resume.json` template from Step 3 with empty arrays. The
Resume page and nav link auto-hide. The user can add work entries later.

### "I have a book coming out but it's not published yet"

Add it to `content/books/`. Use `year` for the publish year. Put preorder
links in `links` with labels like "Preorder on Bookshop". Use the blurb
to describe the book — past or present tense both work.

### "I want a writing-only site (no resume, no books)"

Just fill in `profile.json` and create `content/blog/*.md` files. Leave
`content/resume.json` as the minimal empty template. Leave `content/books/`
and `content/writings/` empty. The nav will show only Home, Blog, About.

### "I just want a single-page bio site"

Fill in `profile.json`. Delete everything in `content/books/`,
`content/writings/`, and `content/blog/`. Leave `resume.json` empty.
The site becomes one page (Home) plus an About page.

### "Replace my photo"

Save the new image to `static/images/<filename>`. Update `photo` and
`photoAlt` in `content/profile.json`. Delete the old image file from
`static/images/seed/` if it was a seed avatar.

### "Update my bio"

`content/profile.json` → `bio` field. Markdown is supported. Use blank lines
between paragraphs. Inline `*italic*`, `**bold**`, `[links](url)`, and
backticks for `code` all render correctly.

---

## When the user asks for code changes

If they ask to change the look, add a feature, or modify the build, follow
these rules adapted from [Andrej Karpathy's LLM-coding guidelines](https://x.com/karpathy/status/2015883857489522876):

1. **State assumptions out loud.** If two reasonable interpretations
   exist, present both before picking. Don't pick silently.
2. **Minimum code.** No speculative features, no abstractions for
   single-use code, no error handling for impossible cases.
3. **Surgical changes.** Touch only what the user asked about. Don't
   "improve" adjacent code or refactor working things.
4. **Verifiable goals.** Define a check ("the page builds", "the new
   field appears on the resume") and loop until it passes.

### Stack reference

- SvelteKit 2 + Svelte 5 (runes syntax: `$props`, `$state`, `$derived`,
  `$effect`)
- `@sveltejs/adapter-static` — fully prerendered, no SSR
- TypeScript + zod for content validation
- Tailwind CSS v4 (theme tokens defined in `src/routes/layout.css`)
- mdsvex for Markdown blog posts
- Sveltia CMS at `/admin` (loaded from CDN)
- Google Fonts: **Newsreader** (display) + **IBM Plex Sans** (UI)

### Hard rules for code changes

- **Accessibility is the design**, not a checklist. Real screen-reader
  usability, AAA body-text contrast (7:1+), `alt` required on every image,
  no JavaScript required to read any content (theme toggle and mobile
  menu are progressive enhancements).
- **Auto-hide is data-driven, not config-driven.** A section appears or
  disappears based on whether its data file has content. There is no
  `enable_books: true` config flag, and there shouldn't be.
- **One container width: 42rem** (set in `.shell` class). All page chrome
  uses it. Don't introduce alternate widths without good reason.
- **No animation, no parallax, no scroll effects** beyond what already
  exists (hamburger morph, theme transitions). `prefers-reduced-motion` is
  respected by default.

### Development commands

```bash
bun install              # install dependencies
bun run dev              # local dev server (http://localhost:5173)
bun run build            # static build to ./build/
bun run preview          # serve the built site locally
bun run lint             # eslint + prettier
bun run check            # svelte-check + tsc
bun run format           # prettier --write
```

Before declaring a code change complete: `bun run check` and
`bun run build` must both pass.
