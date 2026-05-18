<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { data, children } = $props();
	let nav = $derived(data.nav);
	let site = $derived(data.site);
	let profile = $derived(data.profile);
	let currentPath = $derived(page.url.pathname);

	let pageDescription = $derived(page.data.pageDescription ?? site.description);
	let pageTitle = $derived(
		currentPath === '/' ? site.title : `${page.data.pageTitle ?? ''} — ${site.title}`
	);
	let canonical = $derived(`${site.url.replace(/\/$/, '')}${currentPath}`);

	// JSON-LD: a Person schema on every page (light-touch) + a BlogPosting
	// on blog detail when the page data carries article metadata.
	let personLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: profile.name,
		description: profile.tagline,
		url: site.url,
		image: profile.photo ? `${site.url.replace(/\/$/, '')}${profile.photo}` : undefined,
		email: profile.email || undefined,
		sameAs: profile.social.map((s: { url: string }) => s.url)
	});
	let articleLd = $derived(page.data.article);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content={page.data.ogType ?? 'website'} />
	<meta property="og:url" content={canonical} />
	<meta property="og:site_name" content={site.title} />
	<meta
		property="og:image"
		content={`${site.url.replace(/\/$/, '')}/og${currentPath === '/' ? '/index' : currentPath}.png`}
	/>
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta
		name="twitter:image"
		content={`${site.url.replace(/\/$/, '')}/og${currentPath === '/' ? '/index' : currentPath}.png`}
	/>
	<link rel="canonical" href={canonical} />
	<link rel="icon" href={favicon} />
	<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html '<script type="application/ld+json">' + JSON.stringify(personLd) + '</' + 'script>'}
	{#if articleLd}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html '<script type="application/ld+json">' + JSON.stringify(articleLd) + '</' + 'script>'}
	{/if}
</svelte:head>

<a href="#main" class="skip-link">Skip to main content</a>

<header class="site-header">
	<div class="container-wide site-header-inner">
		<a href={resolve('/')} class="site-name" aria-label="{site.title}, home">{site.title}</a>
		<nav aria-label="Primary" class="primary-nav">
			<ul class="nav-list">
				{#each nav as link (link.href)}
					{@const active =
						link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href)}
					<li>
						<a
							href={link.href}
							aria-current={active ? 'page' : undefined}
							class={active ? 'nav-link nav-link-active' : 'nav-link'}>{link.label}</a
						>
					</li>
				{/each}
			</ul>
		</nav>
		<ThemeToggle />
	</div>
</header>

<main id="main" tabindex="-1">
	{@render children()}
</main>

<footer class="site-footer">
	<div class="container-wide footer-inner">
		<p class="footer-line">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
		<p class="footer-line footer-credit">
			Built with
			<a href="https://github.com/adoistic/personal-svelte-template" rel="noopener">
				personal-svelte-template
			</a>
			by
			<a href="https://github.com/adoistic" rel="noopener">Adnan</a>
			<span aria-hidden="true">·</span>
			<a href="https://twitter.com/adoistic" rel="noopener">Twitter</a>
		</p>
	</div>
</footer>

<style>
	.site-header {
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 50;
		background: color-mix(in srgb, var(--color-bg) 92%, transparent);
		backdrop-filter: saturate(180%) blur(8px);
		-webkit-backdrop-filter: saturate(180%) blur(8px);
	}
	.site-header-inner {
		padding-block: clamp(0.85rem, 2vw, 1.25rem);
		display: flex;
		flex-wrap: wrap;
		gap: clamp(0.75rem, 2vw, 2rem);
		align-items: center;
		justify-content: space-between;
	}
	.site-name {
		font-family: var(--font-serif);
		font-size: var(--font-size-lg);
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--color-fg);
		text-decoration: none;
		white-space: nowrap;
	}
	.site-name:hover {
		color: var(--color-accent);
	}
	.primary-nav {
		flex: 1;
	}
	.nav-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: clamp(0.5rem, 1.5vw, 1.5rem);
		justify-content: flex-end;
	}
	.nav-link {
		color: var(--color-muted);
		text-decoration: none;
		padding: 0.4rem 0.25rem;
		font-size: var(--font-size-sm);
		font-weight: 500;
		letter-spacing: 0.01em;
		transition: color 120ms;
		position: relative;
	}
	.nav-link:hover {
		color: var(--color-fg);
	}
	.nav-link-active {
		color: var(--color-fg);
	}
	.nav-link-active::after {
		content: '';
		position: absolute;
		left: 0.25rem;
		right: 0.25rem;
		bottom: 0.1rem;
		height: 2px;
		background: var(--color-accent);
		border-radius: 1px;
	}
	main {
		outline: none;
	}
	.site-footer {
		margin-top: var(--space-section);
		border-top: 1px solid var(--color-border);
		color: var(--color-muted);
		font-size: var(--font-size-sm);
	}
	.footer-inner {
		padding-block: var(--space-section);
		display: grid;
		gap: 0.5rem;
	}
	.footer-line {
		margin: 0;
	}
	.footer-credit a {
		color: var(--color-muted);
	}
	.footer-credit a:hover {
		color: var(--color-accent);
	}
</style>
