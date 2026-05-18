import { error } from '@sveltejs/kit';
import { getBooks, getProfile, hasBooks } from '$lib/content';

export const prerender = true;

export function load() {
	const books = getBooks();
	if (!hasBooks(books)) throw error(404, 'Not found');
	const profile = getProfile();
	return {
		books,
		pageTitle: 'Books',
		pageDescription: `Books by ${profile.name} — ${books.length} title${books.length === 1 ? '' : 's'}.`
	};
}
