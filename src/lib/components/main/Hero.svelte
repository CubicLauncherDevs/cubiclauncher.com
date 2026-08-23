<script lang="ts">
    import ScreenshotCarousel from "./ScreenshotCarousel.svelte";
    import { t } from "$lib/i18n";
    import IconDownload from "~icons/ph/download-simple";
    import IconPalette from "~icons/ph/palette";
    import IconGithub from "~icons/simple-icons/github";
</script>

<section
    class="relative min-h-[420px] lg:min-h-[480px] flex items-center bg-cl-base overflow-hidden"
>
    <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none"
        style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 40px 40px;"
    ></div>

    <div
        class="relative z-10 w-full mx-auto px-4 lg:px-6 py-12"
        style="max-width: var(--discord-max-width);"
    >
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <!-- Copy -->
            <div class="lg:col-span-6 text-center lg:text-left">
                <h1
                    class="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold leading-[1.2] text-white mb-3"
                >
                    {$t('hero.title')}
                </h1>

                <p
                    class="text-sm leading-[1.55] text-cl-muted mb-5 max-w-[440px] mx-auto lg:mx-0"
                >
                    {$t('hero.description')}
                </p>

                <div
                    class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5"
                >
                    <a
                        href="/install"
                        class="inline-flex items-center justify-center gap-1.5 bg-white text-black px-4 py-2 text-xs font-medium rounded hover:bg-neutral-200 transition-colors"
                    >
                        <IconDownload class="w-3.5 h-3.5" />
                        {$t('hero.download')}
                    </a>
                    <a
                        href="/themes"
                        class="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-cl-text border border-cl-border hover:border-cl-border-hover hover:bg-cl-elevated rounded transition-colors"
                    >
                        <IconPalette class="w-3.5 h-3.5" />
                        {$t('hero.exploreThemes')}
                    </a>
                </div>

                <a
                    href="https://github.com/CubicLauncherDevs/CubicLauncher"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 mt-3 text-[11px] text-cl-dim hover:text-cl-text transition-colors"
                >
                    <IconGithub class="w-3 h-3" />
                    {$t('hero.sourceCode')}
                </a>
            </div>

            <!-- Visual -->
            <div class="lg:col-span-6 w-full max-w-[700px] mx-auto lg:mx-0 lg:ml-auto">
                <ScreenshotCarousel />
            </div>
        </div>
    </div>
</section>
