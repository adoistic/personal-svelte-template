# Resume import (LLM workflow)

You don't need to type your resume into a form. Use any LLM (Claude, ChatGPT, Gemini) to convert your existing resume into valid [JSON Resume](https://jsonresume.org/schema/) format, then paste it into your site's `content/resume.json`.

## Step 1: Convert your resume to JSON

Copy this prompt:

> Convert the resume I'm pasting below into valid JSON conforming to the JSON Resume schema (jsonresume.org/schema). Output **only** the JSON — no preamble, no commentary, no markdown fences. If a field has no data, omit it rather than including an empty string. Dates should be ISO-8601 (`YYYY-MM-DD` or `YYYY-MM`). Use `endDate: "Present"` is not valid — for current roles, omit `endDate` entirely. Wrap the output in a single root object with the standard top-level keys: `basics`, `work`, `education`, `skills`, `projects`, `certificates`.
>
> Here's my resume:
>
> [paste your resume text or attach the PDF here]

Open [Claude](https://claude.ai), [ChatGPT](https://chat.openai.com), or [Gemini](https://gemini.google.com), paste the prompt, attach or paste your resume, and send.

You'll get back a JSON object that looks like:

```json
{
	"basics": {
		"name": "Your Name",
		"label": "Software engineer",
		"email": "you@example.com",
		"summary": "..."
	},
	"work": [
		{
			"name": "Acme Corp",
			"position": "Senior Engineer",
			"startDate": "2022-01",
			"endDate": "2024-06",
			"summary": "...",
			"highlights": ["Shipped X", "Built Y"]
		}
	],
	"education": [...],
	"skills": [...],
	"projects": [...]
}
```

## Step 2: Paste into your site

Two ways:

**Option A: GitHub web UI (easiest, no checkout needed)**

1. Go to your repo on GitHub.
2. Navigate to `content/resume.json`.
3. Click the **pencil icon** ("Edit this file") in the top-right.
4. Replace the entire content of the file with what the LLM gave you.
5. Scroll down, write a commit message ("update resume"), click **Commit changes**.
6. Your site rebuilds automatically (Netlify / Vercel / Cloudflare watch for commits). Refresh `/resume` to see it live.

**Option B: Local edit**

1. `git pull` to make sure you're up to date.
2. Open `content/resume.json` in your editor.
3. Replace the file content with the LLM output.
4. `git add content/resume.json && git commit -m "update resume" && git push`.

## Why not edit in the CMS admin UI?

The `/admin` page intentionally doesn't show the resume. JSON Resume has ~30 fields with nested arrays and complex shapes — building a form for it would either (a) be a tedious editing experience or (b) only cover a fraction of the schema. The paste-from-LLM workflow takes about 30 seconds and gives you full schema coverage.

## What the site renders

The Resume page shows your `work`, `education`, `skills`, and `projects` sections. The `basics` section is rendered on the home/about pages instead (it's the same info as your profile).

If `work`, `education`, `skills`, and `projects` are all empty, the Resume page and its nav link auto-hide. So you can leave `content/resume.json` as the empty seed if you don't have one yet — nothing will appear.

## Schema reference

Full JSON Resume v1.0.0 spec: https://jsonresume.org/schema/

Our renderer is a strict subset: we render `work`, `education`, `skills`, `projects`, and `certificates`. Unknown fields are accepted (passthrough) but ignored.
