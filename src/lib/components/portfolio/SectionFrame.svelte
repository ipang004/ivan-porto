<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		id,
		eyebrow,
		title,
		class: className = '',
		titleClass = '',
		children
	}: {
		id: string;
		eyebrow: string;
		title: string;
		class?: string;
		titleClass?: string;
		children: Snippet;
	} = $props();

	function reveal(node: HTMLElement) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						node.classList.add('reveal-visible');
						observer.unobserve(node);
					}
				});
			},
			{ threshold: 0.15 }
		);

		observer.observe(node);
		return { destroy: () => observer.disconnect() };
	}
</script>

<section {id} class="max-w-5xl mx-auto px-4 py-16 scroll-mt-16 {className}">
	<div use:reveal class="reveal">
		<div class="flex items-center gap-3 mb-3 select-none">
			<span class="font-mono text-xs font-black text-black tracking-widest px-3.5 py-1 border-2 border-black bg-amber-400 rounded-md shadow-[3px_3px_0px_0px_#18181b]">
				★ CHAPTER // {eyebrow.toUpperCase()} ★
			</span>
			<div class="h-[2.5px] flex-1 bg-black"></div>
			<span class="font-mono text-xs font-black text-rose-500 select-none">● ● ●</span>
		</div>
		<h2 class="text-3xl sm:text-4xl font-black text-white drop-shadow-[2px_2px_0px_#000] tracking-tight mb-8 {titleClass}">{title}</h2>
		{@render children()}
	</div>
</section>
