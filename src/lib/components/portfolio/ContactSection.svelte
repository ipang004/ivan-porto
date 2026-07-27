<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import SectionFrame from './SectionFrame.svelte';
	import Icon from '@iconify/svelte';
</script>

<SectionFrame id="contact" eyebrow="contact" title="Let's Connect !" class="text-center" titleClass="text-4xl sm:text-5xl">
	<p class="text-foreground/70 mb-8 max-w-xl mx-auto text-base">
		Open to collaborations, exciting projects, or simply talking about web development and technology.
	</p>
	<div class="flex flex-wrap gap-4 justify-center items-center">

		<Button
			variant="outline"
			size="lg"
			href="mailto:imaldini328@gmail.com"
			class="flex items-center gap-2.5 px-5 py-6 text-base transition-all duration-300 hover:bg-zinc-900/40 hover:border-[#ea4335]/30 hover:shadow-[0_0_15px_rgba(234,67,53,0.08)]"
		>
			<Icon icon="logos:google-gmail" class="size-7 shrink-0" />
			Email
		</Button>

		<Button
			variant="outline"
			size="lg"
			href="https://github.com/ipang004"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2.5 px-5 py-6 text-base transition-all duration-300 hover:bg-zinc-900/40 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
		>
			<Icon icon="line-md:github-loop" class="size-7 shrink-0" />
			GitHub
		</Button>

		<Button
			variant="outline"
			size="lg"
			href="https://linkedin.com/in/ivan-maldini"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2.5 px-5 py-6 text-base transition-all duration-300 hover:bg-zinc-900/40 hover:border-[#0a66c2]/30 hover:shadow-[0_0_15px_rgba(10,102,194,0.08)]"
		>
			<Icon icon="selfhst:linkedin" class="size-7 shrink-0" />
			LinkedIn
		</Button>

		<Button
			variant="outline"
			size="lg"
			href="https://www.instagram.com/vmald_/"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2.5 px-5 py-6 text-base transition-all duration-300 hover:bg-zinc-900/40 hover:border-[#e1306c]/30 hover:shadow-[0_0_15px_rgba(225,48,108,0.08)]"
		>
			<Icon icon="skill-icons:instagram" class="size-7 shrink-0" />
			Instagram
		</Button>

	</div>
</SectionFrame>