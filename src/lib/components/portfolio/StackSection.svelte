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

<SectionFrame id="stack" eyebrow="arsenal" title="Tech Stack & Tools">
	<div class="space-y-8 py-4 select-none">
		<div class="w-full flex flex-col gap-3">
			<p class="font-mono text-xs font-black text-amber-300 drop-shadow-[2px_2px_0px_#000] px-1">[ ROW 01 // LANGUAGES, FRAMEWORKS & ENGINES ]</p>
			
			<div 
				class="w-full overflow-hidden"
				style="
					-webkit-mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
					mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
				"
			>
				<div class="animate-marquee-left flex items-center" style="will-change: transform;">
					<div class="flex gap-4 items-center pr-4">
						{#each row1 as tech (tech.name)}
							<div class="flex items-center gap-3 bg-white border-2 border-black py-2 px-4 rounded-xl shadow-[3px_3px_0px_0px_#18181b] hover:border-amber-500 hover:shadow-[4px_4px_0px_0px_#f59e0b] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-default">
								<img src={getSingleIconUrl(tech.slug)} alt={tech.name} class="w-7 h-7 object-contain" />
								<span class="font-mono text-xs tracking-wider text-black font-black">{tech.name}</span>
							</div>
						{/each}
					</div>
					<div class="flex gap-4 items-center pr-4" aria-hidden="true">
						{#each row1 as tech (tech.name + '-dup')}
							<div class="flex items-center gap-3 bg-white border-2 border-black py-2 px-4 rounded-xl shadow-[3px_3px_0px_0px_#18181b] hover:border-amber-500 hover:shadow-[4px_4px_0px_0px_#f59e0b] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-default">
								<img src={getSingleIconUrl(tech.slug)} alt={tech.name} class="w-7 h-7 object-contain" />
								<span class="font-mono text-xs tracking-wider text-black font-black">{tech.name}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<div class="w-full flex flex-col gap-3 mt-2">
			<p class="font-mono text-xs font-black text-sky-300 drop-shadow-[2px_2px_0px_#000] px-1">[ ROW 02 // TOOLING, WORKFLOW & INFRASTRUCTURE ]</p>
			
			<div 
				class="w-full overflow-hidden"
				style="
					-webkit-mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
					mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
				"
			>
				<div class="animate-marquee-right flex items-center" style="will-change: transform;">
					<div class="flex gap-4 items-center pr-4">
						{#each row2 as tech (tech.name)}
							<div class="flex items-center gap-3 bg-white border-2 border-black py-2 px-4 rounded-xl shadow-[3px_3px_0px_0px_#18181b] hover:border-sky-500 hover:shadow-[4px_4px_0px_0px_#0284c7] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-default">
								<img src={getSingleIconUrl(tech.slug)} alt={tech.name} class="w-7 h-7 object-contain" />
								<span class="font-mono text-xs tracking-wider text-black font-black">{tech.name}</span>
							</div>
						{/each}
					</div>
					<div class="flex gap-4 items-center pr-4" aria-hidden="true">
						{#each row2 as tech (tech.name + '-dup')}
							<div class="flex items-center gap-3 bg-white border-2 border-black py-2 px-4 rounded-xl shadow-[3px_3px_0px_0px_#18181b] hover:border-sky-500 hover:shadow-[4px_4px_0px_0px_#0284c7] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-default">
								<img src={getSingleIconUrl(tech.slug)} alt={tech.name} class="w-7 h-7 object-contain" />
								<span class="font-mono text-xs tracking-wider text-black font-black">{tech.name}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</SectionFrame>
