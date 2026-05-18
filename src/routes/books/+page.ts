import { error } from '@sveltejs/kit';
import { getBooks, hasBooks } from '$lib/content';

export const prerender = true;

export function load() {
	const books = getBooks();
	if (!hasBooks(books)) throw error(404, 'Not found');
	return { books, pageTitle: 'Books' };
}
