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

<SectionFrame id="projects" eyebrow="projects" title="Projects">
	<div class="flex flex-col gap-8">
		{#each projects as project, i (project.name)}
			<article
				class="group relative grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl border border-border bg-card overflow-hidden
					transition-all duration-500
					hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_var(--primary)]"
			>
				<div class="relative flex items-center justify-center p-5 md:p-8 bg-muted/20 border-b md:border-b-0 md:border-r border-border/50 min-h-75 md:min-h-100">
					{#if project.environment}
						<div 
							class="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md border backdrop-blur-md select-none font-mono text-[10px] tracking-wider
								{project.environment.toLowerCase().includes('live') 
									? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_-3px_rgba(16,185,129,0.2)]' 
									: 'bg-amber-950/40 text-amber-400 border-amber-500/30 shadow-[0_0_10px_-3px_rgba(245,158,11,0.2)]'}"
						>
							<span class="relative flex h-1.5 w-1.5">
								<span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 
									{project.environment.toLowerCase().includes('live') ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
								<span class="relative inline-flex rounded-full h-1.5 w-1.5 
									{project.environment.toLowerCase().includes('live') ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
							</span>
							<span>{project.environment.toUpperCase()}</span>
						</div>
					{/if}

					{#if project.image}
						<img
							src={project.image}
							alt="Screenshot {project.name}"
							class="max-w-full max-h-80 md:max-h-95 object-contain drop-shadow-2xl
								transition-transform duration-500 group-hover:scale-[1.02]"
						/>
					{:else}
						<div class="w-full aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground bg-zinc-950/40 rounded-xl">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span class="font-mono text-xs opacity-30">screenshot coming soon</span>
						</div>
					{/if}
				</div>

				<div class="flex flex-col justify-between p-7 md:p-8 gap-6">
					<div class="space-y-1">
						<span class="font-mono text-xs text-muted-foreground/50">0{i + 1}</span>
						<h3 class="text-xl font-semibold tracking-tight text-foreground">
							{project.name}
						</h3>
					</div>

					<p class="text-sm leading-relaxed text-muted-foreground line-clamp-3 overflow-hidden">
						{project.description}
					</p>

					<div class="space-y-4">
						<div class="space-y-1.5">
							<p class="font-mono text-xs text-muted-foreground/50">// stack</p>
							<img
								src={getStackIconUrl(project.stackIcons)}
								alt="Tech stack: {project.stackIcons.join(', ')}"
								class="h-7 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
								loading="lazy"
							/>
						</div>

						<div class="flex items-end justify-between gap-3 pt-3 border-t border-border/50">
							<div class="flex flex-wrap gap-1.5 max-w-[75%]">
								{#each project.tags as tag (tag)}
									<span class="font-mono text-[11px] text-zinc-400 bg-zinc-900/50 border border-zinc-800/80 px-2.5 py-0.5 rounded-md hover:border-primary/30 hover:bg-primary/5 hover:text-foreground transition-all duration-300 select-none">
										<span class="text-primary/60 font-medium">#</span>{tag.toLowerCase()}
									</span>
								{/each}
							</div>
							<button
								onclick={() => onOpenModal(project)}
								class="font-mono text-sm text-secondary hover:text-foreground transition-colors shrink-0 pb-0.5"
							>
								View Project →
							</button>
						</div>
					</div>
				</div>
			</article>
		{/each}
	</div>
</SectionFrame>
