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

<SectionFrame id="credentials" eyebrow="accreditations" title="Credentials & Honors">
	<div class="space-y-8">
		<!-- Grid Layout -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			{#each filteredCredentials as item (item.title)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div 
					onclick={() => onOpenImage(item)}
					class="group relative flex flex-col rounded-2xl border-[2.5px] border-black bg-white overflow-hidden cursor-pointer
						shadow-[4px_4px_0px_0px_#18181b] hover:shadow-[7px_7px_0px_0px_#f59e0b] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
				>
					<!-- Image Frame -->
					<div class="relative w-full aspect-4/3 overflow-hidden bg-[#faf6ed] flex items-center justify-center border-b-[2.5px] border-black">
						<img 
							src={item.image} 
							alt={item.title} 
							class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none" 
						/>
						
						<!-- Hover overlay with comic view badge -->
						<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
							<div class="px-4 py-2 rounded-lg bg-amber-400 border-2 border-black text-black font-mono text-xs font-black shadow-[3px_3px_0px_0px_#18181b] transform scale-90 group-hover:scale-100 transition-transform duration-200">
								[ INSPECT CERTIFICATE ]
							</div>
						</div>
					</div>

					<!-- Content info -->
					<div class="p-4 space-y-1 bg-white">
						<span class="font-mono text-[10px] uppercase tracking-wider font-black {item.category === 'award' ? 'text-amber-600' : item.category === 'pkl' ? 'text-emerald-700' : 'text-sky-700'}">
							★ [{item.category.toUpperCase()}]
						</span>
						<h4 class="font-black text-sm text-foreground line-clamp-1 group-hover:text-amber-600 transition-colors">{item.title}</h4>
						<p class="text-xs text-stone-600 font-mono font-bold flex justify-between pt-1">
							<span class="truncate max-w-[65%]">{item.issuer}</span>
							<span class="text-stone-800">{item.date}</span>
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</SectionFrame>
