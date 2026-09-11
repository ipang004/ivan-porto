<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sheet from '$lib/components/ui/sheet';
	import type { NavItem, Profile } from './types';

	let {
		activeSection,
		items,
		profile,
		onNavigate
	}: {
		activeSection: string;
		items: NavItem[];
		profile: Profile;
		onNavigate: (id: string) => void;
	} = $props();

	let sheetOpen = $state(false);

	function navigateTo(id: string) {
		onNavigate(id);
		sheetOpen = false;
	}
</script>

<header class="sticky top-0 inset-x-0 z-50 select-none">
	<nav class="border-b-2 border-black bg-[#160808]/92 backdrop-blur-md shadow-md">
		<div class="max-w-5xl mx-auto flex items-center h-12 px-4 gap-1">
			<span class="font-mono text-xs font-black text-white shrink-0 tracking-wider">
				[ VOL.01 // <span class="text-amber-400">IVAN.DEV</span> ]
			</span>

			<Separator orientation="vertical" class="h-5 mx-3 hidden sm:block bg-white/20" />

			<div class="hidden sm:flex items-center gap-1.5">
				{#each items as item, i}
					<button
						onclick={() => navigateTo(item.id)}
						class="font-mono text-xs px-3 py-1 rounded-md border-2 transition-all cursor-pointer
							{activeSection === item.id
							? 'border-black text-black font-black bg-amber-400 shadow-[2px_2px_0px_0px_#000]'
							: 'border-transparent text-white/80 hover:text-white font-bold hover:bg-white/10'}"
					>
						0{i + 1}. {item.label}
					</button>
				{/each}
			</div>

		<div class="sm:hidden ml-auto">
			<Sheet.Root bind:open={sheetOpen}>
				<Sheet.Trigger>
					{#snippet child({ props }: { props: Record<string, unknown> })}
						<Button {...props} variant="ghost" size="icon" class="text-muted-foreground">
							<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
							</svg>
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content side="right" class="bg-card border-border">
					<Sheet.Header>
						<Sheet.Title class="font-display">Navigasi</Sheet.Title>
					</Sheet.Header>
					<div class="flex flex-col gap-1 px-4">
						{#each items as item}
							<button
								onclick={() => navigateTo(item.id)}
								class="font-mono text-sm text-left px-3 py-2 rounded-md transition-colors
									{activeSection === item.id
									? 'text-foreground bg-muted'
									: 'text-muted-foreground hover:text-foreground'}"
							>
								{item.label}
							</button>
						{/each}
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</nav>
</header>
