import { error } from '@sveltejs/kit';
import { getWritings, getProfile, hasWritings } from '$lib/content';

export const prerender = true;

export function load() {
	const writings = getWritings();
	if (!hasWritings(writings)) throw error(404, 'Not found');
	const profile = getProfile();
	return {
		writings,
		pageTitle: 'Writings',
		pageDescription: `External essays, articles, and interviews by ${profile.name}.`
	};
}
