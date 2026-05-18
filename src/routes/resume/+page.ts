import { error } from '@sveltejs/kit';
import { getResume, getProfile, hasResume } from '$lib/content';

export const prerender = true;

export function load() {
	const resume = getResume();
	if (!hasResume(resume)) throw error(404, 'Not found');
	const profile = getProfile();
	return {
		resume,
		pageTitle: 'Resume',
		pageDescription: `Resume of ${profile.name} — ${resume.basics?.label || 'career history, education, and skills'}.`
	};
}
