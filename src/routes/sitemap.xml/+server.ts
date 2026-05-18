import {
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

export function GET() {
	const site = getSite();
	const base = site.url.replace(/\/$/, '');

	const urls: string[] = [`${base}/`, `${base}/about`];
	if (hasBooks(getBooks())) urls.push(`${base}/books`);
	if (hasWritings(getWritings())) urls.push(`${base}/writings`);
	if (hasResume(getResume())) urls.push(`${base}/resume`);

	const posts = getAllPosts();
	if (hasBlog(posts)) {
		urls.push(`${base}/blog`);
		for (const p of posts) urls.push(`${base}/blog/${p.slug}`);
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `	<url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
