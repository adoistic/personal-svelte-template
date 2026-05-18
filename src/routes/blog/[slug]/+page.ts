import { error } from '@sveltejs/kit';
import { getAllPosts, getPost } from '$lib/content';

export const prerender = true;

export function entries() {
	return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	const post = getPost(params.slug);
	if (!post) throw error(404, 'Post not found');
	return { post: post.meta, pageTitle: post.meta.title };
}
