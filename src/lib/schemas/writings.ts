import { z } from 'zod';

export const WritingSchema = z.object({
	title: z.string().min(1),
	publisher: z.string().default(''),
	year: z.number().int().optional(),
	url: z.string().url(),
	excerpt: z.string().optional()
});

export type Writing = z.infer<typeof WritingSchema>;
