<script lang="ts">
	let { data } = $props();
	let { writings } = $derived(data);
</script>

<article class="section shell">
	<h1>Writings</h1>
	<p class="muted lead">External essays, articles, and interviews — published elsewhere.</p>
	<ul class="writing-list">
		{#each writings as w (w.url)}
			<li class="writing">
				<h2 class="writing-title">
					<a href={w.url} rel="noopener">{w.title}</a>
				</h2>
				<p class="muted writing-meta">
					{#if w.publisher}<span>{w.publisher}</span>{/if}
					{#if w.publisher && w.year}<span> · </span>{/if}
					{#if w.year}<time datetime={String(w.year)}>{w.year}</time>{/if}
				</p>
				{#if w.excerpt}
					<p>{w.excerpt}</p>
				{/if}
			</li>
		{/each}
	</ul>
</article>

<style>
	.section {
		padding-block: var(--space-section);
	}
	.lead {
		margin-top: 0.5rem;
	}
	.writing-list {
		list-style: none;
		padding: 0;
		margin: 2rem 0 0;
		display: grid;
		gap: 2rem;
	}
	.writing-title {
		margin: 0;
	}
	.writing-meta {
		margin: 0.25rem 0 0.5rem;
		font-size: var(--font-size-sm);
	}
</style>
