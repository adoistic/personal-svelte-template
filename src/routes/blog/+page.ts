import { error } from '@sveltejs/kit';
import { getAllPosts, hasBlog } from '$lib/content';

export const prerender = true;

export function load() {
	const posts = getAllPosts();
	if (!hasBlog(posts)) throw error(404, 'Not found');
	return { posts, pageTitle: 'Blog' };
}
