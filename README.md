# Portfolio Website Template

An open source personal website template — fork it, edit your content through a friendly admin UI, deploy free.

Built on SvelteKit + [Sveltia CMS](https://github.com/sveltia/sveltia-cms). Designed for writers, authors, designers, engineers, or anyone who wants a calm, accessible, fast personal site without writing any code.

> **Status:** v0.1 in active development. First public deployment landing on an author's site for a book launch. Not yet recommended for general use.

## Why this template

Most personal-site templates either (a) require you to edit Markdown and YAML by hand, (b) ship as a heavy black-box where the editor and the renderer are tightly coupled, or (c) look the same as every other AI-startup landing page.

This one:

- **Has a real admin UI at `/admin`** — Sveltia CMS commits content to your repo via GitHub OAuth. No database, no server, no monthly fee.
- **Auto-hides empty sections.** No book yet? The "Books" section doesn't render and doesn't appear in the nav. No resume entries? Same. The site shapes itself to whoever's using it.
- **Is built for accessibility from day one** — real screen reader usability, semantic HTML, AAA contrast, keyboard navigation, no JavaScript required to read the content.
- **Is fluidly responsive** — works from a 360px phone to a 2560px monitor without breakpoint-snapping.
- **Doesn't look like an AI-generated site.** Two carefully chosen Google Fonts (Newsreader + IBM Plex Sans). No Inter, no Geist, no carousels, no parallax.

## Quick start (Netlify, ~30 min, no CLI)

1. Click **Use this template** at the top of this repo → create your own copy.
2. Sign in to [Netlify](https://app.netlify.com/) → "Import from GitHub" → pick your new repo.
3. Wait for the first build (~1 minute). You now have a live site.
4. Open `https://<your-site>.netlify.app/admin` → sign in with GitHub → start editing.
5. (Optional) Connect your custom domain in Netlify's DNS settings.

Other hosts (Vercel, Cloudflare Pages, GitHub Pages) work but require a one-time OAuth proxy setup. Docs for those hosts will land in v0.2.

## What you can edit

Through the admin UI:

| Section | What it is | Auto-hides when |
|---|---|---|
| **Profile** | Name, bio, photo, social links | (always shown — required) |
| **Books** | Your books, with covers, blurbs, and buy links | The list is empty |
| **Writings** | External articles, essays, interviews — anything published elsewhere | The list is empty |
| **Resume** | Career history, education, skills (JSON Resume schema) | All sections are empty |
| **Blog** | Long-form posts, with optional cover images | No published posts |

## The LLM-powered resume import

Don't want to type your resume into a form? Drop your resume PDF or text into Claude or ChatGPT with a pre-written prompt (will ship under `docs/resume-import.md`). You'll get back valid [JSON Resume](https://jsonresume.org/schema/). Paste it into the admin UI's Resume page. Done.

## Tech stack

- [SvelteKit 2](https://kit.svelte.dev/) + Svelte 5
- [Sveltia CMS](https://github.com/sveltia/sveltia-cms) — Git-based admin UI
- [Tailwind CSS v4](https://tailwindcss.com/)
- [JSON Resume schema](https://jsonresume.org/schema/) for the resume page
- [mdsvex](https://mdsvex.com/) for Markdown blog posts
- TypeScript + [zod](https://zod.dev/) for content validation

Build is fully static (no SSR, no server, no database).

## Design philosophy

Minimal, accessible, fast, and built for content — not for showing off. Specifically:

- Real screen reader usability, semantic HTML, AAA contrast — accessibility is the design, not a checklist.
- Fluidly responsive from 360px to 2560px without breakpoint-snapping.
- No JavaScript required to read any content.
- Two carefully chosen Google Fonts. No animation, no scroll effects, no carousels.
- Auto-hide is data-driven: a section renders only if its data file has content. No `enable_books: true` config flags.

## Development

```bash
bun install
bun run dev
```

Then open `http://localhost:5173`. The admin UI runs at `http://localhost:5173/admin` but needs OAuth setup to commit — for local content edits, just edit the files in `content/` directly.

## Project guidelines

If you're working on this repo with Claude Code or any LLM coding agent, read [`CLAUDE.md`](CLAUDE.md). It encodes a set of rules adapted from Andrej Karpathy's observations about LLM coding mistakes.

## License

MIT. Use this template for anything — personal sites, client work, derivative templates. No attribution required (but appreciated).

## Acknowledgements

- [Sveltia CMS](https://github.com/sveltia/sveltia-cms) for the admin UI that makes this template possible.
- [JSON Resume](https://jsonresume.org/) for a decade of stable resume schema.
- [Andrej Karpathy](https://x.com/karpathy/status/2015883857489522876) for the LLM-coding guidelines that shape `CLAUDE.md`.
