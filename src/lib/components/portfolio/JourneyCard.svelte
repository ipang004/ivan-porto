<script lang="ts">
	import { onMount } from 'svelte';
	import type { Milestone } from './journey-data';
	import { colorMap } from './journey-data';

	let { milestone, index = 0 }: { milestone: Milestone; index?: number } = $props();

	let isFlipped = $state(false);
	let isVisible = $state(false);
	let cardEl: HTMLElement;

	function toggleFlip() {
		isFlipped = !isFlipped;
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.2 }
		);
		if (cardEl) observer.observe(cardEl);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={cardEl}
	class="relative flex items-start gap-6 md:gap-0
		{index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}
		transition-all duration-700 ease-out
		{isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}"
	style="transition-delay: {index * 100}ms"
>
	<div class="absolute left-6 -translate-x-1/2 md:left-1/2 z-10 flex items-center justify-center">
		<span class="w-3.5 h-3.5 rounded-full border-2 border-background {colorMap[milestone.type].dot} block"></span>
	</div>

	<div class="hidden md:block w-1/2"></div>

	<div class="ml-14 md:ml-0 md:w-1/2 {index % 2 === 0 ? 'md:pl-10' : 'md:pr-10'}">
		<div
			class="flip-wrapper"
			role="button"
			tabindex="0"
			onclick={toggleFlip}
			onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlip(); } }}
		>
			<div class="flip-inner" class:is-flipped={isFlipped}>

				<div class="flip-front group relative bg-card border border-border/60 rounded-2xl p-5
					hover:border-border transition-colors duration-300
					hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.4)]">

					<span class="hidden md:block absolute top-3 right-3 font-mono text-[12px] px-2 py-0.5 rounded-full select-none transition-colors
						{milestone.type === 'education'
							? 'text-primary/50 group-hover:text-primary'
							: milestone.type === 'internship'
							? 'text-secondary/50  group-hover:text-secondary'
							: 'text-accent/50 group-hover:text-accent'}">
						click to flip ↩
					</span>

					<div class="flex items-center gap-3 mb-3">
						<div class="w-10 h-10 flex items-center justify-center rounded-xl border shrink-0 {colorMap[milestone.type].icon}">
							{#if milestone.type === 'education'}
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
							{:else if milestone.type === 'internship'}
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary"><path d="M15 2H9a2 2 0 0 0-2 2v2H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4V4a2 2 0 0 0-2-2z"/><path d="M7 6h10"/><path d="M3 11h18"/></svg>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><path d="m12 14-3-3 3-3 3 3-3 3Z"/><path d="M4.5 16.5 12 9l7.5 7.5"/></svg>
							{/if}
						</div>
						<div>
							<p class="font-semibold text-foreground leading-tight">{milestone.title}</p>
							<p class="font-mono text-xs text-muted-foreground">{milestone.subtitle}</p>
						</div>
					</div>

					<div class="flex flex-wrap items-center gap-2 mb-3">
						<span class="font-mono text-[11px] px-2.5 py-1 rounded-full border {colorMap[milestone.type].badge}">
							{milestone.type === 'education' ? '// education' : milestone.type === 'internship' ? '// internship' : '// work'}
						</span>
						<span class="font-mono text-xs text-muted-foreground/60">{milestone.period}</span>
					</div>

					<p class="font-mono text-xs text-muted-foreground/50 mb-2 flex items-center gap-1.5">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						{milestone.place}
					</p>

					<p class="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>

					<p class="md:hidden font-mono text-[11px] mt-4 border-t border-border/20 pt-3 text-right
						{milestone.type === 'education'
							? 'text-primary/60'
							: milestone.type === 'internship'
							? 'text-secondary/60'
							: 'text-accent/60'}">
						click to flip ↩
					</p>
				</div>

				<div class="flip-back rounded-2xl overflow-hidden border border-border/60 bg-card flex flex-col md:flex-row h-full">
					<div class="relative w-full md:w-1/2 h-48 md:h-full bg-muted/30 overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-border/30">
						<div class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/30 z-0">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<p class="font-mono text-[10px]">Taruh foto di:</p>
							<p class="font-mono text-[10px] opacity-60">{milestone.photo}</p>
						</div>
						<div
							class="absolute inset-0 scale-110 blur-2xl opacity-60 pointer-events-none z-0"
							style="background-image: url({milestone.photo}); background-size: cover; background-position: center;"
						></div>
						<img
							src={milestone.photo}
							alt="Photo - {milestone.title}"
							class="absolute inset-0 w-full h-full object-cover z-10"
							onerror={(e) => {
								const el = e.currentTarget as HTMLImageElement;
								el.style.opacity = '0';
								const backdrop = el.previousElementSibling as HTMLElement;
								if (backdrop) backdrop.style.opacity = '0';
							}}
						/>
					</div>

					<div class="flex flex-col justify-between p-6 md:p-8 flex-1 min-w-0 h-full">
						<div class="space-y-6 my-auto">
							<div>
								<span class="text-[10px] font-mono tracking-wider uppercase
									{milestone.type === 'education' ? 'text-primary' : milestone.type === 'internship' ? 'text-secondary' : 'text-accent'}">
									// {milestone.type}
								</span>
								<h3 class="text-lg font-bold text-foreground leading-tight mt-1">{milestone.title}</h3>
								<p class="text-sm text-muted-foreground font-mono mt-1">{milestone.subtitle}</p>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-border/20 py-4">
								<div>
									<span class="text-[10px] font-mono text-muted-foreground/50 block">// issuer</span>
									<span class="text-sm font-semibold text-foreground block leading-snug">{milestone.place}</span>
								</div>
								<div>
									<span class="text-[10px] font-mono text-muted-foreground/50 block">// date</span>
									<span class="text-xs font-semibold text-foreground block">{milestone.period}</span>
								</div>
							</div>
						</div>

						<div class="flex justify-end mt-6 pt-3 border-t border-border/10">
							<button
								type="button"
								class="font-mono text-[11px] px-3.5 py-1.5 rounded-lg border border-border/60 hover:bg-zinc-800/40 text-foreground transition-all duration-200"
								onclick={(e) => { e.stopPropagation(); toggleFlip(); }}
							>
								Close Details
							</button>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
</div>

<style>
	.flip-wrapper {
		perspective: 1200px;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.flip-inner {
		position: relative;
		width: 100%;
		transform-style: preserve-3d;
		transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.flip-inner.is-flipped {
		transform: rotateY(-180deg);
	}
	.flip-front {
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}
	.flip-back {
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transform: rotateY(180deg);
	}
</style>
