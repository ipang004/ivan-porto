<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import type { Project } from './types';

	let {
		project,
		open = $bindable(false)
	}: {
		project: Project;
		open: boolean;
	} = $props();

	let currentIndex = $state(0);
	const images = $derived(project.images ?? (project.image ? [project.image] : []));

	function prev() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}

	function next() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function close() {
		open = false;
		currentIndex = 0;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') close();
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	}

	function getStackIconUrl(icons: string[]) {
		return `https://skillicons.dev/icons?i=${icons.join(',')}&theme=dark`;
	}

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
		onclick={(e) => e.target === e.currentTarget && close()}
	>
		<div
			transition:scale={{ duration: 200, start: 0.95 }}
			class="relative w-full max-w-4xl rounded-2xl overflow-hidden
				bg-card border border-border shadow-2xl shadow-black/60"
		>
			<div class="overflow-y-auto max-h-[90vh]">
				<button
					onclick={close}
					class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted/80 hover:bg-muted
						border border-border/50 flex items-center justify-center
						text-muted-foreground hover:text-foreground transition-colors"
					aria-label="Tutup modal"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				{#if images.length > 0}
					<div class="relative bg-zinc-950 rounded-t-2xl overflow-hidden">
						<div class="relative w-full">
							<img
								src={images[currentIndex]}
								alt="Screenshot {project.name} {currentIndex + 1}"
								class="w-full h-auto object-contain max-h-[50vh]"
							/>
						</div>

						{#if images.length > 1}
							<button
								onclick={prev}
								class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
									bg-black/50 hover:bg-black/80 border border-white/10
									flex items-center justify-center text-white transition-all"
								aria-label="Gambar sebelumnya"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							<button
								onclick={next}
								class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
									bg-black/50 hover:bg-black/80 border border-white/10
									flex items-center justify-center text-white transition-all"
								aria-label="Gambar berikutnya"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
								</svg>
							</button>

							<div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
								{#each images as _, idx (idx)}
									<button
										onclick={() => (currentIndex = idx)}
										class="w-1.5 h-1.5 rounded-full transition-all {idx === currentIndex
											? 'bg-white w-4'
											: 'bg-white/40 hover:bg-white/70'}"
										aria-label="Gambar {idx + 1}"
									></button>
								{/each}
							</div>

							<span class="absolute top-3 left-3 font-mono text-xs text-white/60
								bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
								{currentIndex + 1} / {images.length}
							</span>
						{/if}
					</div>

					{#if images.length > 1}
						<div class="flex gap-2 p-3 bg-zinc-950/60 border-b border-border overflow-x-auto">
							{#each images as img, idx (idx)}
								<button
									onclick={() => (currentIndex = idx)}
									class="shrink-0 w-20 h-12 rounded overflow-hidden border-2 transition-all
										{idx === currentIndex ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-80'}"
								>
									<img src={img} alt="Thumbnail {idx + 1}" class="w-full h-full object-cover object-top" />
								</button>
							{/each}
						</div>
					{/if}
				{/if}

				<div class="p-6 md:p-8 space-y-6">
					<div>
						<p class="font-mono text-xs text-secondary mb-1">// project</p>
						<h2 class="text-2xl font-semibold tracking-tight text-foreground">{project.name}</h2>
					</div>

					<div class="space-y-2">
						<p class="font-mono text-xs text-muted-foreground/50">// about</p>
						<p class="text-sm leading-relaxed text-muted-foreground">
							{project.detail ?? project.description}
						</p>
					</div>

					<div class="space-y-2">
						<p class="font-mono text-xs text-muted-foreground/50">// stack</p>
						<img
							src={getStackIconUrl(project.stackIcons)}
							alt="Tech stack: {project.stackIcons.join(', ')}"
							class="h-8"
							loading="lazy"
						/>
					</div>

					<div class="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-border/50">
						<div class="flex flex-wrap gap-1.5">
							{#each project.tags as tag (tag)}
								<span class="font-mono text-[11px] text-zinc-400 bg-zinc-900/50 border border-zinc-800/80 px-2.5 py-1 rounded-md hover:border-primary/30 hover:bg-primary/5 hover:text-foreground transition-all duration-300 select-none">
									<span class="text-primary/60 font-medium">#</span>{tag.toLowerCase()}
								</span>
							{/each}
						</div>
						{#if project.href && project.href !== '#'}
							<Button href={project.href} target="_blank" class="rounded-full px-5">
								Buka Project →
							</Button>
						{:else}
							<span class="font-mono text-xs text-muted-foreground/40 italic">link coming soon</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
