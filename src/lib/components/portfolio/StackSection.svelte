<script lang="ts">
	import SectionFrame from './SectionFrame.svelte';

	const row1 = [
		{ name: 'HTML5', slug: 'html' },
		{ name: 'CSS3', slug: 'css' },
		{ name: 'JavaScript', slug: 'js' },
		{ name: 'TypeScript', slug: 'ts' },
		{ name: 'Svelte', slug: 'svelte' },
		{ name: 'Tailwind CSS', slug: 'tailwind' },
		{ name: 'PHP', slug: 'php' },
		{ name: 'Laravel', slug: 'laravel' },
		{ name: 'Node.js', slug: 'nodejs' },
		{ name: 'MySQL', slug: 'mysql' }
	];

	const row2 = [
		{ name: 'Git', slug: 'git' },
		{ name: 'GitHub', slug: 'github' },
		{ name: 'Vite', slug: 'vite' },
		{ name: 'pnpm', slug: 'pnpm' },
		{ name: 'VS Code', slug: 'vscode' },
		{ name: 'Postman', slug: 'postman' },
		{ name: 'Vercel', slug: 'vercel' }
	];

	function getSingleIconUrl(slug: string) {
		return `https://skillicons.dev/icons?i=${slug}&theme=dark`;
	}
</script>

<SectionFrame id="stack" eyebrow="stack" title="Tech Stack">
	<div class="space-y-8 py-4 select-none">
		<div class="w-full flex flex-col gap-3">
			<p class="font-mono text-xs text-muted-foreground/60 px-1">// core development stack (languages, frameworks & database)</p>
			
			<div 
				class="w-full overflow-hidden"
				style="
					-webkit-mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
					mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
				"
			>
				<div class="animate-marquee-left flex items-center" style="will-change: transform;">
					<div class="flex gap-8 items-center pr-8">
						{#each row1 as tech (tech.name)}
							<div class="flex items-center gap-3 bg-muted/30 border border-border/50 py-2.5 px-5 rounded-2xl">
								<img src={getSingleIconUrl(tech.slug)} alt={tech.name} class="w-8 h-8 object-contain" />
								<span class="font-mono text-sm tracking-wide text-foreground/90 font-medium">{tech.name}</span>
							</div>
						{/each}
					</div>
					<div class="flex gap-8 items-center pr-8" aria-hidden="true">
						{#each row1 as tech (tech.name + '-dup')}
							<div class="flex items-center gap-3 bg-muted/30 border border-border/50 py-2.5 px-5 rounded-2xl">
								<img src={getSingleIconUrl(tech.slug)} alt={tech.name} class="w-8 h-8 object-contain" />
								<span class="font-mono text-sm tracking-wide text-foreground/90 font-medium">{tech.name}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<div class="w-full flex flex-col gap-3 mt-2">
			<p class="font-mono text-xs text-muted-foreground/60 px-1">// developer tooling, version control & workflow</p>
			
			<div 
				class="w-full overflow-hidden"
				style="
					-webkit-mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
					mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
				"
			>
				<div class="animate-marquee-right flex items-center" style="will-change: transform;">
					<div class="flex gap-8 items-center pr-8">
						{#each row2 as tech (tech.name)}
							<div class="flex items-center gap-3 bg-muted/30 border border-border/50 py-2.5 px-5 rounded-2xl">
								<img src={getSingleIconUrl(tech.slug)} alt={tech.name} class="w-8 h-8 object-contain" />
								<span class="font-mono text-sm tracking-wide text-foreground/90 font-medium">{tech.name}</span>
							</div>
						{/each}
					</div>
					<div class="flex gap-8 items-center pr-8" aria-hidden="true">
						{#each row2 as tech (tech.name + '-dup')}
							<div class="flex items-center gap-3 bg-muted/30 border border-border/50 py-2.5 px-5 rounded-2xl">
								<img src={getSingleIconUrl(tech.slug)} alt={tech.name} class="w-8 h-8 object-contain" />
								<span class="font-mono text-sm tracking-wide text-foreground/90 font-medium">{tech.name}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</SectionFrame>
