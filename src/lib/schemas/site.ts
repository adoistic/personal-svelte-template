import { z } from 'zod';

export const SiteSchema = z.object({
	title: z.string().min(1),
	description: z.string().default(''),
	url: z.string().url().default('https://example.com'),
	accent: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/, 'accent must be a 6-digit hex like #0f4c81')
		.default('#0f4c81')
});

export type Site = z.infer<typeof SiteSchema>;
