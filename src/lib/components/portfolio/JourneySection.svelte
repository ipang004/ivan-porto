<script lang="ts">
	import { onMount } from 'svelte';
	import SectionFrame from './SectionFrame.svelte';

	type MilestoneType = 'education' | 'internship' | 'work';

	interface Milestone {
		type: MilestoneType;
		title: string;
		subtitle: string;
		place: string;
		period: string;
		description: string;
	}

	const journey: Milestone[] = [
		{
			type: 'education',
			title: 'SMKN 17 Jakarta',
			subtitle: 'Software Engineering',
			place: 'West Jakarta, Jakarta, Indonesia',
			period: '2023 — 2026',
			description:
				'Completed a three-year vocational program in Software Engineering, with a focus on web development, databases, and software development fundamentals. Actively participated in the Web Technologies category of the Vocational High School Skills Competition (LKS) and various school projects.'
		},
		{
			type: 'internship',
			title: 'Praktik Kerja Lapangan',
			subtitle: 'Web Developer Intern',
			place: 'PT Yapindo Jaya Abadi',
			period: '2025 — 2026',
			description:
				'Completed a web development internship with a focus on frontend development and operational support. Built several internal web applications from scratch, created UI/UX design assets in Figma, and supported system data management to ensure accuracy.'
		},
		{
			type: 'work',
			title: 'Frontend Developer — Probation',
			subtitle: 'Full-time Web Developer',
			place: 'PT Yapindo Jaya Abadi',
			period: '2026 — Present',
			description:
				'Joined the company as a Frontend Developer after completing the internship. Contributed to building new web applications from scratch, refactoring existing code to improve maintainability and performance, and collaborating with cross-functional teams to develop and maintain production features.'
		}
	];

	const colorMap: Record<MilestoneType, { dot: string; badge: string; icon: string }> = {
		education: {
			dot: 'bg-primary shadow-[0_0_12px_3px_var(--color-primary)]',
			badge: 'bg-primary/10 text-primary border-primary/30',
			icon: 'bg-primary/10 border-primary/20'
		},
		internship: {
			dot: 'bg-secondary shadow-[0_0_12px_3px_var(--color-secondary)]',
			badge: 'bg-secondary/10 text-secondary border-secondary/30',
			icon: 'bg-secondary/10 border-secondary/20'
		},
		work: {
			dot: 'bg-accent shadow-[0_0_12px_3px_var(--color-accent)]',
			badge: 'bg-accent/10 text-accent border-accent/30',
			icon: 'bg-accent/10 border-accent/20'
		}
	};

	let itemEls: HTMLElement[] = [];
	let lineEl: HTMLElement | null = null;
	let visibleItems = $state<boolean[]>(journey.map(() => false));

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

		const cardObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const idx = itemEls.indexOf(entry.target as HTMLElement);
					if (entry.isIntersecting && idx !== -1) {
						visibleItems[idx] = true;
						cardObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2 }
		);
		itemEls.forEach((el) => el && cardObserver.observe(el));

		return () => {
			lineObserver.disconnect();
			cardObserver.disconnect();
		};
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
				<div
					bind:this={itemEls[i]}
					class="relative flex items-start gap-6 md:gap-0
						{i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}
						transition-all duration-700 ease-out
						{visibleItems[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}"
					style="transition-delay: {i * 100}ms"
				>
					<div class="absolute left-6 -translate-x-1/2 md:left-1/2 z-10 flex items-center justify-center">
						<span class="w-3.5 h-3.5 rounded-full border-2 border-background {colorMap[milestone.type].dot} block"></span>
					</div>

					<div class="hidden md:block w-1/2"></div>

					<div class="ml-14 md:ml-0 md:w-1/2 {i % 2 === 0 ? 'md:pl-10' : 'md:pr-10'}">
						<div class="group relative bg-card border border-border/60 rounded-2xl p-5 hover:border-border
							transition-all duration-300 hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.4)]">

							<div class="flex items-center justify-between mb-3">
								<div class="flex items-center gap-3">
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

							<p class="text-sm text-muted-foreground leading-relaxed">
								{milestone.description}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</SectionFrame>
