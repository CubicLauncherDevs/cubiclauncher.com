<script lang="ts">
    import ScreenshotCarousel from "./ScreenshotCarousel.svelte";
    import { t } from "$lib/i18n";
    import IconDownload from "~icons/ph/download-simple";
    import IconPalette from "~icons/ph/palette";
    import IconGithub from "~icons/simple-icons/github";
</script>

<section
    class="relative min-h-[520px] lg:min-h-[580px] flex items-center bg-neutral-950 pt-[var(--discord-nav-height)] overflow-hidden"
>
    <div
        class="absolute inset-0 opacity-[0.04] pointer-events-none"
        style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 40px 40px;"
    ></div>

    <div
        class="relative z-10 w-full mx-auto px-6 lg:px-8 py-14"
        style="max-width: var(--discord-max-width);"
    >
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <!-- Copy -->
            <div class="lg:col-span-6 text-center lg:text-left">
                <h1
                    class="text-[28px] sm:text-[34px] lg:text-[38px] font-semibold leading-[1.2] text-white mb-4"
                >
                    {$t('hero.title')}
                </h1>

                <p
                    class="text-[15px] leading-[1.6] text-neutral-400 mb-6 max-w-[460px] mx-auto lg:mx-0"
                >
                    {$t('hero.description')}
                </p>

                <div
                    class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
                >
                    <a
                        href="/install"
                        class="inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 text-[13px] font-medium rounded-[4px] hover:bg-neutral-200 transition-colors"
                    >
                        <IconDownload class="w-4 h-4" />
                        {$t('hero.download')}
                    </a>
                    <a
                        href="/themes"
                        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white border border-white/20 rounded-[4px] hover:bg-white/5 transition-colors"
                    >
                        <IconPalette class="w-4 h-4" />
                        {$t('hero.exploreThemes')}
                    </a>
                </div>

                <a
                    href="https://github.com/CubicLauncherDevs/CubicLauncher"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 mt-4 text-[12px] text-neutral-500 hover:text-white transition-colors"
                >
                    <IconGithub class="w-3.5 h-3.5" />
                    {$t('hero.sourceCode')}
                </a>
            </div>

            <!-- Visual -->
            <div class="lg:col-span-6 w-full max-w-[760px] mx-auto lg:mx-0 lg:ml-auto">
                <ScreenshotCarousel />
            </div>
        </div>
    </div>
</section>
