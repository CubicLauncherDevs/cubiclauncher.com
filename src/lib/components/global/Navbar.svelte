<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import Logo from "$lib/Logo.svelte";
    import LanguageSwitcher from "$lib/i18n/LanguageSwitcher.svelte";
    import ThemeSwitcher from "$lib/components/global/ThemeSwitcher.svelte";
    import { t } from "$lib/i18n";
    import { page } from "$app/stores";
    import { tick } from "svelte";
    import IconDownload from "~icons/ph/download-simple";
    import IconUser from "~icons/ph/user";
    import { themeStore } from "$lib/stores/theme.svelte";

    let scrolled = $state(false);
    let isMobileMenuOpen = $state(false);
    let isMoreOpen = $state(false);
    let moreContainer = $state<HTMLDivElement | null>(null);

    const toggleMobileMenu = () => {
        isMobileMenuOpen = !isMobileMenuOpen;
    };

    const closeMobileMenu = () => {
        isMobileMenuOpen = false;
    };

    function isActive(href: string) {
        const path = $page.url.pathname;
        return path === href || path.startsWith(href + "/");
    }

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
        ["changelogs.nav", "/changelogs"],
    ];

    const moreLinks: { labelKey: string; href: string; external?: boolean }[] = [
        { labelKey: "nav.about", href: "/about" },
        { labelKey: "nav.docs", href: "https://dev.cubiclauncher.org/docs", external: true },
        { labelKey: "nav.discord", href: "https://discord.com/invite/7VaqSrPukm", external: true },
        { labelKey: "nav.donate", href: "/donate" },
    ];
</script>

<svelte:window
    onkeydown={(e) => {
        if (e.key === 'Escape') {
            if (isMobileMenuOpen) closeMobileMenu();
            if (isMoreOpen) isMoreOpen = false;
        }
    }}
    onclick={(e) => {
        if (moreContainer && !moreContainer.contains(e.target as Node)) {
            isMoreOpen = false;
        }
    }}
/>

<header
    class="fixed top-0 left-0 right-0 z-50 h-[var(--navbar-height)] border-b transition-all duration-200 {scrolled
        ? 'h-[52px] bg-cl-base/90 border-cl-border shadow-sm backdrop-blur-[2px]'
        : 'bg-cl-base border-transparent'}"
>
    <div class="h-full mx-auto px-4 lg:px-6 flex items-center justify-between" style="max-width: var(--discord-max-width);">
        <div class="flex items-center gap-6">
            <a href="/" class="flex items-center gap-2 group shrink-0">
                <Logo
                    width="1.5rem"
                    height="1.5rem"
                    color={themeStore.resolved === "dark" ? "#ffffff" : "#24292e"}
                    className="transition-transform duration-200 group-hover:scale-105"
                />
                <span class="hidden sm:block font-semibold text-sm text-cl-text tracking-tight">
                    CubicLauncher
                </span>
            </a>

            <nav class="hidden md:flex items-center gap-1">
                {#each mainLinks as [labelKey, href]}
                    <a
                        href={href}
                        class="px-2.5 py-1.5 text-xs font-medium text-cl-muted hover:text-cl-text transition-colors duration-150 border-b-2 border-transparent {isActive(href) ? 'text-cl-text border-cl-text' : ''}"
                        aria-current={isActive(href) ? 'page' : undefined}
                        data-sveltekit-prefetch
                    >
                        {$t(labelKey)}
                    </a>
                {/each}

                <!-- More dropdown (desktop) -->
                <div class="relative" bind:this={moreContainer}>
                    <button
                        type="button"
                        class="px-2.5 py-1.5 text-xs font-medium text-cl-muted hover:text-cl-text transition-colors duration-150 inline-flex items-center gap-1"
                        aria-haspopup="menu"
                        aria-expanded={isMoreOpen}
                        onclick={async () => {
                            isMoreOpen = !isMoreOpen;
                            if (isMoreOpen) {
                                await tick();
                                const items = moreContainer?.querySelectorAll<HTMLAnchorElement>('a[role="menuitem"]');
                                items?.[0]?.focus();
                            }
                        }}
                        onkeydown={async (e) => {
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                if (!isMoreOpen) {
                                    isMoreOpen = true;
                                    await tick();
                                }
                                const items = moreContainer?.querySelectorAll<HTMLAnchorElement>('a[role="menuitem"]');
                                items?.[0]?.focus();
                            }
                        }}
                    >
                        {$t('nav.more')}
                        <svg class="w-3 h-3 transition-transform {isMoreOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {#if isMoreOpen}
                        <div
                            class="absolute left-0 top-full mt-1 bg-cl-surface border border-cl-border rounded overflow-hidden shadow-lg z-50 min-w-[160px]"
                            role="menu"
                            tabindex="-1"
                            onkeydown={(e) => {
                                const items = moreContainer?.querySelectorAll<HTMLAnchorElement>('a[role="menuitem"]');
                                if (!items || items.length === 0) return;
                                const list = Array.from(items);
                                const idx = list.indexOf(document.activeElement as HTMLAnchorElement);
                                if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    const next = list[(idx + 1 + list.length) % list.length];
                                    next?.focus();
                                } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    const prev = list[(idx - 1 + list.length) % list.length];
                                    prev?.focus();
                                } else if (e.key === 'Home') {
                                    e.preventDefault();
                                    list[0]?.focus();
                                } else if (e.key === 'End') {
                                    e.preventDefault();
                                    list[list.length - 1]?.focus();
                                }
                            }}
                        >
                            {#each moreLinks as link}
                                <a
                                    href={link.href}
                                    class="block px-3 py-1.5 text-xs font-medium text-cl-muted hover:text-cl-text hover:bg-cl-elevated transition-colors duration-150 focus:outline-none focus:bg-cl-elevated"
                                    role="menuitem"
                                    target={link.external ? '_blank' : undefined}
                                    rel={link.external ? 'noopener noreferrer' : undefined}
                                    onclick={() => (isMoreOpen = false)}
                                >
                                    {$t(link.labelKey)}
                                </a>
                            {/each}
                        </div>
                    {/if}
                </div>
            </nav>
        </div>

        <div class="flex items-center gap-3 shrink-0">
            <div class="hidden sm:flex items-center gap-3">
                <ThemeSwitcher />
                <LanguageSwitcher />
            </div>

            <!-- CTA buttons on desktop -->
            <a
                href="/install"
                class="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium rounded px-3 py-1.5 bg-cl-text text-cl-accent-inverse hover:opacity-90 transition-opacity"
                data-sveltekit-prefetch
            >
                <IconDownload class="h-3.5 w-3.5" /> {$t('nav.download')}
            </a>
            <a
                href="https://accounts.cubiclauncher.org"
                target="_blank"
                rel="noopener noreferrer"
                class="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-cl-text bg-cl-elevated border border-cl-border hover:border-cl-border-hover hover:bg-cl-hover rounded px-3 py-1.5 transition-colors duration-150"
            >
                <IconUser class="h-3.5 w-3.5" /> {$t('nav.accounts')}
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
                {#each moreLinks as link}
                    <a
                        href={link.href}
                        class="block px-4 py-2 text-xs font-medium text-cl-muted hover:text-cl-text hover:bg-cl-elevated transition-colors duration-150"
                        onclick={closeMobileMenu}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                        {$t(link.labelKey)}
                    </a>
                {/each}
                <div class="px-4 py-2 flex items-center justify-between border-t border-cl-border mt-1 sticky bottom-0 bg-cl-base">
                    <div class="flex items-center gap-2">
                        <a
                            href="/install"
                            class="inline-flex items-center gap-1.5 text-xs font-medium rounded px-3 py-1.5 bg-cl-text text-cl-accent-inverse hover:opacity-90 transition-opacity"
                            onclick={closeMobileMenu}
                        >
                            <IconDownload class="h-3.5 w-3.5" /> {$t('nav.download')}
                        </a>
                        <a
                            href="https://accounts.cubiclauncher.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 text-xs font-medium text-cl-text bg-cl-elevated border border-cl-border hover:border-cl-border-hover hover:bg-cl-hover rounded px-3 py-1.5 transition-colors duration-150"
                            onclick={closeMobileMenu}
                        >
                            <IconUser class="h-3.5 w-3.5" /> {$t('nav.accounts')}
                        </a>
                    </div>
                    <div class="flex items-center gap-3">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                    </div>
                </div>
            </nav>
        </div>
    </div>
{/if}
