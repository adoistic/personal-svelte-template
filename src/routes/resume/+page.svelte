<script lang="ts">
	let { data } = $props();
	let { resume } = $derived(data);

	function fmtRange(start?: string, end?: string): string {
		const s = start ?? '';
		const e = end ?? 'Present';
		if (!s && !e) return '';
		return `${s} — ${e}`;
	}
</script>

<article class="section container">
	<h1>Resume</h1>

	{#if resume.basics?.label}
		<p class="muted lead">{resume.basics.label}</p>
	{/if}

	{#if resume.work.length > 0}
		<section aria-labelledby="work-heading" class="resume-section">
			<h2 id="work-heading">Work</h2>
			<ol class="entry-list">
				{#each resume.work as w, i (i)}
					<li class="entry">
						<header class="entry-header">
							<h3 class="entry-title">
								{w.position ?? ''}
								{#if w.position && w.name}<span class="muted"> · </span>{/if}
								{#if w.url && w.name}
									<a href={w.url} rel="noopener">{w.name}</a>
								{:else if w.name}
									<span>{w.name}</span>
								{/if}
							</h3>
							<p class="muted entry-meta">
								<time>{fmtRange(w.startDate, w.endDate)}</time>
							</p>
						</header>
						{#if w.summary}<p>{w.summary}</p>{/if}
						{#if w.highlights && w.highlights.length > 0}
							<ul>
								{#each w.highlights as h, hi (hi)}
									<li>{h}</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ol>
		</section>
	{/if}

	{#if resume.education.length > 0}
		<section aria-labelledby="education-heading" class="resume-section">
			<h2 id="education-heading">Education</h2>
			<ol class="entry-list">
				{#each resume.education as e, i (i)}
					<li class="entry">
						<header class="entry-header">
							<h3 class="entry-title">
								{e.studyType ?? ''}
								{#if e.studyType && e.area}<span class="muted">, </span>{/if}
								{#if e.area}<span>{e.area}</span>{/if}
							</h3>
							{#if e.institution}
								<p class="muted entry-meta">
									{e.institution}
									{#if e.startDate || e.endDate}
										<span> · </span>
										<time>{fmtRange(e.startDate, e.endDate)}</time>
									{/if}
								</p>
							{/if}
						</header>
					</li>
				{/each}
			</ol>
		</section>
	{/if}

	{#if resume.skills.length > 0}
		<section aria-labelledby="skills-heading" class="resume-section">
			<h2 id="skills-heading">Skills</h2>
			<ul class="skill-list">
				{#each resume.skills as s, i (i)}
					<li>
						<strong>{s.name}</strong>
						{#if s.keywords && s.keywords.length > 0}
							<span class="muted"> — {s.keywords.join(', ')}</span>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if resume.projects.length > 0}
		<section aria-labelledby="projects-heading" class="resume-section">
			<h2 id="projects-heading">Projects</h2>
			<ol class="entry-list">
				{#each resume.projects as p, i (i)}
					<li class="entry">
						<header class="entry-header">
							<h3 class="entry-title">
								{#if p.url && p.name}<a href={p.url} rel="noopener">{p.name}</a
									>{:else if p.name}<span>{p.name}</span>{/if}
							</h3>
							{#if p.startDate || p.endDate}
								<p class="muted entry-meta">
									<time>{fmtRange(p.startDate, p.endDate)}</time>
								</p>
							{/if}
						</header>
						{#if p.description}<p>{p.description}</p>{/if}
					</li>
				{/each}
			</ol>
		</section>
	{/if}
</article>

<style>
	.section {
		padding-block: var(--space-section);
	}
	.lead {
		margin-top: 0.5rem;
	}
	.resume-section {
		margin-top: clamp(2rem, 5vw, 3rem);
	}
	.entry-list {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		display: grid;
		gap: 1.75rem;
	}
	.entry-header {
		margin-bottom: 0.5rem;
	}
	.entry-title {
		margin: 0;
	}
	.entry-meta {
		margin: 0.25rem 0 0;
		font-size: var(--font-size-sm);
	}
	.skill-list {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		display: grid;
		gap: 0.5rem;
	}
</style>
