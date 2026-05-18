import { getProfile, getSite } from '$lib/content';
import { getNavLinks } from '$lib/nav';

export const prerender = true;
export const trailingSlash = 'never';

export function load() {
	return {
		profile: getProfile(),
		site: getSite(),
		nav: getNavLinks()
	};
}
