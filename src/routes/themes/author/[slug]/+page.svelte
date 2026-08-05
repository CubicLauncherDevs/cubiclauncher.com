<script lang="ts">
  import { page } from "$app/stores";
  import { t } from "$lib/i18n";
  import type { AuthorEntry, Theme } from "$lib/types/theme";
  import ThemeCard from "$lib/components/themes/ThemeCard.svelte";
  import IconArrowLeft from "~icons/ph/arrow-left";

  let { data } = $props();
  let author = $derived(data.author);

  let canonicalUrl = $derived($page.url.href.split('?')[0]);

  const ITEMS_PER_PAGE = 12;
  let currentPage = $state(1);

  let totalPages = $derived(Math.max(1, Math.ceil((author?.themes.length ?? 0) / ITEMS_PER_PAGE)));

  let paginatedThemes = $derived(
    (author?.themes ?? []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  );

  let paginationStart = $derived((currentPage - 1) * ITEMS_PER_PAGE + 1);
  let paginationEnd = $derived(Math.min(currentPage * ITEMS_PER_PAGE, author?.themes.length ?? 0));

  function goToPage(pageNum: number) {
    if (pageNum < 1 || pageNum > totalPages) return;
    currentPage = pageNum;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  let jsonLd = $derived(
    author
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: author.name,
            url: canonicalUrl
          }
        })
      : null
  );
</script>

<svelte:head>
  <title>{author ? `${author.name} - Themes - CubicLauncher` : "Author - CubicLauncher"}</title>
  <meta name="description" content={$t('page.themesDesc')} />
  <link rel="canonical" href={canonicalUrl} />
  {#if jsonLd}
    {@html `<script type="application/ld+json">${jsonLd}</script>`}
  {/if}
</svelte:head>

<section class="min-h-screen pt-36 pb-32 bg-neutral-950 text-white">
  <div class="container mx-auto px-6 max-w-6xl">
    <a
      href="/themes"
      class="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors mb-8"
    >
      <IconArrowLeft class="w-4 h-4" />
      {$t('themeDetail.allThemes')}
    </a>

    {#if author}
      <div class="mb-10">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">
          {author.name}
        </h1>
        <p class="text-neutral-400">
          {$t('themes.showing', { values: { start: paginationStart, end: paginationEnd, total: author.themes.length } })}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each paginatedThemes as theme}
          <ThemeCard {theme} />
        {/each}
      </div>

      {#if totalPages > 1}
        <div class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs text-neutral-500 hidden sm:block">
            {$t('themes.showing', { values: { start: paginationStart, end: paginationEnd, total: author.themes.length } })}
          </div>
          <div class="flex items-center gap-2">
            <button
              onclick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              class="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-neutral-400 hover:text-white hover:border-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {$t('themes.previous')}
            </button>

            {#each Array(totalPages) as _, idx}
              {@const pageNum = idx + 1}
              {#if pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)}
                <button
                  onclick={() => goToPage(pageNum)}
                  class="w-8 h-8 rounded-lg text-xs font-medium transition-colors {currentPage === pageNum ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'}"
                >
                  {pageNum}
                </button>
              {:else if pageNum === currentPage - 2 || pageNum === currentPage + 2}
                <span class="text-neutral-600 text-xs px-1">...</span>
              {/if}
            {/each}

            <button
              onclick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              class="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-neutral-400 hover:text-white hover:border-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {$t('themes.next')}
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</section>
