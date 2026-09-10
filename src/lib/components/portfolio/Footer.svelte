<script lang="ts">
    import { profile } from './site-data';
    const year = new Date().getFullYear();
</script>

<footer class="relative border-t-2 sm:border-t-4 border-black bg-[#160808]/95 backdrop-blur-md overflow-hidden select-none text-white">
    <div class="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs">
        <div class="flex flex-col items-center sm:items-start gap-1">
            <span class="font-black text-white tracking-widest text-sm">[ {profile.name.toUpperCase()} ]</span>
            <span class="text-stone-300 font-bold">{profile.role} · Jakarta, ID</span>
        </div>

        <div class="text-center">
            <span class="font-black text-amber-400 block text-xs tracking-wider">★ TO BE CONTINUED IN THE NEXT RELEASE ★</span>
            <p class="text-stone-300 font-bold text-[11px] pt-0.5">
                © {year} · RETRO COMIC EDITION · ISSUE NO. 01
            </p>
        </div>

        <div class="flex items-center gap-2 border-2 border-black bg-amber-400 text-black px-3 py-1 rounded-md shadow-[2px_2px_0px_0px_#000] font-black">
            <span class="w-2 h-2 rounded-full bg-black animate-pulse"></span>
            <span>AVAILABLE FOR HIRE</span>
        </div>
    </div>
</footer>
