# Personal Svelte Template

A minimal, accessibility-first personal website you can set up by talking to Claude — no CMS configuration needed.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/adoistic/personal-svelte-template)

## What it is

An opinionated personal site template for writers, authors, designers, engineers, or anyone who wants a calm, fast site without writing code.

- **Five sections** that each auto-hide if empty: Profile, Books, Writings, Resume, Blog.
- **Built for screen readers and keyboard navigation** from day one. AAA contrast, no JS required to read content.
- **Fluidly responsive**, fixed 42rem reading column, light/dark/system theme toggle.
- **Sveltia CMS at `/admin`** for ongoing editing — but you don't need it for setup (see below).
- **Per-page OG images** generated automatically at build, full SEO meta + JSON-LD, `sitemap.xml`, and `llms.txt` for AI crawlers.

## Set it up by talking to Claude

The killer move: instead of clicking through a CMS form by form, just hand Claude (or any LLM coding agent) your raw materials.

```bash
# 1. Fork this repo via the "Use this template" button on GitHub
# 2. Clone your fork locally
# 3. Open it with Claude Code (or run an agent in the directory)
```

Then say something like:

> "Here's my resume PDF. Set up this site for me."
> "I'm Jane. I've written these three books, here are some essays I've published, and add a welcome blog post about my work."
> "Use this photo, here's my bio, leave the resume blank for now."

Claude reads [`CLAUDE.md`](CLAUDE.md) — a complete content-setup guide that documents every file, field, and convention. It will edit `content/*.json` and `content/blog/*.md` directly, drop your photo in `static/images/`, and verify the build passes. The dev server (`bun run dev`) shows your site live.

After setup, push to GitHub. Connect to Netlify. The `/admin` UI is there for ongoing edits whenever you want.

## Tech

SvelteKit 2 + Svelte 5 · adapter-static · Tailwind CSS v4 · Sveltia CMS · JSON Resume schema · mdsvex · TypeScript + zod. Build is fully static.

## License

MIT. Use this for anything — personal sites, client work, derivative templates. No attribution required (but a star is appreciated).

## Credit

Built by [Adnan](https://github.com/adoistic). [Sveltia CMS](https://github.com/sveltia/sveltia-cms) makes the admin UI possible. [JSON Resume](https://jsonresume.org/) gives the resume page a decade of stable schema. The agent-setup workflow takes inspiration from [Andrej Karpathy](https://x.com/karpathy/status/2015883857489522876)'s LLM-coding guidelines.
