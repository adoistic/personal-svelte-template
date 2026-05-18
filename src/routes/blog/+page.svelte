<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
	let { posts } = $derived(data);

	function formatDate(iso: string) {
		const d = new Date(iso);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}
</script>

<article class="section container">
	<h1>Blog</h1>
	<ul class="post-list">
		{#each posts as post (post.slug)}
			<li class:has-cover={!!post.cover}>
				<a href={resolve('/blog/[slug]', { slug: post.slug })} class="post-link">
					{#if post.cover}
						<img
							src={post.cover}
							alt={post.coverAlt || ''}
							class="post-cover"
							width="320"
							height="180"
						/>
					{/if}
					<div class="post-meta-block">
						<h2 class="post-title">{post.title}</h2>
						<p class="muted post-meta">
							<time datetime={post.date}>{formatDate(post.date)}</time>
						</p>
						{#if post.excerpt}
							<p class="post-excerpt">{post.excerpt}</p>
						{/if}
					</div>
				</a>
			</li>
		{/each}
	</ul>
</article>

<style>
	.section {
		padding-block: var(--space-section);
	}
	.post-list {
		list-style: none;
		padding: 0;
		margin: 2rem 0 0;
		display: grid;
		gap: 2.5rem;
	}
	.post-link {
		display: block;
		text-decoration: none;
		color: inherit;
	}
	.post-link:hover .post-title {
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}
	.has-cover .post-link {
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: 1.5rem;
		align-items: start;
	}
	@media (max-width: 540px) {
		.has-cover .post-link {
			grid-template-columns: 1fr;
		}
	}
	.post-cover {
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border: 1px solid var(--color-border);
	}
	.post-title {
		margin: 0 0 0.25rem;
	}
	.post-meta {
		margin: 0 0 0.5rem;
		font-size: var(--font-size-sm);
	}
	.post-excerpt {
		margin: 0;
	}
</style>
