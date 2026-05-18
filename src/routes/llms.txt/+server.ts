import {
	getProfile,
	getSite,
	getBooks,
	getWritings,
	getResume,
	getAllPosts,
	hasBooks,
	hasWritings,
	hasResume,
	hasBlog
} from '$lib/content';

export const prerender = true;

// llms.txt is an emerging convention (proposed at llmstxt.org) — a single
// Markdown file at /llms.txt that gives LLM crawlers a curated map of the
// site's content. Think of it as a sitemap optimized for reading, not crawling.

export function GET() {
	const site = getSite();
	const profile = getProfile();
	const base = site.url.replace(/\/$/, '');

	const lines: string[] = [];
	lines.push(`# ${site.title}`);
	lines.push('');
	if (site.description) {
		lines.push(`> ${site.description}`);
		lines.push('');
	}
	if (profile.bio) {
		const firstPara = profile.bio.split(/\n\n+/)[0];
		lines.push(firstPara);
		lines.push('');
	}

	lines.push('## Core pages');
	lines.push(`- [Home](${base}/): Site homepage with bio and recent writing.`);
	lines.push(`- [About](${base}/about): Author bio.`);
	lines.push('');

	const books = getBooks();
	if (hasBooks(books)) {
		lines.push('## Books');
		for (const b of books) {
			const year = b.year ? ` (${b.year})` : '';
			lines.push(`- [${b.title}${year}](${base}/books): ${b.blurb.split('\n')[0]}`);
		}
		lines.push('');
	}

	const writings = getWritings();
	if (hasWritings(writings)) {
		lines.push('## External writings');
		for (const w of writings) {
			const meta = [w.publisher, w.year].filter(Boolean).join(', ');
			lines.push(`- [${w.title}](${w.url})${meta ? ` — ${meta}` : ''}`);
		}
		lines.push('');
	}

	if (hasResume(getResume())) {
		lines.push('## Resume');
		lines.push(`- [Resume](${base}/resume): Career history, education, skills.`);
		lines.push('');
	}

	const posts = getAllPosts();
	if (hasBlog(posts)) {
		lines.push('## Blog posts');
		for (const p of posts) {
			const summary = p.excerpt ?? '';
			lines.push(`- [${p.title}](${base}/blog/${p.slug}): ${summary}`);
		}
		lines.push('');
	}

	lines.push('## Optional');
	lines.push(`- [Sitemap](${base}/sitemap.xml): Machine-readable index.`);
	lines.push(`- [RSS](${base}/rss.xml): (planned)`);
	lines.push('');

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
}
