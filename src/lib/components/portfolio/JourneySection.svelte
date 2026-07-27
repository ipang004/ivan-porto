<script lang="ts">
	import { onMount } from 'svelte';
	import SectionFrame from './SectionFrame.svelte';
	import JourneyCard from './JourneyCard.svelte';
	import { journey } from './journey-data';

	let lineEl: HTMLElement | null = null;

	onMount(() => {
		const lineObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && lineEl) {
						lineEl.style.height = '100%';
					}
				});
			},
			{ threshold: 0.1 }
		);
		if (lineEl) lineObserver.observe(lineEl.parentElement!);
		return () => lineObserver.disconnect();
	});
</script>

<SectionFrame id="journey" eyebrow="journey" title="My Journey">
	<div class="relative mt-4">
		<div class="absolute left-6 top-0 bottom-0 w-px bg-border/40 md:left-1/2 md:-translate-x-px">
			<div
				bind:this={lineEl}
				class="w-full bg-linear-to-b from-primary via-secondary to-accent transition-all duration-2000 ease-out"
				style="height: 0%;"
			></div>
		</div>

		<div class="flex flex-col gap-12 pb-4">
			{#each journey as milestone, i (milestone.type)}
				<JourneyCard {milestone} index={i} />
			{/each}
		</div>
	</div>
</SectionFrame>
