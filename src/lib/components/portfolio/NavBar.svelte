<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sheet from '$lib/components/ui/sheet';
	import Menu from '@lucide/svelte/icons/menu';
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

<nav class="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
	<div class="max-w-4xl mx-auto flex items-center h-12 px-4 gap-1">
		<span class="font-mono text-xs text-secondary shrink-0">~/{profile.name.toLowerCase().replace(/\s+/g, '-')}</span>

		<Separator orientation="vertical" class="h-5 mx-3 hidden sm:block" />

		<div class="hidden sm:flex items-center gap-1">
			{#each items as item (item.id)}
				<button
					onclick={() => navigateTo(item.id)}
					class="font-mono text-xs px-3 py-1.5 rounded-t-md border-b-2 transition-colors
						{activeSection === item.id
						? 'border-primary text-foreground bg-card'
						: 'border-transparent text-muted-foreground hover:text-foreground'}"
				>
					{item.label}
				</button>
			{/each}
		</div>

		<div class="sm:hidden ml-auto">
			<Sheet.Root bind:open={sheetOpen}>
				<Sheet.Trigger>
					{#snippet child({ props }: { props: Record<string, unknown> })}
						<Button {...props} variant="ghost" size="icon" class="text-muted-foreground">
							<Menu class="size-5" />
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content side="right" class="bg-card border-border">
					<Sheet.Header>
						<Sheet.Title class="font-display">Navigasi</Sheet.Title>
					</Sheet.Header>
					<div class="flex flex-col gap-1 px-4">
						{#each items as item (item.id)}
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
