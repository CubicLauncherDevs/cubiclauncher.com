<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import Logo from "$lib/Logo.svelte";
    import LanguageSwitcher from "$lib/i18n/LanguageSwitcher.svelte";
    import ThemeSwitcher from "$lib/components/global/ThemeSwitcher.svelte";
    import { t } from "$lib/i18n";
    import { themeStore } from "$lib/stores/theme.svelte";

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
            scrolled = window.scrollY > 10;
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
    class="fixed top-0 left-0 right-0 z-50 h-[var(--navbar-height)] border-b transition-colors duration-200 {scrolled
        ? 'bg-cl-base border-cl-border'
        : 'bg-cl-base border-transparent'}"
>
    <div class="h-full mx-auto px-4 lg:px-6 flex items-center justify-between" style="max-width: var(--discord-max-width);">
        <div class="flex items-center gap-6">
            <a href="/" class="flex items-center gap-2 group shrink-0">
                <Logo
                    width="1.5rem"
                    height="1.5rem"
                    color="var(--cl-text)"
                    className="transition-transform duration-200 group-hover:scale-105"
                />
                <span class="hidden sm:block font-semibold text-sm text-cl-text tracking-tight">
                    CubicLauncher
                </span>
            </a>

            <nav class="hidden md:flex items-center">
                {#each mainLinks as [labelKey, href]}
                    <a
                        href={href}
                        class="px-2.5 py-1.5 text-xs font-medium text-cl-muted hover:text-cl-text transition-colors duration-150"
                    >
                        {$t(labelKey)}
                    </a>
                {/each}
            </nav>
        </div>

        <div class="flex items-center gap-3 shrink-0">
            <div class="hidden sm:flex items-center gap-3">
                <ThemeSwitcher />
                <LanguageSwitcher />
            </div>

            <nav class="hidden md:flex items-center">
                <a
                    href="https://discord.com/invite/7VaqSrPukm"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-2.5 py-1.5 text-xs font-medium text-cl-muted hover:text-cl-text transition-colors duration-150"
                >
                    {$t('nav.discord')}
                </a>
                <a
                    href="/donate"
                    class="px-2.5 py-1.5 text-xs font-medium text-cl-muted hover:text-cl-text transition-colors duration-150"
                >
                    {$t('nav.donate')}
                </a>
            </nav>

            <a
                href="/install"
                class="hidden sm:inline-flex items-center text-xs font-medium text-cl-text bg-cl-elevated border border-cl-border hover:border-cl-border-hover hover:bg-cl-hover rounded px-3 py-1.5 transition-colors duration-150"
            >
                {$t('nav.download')}
            </a>

            <button
                class="md:hidden text-cl-muted hover:text-cl-text p-1.5 focus:outline-none transition-colors duration-150"
                onclick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
            >
                <svg
                    class="w-5 h-5 transition-transform duration-200 {isMobileMenuOpen ? 'rotate-90' : ''}"
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
            class="absolute inset-0 block w-full h-full bg-cl-accent/40 backdrop-blur-sm"
            aria-label="Close menu"
            onclick={closeMobileMenu}
            transition:fade={{ duration: 200, easing: cubicOut }}
        ></button>
        <div
            class="absolute top-[var(--navbar-height)] left-0 right-0 bg-cl-base border-b border-cl-border shadow-xl"
            transition:fly={{ y: -10, duration: 200, easing: cubicOut }}
        >
            <nav class="flex flex-col py-1">
                {#each mainLinks as [labelKey, href]}
                    <a
                        href={href}
                        class="block px-4 py-2 text-xs font-medium text-cl-muted hover:text-cl-text hover:bg-cl-elevated transition-colors duration-150"
                        onclick={closeMobileMenu}
                    >
                        {$t(labelKey)}
                    </a>
                {/each}
                <a
                    href="https://discord.com/invite/7VaqSrPukm"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block px-4 py-2 text-xs font-medium text-cl-muted hover:text-cl-text hover:bg-cl-elevated transition-colors duration-150"
                    onclick={closeMobileMenu}
                >
                    {$t('nav.discord')}
                </a>
                <a
                    href="/donate"
                    class="block px-4 py-2 text-xs font-medium text-cl-muted hover:text-cl-text hover:bg-cl-elevated transition-colors duration-150"
                    onclick={closeMobileMenu}
                >
                    {$t('nav.donate')}
                </a>
                <div class="px-4 py-2 flex items-center justify-between border-t border-cl-border mt-1">
                    <a
                        href="/install"
                        class="inline-flex items-center text-xs font-medium text-cl-text bg-cl-elevated border border-cl-border hover:border-cl-border-hover hover:bg-cl-hover rounded px-3 py-1.5 transition-colors duration-150"
                        onclick={closeMobileMenu}
                    >
                        {$t('nav.download')}
                    </a>
                    <div class="flex items-center gap-3">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                    </div>
                </div>
            </nav>
        </div>
    </div>
{/if}
