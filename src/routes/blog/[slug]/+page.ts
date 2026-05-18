import { error } from '@sveltejs/kit';
import { getAllPosts, getPost, getProfile, getSite } from '$lib/content';

export const prerender = true;

export function entries() {
	return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function load({ params }: { params: { slug: string } }) {
	const post = getPost(params.slug);
	if (!post) throw error(404, 'Post not found');
	const profile = getProfile();
	const site = getSite();
	const url = `${site.url.replace(/\/$/, '')}/blog/${post.meta.slug}`;

	const article = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.meta.title,
		datePublished: post.meta.date,
		dateModified: post.meta.date,
		description: post.meta.excerpt,
		author: { '@type': 'Person', name: profile.name, url: site.url },
		publisher: { '@type': 'Person', name: profile.name, url: site.url },
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		image: post.meta.cover
			? [`${site.url.replace(/\/$/, '')}${post.meta.cover}`]
			: [`${site.url.replace(/\/$/, '')}/og/blog/${post.meta.slug}.png`]
	};

	return {
		post: post.meta,
		pageTitle: post.meta.title,
		pageDescription: post.meta.excerpt ?? `${post.meta.title} — by ${profile.name}`,
		ogType: 'article',
		article
	};
}
