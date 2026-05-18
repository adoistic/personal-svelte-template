import { error } from '@sveltejs/kit';
import { getWritings, hasWritings } from '$lib/content';

export const prerender = true;

export function load() {
	const writings = getWritings();
	if (!hasWritings(writings)) throw error(404, 'Not found');
	return { writings, pageTitle: 'Writings' };
}
