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

	let activeSection = $state('about');
	let glowEl = $state<HTMLElement | null>(null);
	let selectedProject = $state<Project | null>(null);
	let modalOpen = $state(false);
	let selectedCredential = $state<Credential | null>(null);

	$effect(() => {
		document.body.style.overflow = selectedCredential ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		}
 	})

	function openModal(project: Project) {
		selectedProject = project;
		modalOpen = true;
	}

	function scrollTo(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}

	$effect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (glowEl) {
				glowEl.style.setProperty('--mouse-x', `${e.clientX}px`);
				glowEl.style.setProperty('--mouse-y', `${e.clientY}px`);
			}
		};

		window.addEventListener('mousemove', handleMouseMove);

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
			window.removeEventListener('mousemove', handleMouseMove);
			observer.disconnect();
		};
	});
</script>

<svelte:head>
	<title>{profile.name} | {profile.role}</title>
	<meta name="description" content="Personal portfolio of {profile.name}, a {profile.role} specializing in {profile.focus}." />
	<meta property="og:title" content="{profile.name} | Portofolio" />
	<meta property="og:description" content="Turning ideas into web applications using {profile.focus}." />
</svelte:head>

<main class="dark min-h-screen bg-background bg-dots text-foreground font-body relative overflow-hidden">
	<!-- Ambient mouse glow -->
	<div
		bind:this={glowEl}
		class="pointer-events-none fixed inset-0 z-0 opacity-15 transition-opacity"
		style="background: radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), var(--primary), transparent 80%);"
	></div>

	<NavBar {activeSection} items={navItems} {profile} onNavigate={scrollTo} />

	<!-- Grid Layout Blueprint -->
	<div class="relative max-w-5xl mx-auto border-x border-border/20 z-10 bg-background/20 backdrop-blur-[1px]">
		<HeroSection {profile} onNavigate={scrollTo} />

		<div class="border-t border-border/20 relative">
			<span class="absolute -top-2 -left-2 font-mono text-[10px] text-zinc-600 select-none">+</span>
			<span class="absolute -top-2 -right-2 font-mono text-[10px] text-zinc-600 select-none">+</span>
		</div>
		
		<StackSection />

		<div class="border-t border-border/20 relative">
			<span class="absolute -top-2 -left-2 font-mono text-[10px] text-zinc-600 select-none">+</span>
			<span class="absolute -top-2 -right-2 font-mono text-[10px] text-zinc-600 select-none">+</span>
		</div>
		
		<ProjectsSection {projects} onOpenModal={openModal} />

		<div class="border-t border-border/20 relative">
			<span class="absolute -top-2 -left-2 font-mono text-[10px] text-zinc-600 select-none">+</span>
			<span class="absolute -top-2 -right-2 font-mono text-[10px] text-zinc-600 select-none">+</span>
		</div>
		
		<CredentialsSection {credentials} onOpenImage={(item) => selectedCredential = item} />

		<JourneySection />

		<div class="border-t border-border/20 relative">
			<span class="absolute -top-2 -left-2 font-mono text-[10px] text-zinc-600 select-none">+</span>
			<span class="absolute -top-2 -right-2 font-mono text-[10px] text-zinc-600 select-none">+</span>
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
			<!-- Close button -->
			<button
				onclick={() => selectedCredential = null}
				class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black border border-white/10 flex items-center justify-center text-white transition-colors"
				aria-label="Close"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Modal Box Split Layout -->
			<div 
				transition:scale={{ duration: 200, start: 0.95 }}
				class="relative max-w-4xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
				onclick={(e) => e.stopPropagation()}
			>
				<!-- Sisi Kiri: Gambar -->
				<div class="relative w-full md:w-1/2 aspect-4/3 md:aspect-auto overflow-hidden bg-black/40 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-900">
					<img 
						src={selectedCredential.image} 
						alt="" 
						class="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110" 
					/>
					<img
						src={selectedCredential.image}
						alt={selectedCredential.title}
						class="relative max-w-[90%] max-h-[90%] object-contain rounded border border-white/5 shadow-xl select-none"
					/>
				</div>

				<!-- Sisi Kanan: Penjelasan -->
				<div class="p-6 md:p-8 flex-1 flex flex-col justify-between overflow-y-auto">
					<div class="space-y-4">
						<div class="space-y-1">
							<span class="font-mono text-xs text-primary/80 uppercase tracking-widest">{selectedCredential.category}</span>
							<h3 class="text-xl font-bold text-foreground leading-snug">{selectedCredential.title}</h3>
						</div>

						<div class="grid grid-cols-2 gap-4 py-3 border-y border-border/30 text-sm font-mono">
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
							<span class="font-mono text-xs text-muted-foreground/60 block">// description</span>
							<p class="text-sm text-zinc-300 leading-relaxed font-sans">
								{selectedCredential.description || 'Tidak ada deskripsi penjelasan.'}
							</p>
						</div>
					</div>

					<div class="pt-6 border-t border-border/20 flex justify-end">
						<button
							onclick={() => selectedCredential = null}
							class="font-mono text-xs px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-foreground transition-all duration-300"
						>
							Close Details
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>
