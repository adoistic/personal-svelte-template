import { z } from 'zod';

export const SocialLinkSchema = z.object({
	platform: z.string().min(1),
	url: z.string().url(),
	label: z.string().optional()
});

export const ProfileSchema = z.object({
	name: z.string().min(1),
	tagline: z.string().default(''),
	bio: z.string().default(''),
	photo: z.string().default(''),
	photoAlt: z.string().default(''),
	location: z.string().default(''),
	email: z.string().default(''),
	social: z.array(SocialLinkSchema).default([])
});

export type Profile = z.infer<typeof ProfileSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
