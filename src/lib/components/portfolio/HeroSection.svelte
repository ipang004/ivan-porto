<script lang="ts">
    import { onMount } from 'svelte';
    import { animate } from 'motion';
    import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import type { Profile } from './types';
    
    let {
        profile,
        onNavigate
    }: {
        profile: Profile;
        onNavigate: (id: string) => void;
    } = $props();

    let titleEl: HTMLElement;
    let cardEl: HTMLElement;
    let buttonsEl: HTMLElement;

    type TabKey = 'profile' | 'skills' | 'experience';
    let activeTab = $state<TabKey>('profile');

    const tabContents = $derived({
        profile: `const developer = {\n  name: "${profile.name}",\n  role: "${profile.role}",\n  focus: "${profile.focus}",\n  location: "${profile.location}",\n  status: "Full-time Developer"\n};`,
        skills: `{\n  "frontend": [\n    "SvelteKit", "TypeScript", \n    "Tailwind CSS", "JavaScript"\n  ],\n  "backend": [\n    "Laravel", "Node.js", "MySQL"\n  ],\n  "tools": ["Git", "GitHub"]\n}`,
        experience: `# Experience\n- Frontend Developer\n- Full-Stack (Laravel & MySQL)\n- Building interactive UIs\n- Active learning new stacks`
    });

    let typedText = $state('');
    let typingInterval: ReturnType<typeof setInterval>;

    function highlight(text: string, tab: TabKey) {
        if (!text) return '';
        let escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
            
        if (tab === 'profile') {
            return escaped
                .replace(/(['"])(.*?)\1/g, '<span class="text-emerald-400">"$2"</span>')
                .replace(/\b(true|false|null|undefined|string|number|boolean)\b/g, '<span class="text-amber-400">$1</span>')
                .replace(/\b(\w+)(?=\s*:)/g, '<span class="text-blue-400">$1</span>');
        } else if (tab === 'skills') {
            return escaped
                .replace(/(['"])(.*?)\1/g, '<span class="text-emerald-400">"$2"</span>')
                .replace(/<span class="text-emerald-400">"([^"]+)"<\/span>\s*:/g, '<span class="text-blue-400">"$1"</span>:')
                .replace(/([{}[\],])/g, '<span class="text-zinc-500">$1</span>');
        } else if (tab === 'experience') {
            return escaped
                .replace(/^(-\s+)(.*)$/gm, '<span class="text-primary font-bold">$1</span><span class="text-zinc-300">$2</span>');
        }
        return escaped;
    }

    function startTyping(text: string) {
        clearInterval(typingInterval);
        typedText = '';
        let index = 0;
        typingInterval = setInterval(() => {
            if (index < text.length) {
                typedText += text[index];
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 30);
    }

    function changeTab(tab: TabKey) {
        activeTab = tab;
        startTyping(tabContents[tab]);
    }

    onMount(() => {
        animate(titleEl, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, ease: "easeOut" });
        animate(cardEl, { opacity: [0, 1], y: [20, 0] }, { delay: 0.2, duration: 0.6, ease: "easeOut" });
        animate(buttonsEl, { opacity: [0, 1], y: [15, 0] }, { delay: 0.4, duration: 0.5, ease: "easeOut" });
        startTyping(tabContents.profile);

        return () => {
            clearInterval(typingInterval);
        };
    });
</script>

{#snippet lineNumbers(text: string)}
    <div class="flex flex-col text-right select-none text-zinc-700 pr-4 border-r border-zinc-800/40 font-mono text-xs sm:text-sm leading-loose w-8 shrink-0">
        {#each { length: text.split('\n').length } as _, i (i)}
            <span>{i + 1}</span>
        {/each}
    </div>
{/snippet}

<section
    id="about"
    class="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12 overflow-hidden"
>
    <div
        class="pointer-events-none absolute w-105 h-105 rounded-full blur-[70px] opacity-12"
        style="background: radial-gradient(circle, var(--primary), transparent 70%); top: 10%;"
    ></div>

    <div class="w-full max-w-4xl flex flex-col items-center text-center z-10 space-y-12">
        
        <div bind:this={titleEl} style="opacity: 0; transform: translateY(20px)" class="space-y-4 max-w-3xl">
            <h1
                class="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none bg-linear-to-b from-white to-zinc-400 bg-clip-text text-transparent"
            >
                Halo, I'm {profile.name}.
            </h1>
            <p class="text-2xl sm:text-4xl font-light text-zinc-400 tracking-wide">
                A <span
                    class="text-foreground font-medium underline decoration-primary/40 underline-offset-8"
                    >{profile.role}</span
                > who loves exploring and learning new things in web development.
            </p>
        </div>

        <div bind:this={cardEl} style="opacity: 0; transform: translateY(20px)" class="w-full text-left">
            <div class="animate-float" style="animation-delay: 0.9s; animation-fill-mode: backwards;">
                <div class="gradient-border-wrapper shadow-[0_18px_60px_-36px_var(--primary)]">
                    <div class="gradient-border-glow"></div>
                    
                    <Card.Root class="relative z-10 bg-card border-0 rounded-[15px] overflow-hidden py-0 gap-0">
                        <div class="flex items-center justify-between border-b border-border bg-muted/40 select-none">
                            <div class="flex items-center">
                                <div class="flex items-center gap-1.5 px-4 py-3">
                                    <span class="w-3 h-3 rounded-full bg-accent/70"></span>
                                    <span class="w-3 h-3 rounded-full bg-secondary/70"></span>
                                    <span class="w-3 h-3 rounded-full bg-primary/70"></span>
                                </div>
                                
                                <div class="flex text-xs font-mono border-l border-border/50 h-full overflow-x-auto scrollbar-none">
                                    <button 
                                        onclick={() => changeTab('profile')}
                                        class="px-3 sm:px-4 py-3 border-r border-border/50 flex items-center gap-1 sm:gap-1.5 transition-colors whitespace-nowrap shrink-0
                                            {activeTab === 'profile' ? 'bg-background text-foreground border-t-2 border-t-primary' : 'text-muted-foreground bg-muted/20 hover:bg-muted/40'}"
                                    >
                                        <span class="text-blue-400">TS</span><span class="hidden sm:inline"> profile.ts</span>
                                    </button>
                                    <button 
                                        onclick={() => changeTab('skills')}
                                        class="px-3 sm:px-4 py-3 border-r border-border/50 flex items-center gap-1 sm:gap-1.5 transition-colors whitespace-nowrap shrink-0
                                            {activeTab === 'skills' ? 'bg-background text-foreground border-t-2 border-t-primary' : 'text-muted-foreground bg-muted/20 hover:bg-muted/40'}"
                                    >
                                        <span class="text-yellow-500">&#123;&#125;</span><span class="hidden sm:inline"> skills.json</span>
                                    </button>
                                    <button 
                                        onclick={() => changeTab('experience')}
                                        class="px-3 sm:px-4 py-3 border-r border-border/50 flex items-center gap-1 sm:gap-1.5 transition-colors whitespace-nowrap shrink-0
                                            {activeTab === 'experience' ? 'bg-background text-foreground border-t-2 border-t-primary' : 'text-muted-foreground bg-muted/20 hover:bg-muted/40'}"
                                    >
                                        <span class="text-primary">M↓</span><span class="hidden sm:inline"> experience.md</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Card.Content class="flex gap-4 p-6 font-mono text-xs sm:text-sm leading-loose min-h-45 sm:min-h-55 select-text">
                            {@render lineNumbers(typedText)}
                            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                            <pre class="whitespace-pre-wrap text-foreground/90 flex-1 overflow-x-auto"><code class="text-foreground">{@html highlight(typedText, activeTab)}</code><span class="animate-pulse text-primary font-bold">|</span></pre>
                        </Card.Content>
                    </Card.Root>
                </div>
            </div>
        </div>

        <div bind:this={buttonsEl} style="opacity: 0; transform: translateY(15px)" class="flex gap-4 select-none">
            <Button
                onclick={() => onNavigate('projects')}
                class="rounded-full px-6 py-5 text-base font-medium shadow-lg hover:shadow-primary/20 transition-all"
            >
                View Projects
            </Button>
            <Button
                onclick={() => onNavigate('contact')}
                variant="outline"
                class="rounded-full px-6 py-5 text-base font-medium border-border/60 hover:bg-muted/50 transition-all"
            >
                Contact Me
            </Button>
        </div>
    </div>
</section>