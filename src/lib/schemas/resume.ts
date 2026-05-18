import { z } from 'zod';

// Subset of JSON Resume v1.0.0 schema (jsonresume.org/schema). Only the fields
// we actually render are typed strictly. Unknown fields are passed through.

const LocationSchema = z
	.object({
		address: z.string().optional(),
		postalCode: z.string().optional(),
		city: z.string().optional(),
		countryCode: z.string().optional(),
		region: z.string().optional()
	})
	.passthrough();

const ProfileSchema = z.object({
	network: z.string(),
	username: z.string().optional(),
	url: z.string().url().optional()
});

const BasicsSchema = z
	.object({
		name: z.string().optional().default(''),
		label: z.string().optional(),
		image: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		url: z.string().url().optional(),
		summary: z.string().optional(),
		location: LocationSchema.optional(),
		profiles: z.array(ProfileSchema).optional()
	})
	.passthrough();

const WorkSchema = z
	.object({
		name: z.string().optional(),
		position: z.string().optional(),
		url: z.string().url().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		summary: z.string().optional(),
		highlights: z.array(z.string()).optional()
	})
	.passthrough();

const EducationSchema = z
	.object({
		institution: z.string().optional(),
		url: z.string().url().optional(),
		area: z.string().optional(),
		studyType: z.string().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		score: z.string().optional(),
		courses: z.array(z.string()).optional()
	})
	.passthrough();

const SkillSchema = z
	.object({
		name: z.string(),
		level: z.string().optional(),
		keywords: z.array(z.string()).optional()
	})
	.passthrough();

const ProjectSchema = z
	.object({
		name: z.string().optional(),
		description: z.string().optional(),
		highlights: z.array(z.string()).optional(),
		keywords: z.array(z.string()).optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		url: z.string().url().optional(),
		roles: z.array(z.string()).optional(),
		entity: z.string().optional(),
		type: z.string().optional()
	})
	.passthrough();

const CertificateSchema = z
	.object({
		name: z.string(),
		date: z.string().optional(),
		issuer: z.string().optional(),
		url: z.string().url().optional()
	})
	.passthrough();

export const ResumeSchema = z
	.object({
		basics: BasicsSchema.optional(),
		work: z.array(WorkSchema).default([]),
		education: z.array(EducationSchema).default([]),
		skills: z.array(SkillSchema).default([]),
		projects: z.array(ProjectSchema).default([]),
		certificates: z.array(CertificateSchema).default([])
	})
	.passthrough();

export type Resume = z.infer<typeof ResumeSchema>;
export type Work = z.infer<typeof WorkSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Certificate = z.infer<typeof CertificateSchema>;
