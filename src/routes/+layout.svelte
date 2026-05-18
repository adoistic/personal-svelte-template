<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
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

	// --- Mobile menu state ---------------------------------------------------
	let menuOpen = $state(false);
	let menuButton: HTMLButtonElement | undefined = $state();

	function openMenu() {
		menuOpen = true;
		// Move focus to the first link in the panel for keyboard users.
		queueMicrotask(() => {
			const first = document.querySelector<HTMLAnchorElement>('#mobile-menu .mobile-nav-link');
			first?.focus();
		});
	}
	function closeMenu() {
		if (!menuOpen) return;
		menuOpen = false;
		menuButton?.focus();
	}

	// Close on Escape, lock body scroll while open.
	onMount(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape' && menuOpen) closeMenu();
		}
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = menuOpen ? 'hidden' : '';
	});

	// Close menu whenever the route changes.
	$effect(() => {
		void currentPath;
		menuOpen = false;
	});
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
	<div class="shell site-header-inner">
		<a href={resolve('/')} class="site-name" aria-label="{site.title}, home">{site.title}</a>

		<!-- Wide-screen inline nav -->
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

		<!-- Mobile hamburger button -->
		<button
			class="hamburger"
			type="button"
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={menuOpen}
			aria-controls="mobile-menu"
			onclick={() => (menuOpen ? closeMenu() : openMenu())}
			bind:this={menuButton}
		>
			<span class="hamburger-icon" class:is-open={menuOpen} aria-hidden="true">
				<span></span>
				<span></span>
				<span></span>
			</span>
		</button>
	</div>
</header>

<!-- Mobile menu panel: full-width drop-down below the header.
     Hidden on wide screens via CSS even if menuOpen is true. -->
<div
	id="mobile-menu"
	class="mobile-menu"
	class:is-open={menuOpen}
	role="dialog"
	aria-modal="true"
	aria-label="Site navigation"
	hidden={!menuOpen}
>
	<nav aria-label="Mobile primary">
		<ul class="mobile-nav-list">
			{#each nav as link (link.href)}
				{@const active =
					link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href)}
				<li>
					<a
						href={link.href}
						aria-current={active ? 'page' : undefined}
						class={active ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link'}
						>{link.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</div>

<!-- Backdrop, click to close. Behind the menu, above the rest. -->
{#if menuOpen}
	<button
		class="menu-backdrop"
		type="button"
		aria-label="Close menu"
		onclick={closeMenu}
		tabindex="-1"
	></button>
{/if}

<main id="main" tabindex="-1">
	{@render children()}
</main>

<footer class="site-footer">
	<div class="shell footer-inner">
		<div class="footer-text">
			<p class="footer-line">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
			<p class="footer-line footer-credit">
				Built with
				<a href="https://github.com/adoistic/personal-svelte-template" rel="noopener">
					personal-svelte-template
				</a>
				by
				<a href="https://github.com/adoistic" rel="noopener">Adnan</a>
			</p>
		</div>
		<ThemeToggle />
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
		gap: clamp(1rem, 3vw, 2.5rem);
		align-items: baseline;
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

	/* Hamburger button — hidden on wide screens. */
	.hamburger {
		display: none;
		background: transparent;
		border: 0;
		padding: 0.5rem;
		cursor: pointer;
		color: var(--color-fg);
		margin-inline-start: auto;
	}
	.hamburger-icon {
		display: inline-block;
		width: 26px;
		height: 20px;
		position: relative;
	}
	.hamburger-icon span {
		display: block;
		position: absolute;
		left: 0;
		right: 0;
		height: 2px;
		background: currentColor;
		border-radius: 1px;
		transition:
			transform 200ms ease,
			opacity 150ms ease,
			top 200ms ease;
	}
	.hamburger-icon span:nth-child(1) {
		top: 2px;
	}
	.hamburger-icon span:nth-child(2) {
		top: 9px;
	}
	.hamburger-icon span:nth-child(3) {
		top: 16px;
	}
	.hamburger-icon.is-open span:nth-child(1) {
		top: 9px;
		transform: rotate(45deg);
	}
	.hamburger-icon.is-open span:nth-child(2) {
		opacity: 0;
	}
	.hamburger-icon.is-open span:nth-child(3) {
		top: 9px;
		transform: rotate(-45deg);
	}

	/* Mobile menu panel — hidden by default, only shown on narrow screens. */
	.mobile-menu {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding-top: calc(clamp(0.85rem, 2vw, 1.25rem) * 2 + 2rem);
		padding-bottom: 2rem;
		padding-inline: clamp(1rem, 4vw, 2rem);
		background: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
		z-index: 60;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
	}
	.mobile-nav-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.25rem;
	}
	.mobile-nav-link {
		display: block;
		padding: 0.85rem 0.5rem;
		font-family: var(--font-serif);
		font-size: var(--font-size-lg);
		color: var(--color-fg);
		text-decoration: none;
		border-radius: 4px;
	}
	.mobile-nav-link:hover {
		background: color-mix(in srgb, var(--color-border) 40%, transparent);
	}
	.mobile-nav-link-active {
		color: var(--color-accent);
		font-weight: 500;
	}

	.menu-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		border: 0;
		padding: 0;
		cursor: pointer;
		z-index: 55;
	}

	@media (max-width: 640px) {
		.primary-nav {
			display: none;
		}
		.hamburger {
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}
		.mobile-menu {
			display: block;
			transform: translateY(-110%);
			transition: transform 220ms ease;
		}
		.mobile-menu.is-open {
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hamburger-icon span,
		.mobile-menu {
			transition: none;
		}
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
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1.5rem;
	}
	.footer-text {
		display: grid;
		gap: 0.4rem;
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
