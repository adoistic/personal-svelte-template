<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<article class="section container">
	<h1>{page.status} — Page not found</h1>
	<p class="muted">
		{page.error?.message ?? 'The page you are looking for does not exist or has moved.'}
	</p>
	<p><a href={resolve('/')}>← Back home</a></p>
</article>

<style>
	.section {
		padding-block: var(--space-section);
	}
</style>
