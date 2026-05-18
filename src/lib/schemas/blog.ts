import { z } from 'zod';

export const BlogFrontmatterSchema = z.object({
	title: z.string().min(1),
	date: z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString() : v)),
	cover: z.string().optional(),
	coverAlt: z.string().optional(),
	excerpt: z.string().optional(),
	draft: z.boolean().default(false)
});

export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;

export type BlogPostMeta = BlogFrontmatter & { slug: string };
