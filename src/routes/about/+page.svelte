<script lang="ts">
	import { md } from '$lib/markdown';

	let { data } = $props();
	let { profile } = $derived(data);
</script>

<article class="section container">
	<h1>About</h1>
	{#if profile.bio}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="prose">{@html md(profile.bio)}</div>
	{:else}
		<p class="muted">No bio set yet.</p>
	{/if}
</article>

<style>
	.section {
		padding-block: var(--space-section);
	}
</style>
