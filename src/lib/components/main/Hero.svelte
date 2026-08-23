<script lang="ts">
    import HeroBackground from "./HeroBackground.svelte";
    import { t } from "$lib/i18n";
    import IconDownload from "~icons/ph/download-simple";
    import IconPalette from "~icons/ph/palette";
    import IconGithub from "~icons/simple-icons/github";
</script>

<section
    id="hero-section"
    class="relative min-h-[420px] lg:min-h-[520px] flex items-center overflow-hidden"
    style="isolation: isolate;"
>
    <HeroBackground />

    <div
        class="relative z-10 w-full mx-auto px-4 lg:px-6 py-16 text-left"
        style="max-width: var(--discord-max-width);"
    >
        <h1
            class="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.15] text-white mb-4 max-w-[600px]"
        >
            {$t('hero.title')}
        </h1>

        <p
            class="text-sm leading-[1.6] text-cl-muted mb-6 max-w-[480px]"
        >
            {$t('hero.description')}
        </p>

        <div
            class="flex flex-col sm:flex-row items-start gap-2.5 mb-4"
        >
            <a
                href="/install"
                class="inline-flex items-center justify-center gap-1.5 bg-white text-black px-5 py-2 text-xs font-medium rounded hover:bg-neutral-200 transition-colors"
            >
                <IconDownload class="w-3.5 h-3.5" />
                {$t('hero.download')}
            </a>
            <a
                href="/themes"
                class="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-medium text-cl-text border border-cl-border hover:border-cl-border-hover hover:bg-cl-elevated rounded transition-colors"
            >
                <IconPalette class="w-3.5 h-3.5" />
                {$t('hero.exploreThemes')}
            </a>
        </div>

        <a
            href="https://github.com/CubicLauncherDevs/CubicLauncher"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-[11px] text-cl-dim hover:text-cl-text transition-colors"
        >
            <IconGithub class="w-3 h-3" />
            {$t('hero.sourceCode')}
        </a>
    </div>
</section>
