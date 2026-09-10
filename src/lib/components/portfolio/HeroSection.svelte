<script lang="ts">
	import { onMount } from 'svelte';
	import { animate } from 'motion';
	import { Button } from '$lib/components/ui/button';
	import Lanyard from './Lanyard.svelte';
	import type { Profile } from './types';

	let {
		profile,
		onNavigate
	}: {
		profile: Profile;
		onNavigate: (id: string) => void;
	} = $props();

	let leftColEl: HTMLElement;
	let rightColEl: HTMLElement;

	onMount(() => {
		if (leftColEl) {
			animate(leftColEl, { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, ease: 'easeOut' });
		}
		if (rightColEl) {
			animate(rightColEl, { opacity: [0, 1], scale: [0.96, 1] }, { delay: 0.15, duration: 0.7, ease: 'easeOut' });
		}
	});
</script>

<section
	id="about"
	class="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 overflow-hidden"
>
	<div class="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
		<!-- Left Column: Editorial & Clear Identity -->
		<div bind:this={leftColEl} class="lg:col-span-6 flex flex-col items-start text-left space-y-6 z-10">
			<!-- Minimalist Availability Status -->
			<div class="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-border/80 bg-muted/40 backdrop-blur-xs select-none">
				<span class="font-mono text-xs text-foreground/80 tracking-wide">
					Available for projects & roles · Jakarta, ID
				</span>
			</div>

			<!-- Headline -->
			<div class="space-y-2">
				<h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
					Hello, I'm <br class="hidden sm:inline" />
					<span class="text-foreground">{profile.name}.</span>
				</h1>
				<p class="font-mono text-base sm:text-lg text-foreground/75 tracking-tight">
					Frontend Developer · SvelteKit & TypeScript
				</p>
			</div>

			<!-- Core Value Statement -->
			<p class="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
				I craft clean, high-performance web applications with a focus on tactile user interfaces, 
				type-safe architecture, and production reliability. Currently engineering frontends at 
				<span class="text-foreground font-medium">PT Yapindo Jaya Abadi</span>.
			</p>

			<!-- Action Buttons -->
			<div class="flex flex-wrap items-center gap-3.5 pt-2 select-none">
				<Button
					onclick={() => onNavigate('projects')}
					class="rounded-lg px-6 py-5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-all cursor-pointer"
				>
					View Projects →
				</Button>
				<Button
					onclick={() => onNavigate('contact')}
					variant="outline"
					class="rounded-lg px-6 py-5 text-sm font-medium border-border hover:bg-muted/60 transition-all cursor-pointer"
				>
					Contact Me
				</Button>
			</div>

			<!-- Quick Monospaced Specs Grid -->
			<div class="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-border/60 text-xs font-mono">
				<div>
					<span class="text-muted-foreground/60 block text-[11px] mb-1">// focus</span>
					<span class="text-foreground/90 font-medium">SvelteKit & TS</span>
				</div>
				<div>
					<span class="text-muted-foreground/60 block text-[11px] mb-1">// current</span>
					<span class="text-foreground/90 font-medium">Yapindo Jaya Abadi</span>
				</div>
				<div class="col-span-2 sm:col-span-1">
					<span class="text-muted-foreground/60 block text-[11px] mb-1">// recognition</span>
					<span class="text-foreground/90 font-medium">4th LKS Web Tech</span>
				</div>
			</div>
		</div>

		<!-- Right Column: Interactive 3D Lanyard ID Badge -->
		<div bind:this={rightColEl} class="lg:col-span-6 flex justify-center items-center relative">
			<div class="w-full max-w-[480px] lg:max-w-[540px] relative">
				<!-- Subtle atmospheric stage glow (soft neutral, not neon) -->
				<div
					class="pointer-events-none absolute inset-0 -top-10 -bottom-10 rounded-full blur-3xl opacity-10 bg-radial from-white/20 via-white/5 to-transparent"
				></div>

				<!-- 3D Lanyard Component -->
				<Lanyard />
			</div>
		</div>
	</div>
</section>