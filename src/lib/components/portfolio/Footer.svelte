<script lang="ts">
    import { profile } from './site-data';
    const year = new Date().getFullYear();
</script>

<footer class="relative border-t border-border/40 bg-card/50 overflow-hidden">

    <div class="sweep-line absolute top-0 inset-x-0 h-px pointer-events-none"></div>

    <div class="corner-glow-left absolute left-0 top-0 w-32 h-full pointer-events-none"
         style="background: linear-gradient(to right, oklch(0.703 0.164 287.4 / 0.15), transparent);">
    </div>

    <div class="corner-glow-right absolute right-0 top-0 w-32 h-full pointer-events-none"
         style="background: linear-gradient(to left, oklch(0.786 0.114 186.6 / 0.15), transparent);">
    </div>


    <div class="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex flex-col items-center sm:items-start gap-0.5">
            <span class="text-sm font-semibold text-foreground/80">{profile.name}</span>
            <span class="text-xs text-muted-foreground">{profile.role}</span>
        </div>

        <p class="text-xs text-muted-foreground order-last sm:order-none">
            © {year} · All rights reserved
        </p>

        <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <span class="relative flex h-1.5 w-1.5">
            </span>
            Open to collaborate
        </div>
    </div>
</footer>

<style>
    .sweep-line {
        background: linear-gradient(to right,
            transparent 0%,
            oklch(0.703 0.164 287.4 / 0.9) 50%,
            transparent 100%
        );
        background-size: 30% 100%;
        background-repeat: no-repeat;
        animation: sweep 2s ease-in-out infinite;
    }
    @keyframes sweep {
        0%   { background-position: -30% 0; }
        100% { background-position: 130% 0; }
    }

    .corner-glow-left {
        animation: pulseLeft 2s ease-in-out infinite;
    }
    .corner-glow-right {
        animation: pulseRight 2s ease-in-out infinite;
        animation-delay: 1.75s;
    }
    @keyframes pulseLeft {
        0%, 100% { opacity: 0.4; }
        50%       { opacity: 1; }
    }
    @keyframes pulseRight {
        0%, 100% { opacity: 0.4; }
        50%       { opacity: 1; }
    }
</style>
