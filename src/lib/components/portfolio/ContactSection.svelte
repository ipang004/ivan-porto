<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import SectionFrame from './SectionFrame.svelte';
	import Icon from '@iconify/svelte';
</script>

<SectionFrame id="contact" eyebrow="communications" title="Let's Connect" class="text-center" titleClass="text-4xl sm:text-5xl">
	<p class="text-white drop-shadow-[2px_2px_0px_#000] font-medium mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
		Open to collaborative web projects, frontend engineering roles, or technical discussions.
	</p>
	<div class="flex flex-wrap gap-3.5 justify-center items-center font-mono text-xs">

		<Button
			variant="outline"
			size="lg"
			href="mailto:imaldini328@gmail.com"
			class="flex items-center gap-2.5 px-6 py-5 rounded-xl border-[2.5px] border-black bg-white text-black font-black shadow-[4px_4px_0px_0px_#18181b] hover:bg-amber-400 hover:shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
		>
			<Icon icon="lucide:mail" class="size-5 shrink-0 text-amber-500" />
			<span>EMAIL DISPATCH</span>
		</Button>

		<Button
			variant="outline"
			size="lg"
			href="https://github.com/ipang004"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2.5 px-6 py-5 rounded-xl border-[2.5px] border-black bg-white text-black font-black shadow-[4px_4px_0px_0px_#18181b] hover:bg-zinc-200 hover:shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
		>
			<Icon icon="lucide:github" class="size-5 shrink-0 text-black" />
			<span>GITHUB HQ</span>
		</Button>

		<Button
			variant="outline"
			size="lg"
			href="https://linkedin.com/in/ivan-maldini"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2.5 px-6 py-5 rounded-xl border-[2.5px] border-black bg-white text-black font-black shadow-[4px_4px_0px_0px_#18181b] hover:bg-sky-400 hover:text-white hover:shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
		>
			<Icon icon="lucide:linkedin" class="size-5 shrink-0 text-sky-600" />
			<span>LINKEDIN COMM</span>
		</Button>

		<Button
			variant="outline"
			size="lg"
			href="https://www.instagram.com/vmald_/"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2.5 px-6 py-5 rounded-xl border-[2.5px] border-black bg-white text-black font-black shadow-[4px_4px_0px_0px_#18181b] hover:bg-rose-400 hover:text-white hover:shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
		>
			<Icon icon="lucide:instagram" class="size-5 shrink-0 text-rose-500" />
			<span>INSTAGRAM FEED</span>
		</Button>

	</div>
</SectionFrame>