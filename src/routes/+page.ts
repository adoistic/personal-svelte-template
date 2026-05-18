import {
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

export function load() {
	const posts = getAllPosts();
	return {
		pageTitle: 'Home',
		sections: {
			books: hasBooks(getBooks()),
			writings: hasWritings(getWritings()),
			resume: hasResume(getResume()),
			blog: hasBlog(posts)
		},
		recentPosts: posts.slice(0, 3)
	};
}
