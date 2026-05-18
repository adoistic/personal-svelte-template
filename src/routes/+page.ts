import {
	getBooks,
	getWritings,
	getResume,
	getAllPosts,
	getProfile,
	getSite,
	hasBooks,
	hasWritings,
	hasResume,
	hasBlog
} from '$lib/content';

export const prerender = true;

export function load() {
	const posts = getAllPosts();
	const profile = getProfile();
	const site = getSite();
	return {
		pageTitle: 'Home',
		pageDescription: profile.tagline || site.description,
		sections: {
			books: hasBooks(getBooks()),
			writings: hasWritings(getWritings()),
			resume: hasResume(getResume()),
			blog: hasBlog(posts)
		},
		recentPosts: posts.slice(0, 3)
	};
}
