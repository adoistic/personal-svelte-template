import { error } from '@sveltejs/kit';
import { getResume, hasResume } from '$lib/content';

export const prerender = true;

export function load() {
	const resume = getResume();
	if (!hasResume(resume)) throw error(404, 'Not found');
	return { resume, pageTitle: 'Resume' };
}
