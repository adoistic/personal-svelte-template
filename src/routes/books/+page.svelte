<script lang="ts">
	import { md } from '$lib/markdown';

	let { data } = $props();
	let { books } = $derived(data);
</script>

<article class="section shell">
	<h1>Books</h1>
	<ul class="book-list">
		{#each books as book (book.title)}
			<li class="book">
				{#if book.cover}
					<img
						src={book.cover}
						alt={book.coverAlt || `Cover of ${book.title}`}
						class="book-cover"
						width="160"
						height="240"
					/>
				{/if}
				<div class="book-body">
					<h2 class="book-title">{book.title}</h2>
					{#if book.year}
						<p class="muted book-meta"><time datetime={String(book.year)}>{book.year}</time></p>
					{/if}
					{#if book.blurb}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<div class="prose book-blurb">{@html md(book.blurb)}</div>
					{/if}
					{#if book.links.length > 0}
						<ul class="book-links" aria-label="Where to buy {book.title}">
							{#each book.links as link (link.url)}
								<li><a href={link.url} rel="noopener">{link.label}</a></li>
							{/each}
						</ul>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</article>

<style>
	.section {
		padding-block: var(--space-section);
	}
	.book-list {
		list-style: none;
		padding: 0;
		margin: 2rem 0 0;
		display: grid;
		gap: 2.5rem;
	}
	.book {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: clamp(1rem, 3vw, 2rem);
		align-items: start;
	}
	@media (max-width: 540px) {
		.book {
			grid-template-columns: 1fr;
		}
	}
	.book-cover {
		width: clamp(120px, 25vw, 160px);
		height: auto;
		border: 1px solid var(--color-border);
	}
	.book-title {
		margin: 0;
	}
	.book-meta {
		margin: 0.25rem 0 0.75rem;
		font-size: var(--font-size-sm);
	}
	.book-links {
		list-style: none;
		padding: 0;
		margin-top: 1rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: var(--font-size-sm);
	}
</style>
