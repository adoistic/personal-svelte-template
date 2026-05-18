<script lang="ts">
	import { onMount } from 'svelte';

	type Theme = 'system' | 'light' | 'dark';

	let theme = $state<Theme>('system');
	let mounted = $state(false);

	onMount(() => {
		const stored = localStorage.getItem('theme');
		theme = stored === 'light' || stored === 'dark' ? stored : 'system';
		mounted = true;
	});

	function setTheme(next: Theme) {
		theme = next;
		if (next === 'system') {
			localStorage.removeItem('theme');
			document.documentElement.removeAttribute('data-theme');
		} else {
			localStorage.setItem('theme', next);
			document.documentElement.dataset.theme = next;
		}
	}
</script>

<div
	class="theme-toggle"
	role="group"
	aria-label="Color theme"
	style:visibility={mounted ? 'visible' : 'hidden'}
>
	<button
		type="button"
		onclick={() => setTheme('system')}
		aria-pressed={theme === 'system'}
		title="Match system setting"
	>
		<span aria-hidden="true">Auto</span>
		<span class="sr-only">Use system color scheme</span>
	</button>
	<button
		type="button"
		onclick={() => setTheme('light')}
		aria-pressed={theme === 'light'}
		title="Light mode"
	>
		<span aria-hidden="true">Light</span>
		<span class="sr-only">Force light mode</span>
	</button>
	<button
		type="button"
		onclick={() => setTheme('dark')}
		aria-pressed={theme === 'dark'}
		title="Dark mode"
	>
		<span aria-hidden="true">Dark</span>
		<span class="sr-only">Force dark mode</span>
	</button>
</div>

<style>
	.theme-toggle {
		display: inline-flex;
		gap: 0;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		overflow: hidden;
		font-size: var(--font-size-sm);
	}
	.theme-toggle button {
		background: transparent;
		color: var(--color-muted);
		border: 0;
		padding: 0.35rem 0.7rem;
		font: inherit;
		cursor: pointer;
		border-right: 1px solid var(--color-border);
	}
	.theme-toggle button:last-child {
		border-right: 0;
	}
	.theme-toggle button:hover {
		color: var(--color-fg);
		background: color-mix(in srgb, var(--color-border) 50%, transparent);
	}
	.theme-toggle button[aria-pressed='true'] {
		background: var(--color-fg);
		color: var(--color-bg);
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
