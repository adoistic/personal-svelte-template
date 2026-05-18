import { z } from 'zod';

export const BookLinkSchema = z.object({
	label: z.string().min(1),
	url: z.string().url()
});

export const BookSchema = z.object({
	title: z.string().min(1),
	year: z.number().int().optional(),
	cover: z.string().optional(),
	coverAlt: z.string().optional(),
	blurb: z.string().default(''),
	links: z.array(BookLinkSchema).default([])
});

export type Book = z.infer<typeof BookSchema>;
