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
	class="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 overflow-visible"
>
	<div class="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
		<!-- Left Column: Vintage Comic Newsprint Identity -->
		<div bind:this={leftColEl} class="lg:col-span-6 flex flex-col items-start text-left space-y-6 z-10">
			<!-- Comic Pop Pill -->
			<div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-md border-2 border-black bg-amber-400 text-black shadow-[3px_3px_0px_0px_#18181b] select-none">
				<span class="w-2 h-2 rounded-full bg-black animate-pulse"></span>
				<span class="font-mono text-xs font-black tracking-wider">
					ISSUE 01 // AVAILABLE FOR ROLES · JAKARTA
				</span>
			</div>

			<!-- Headline -->
			<div class="space-y-2">
				<h1 class="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[3px_3px_0px_#000] leading-[1.08]">
					Hello, I'm <br class="hidden sm:inline" />
					<span class="text-amber-400 relative inline-block underline decoration-4 underline-offset-8 decoration-black">
						{profile.name}.
					</span>
				</h1>
				<p class="font-mono text-base sm:text-lg text-sky-300 font-black tracking-tight drop-shadow-[2px_2px_0px_#000]">
					[ CHAPTER: FRONTEND ARCHITECT // SVELTEKIT & TS ]
				</p>
			</div>

			<!-- Comic Dialogue Balloon (Speech Bubble) -->
			<div class="comic-bubble p-4 sm:p-5 rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#18181b] text-sm sm:text-base leading-relaxed max-w-xl">
				<span class="font-mono text-xs font-black text-amber-500 block mb-1.5">// BIO DISPATCH</span>
				<p class="text-foreground font-medium">
					I craft clean, high-performance web applications with a focus on tactile user interfaces, 
					type-safe architecture, and production reliability. Currently engineering frontends at 
					<span class="text-sky-600 font-bold">PT Yapindo Jaya Abadi</span>.
				</p>
			</div>

			<!-- Action Buttons with Comic Hard-Shadows -->
			<div class="flex flex-wrap items-center gap-4 pt-1 select-none">
				<Button
					onclick={() => onNavigate('projects')}
					class="rounded-xl px-6 py-5 text-sm font-black bg-amber-400 text-black hover:bg-amber-300 border-2 border-black shadow-[4px_4px_0px_0px_#18181b] hover:shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
				>
					Explore Works →
				</Button>
				<Button
					onclick={() => onNavigate('contact')}
					variant="outline"
					class="rounded-xl px-6 py-5 text-sm font-bold border-2 border-black text-white hover:bg-zinc-100 hover:text-slate-300 shadow-[4px_4px_0px_0px_#18181b] hover:shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
				>
					Get in Touch
				</Button>
				<span class="comic-badge-pow bg-rose-500 text-yellow-300 px-2.5 py-1 rounded-md text-xs -rotate-6">
					💥 BAM!
				</span>
			</div>

			<!-- Comic Stat Boxes Grid -->
			<div class="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
				<div class="border-2 border-black bg-white p-3 rounded-xl shadow-[3px_3px_0px_0px_#18181b] hover:border-amber-500 hover:shadow-[4px_4px_0px_0px_#f59e0b] transition-all">
					<span class="text-amber-500 font-black block text-[11px] mb-1">// CORE STACK</span>
					<span class="text-foreground font-bold text-xs">SvelteKit & TS</span>
				</div>
				<div class="border-2 border-black bg-white p-3 rounded-xl shadow-[3px_3px_0px_0px_#18181b] hover:border-sky-500 hover:shadow-[4px_4px_0px_0px_#0284c7] transition-all">
					<span class="text-sky-600 font-black block text-[11px] mb-1">// AFFILIATION</span>
					<span class="text-foreground font-bold text-xs">Yapindo Jaya Abadi</span>
				</div>
				<div class="col-span-2 sm:col-span-1 border-2 border-black bg-white p-3 rounded-xl shadow-[3px_3px_0px_0px_#18181b] hover:border-rose-500 hover:shadow-[4px_4px_0px_0px_#f43f5e] transition-all">
					<span class="text-rose-500 font-black block text-[11px] mb-1">// RECOGNITION</span>
					<span class="text-foreground font-bold text-xs">4th LKS Web Tech</span>
				</div>
			</div>
		</div>

		<!-- Right Column: Interactive 3D Lanyard Pass -->
		<div bind:this={rightColEl} class="lg:col-span-6 flex justify-center items-center relative mt-8 sm:mt-10 lg:mt-0">
			<!-- Floating Comic Sound Effect Badges -->
			<div class="absolute top-2 right-3 sm:right-6 lg:-top-3 lg:right-10 z-20 pointer-events-none">
				<span class="comic-badge-pow bg-rose-500 text-yellow-300 px-2.5 sm:px-3 py-1 rounded-md text-xs sm:text-base">
					💥 POW!
				</span>
			</div>
			<div class="absolute bottom-2 left-3 sm:left-6 lg:-bottom-2 lg:left-12 z-20 pointer-events-none">
				<span class="comic-badge-pow bg-sky-500 text-white px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-xs rotate-6">
					⚡ PASS VERIFIED
				</span>
			</div>

			<div class="w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[420px] relative z-10 mt-0 lg:-mt-24">
				<!-- 3D Lanyard Component -->
				<Lanyard />
			</div>
		</div>
	</div>
</section>