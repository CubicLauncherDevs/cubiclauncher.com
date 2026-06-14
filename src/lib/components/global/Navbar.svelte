<script lang="ts">
    import { onMount } from "svelte";
    import Logo from "$lib/Logo.svelte";
    import LanguageSwitcher from "$lib/i18n/LanguageSwitcher.svelte";
    import { fade } from "svelte/transition";
    import { t } from "$lib/i18n";

    let scrolled = false;
    let isMobileMenuOpen = false;

    const toggleMobileMenu = () => {
        isMobileMenuOpen = !isMobileMenuOpen;
        if (typeof document !== "undefined") {
            if (isMobileMenuOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
        }
    };

    onMount(() => {
        const handleScroll = () => {
            scrolled = window.scrollY > 50;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {scrolled
        ? 'py-3 sm:py-4'
        : 'py-4 sm:py-8'} pointer-events-none flex justify-center"
>
    <div class="pointer-events-auto w-full px-4 sm:px-6 flex justify-center">
        <div
            class="w-full flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full border {scrolled
                ? 'max-w-4xl bg-neutral-900/90 backdrop-blur-xs border-white/10 px-4 sm:px-8 py-2 sm:py-3 shadow-2xl'
                : 'max-w-7xl border-transparent px-2 sm:px-4 py-2'}"
        >
            <div class="flex items-center gap-4 sm:gap-12 shrink-0">
                <a href="/" class="flex items-center gap-3 group">
                    <Logo
                        width="2.5rem"
                        height="2.5rem"
                        color="#ffffff"
                        className="group-hover:scale-110 transition-transform duration-500"
                    />
                    <span
                        class="hidden sm:block font-bold text-lg tracking-tighter uppercase"
                        >CubicLauncher</span
                    >
                </a>

                <nav class="hidden md:flex items-center gap-8">
                    {#each [["nav.docs", "/docs"], ["nav.themes", "/themes"]] as [labelKey, href]}
                        <a
                            href={href}
                            class="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
                            >{$t(labelKey)}</a
                        >
                    {/each}
                    <a
                        href="https://discord.com/invite/7VaqSrPukm"
                        class="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
                        >{$t('nav.discord')}</a
                    >
                </nav>
            </div>

            <div class="flex items-center gap-3 sm:gap-6 shrink-0">
                <div class="hidden sm:block">
                  <LanguageSwitcher />
                </div>
                <a
                    href="https://ko-fi.com/cubiclauncher"
                    class="hidden sm:block text-[10px] font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
                    {$t('nav.donate')}
            </a>
                <a
                    href="/install"
                    class="hidden sm:flex bg-white text-black px-6 py-2 sm:px-8 sm:py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all active:scale-95"
                >
                    {$t('nav.download')}
                </a>
                <button
                    class="md:hidden text-white p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors focus:outline-none flex items-center justify-center"
                    on:click={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    <svg
                        class="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</header>

{#if isMobileMenuOpen}
    <div
        class="fixed inset-0 z-60 bg-neutral-950/95 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-auto"
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 300 }}
    >
        <button
            class="absolute top-6 right-6 p-4 text-neutral-400 hover:text-white transition-colors focus:outline-none"
            on:click={toggleMobileMenu}
            aria-label="Close mobile menu"
        >
            <svg
                class="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>

        <nav class="flex flex-col items-center gap-10">
            <a
                href="/"
                class="mb-8 flex items-center gap-3"
                on:click={toggleMobileMenu}
            >
                <Logo width="3rem" height="3rem" color="#ffffff" />
                <span
                    class="font-bold text-2xl tracking-tighter uppercase text-white"
                    >CubicLauncher</span
                >
            </a>

            {#each [["nav.docs", "/docs"], ["nav.themes", "/themes"]] as [labelKey, href]}
                <a
                    href={href}
                    class="text-xl font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
                    on:click={toggleMobileMenu}>{$t(labelKey)}</a
                >
            {/each}
            <a
                href="https://discord.com/invite/7VaqSrPukm"
                class="text-xl font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
                on:click={toggleMobileMenu}>{$t('nav.discord')}</a
            >

            <button
                class="mt-4 text-xl font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
                on:click={toggleMobileMenu}
            >
                {$t('nav.donate')}
            </button>

            <a
                href="/install"
                class="mt-8 bg-white text-black px-10 py-3 text-sm font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all active:scale-95"
                on:click={toggleMobileMenu}
            >
                {$t('nav.download')}
            </a>

            <div class="mt-6">
              <LanguageSwitcher />
            </div>
        </nav>
    </div>
{/if}
