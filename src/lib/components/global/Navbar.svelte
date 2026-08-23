<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import Logo from "$lib/Logo.svelte";
    import LanguageSwitcher from "$lib/i18n/LanguageSwitcher.svelte";
    import { t } from "$lib/i18n";

    let scrolled = $state(false);
    let isMobileMenuOpen = $state(false);

    const toggleMobileMenu = () => {
        isMobileMenuOpen = !isMobileMenuOpen;
    };

    const closeMobileMenu = () => {
        isMobileMenuOpen = false;
    };

    onMount(() => {
        const handleScroll = () => {
            scrolled = window.scrollY > 50;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    });

    const mainLinks: [string, string][] = [
        ["nav.themes", "/themes"],
        ["nav.about", "/about"],
        ["nav.docs", "https://dev.cubiclauncher.org/docs"]
    ];
</script>

<svelte:window
    onkeydown={(e) => {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileMenu();
        }
    }}
/>

<header
    class="fixed top-0 left-0 right-0 z-50 {scrolled
        ? 'bg-neutral-950/90 backdrop-blur-md border-b border-white/5'
        : 'bg-transparent border-b border-transparent'}"
    style="height: var(--discord-nav-height); transition: background-color 200ms ease-out, border-color 200ms ease-out, backdrop-filter 200ms ease-out;"
>
    <div class="h-full mx-auto px-6 lg:px-8 flex items-center justify-between" style="max-width: var(--discord-max-width);">
        <div class="flex items-center gap-8">
            <a href="/" class="flex items-center gap-2.5 group shrink-0">
                <Logo
                    width="2rem"
                    height="2rem"
                    color="#ffffff"
                    className="transition-transform duration-200 group-hover:scale-105"
                />
                <span class="hidden sm:block font-semibold text-[15px] text-white tracking-tight">
                    CubicLauncher
                </span>
            </a>

            <nav class="hidden md:flex items-center">
                {#each mainLinks as [labelKey, href]}
                    <a
                        href={href}
                        class="px-3 py-2 text-[14px] font-medium text-white/80 hover:text-white transition-colors duration-150"
                    >
                        {$t(labelKey)}
                    </a>
                {/each}
            </nav>
        </div>

        <div class="flex items-center gap-4 shrink-0">
            <div class="hidden sm:block">
                <LanguageSwitcher />
            </div>

            <nav class="hidden md:flex items-center">
                <a
                    href="https://discord.com/invite/7VaqSrPukm"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-3 py-2 text-[14px] font-medium text-white/80 hover:text-white transition-colors duration-150"
                >
                    {$t('nav.discord')}
                </a>
                <a
                    href="/donate"
                    class="px-3 py-2 text-[14px] font-medium text-white/80 hover:text-white transition-colors duration-150"
                >
                    {$t('nav.donate')}
                </a>
            </nav>

            <a
                href="/install"
                class="hidden sm:inline-flex items-center text-[14px] font-medium text-white border border-white/80 rounded-[20px] px-4 py-1.5 hover:bg-white/10 transition-colors duration-150"
            >
                {$t('nav.download')}
            </a>

            <button
                class="md:hidden text-white/80 hover:text-white p-2 focus:outline-none transition-colors duration-150"
                onclick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
            >
                <svg
                    class="w-6 h-6 transition-transform duration-200 {isMobileMenuOpen ? 'rotate-90' : ''}"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {#if isMobileMenuOpen}
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    {:else}
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    {/if}
                </svg>
            </button>
        </div>
    </div>
</header>

{#if isMobileMenuOpen}
    <div class="fixed inset-0 z-40 md:hidden">
        <button
            type="button"
            class="absolute inset-0 block w-full h-full bg-black/40 backdrop-blur-sm"
            aria-label="Close menu"
            onclick={closeMobileMenu}
            transition:fade={{ duration: 200, easing: cubicOut }}
        ></button>
        <div
            class="absolute top-[var(--discord-nav-height)] left-0 right-0 bg-neutral-950 border-b border-white/5 shadow-xl overflow-hidden"
            transition:fly={{ y: -10, duration: 200, easing: cubicOut }}
        >
            <nav class="flex flex-col">
                {#each mainLinks as [labelKey, href]}
                    <a
                        href={href}
                        class="block px-6 py-3.5 text-[14px] font-medium text-white/80 hover:text-white border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-150"
                        onclick={closeMobileMenu}
                    >
                        {$t(labelKey)}
                    </a>
                {/each}
                <a
                    href="https://discord.com/invite/7VaqSrPukm"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block px-6 py-3.5 text-[14px] font-medium text-white/80 hover:text-white border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-150"
                    onclick={closeMobileMenu}
                >
                    {$t('nav.discord')}
                </a>
                <a
                    href="/donate"
                    class="block px-6 py-3.5 text-[14px] font-medium text-white/80 hover:text-white border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-150"
                    onclick={closeMobileMenu}
                >
                    {$t('nav.donate')}
                </a>
                <div class="px-6 py-4 flex items-center justify-between">
                    <a
                        href="/install"
                        class="inline-flex items-center text-[14px] font-medium text-white border border-white/80 rounded-[20px] px-5 py-2 hover:bg-white/10 transition-colors duration-150"
                        onclick={closeMobileMenu}
                    >
                        {$t('nav.download')}
                    </a>
                    <LanguageSwitcher />
                </div>
            </nav>
        </div>
    </div>
{/if}
