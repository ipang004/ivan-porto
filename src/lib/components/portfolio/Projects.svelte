<script lang="ts">
	import type { Project } from './types';

	let {
		projects = [],
		onOpenModal
	}: {
		projects: Project[];
		onOpenModal?: (project: Project) => void;
	} = $props();

	let activeTag = $state<string>('All');
	let activeIndex = $state<number>(0);

	// Extract unique tags from projects
	const allTags = $derived([
		'All',
		...Array.from(new Set(projects.flatMap((p) => p.tags || [])))
	]);

	// Filter projects based on selected tag
	const filteredProjects = $derived(
		activeTag === 'All'
			? projects
			: projects.filter((p) =>
					p.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase())
				)
	);

	// Currently highlighted project for detail callout
	const activeProject = $derived(
		filteredProjects[activeIndex] || filteredProjects[0] || projects[0]
	);

	function handleProjectClick(project: Project, index: number) {
		activeIndex = index;
		if (onOpenModal) {
			onOpenModal(project);
		}
	}
</script>

<section id="projects" class="relative w-full bg-[#FDFBF8] text-[#111113] px-4 sm:px-6 md:px-12 lg:px-16 py-20 select-none">
	<div class="max-w-7xl mx-auto">
		<!-- 1. Section Header -->
		<div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
			<div>
				<h2 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#111113] leading-tight">
					Lets have a look at <br />
					my <span class="text-[#E87A38]">Portfolio</span>
				</h2>
			</div>
			<div>
				<button
					onclick={() => { activeTag = 'All'; activeIndex = 0; }}
					class="inline-flex items-center justify-center bg-[#E87A38] text-white px-7 py-3 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
				>
					See All
				</button>
			</div>
		</div>

		<!-- 2. Showcase Cards / Carousel View (Wide Grid) -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each filteredProjects.slice(0, 4) as project, i (project.name)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					onclick={() => handleProjectClick(project, i)}
					class="group relative rounded-3xl overflow-hidden border border-neutral-200/80 bg-white shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[400px] md:min-h-[460px]"
				>
					<!-- Background / UI Mockup Image -->
					<div class="relative w-full h-[320px] sm:h-[380px] md:h-[420px] bg-neutral-100/80 overflow-hidden flex items-center justify-center p-6 md:p-8">
						{#if project.image}
							<img
								src={project.image}
								alt={project.name}
								class="w-full h-full object-cover object-top rounded-2xl transition-transform duration-500 group-hover:scale-[1.03] shadow-md"
								loading="lazy"
							/>
						{:else}
							<div class="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
								<svg class="w-12 h-12 stroke-current opacity-40" fill="none" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<span class="text-xs font-mono">Mockup Preview</span>
							</div>
						{/if}

						<!-- Floating Arrow Button (Pojok Kanan Atas) -->
						<div class="absolute top-5 right-5 z-10 w-11 h-11 rounded-full border border-[#E87A38] bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#E87A38] font-bold shadow-sm group-hover:bg-[#E87A38] group-hover:text-white transition-all duration-300">
							↗
						</div>

						<!-- Overlay Gradient & Title di Kiri Bawah -->
						<div class="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
							<span class="text-2xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow-md">
								{project.name}
							</span>
						</div>
					</div>

					<!-- Bottom Card Meta -->
					<div class="p-6 flex items-center justify-between border-t border-neutral-100 bg-white">
						<div class="flex flex-wrap gap-2">
							{#each project.tags.slice(0, 3) as tag}
								<span class="px-3.5 py-1 rounded-full bg-[#F1F3F5] text-xs font-medium text-neutral-600">
									#{tag}
								</span>
							{/each}
						</div>
						<span class="text-xs md:text-sm font-semibold text-[#E87A38] group-hover:underline">
							View Project →
						</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- 3. Pagination Indicator -->
		<div class="flex justify-center items-center gap-2 my-10" aria-hidden="true">
			<span class="w-2 h-2 rounded-full bg-neutral-300"></span>
			<span class="w-8 h-2 rounded-full bg-[#E87A38]"></span>
			<span class="w-2 h-2 rounded-full bg-neutral-300"></span>
			<span class="w-2 h-2 rounded-full bg-neutral-300"></span>
		</div>

		<!-- 4. Filter Tags (Pills Row) -->
		<div class="flex flex-wrap justify-center gap-2.5 mb-10">
			{#each allTags as tag}
				<button
					onclick={() => { activeTag = tag; activeIndex = 0; }}
					class="px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all cursor-pointer
						{activeTag.toLowerCase() === tag.toLowerCase()
							? 'bg-[#E87A38] text-white shadow-xs'
							: 'bg-[#F1F3F5] text-neutral-700 hover:bg-neutral-200'}"
				>
					{tag}
				</button>
			{/each}
		</div>

		<!-- 5. Project Detail & Call to Action (Bawah) -->
		{#if activeProject}
			<div class="max-w-2xl mx-auto text-center p-6 rounded-2xl bg-white/70 border border-neutral-200/80 shadow-xs">
				<div class="flex items-center justify-center gap-3">
					<h3 class="text-2xl md:text-3xl font-bold text-[#111113]">
						{activeProject.name}
					</h3>
					{#if activeProject.href && activeProject.href !== '#'}
						<a
							href={activeProject.href}
							target="_blank"
							rel="noopener noreferrer"
							class="w-10 h-10 rounded-full bg-[#E87A38] text-white flex items-center justify-center text-lg font-bold hover:scale-105 hover:bg-[#D46B2A] transition-all shadow-md cursor-pointer"
							aria-label="Open Project {activeProject.name}"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 17L17 7M17 7H7M17 7V17" />
							</svg>
						</a>
					{/if}
				</div>
				<p class="text-neutral-500 text-sm md:text-base leading-relaxed mt-3 max-w-xl mx-auto">
					{activeProject.description}
				</p>
			</div>
		{/if}
	</div>
</section>
