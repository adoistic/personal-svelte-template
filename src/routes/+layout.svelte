<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { data, children } = $props();
	let nav = $derived(data.nav);
	let site = $derived(data.site);
	let profile = $derived(data.profile);
	let currentPath = $derived(page.url.pathname);

	let pageTitle = $derived(
		currentPath === '/' ? site.title : `${page.data.pageTitle ?? ''} — ${site.title}`
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={site.description} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={site.description} />
	<meta property="og:type" content="website" />
	<link rel="icon" href={favicon} />
</svelte:head>

<a href="#main" class="skip-link">Skip to main content</a>

<header class="container-wide site-header">
	<nav aria-label="Primary">
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
</header>

<main id="main" tabindex="-1">
	{@render children()}
</main>

<footer class="container-wide site-footer">
	<p>© {new Date().getFullYear()} {profile.name}.</p>
</footer>

<style>
	.site-header {
		padding-block: clamp(1.25rem, 3vw, 2rem);
	}
	.nav-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: clamp(0.75rem, 2vw, 1.5rem);
	}
	.nav-link {
		color: var(--color-fg);
		text-decoration: none;
		padding: 0.25rem 0;
	}
	.nav-link:hover {
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}
	.nav-link-active {
		font-weight: 600;
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 0.25em;
	}
	main {
		outline: none;
	}
	.site-footer {
		padding-block: var(--space-section);
		margin-top: var(--space-section);
		border-top: 1px solid var(--color-border);
		color: var(--color-muted);
		font-size: var(--font-size-sm);
	}
</style>
