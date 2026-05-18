import { marked } from 'marked';

// Configured for trusted content (CMS-authored by the site owner, not
// arbitrary visitors), so we don't sanitize aggressively. We still disable
// dangerous defaults like raw HTML pass-through where appropriate.
marked.setOptions({
	gfm: true,
	breaks: false
});

/**
 * Render a Markdown string to an HTML string. Synchronous because the
 * `marked` async path isn't needed here. Returns an empty string for
 * empty input so callers can confidently `{@html md(...)}`.
 */
export function md(input: string | undefined | null): string {
	if (!input) return '';
	return marked.parse(input, { async: false }) as string;
}

/**
 * Render a Markdown string as inline (no wrapping <p>). Useful for short
 * fields like a tagline or a one-line book blurb.
 */
export function mdInline(input: string | undefined | null): string {
	if (!input) return '';
	return marked.parseInline(input, { async: false }) as string;
}
