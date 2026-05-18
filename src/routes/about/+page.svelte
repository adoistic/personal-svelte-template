<script lang="ts">
	let { data } = $props();
	let { profile } = $derived(data);
</script>

<article class="section container">
	<h1>About</h1>
	{#if profile.bio}
		<div class="prose">
			{#each profile.bio.split(/\n\n+/) as para, i (i)}
				<p>{para}</p>
			{/each}
		</div>
	{:else}
		<p class="muted">No bio set yet.</p>
	{/if}
</article>

<style>
	.section {
		padding-block: var(--space-section);
	}
</style>
