import {
	getBooks,
	getWritings,
	getResume,
	getAllPosts,
	hasBooks,
	hasWritings,
	hasResume,
	hasBlog
} from './content';

export type NavLink = { href: string; label: string };

export function getNavLinks(): NavLink[] {
	const links: NavLink[] = [{ href: '/', label: 'Home' }];

	if (hasBooks(getBooks())) links.push({ href: '/books', label: 'Books' });
	if (hasWritings(getWritings())) links.push({ href: '/writings', label: 'Writings' });
	if (hasResume(getResume())) links.push({ href: '/resume', label: 'Resume' });
	if (hasBlog(getAllPosts())) links.push({ href: '/blog', label: 'Blog' });

	links.push({ href: '/about', label: 'About' });
	return links;
}
