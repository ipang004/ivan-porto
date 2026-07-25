<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		id,
		eyebrow,
		title,
		class: className = '',
		children
	}: {
		id: string;
		eyebrow: string;
		title: string;
		class?: string;
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

<section {id} class="max-w-5xl mx-auto px-4 py-15 scroll-mt-16 {className}">
	<div use:reveal class="reveal">
		<p class="font-mono text-xs text-secondary mb-3">// {eyebrow}</p>
		<h2 class="font-display text-3xl font-semibold mb-8">{title}</h2>
		{@render children()}
	</div>
</section>
