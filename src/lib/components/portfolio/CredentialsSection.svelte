<script lang="ts">
	import SectionFrame from './SectionFrame.svelte';
	import type { Credential } from './types';

	let { credentials, onOpenImage }: { credentials: Credential[], onOpenImage: (item: Credential) => void } = $props();

	let selectedCategory = $state<'all' | 'award' | 'certificate' | 'pkl'>('all');

	const filteredCredentials = $derived(
		selectedCategory === 'all'
			? credentials
			: credentials.filter((c) => c.category === selectedCategory)
	);
	
</script>

<SectionFrame id="credentials" eyebrow="achievements" title="Credentials & Experience">
	<div class="space-y-8">


		<!-- Grid Layout -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			{#each filteredCredentials as item (item.title)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div 
					onclick={() => onOpenImage(item)}
					class="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden cursor-pointer
						transition-all duration-500 hover:border-primary/40 hover:shadow-[0_10px_30px_-15px_var(--primary)]"
				>
					<!-- Image Frame with Dynamic Blur Background for aspect ratio fitting -->
					<div class="relative w-full aspect-4/3 overflow-hidden bg-zinc-950 flex items-center justify-center">
						<!-- Real Image (Zoomed Cover focusing on the top of the certificate) -->
						<img 
							src={item.image} 
							alt={item.title} 
							class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none" 
						/>
						
						<!-- Hover overlay -->
						<div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
							<div class="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary transform scale-90 group-hover:scale-100 transition-transform duration-300">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Content info -->
					<div class="p-5 border-t border-border/30 space-y-1 bg-zinc-950/20">
						<span class="font-mono text-[10px] text-primary/80 uppercase tracking-wider">{item.category}</span>
						<h4 class="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h4>
						<p class="text-xs text-muted-foreground font-mono flex justify-between">
							<span>{item.issuer}</span>
							<span>{item.date}</span>
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</SectionFrame>
