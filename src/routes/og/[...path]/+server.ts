import { error } from '@sveltejs/kit';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	getProfile,
	getSite,
	getBooks,
	getWritings,
	getResume,
	getAllPosts,
	hasBooks,
	hasWritings,
	hasResume,
	hasBlog
} from '$lib/content';

export const prerender = true;

type OgPage = { path: string; title: string; subtitle: string };

function listPages(): OgPage[] {
	const profile = getProfile();
	const site = getSite();

	const pages: OgPage[] = [
		{ path: 'index', title: profile.name, subtitle: profile.tagline || site.description },
		{ path: 'about', title: 'About', subtitle: profile.name }
	];
	if (hasBooks(getBooks())) pages.push({ path: 'books', title: 'Books', subtitle: profile.name });
	if (hasWritings(getWritings()))
		pages.push({ path: 'writings', title: 'Writings', subtitle: profile.name });
	if (hasResume(getResume()))
		pages.push({ path: 'resume', title: 'Resume', subtitle: profile.name });

	const posts = getAllPosts();
	if (hasBlog(posts)) {
		pages.push({ path: 'blog', title: 'Blog', subtitle: profile.name });
		for (const post of posts) {
			pages.push({ path: `blog/${post.slug}`, title: post.title, subtitle: profile.name });
		}
	}
	return pages;
}

export function entries() {
	return listPages().map((p) => ({ path: `${p.path}.png` }));
}

// Inter weight 500 woff is bundled via @fontsource/inter. Satori accepts
// woff (v1) directly; this matches the official Satori playground.
let fontCache: Buffer | null = null;
function loadFont(): Buffer {
	if (fontCache) return fontCache;
	const here = path.dirname(fileURLToPath(import.meta.url));
	const fontFile = 'inter-latin-500-normal.woff';
	const candidates = [
		path.resolve(here, '../../../../../node_modules/@fontsource/inter/files/' + fontFile),
		path.resolve(process.cwd(), 'node_modules/@fontsource/inter/files/' + fontFile)
	];
	for (const p of candidates) {
		if (fs.existsSync(p)) {
			fontCache = fs.readFileSync(p);
			return fontCache;
		}
	}
	throw new Error(`Inter font not found. Looked in: ${candidates.join(', ')}`);
}

export async function GET({ params }) {
	const pathArg = params.path;
	if (!pathArg.endsWith('.png')) throw error(404);
	const lookup = pathArg.slice(0, -4);

	const page = listPages().find((p) => p.path === lookup);
	if (!page) throw error(404);

	const site = getSite();
	const font = loadFont();

	const svg = await satori(
		{
			type: 'div',
			key: 'root',
			props: {
				style: {
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '72px 80px',
					background: '#fdfdfc',
					fontFamily: 'Inter',
					color: '#18181b'
				},
				children: [
					{
						type: 'div',
						key: 'top',
						props: {
							style: {
								display: 'flex',
								fontSize: 24,
								color: '#52525b',
								letterSpacing: '0.05em',
								textTransform: 'uppercase'
							},
							children: site.title
						}
					},
					{
						type: 'div',
						key: 'mid',
						props: {
							style: {
								display: 'flex',
								fontSize: 76,
								lineHeight: 1.1,
								letterSpacing: '-0.02em',
								fontWeight: 500,
								color: '#18181b',
								flexWrap: 'wrap'
							},
							children: page.title
						}
					},
					{
						type: 'div',
						key: 'bot',
						props: {
							style: {
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-end',
								fontSize: 24,
								color: '#52525b'
							},
							children: [
								{
									type: 'div',
									key: 'sub',
									props: { style: { display: 'flex' }, children: page.subtitle }
								},
								{
									type: 'div',
									key: 'url',
									props: {
										style: { display: 'flex', fontFamily: 'Inter' },
										children: site.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
									}
								}
							]
						}
					}
				]
			}
		},
		{
			width: 1200,
			height: 630,
			fonts: [{ name: 'Inter', data: font, weight: 500, style: 'normal' }]
		}
	);

	const png = new Resvg(svg).render().asPng();

	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
