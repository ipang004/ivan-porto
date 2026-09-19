<script lang="ts">
	import SectionFrame from './SectionFrame.svelte';
	import Icon from '@iconify/svelte';
</script>

<SectionFrame id="contact" eyebrow="contact" title="Let's Connect !" class="text-center" titleClass="text-4xl sm:text-5xl">
	<p class="text-stone-300 font-medium mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
		Open to collaborations, exciting projects, or simply talking about web development and technology.
	</p>
	<div class="flex flex-wrap gap-3.5 sm:gap-4 justify-center items-center">

		<a
			href="mailto:imaldini328@gmail.com"
			class="flex items-center gap-2.5 px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl border border-white/20 bg-zinc-900/70 hover:bg-zinc-900/90 text-white font-semibold text-sm sm:text-base backdrop-blur-md shadow-md transition-all duration-300 hover:border-[#ea4335]/60 hover:shadow-[0_0_18px_rgba(234,67,53,0.25)] hover:-translate-y-0.5 select-none"
		>
			<Icon icon="logos:google-gmail" class="size-6 sm:size-7 shrink-0" />
			<span>Email</span>
		</a>

		<a
			href="https://github.com/ipang004"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2.5 px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl border border-white/20 bg-zinc-900/70 hover:bg-zinc-900/90 text-white font-semibold text-sm sm:text-base backdrop-blur-md shadow-md transition-all duration-300 hover:border-white/50 hover:shadow-[0_0_18px_rgba(255,255,255,0.18)] hover:-translate-y-0.5 select-none"
		>
			<Icon icon="line-md:github-loop" class="size-6 sm:size-7 shrink-0 text-white" />
			<span>GitHub</span>
		</a>

		<a
			href="https://linkedin.com/in/ivan-maldini"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2.5 px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl border border-white/20 bg-zinc-900/70 hover:bg-zinc-900/90 text-white font-semibold text-sm sm:text-base backdrop-blur-md shadow-md transition-all duration-300 hover:border-[#0a66c2]/60 hover:shadow-[0_0_18px_rgba(10,102,194,0.25)] hover:-translate-y-0.5 select-none"
		>
			<Icon icon="selfhst:linkedin" class="size-6 sm:size-7 shrink-0" />
			<span>LinkedIn</span>
		</a>

		<a
			href="https://www.instagram.com/vmald_/"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2.5 px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl border border-white/20 bg-zinc-900/70 hover:bg-zinc-900/90 text-white font-semibold text-sm sm:text-base backdrop-blur-md shadow-md transition-all duration-300 hover:border-[#e1306c]/60 hover:shadow-[0_0_18px_rgba(225,48,108,0.25)] hover:-translate-y-0.5 select-none"
		>
			<Icon icon="skill-icons:instagram" class="size-6 sm:size-7 shrink-0" />
			<span>Instagram</span>
		</a>

	</div>
</SectionFrame>