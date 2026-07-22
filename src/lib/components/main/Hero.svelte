<script lang="ts">
    import { onMount } from "svelte";
    import Logo from "$lib/Logo.svelte";
    import { t } from "$lib/i18n";

    let fallingLogos: {
        id: number;
        left: number;
        size: number;
        duration: number;
        delay: number;
        opacity: number;
    }[] = [];

    onMount(() => {
        fallingLogos = Array.from({ length: 24 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: Math.random() * 30 + 15,
            duration: Math.random() * 15 + 10,
            delay: Math.random() * -20,
            opacity: Math.random() * 0.1 + 0.02,
        }));
    });
</script>

<section
    class="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-neutral-950"
>
    <!-- Subtle Background Pattern -->
    <div
        class="absolute inset-0 opacity-[0.1] pointer-events-none z-0"
        style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 40px 40px;"
    ></div>

    <!-- Falling Logos Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {#each fallingLogos as logo (logo.id)}
            <div
                class="absolute -top-25 falling-logo"
                style="
          left: {logo.left}%;
          width: {logo.size}px;
          height: {logo.size}px;
          animation-duration: {logo.duration}s;
          animation-delay: {logo.delay}s;
          opacity: {logo.opacity};
        "
            >
                <Logo width="100%" height="100%" color="#ffffff" />
            </div>
        {/each}
    </div>

    <div
        class="container mx-auto px-6 relative z-10 flex flex-col items-center text-center"
    >
        <!-- Center Logo -->
        <div
            class="relative group flex items-center justify-center w-48 h-48 md:w-64 md:h-64 mb-10"
        >
            <!-- Subtle Glow Behind Logo -->
            <div
                class="absolute inset-0 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/20 transition-colors duration-700"
            ></div>

            <!-- Cubic Logo -->
            <div
                class="relative transform rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-700 w-full h-full"
            >
                <Logo width="100%" height="100%" color="#ffffff" />
            </div>
        </div>

        <!-- Text & Buttons -->
        <h1
            class="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter mb-8 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent"
        >
            CUBIC <br class="md:hidden" /> LAUNCHER.
        </h1>

        <p
            class="max-w-2xl text-lg md:text-xl text-neutral-400 leading-relaxed mb-8 font-light"
        >
            {$t('hero.description')}
        </p>

        <div
            class="flex flex-col sm:flex-row items-center gap-6 justify-center w-full max-w-md mx-auto sm:max-w-none"
        >
            <a
                href="/install"
                class="w-full sm:w-auto bg-white text-black px-12 py-5 font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-white/5 text-center"
            >
                {$t('hero.download')}
            </a>
            <a
                href="https://github.com/CubicLauncherDevs/CubicLauncher"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:w-auto px-12 py-5 border border-white/10 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all"
            >
                {$t('hero.sourceCode')}
            </a>
        </div>
    </div>
</section>
