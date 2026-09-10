<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import ContactSection from '$lib/components/portfolio/ContactSection.svelte';
	import HeroSection from '$lib/components/portfolio/HeroSection.svelte';
	import NavBar from '$lib/components/portfolio/NavBar.svelte';
	import ProjectsSection from '$lib/components/portfolio/ProjectsSection.svelte';
	import StackSection from '$lib/components/portfolio/StackSection.svelte';
	import ProjectModal from '$lib/components/portfolio/ProjectModal.svelte';
	import CredentialsSection from '$lib/components/portfolio/CredentialsSection.svelte';
	import JourneySection from '$lib/components/portfolio/JourneySection.svelte';
	import { navItems, profile, projects, credentials } from '$lib/components/portfolio/site-data';
	import type { Credential, Project } from '$lib/components/portfolio/types';
	import Footer from '$lib/components/portfolio/Footer.svelte';

	let activeSection = $state('about');
	let selectedProject = $state<Project | null>(null);
	let modalOpen = $state(false);
	let selectedCredential = $state<Credential | null>(null);

	$effect(() => {
		document.body.style.overflow = selectedCredential ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	function openModal(project: Project) {
		selectedProject = project;
		modalOpen = true;
	}

	function scrollTo(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}

	$effect(() => {
		const sections = navItems
			.map((item) => document.getElementById(item.id))
			.filter((section): section is HTMLElement => section !== null);

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{ rootMargin: '-40% 0px -55% 0px' }
		);

		sections.forEach((section) => observer.observe(section));

		return () => {
			observer.disconnect();
		};
	});
</script>

<svelte:head>
	<title>{profile.name} — {profile.role}</title>
	<meta name="description" content="Personal portfolio of {profile.name}, a {profile.role} specializing in {profile.focus}." />
	<meta property="og:title" content="{profile.name} — {profile.role}" />
	<meta property="og:description" content="Crafting thoughtful web interfaces using {profile.focus}." />
</svelte:head>

<main class="min-h-screen text-foreground relative overflow-hidden selection:bg-amber-400 selection:text-black">
	<NavBar {activeSection} items={navItems} {profile} onNavigate={scrollTo} />

	<div class="relative max-w-6xl mx-auto z-10 px-3 sm:px-6">
		<HeroSection {profile} onNavigate={scrollTo} />

		<div class="border-t border-border/20 relative">
			<span class="absolute -top-2 -left-2 font-mono text-[10px] text-muted-foreground/60 select-none">+</span>
			<span class="absolute -top-2 -right-2 font-mono text-[10px] text-muted-foreground/60 select-none">+</span>
		</div>

		<StackSection />

		<div class="border-t border-border/20 relative">
			<span class="absolute -top-2 -left-2 font-mono text-[10px] text-muted-foreground/60 select-none">+</span>
			<span class="absolute -top-2 -right-2 font-mono text-[10px] text-muted-foreground/60 select-none">+</span>
		</div>

		<ProjectsSection {projects} onOpenModal={openModal} />

		<div class="border-t border-border/20 relative">
			<span class="absolute -top-2 -left-2 font-mono text-[10px] text-muted-foreground/60 select-none">+</span>
			<span class="absolute -top-2 -right-2 font-mono text-[10px] text-muted-foreground/60 select-none">+</span>
		</div>

		<CredentialsSection {credentials} onOpenImage={(item) => selectedCredential = item} />

		<JourneySection />

		<div class="border-t border-border/20 relative">
			<span class="absolute -top-2 -left-2 font-mono text-[10px] text-muted-foreground/60 select-none">+</span>
			<span class="absolute -top-2 -right-2 font-mono text-[10px] text-muted-foreground/60 select-none">+</span>
		</div>

		<ContactSection />
	</div>

	{#if selectedProject}
		<ProjectModal project={selectedProject} bind:open={modalOpen} />
	{/if}

	{#if selectedCredential}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			transition:fade={{ duration: 200 }}
			class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
			onclick={() => selectedCredential = null}
		>
			<button
				onclick={() => selectedCredential = null}
				class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 border-2 border-black flex items-center justify-center text-black font-black shadow-[2px_2px_0px_0px_#18181b] transition-transform hover:scale-105 cursor-pointer"
				aria-label="Close"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<div
				transition:scale={{ duration: 200, start: 0.95 }}
				class="relative max-w-4xl w-full bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[10px_10px_0px_0px_#18181b] flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
				onclick={(e) => e.stopPropagation()}
			>
				<div class="relative w-full md:w-1/2 aspect-4/3 md:aspect-auto overflow-hidden bg-[#faf6ed] flex items-center justify-center border-b md:border-b-0 md:border-r-[2.5px] border-black">
					<img
						src={selectedCredential.image}
						alt={selectedCredential.title}
						class="relative max-w-[90%] max-h-[90%] object-contain rounded border-2 border-black shadow-lg select-none"
					/>
				</div>

				<div class="p-6 md:p-8 flex-1 flex flex-col justify-between overflow-y-auto">
					<div class="space-y-4">
						<div class="space-y-1">
							<span class="font-mono text-xs text-muted-foreground uppercase tracking-widest">[DOSSIER // {selectedCredential.category}]</span>
							<h3 class="text-xl font-bold text-foreground leading-snug">{selectedCredential.title}</h3>
						</div>

						<div class="grid grid-cols-2 gap-4 py-3 border-y border-border text-sm font-mono">
							<div>
								<span class="text-muted-foreground block text-xs mb-0.5">// issuer</span>
								<span class="text-foreground font-semibold">{selectedCredential.issuer}</span>
							</div>
							<div>
								<span class="text-muted-foreground block text-xs mb-0.5">// date</span>
								<span class="text-foreground font-semibold">{selectedCredential.date}</span>
							</div>
						</div>

						<div class="space-y-2 pt-2">
							<span class="font-mono text-xs text-muted-foreground block">// description</span>
							<p class="text-sm text-foreground/80 leading-relaxed font-sans">
								{selectedCredential.description || 'Tidak ada deskripsi penjelasan.'}
							</p>
						</div>
					</div>

					<div class="pt-6 border-t border-border flex justify-end">
						<button
							onclick={() => selectedCredential = null}
							class="font-mono text-xs px-4 py-2 rounded-lg bg-foreground text-background font-medium hover:bg-foreground/90 transition-all duration-200 cursor-pointer"
						>
							Close Details
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>
<Footer />
