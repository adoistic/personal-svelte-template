<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
	let { profile, sections, recentPosts } = $derived(data);

	function formatDate(iso: string) {
		const d = new Date(iso);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}
</script>

<section class="hero container" aria-labelledby="profile-heading">
	<div class="hero-grid">
		{#if profile.photo}
			<img
				src={profile.photo}
				alt={profile.photoAlt || `Photo of ${profile.name}`}
				width="160"
				height="160"
				class="hero-photo"
			/>
		{/if}
		<div>
			<h1 id="profile-heading">{profile.name}</h1>
			{#if profile.tagline}
				<p class="hero-tagline">{profile.tagline}</p>
			{/if}
		</div>
	</div>

	{#if profile.bio}
		<div class="prose hero-bio">
			{#each profile.bio.split(/\n\n+/) as para, i (i)}
				<p>{para}</p>
			{/each}
		</div>
	{/if}

	{#if profile.social.length > 0 || profile.email}
		<ul class="social-list" aria-label="Contact and social links">
			{#if profile.email}
				<li><a href="mailto:{profile.email}">{profile.email}</a></li>
			{/if}
			{#each profile.social as link (link.url)}
				<li>
					<a href={link.url} rel="me noopener">{link.label || link.platform}</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>

{#if sections.blog && recentPosts.length > 0}
	<section class="section container" aria-labelledby="recent-heading">
		<h2 id="recent-heading">Recent writing</h2>
		<ul class="post-preview-list">
			{#each recentPosts as post (post.slug)}
				<li>
					<a href={resolve('/blog/[slug]', { slug: post.slug })} class="post-preview-link">
						<h3 class="post-preview-title">{post.title}</h3>
						<p class="muted post-preview-meta">
							<time datetime={post.date}>{formatDate(post.date)}</time>
						</p>
						{#if post.excerpt}
							<p class="post-preview-excerpt">{post.excerpt}</p>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
		<p><a href={resolve('/blog')}>All writing →</a></p>
	</section>
{/if}

<style>
	.hero {
		padding-block: var(--space-section);
	}
	.hero-grid {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: clamp(1rem, 3vw, 2rem);
		align-items: center;
	}
	@media (max-width: 480px) {
		.hero-grid {
			grid-template-columns: 1fr;
		}
	}
	.hero-photo {
		border-radius: 50%;
		width: clamp(100px, 22vw, 160px);
		height: clamp(100px, 22vw, 160px);
		object-fit: cover;
	}
	.hero-tagline {
		color: var(--color-muted);
		font-size: var(--font-size-lg);
		margin-top: 0.5em;
	}
	.hero-bio {
		margin-top: clamp(1.5rem, 4vw, 2.5rem);
	}
	.social-list {
		list-style: none;
		padding: 0;
		margin-top: 1.5rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: var(--font-size-sm);
	}
	.section {
		padding-block: var(--space-section);
	}
	.post-preview-list {
		list-style: none;
		padding: 0;
		margin: 1.5rem 0 0;
		display: grid;
		gap: 2rem;
	}
	.post-preview-link {
		display: block;
		text-decoration: none;
		color: inherit;
	}
	.post-preview-link:hover .post-preview-title {
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}
	.post-preview-title {
		margin: 0 0 0.25rem;
	}
	.post-preview-meta {
		margin: 0 0 0.5rem;
		font-size: var(--font-size-sm);
	}
	.post-preview-excerpt {
		margin: 0;
	}
</style>
