<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" type="image/png" href={favicon} /></svelte:head>
<div class="dark min-h-screen text-foreground relative">
	<!-- Fixed Sticky Comic Wallpaper Background -->
	<div class="bg-comic-wallpaper" aria-hidden="true"></div>
	{@render children()}
</div>
