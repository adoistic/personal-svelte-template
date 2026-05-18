import { getProfile } from '$lib/content';

export const prerender = true;

export function load() {
	const profile = getProfile();
	const firstPara = (profile.bio || '').split(/\n\n+/)[0].replace(/[*_`#>[\]]/g, '');
	return {
		pageTitle: 'About',
		pageDescription: firstPara || `About ${profile.name}`
	};
}
