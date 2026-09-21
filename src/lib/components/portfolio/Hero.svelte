<script lang="ts">
	let { onNavigate }: { onNavigate?: (id: string) => void } = $props();

	function handleNav(id: string) {
		if (onNavigate) {
			onNavigate(id);
		} else {
			const el = document.getElementById(id);
			if (el) el.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<section id="about" class="relative w-full bg-[#FDFBF8] text-[#111113] overflow-hidden flex flex-col justify-between items-center px-4 pt-6 pb-6 select-none">
	<!-- 1. Top Navbar (Floating Capsule) -->
	<header class="w-full max-w-4xl z-40 flex justify-center">
		<nav class="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-[#18181B] text-white shadow-2xl text-xs sm:text-sm font-medium tracking-wide">
			<button 
				onclick={() => handleNav('about')} 
				class="px-5 py-2 rounded-full bg-[#E87A38] text-white font-semibold transition-all hover:brightness-110 cursor-pointer shadow-sm"
			>
				Home
			</button>
			<button 
				onclick={() => handleNav('about')} 
				class="px-3.5 py-2 rounded-full text-zinc-300 hover:text-white transition-colors cursor-pointer"
			>
				About
			</button>
			<button 
				onclick={() => handleNav('stack')} 
				class="px-3.5 py-2 rounded-full text-zinc-300 hover:text-white transition-colors cursor-pointer"
			>
				Service
			</button>

			<!-- Brand / Logo Tengah -->
			<div class="flex items-center gap-1.5 px-4 py-1.5 font-bold tracking-widest text-white text-sm sm:text-base border-x border-zinc-700/60 mx-1">
				<span class="w-5 h-5 rounded-full bg-[#E87A38] text-white flex items-center justify-center text-[10px] font-black">JC</span>
				<span>IVAN</span>
			</div>

			<button 
				onclick={() => handleNav('journey')} 
				class="px-3.5 py-2 rounded-full text-zinc-300 hover:text-white transition-colors cursor-pointer"
			>
				Resume
			</button>
			<button 
				onclick={() => handleNav('projects')} 
				class="px-3.5 py-2 rounded-full text-zinc-300 hover:text-white transition-colors cursor-pointer"
			>
				Project
			</button>
			<button 
				onclick={() => handleNav('contact')} 
				class="px-3.5 py-2 rounded-full text-zinc-300 hover:text-white transition-colors cursor-pointer"
			>
				Contact
			</button>
		</nav>
	</header>

	<!-- Main Visual Canvas Area -->
	<div class="relative w-full max-w-6xl flex-1 flex flex-col justify-end items-center mt-10 min-h-[580px] sm:min-h-[640px] md:min-h-[700px]">
		<!-- 2. Background Shape (Arch Dome) -->
		<div 
			class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[480px] md:w-[600px] h-[340px] sm:h-[440px] md:h-[500px] bg-[#F3C49B] rounded-t-full z-0 pointer-events-none"
			aria-hidden="true"
		></div>

		<!-- 3. Tipografi Tengah (Di Belakang Kepala Subjek) -->
		<div class="absolute top-2 sm:top-6 inset-x-0 mx-auto text-center z-10 pointer-events-none flex flex-col items-center px-4">
			<!-- Badge "Hello!" dengan aksen garis playful -->
			<div class="relative inline-flex items-center gap-1.5 px-4 py-1 rounded-full border border-neutral-300/80 bg-white/90 text-xs font-semibold text-[#111113] shadow-xs mb-4">
				<span>Hello!</span>
				<!-- Aksen garis playful oranye -->
				<svg class="absolute -top-3.5 -right-3 w-4 h-4 text-[#E87A38]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
					<path d="M12 2v4M19 5l-3 3M22 12h-4" />
				</svg>
			</div>

			<!-- Headline Besar dengan Aksen Coretan -->
			<div class="relative">
				<!-- Garis aksen lengkung di samping kiri judul -->
				<svg class="hidden sm:block absolute -left-10 top-16 w-8 h-12 text-[#E87A38] opacity-80" viewBox="0 0 40 60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
					<path d="M30 10 C10 25, 10 45, 25 55" />
					<path d="M38 25 C25 35, 25 50, 35 58" />
				</svg>

				<h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#111113] leading-[1.08] max-w-4xl">
					I'm <span class="text-[#E87A38]">Ivan</span>,<br />
					Product Designer
				</h1>
			</div>
		</div>

		<!-- 6. Metrik Sisi Kiri (Desktop Only) -->
		<aside class="hidden lg:flex absolute left-4 xl:left-8 bottom-32 z-20 flex-col items-start gap-2 max-w-[220px] text-left pointer-events-none select-none">
			<div class="text-3xl font-serif text-[#111113] leading-none font-black">
				“
			</div>
			<p class="text-xs font-medium text-[#111113] leading-relaxed">
				Ivan's Exceptional product design ensure our website's success.
			</p>
			<p class="text-xs font-bold text-[#111113]">
				Highly Recommended
			</p>
		</aside>

		<!-- 6. Metrik Sisi Kanan (Desktop Only) -->
		<aside class="hidden lg:flex absolute right-4 xl:right-8 bottom-32 z-20 flex-col items-end gap-1 max-w-[200px] text-right pointer-events-none select-none">
			<!-- 5 Bintang Oranye -->
			<div class="flex items-center gap-1 text-[#E87A38] mb-1" aria-label="5 stars rating">
				{#each Array(5) as _}
					<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
				{/each}
			</div>
			<p class="text-3xl sm:text-4xl font-extrabold text-[#111113] tracking-tight leading-none">
				10 Years
			</p>
			<p class="text-xs font-semibold text-neutral-500">
				Experience
			</p>
		</aside>

		<!-- 4. Foto Cutout Subjek (Flush Rata Bawah) -->
		<div class="relative z-20 flex justify-center items-end pointer-events-none">
			<img 
				src="/ivan-cutout.png" 
				alt="Ivan" 
				class="max-h-[460px] sm:max-h-[520px] md:max-h-[580px] w-auto object-contain object-bottom select-none pointer-events-none drop-shadow-md" 
				onerror={(e) => {
					// Fallback jika /ivan-cutout.png belum diunggah
					const target = e.currentTarget as HTMLImageElement;
					target.src = '/photos/work.jpeg';
					target.className = 'max-h-[440px] w-auto object-cover rounded-t-full select-none pointer-events-none drop-shadow-md opacity-90';
				}}
			/>
		</div>

		<!-- 5. Tombol CTA Kapsul Kaca (Melayang di Atas Badan Subjek) -->
		<div class="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center">
			<div class="flex items-center gap-3 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl">
				<button 
					onclick={() => handleNav('projects')}
					class="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#E87A38] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md transition-all hover:brightness-110 active:scale-95 cursor-pointer"
				>
					<span>Portfolio</span>
					<span class="text-xs font-bold">↗</span>
				</button>
				<button 
					onclick={() => handleNav('contact')}
					class="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors drop-shadow-xs cursor-pointer"
				>
					Hire me
				</button>
			</div>
		</div>
	</div>
</section>
