<script lang="ts">
	import SectionFrame from './SectionFrame.svelte';
	import type { Project } from './types';

	let {
		projects,
		onOpenModal
	}: {
		projects: Project[];
		onOpenModal: (project: Project) => void;
	} = $props();

	function getStackIconUrl(icons: string[]) {
		return `https://skillicons.dev/icons?i=${icons.join(',')}&theme=dark`;
	}
</script>

<SectionFrame id="projects" eyebrow="selected works" title="Featured Projects">
	<div class="flex flex-col gap-8">
		{#each projects as project, i (project.name)}
			<article
				class="group relative grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl border-[2.5px] border-black bg-white overflow-hidden
					shadow-[5px_5px_0px_0px_#18181b]
					transition-all duration-200
					hover:shadow-[8px_8px_0px_0px_#f59e0b] hover:-translate-x-0.5 hover:-translate-y-0.5"
			>
				<div class="relative flex items-center justify-center p-5 md:p-8 bg-[#faf6ed] bg-comic-newsprint border-b md:border-b-0 md:border-r-[2.5px] border-black min-h-75 md:min-h-100 overflow-hidden">
					{#if project.environment}
						<div 
							class="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded border-2 border-black bg-amber-400 text-black select-none font-mono text-[10px] font-black tracking-wider shadow-[2px_2px_0px_0px_#18181b]"
						>
							<span class="w-1.5 h-1.5 rounded-full bg-black"></span>
							<span>[{project.environment.toUpperCase()}]</span>
						</div>
					{/if}

					{#if i === 0}
						<div class="absolute top-4 right-4 z-20 select-none">
							<span class="comic-badge-pow bg-rose-500 text-yellow-300 px-2.5 py-0.5 text-[10px] -rotate-3">
								★ TOP MISSION
							</span>
						</div>
					{/if}

					{#if project.image}
						<img
							src={project.image}
							alt="Screenshot {project.name}"
							class="max-w-full max-h-80 md:max-h-95 object-contain drop-shadow-md
								transition-transform duration-500 group-hover:scale-[1.02]"
						/>
					{:else}
						<div class="w-full aspect-video flex flex-col items-center justify-center gap-2 text-stone-500 bg-white/70 border-2 border-dashed border-stone-400 rounded-xl">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span class="font-mono text-xs opacity-60">// screenshot coming soon</span>
						</div>
					{/if}
				</div>

				<div class="flex flex-col justify-between p-7 md:p-8 gap-6 bg-white">
					<div class="space-y-1">
						<span class="font-mono text-xs font-black text-amber-500">[ PANEL 0{i + 1} // CASE STUDY ]</span>
						<h3 class="text-2xl font-black tracking-tight text-foreground group-hover:text-amber-500 transition-colors">
							{project.name}
						</h3>
					</div>

					<p class="text-sm leading-relaxed text-stone-700 font-medium line-clamp-3 overflow-hidden">
						{project.description}
					</p>

					<div class="space-y-4">
						<div class="space-y-1.5">
							<p class="font-mono text-xs font-black text-sky-600">// TECH ARSENAL</p>
							<img
								src={getStackIconUrl(project.stackIcons)}
								alt="Tech stack: {project.stackIcons.join(', ')}"
								class="h-7 opacity-95 group-hover:opacity-100 transition-opacity duration-300"
								loading="lazy"
							/>
						</div>

						<div class="flex items-end justify-between gap-3 pt-3 border-t-2 border-black/10">
							<div class="flex flex-wrap gap-1.5 max-w-[70%]">
								{#each project.tags as tag (tag)}
									<span class="font-mono text-[11px] font-bold text-black bg-[#faf6ed] border border-black px-2.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#18181b] hover:bg-amber-400 transition-all duration-150 select-none">
										#{tag.toLowerCase()}
									</span>
								{/each}
							</div>
							<button
								onclick={() => onOpenModal(project)}
								class="font-mono text-xs font-black text-black bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#18181b] hover:shadow-[1px_1px_0px_0px_#18181b] hover:translate-x-0.5 hover:translate-y-0.5 transition-all shrink-0 cursor-pointer"
							>
								[ Details → ]
							</button>
						</div>
					</div>
				</div>
			</article>
		{/each}
	</div>
</SectionFrame>
