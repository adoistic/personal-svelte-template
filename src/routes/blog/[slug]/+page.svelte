<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
	let post = $derived(data.post);

	const modules = import.meta.glob('/content/blog/*.md', { eager: true });
	let mod = $derived(modules[`/content/blog/${post.slug}.md`] as { default: unknown } | undefined);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let Component = $derived(mod?.default as any);

	function formatDate(iso: string) {
		const d = new Date(iso);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}
</script>

<article class="section container">
	<header class="post-header">
		<h1>{post.title}</h1>
		<p class="muted">
			<time datetime={post.date}>{formatDate(post.date)}</time>
		</p>
	</header>

	{#if post.cover}
		<img src={post.cover} alt={post.coverAlt || ''} class="post-cover" width="800" height="450" />
	{/if}

	<div class="prose post-body">
		{#if Component}
			<Component />
		{/if}
	</div>

	<p class="back"><a href={resolve('/blog')}>← All writing</a></p>
</article>

<style>
	.section {
		padding-block: var(--space-section);
	}
	.post-header {
		margin-bottom: 1.5rem;
	}
	.post-cover {
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border: 1px solid var(--color-border);
		margin: 1.5rem 0;
	}
	.post-body {
		margin-top: 1.5rem;
	}
	.back {
		margin-top: 3rem;
		font-size: var(--font-size-sm);
	}
</style>
