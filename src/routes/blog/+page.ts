import { error } from '@sveltejs/kit';
import { getAllPosts, getProfile, hasBlog } from '$lib/content';

export const prerender = true;

export function load() {
	const posts = getAllPosts();
	if (!hasBlog(posts)) throw error(404, 'Not found');
	const profile = getProfile();
	return {
		posts,
		pageTitle: 'Blog',
		pageDescription: `Long-form posts by ${profile.name}.`
	};
}
