import profileRaw from '../../content/profile.json';
import siteRaw from '../../content/site.json';
import booksRaw from '../../content/books.json';
import writingsRaw from '../../content/writings.json';
import resumeRaw from '../../content/resume.json';

import { ProfileSchema, type Profile } from './schemas/profile';
import { SiteSchema, type Site } from './schemas/site';
import { BooksSchema, type Book } from './schemas/books';
import { WritingsSchema, type Writing } from './schemas/writings';
import { ResumeSchema, type Resume } from './schemas/resume';
import { BlogFrontmatterSchema, type BlogPostMeta } from './schemas/blog';

// --- Profile + Site (required for the build) -----------------------------

export function getProfile(): Profile {
	const result = ProfileSchema.safeParse(profileRaw);
	if (!result.success) {
		throw new Error(
			`content/profile.json failed validation:\n${result.error.issues
				.map((i) => `  - ${i.path.join('.')}: ${i.message}`)
				.join('\n')}`
		);
	}
	return result.data;
}

export function getSite(): Site {
	const result = SiteSchema.safeParse(siteRaw);
	if (!result.success) {
		throw new Error(
			`content/site.json failed validation:\n${result.error.issues
				.map((i) => `  - ${i.path.join('.')}: ${i.message}`)
				.join('\n')}`
		);
	}
	return result.data;
}

// --- Optional sections (graceful degrade to empty) -----------------------

export function getBooks(): Book[] {
	const result = BooksSchema.safeParse(booksRaw);
	return result.success ? result.data : [];
}

export function getWritings(): Writing[] {
	const result = WritingsSchema.safeParse(writingsRaw);
	return result.success ? result.data : [];
}

export function getResume(): Resume {
	const result = ResumeSchema.safeParse(resumeRaw);
	if (result.success) return result.data;
	return ResumeSchema.parse({});
}

// --- Blog: scan content/blog/*.md via Vite glob --------------------------

type MdModule = {
	default: unknown;
	metadata?: unknown;
};

const postModules = import.meta.glob<MdModule>('/content/blog/*.md', {
	eager: true
});

export function getAllPosts(): BlogPostMeta[] {
	const posts: BlogPostMeta[] = [];
	for (const [path, mod] of Object.entries(postModules)) {
		const slug = path.split('/').pop()?.replace(/\.md$/, '');
		if (!slug) continue;
		const parsed = BlogFrontmatterSchema.safeParse(mod.metadata ?? {});
		if (!parsed.success) continue;
		if (parsed.data.draft) continue;
		posts.push({ ...parsed.data, slug });
	}
	posts.sort((a, b) => (a.date < b.date ? 1 : -1));
	return posts;
}

export function getPost(slug: string): { meta: BlogPostMeta; component: unknown } | null {
	const path = `/content/blog/${slug}.md`;
	const mod = postModules[path];
	if (!mod) return null;
	const parsed = BlogFrontmatterSchema.safeParse(mod.metadata ?? {});
	if (!parsed.success) return null;
	if (parsed.data.draft) return null;
	return { meta: { ...parsed.data, slug }, component: mod.default };
}

// --- Section predicates (auto-hide rules) --------------------------------

export function hasBooks(books: Book[]): boolean {
	return books.length > 0;
}

export function hasWritings(writings: Writing[]): boolean {
	return writings.length > 0;
}

export function hasResume(resume: Resume): boolean {
	return (
		(resume.work?.length ?? 0) > 0 ||
		(resume.education?.length ?? 0) > 0 ||
		(resume.skills?.length ?? 0) > 0 ||
		(resume.projects?.length ?? 0) > 0
	);
}

export function hasBlog(posts: BlogPostMeta[]): boolean {
	return posts.length > 0;
}
