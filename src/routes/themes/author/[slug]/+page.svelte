<script lang="ts">
  import { page } from "$app/stores";
  import { t } from "$lib/i18n";
  import ThemeCard from "$lib/components/themes/ThemeCard.svelte";
  import ThemeListRow from "$lib/components/themes/ThemeListRow.svelte";
  import IconArrowLeft from "~icons/ph/arrow-left";
  import IconList from "~icons/ph/list";
  import IconSquaresFour from "~icons/ph/squares-four";
  import { goToThemesList } from "$lib/utils/theme-history";

  let { data } = $props();
  let author = $derived(data.author);

  let canonicalUrl = $derived($page.url.href.split('?')[0]);

  const ITEMS_PER_PAGE = 12;
  let currentPage = $state(1);
  let viewMode = $state<"grid" | "list">("grid");

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
    {@html `<script type="application/ld+json">${jsonLd}<\/script>`}
  {/if}
</svelte:head>

<section class="min-h-screen pb-16 pt-[calc(var(--navbar-height)+24px)] bg-cl-base text-cl-text">
  <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
    <a
      href="/themes"
      onclick={goToThemesList}
      class="inline-flex items-center gap-1 text-[11px] text-cl-dim hover:text-cl-text transition-colors mb-4"
    >
      <IconArrowLeft class="w-3 h-3" />
      {$t('themeDetail.allThemes')}
    </a>

    {#if author}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 class="text-lg sm:text-xl font-semibold text-white mb-0.5">
            {author.name}
          </h1>
          <p class="text-xs text-cl-muted">
            {$t('themes.showing', { values: { start: paginationStart, end: paginationEnd, total: author.themes.length } })}
          </p>
        </div>

        <div class="inline-flex bg-cl-surface border border-cl-border rounded p-0.5">
          <button
            onclick={() => viewMode = "grid"}
            class="p-1 rounded transition-colors {viewMode === 'grid' ? 'bg-cl-elevated text-white' : 'text-cl-dim hover:text-cl-text'}"
            aria-label="Grid view"
          >
            <IconSquaresFour class="w-3.5 h-3.5" />
          </button>
          <button
            onclick={() => viewMode = "list"}
            class="p-1 rounded transition-colors {viewMode === 'list' ? 'bg-cl-elevated text-white' : 'text-cl-dim hover:text-cl-text'}"
            aria-label="List view"
          >
            <IconList class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {#if viewMode === "grid"}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {#each paginatedThemes as theme}
            <ThemeCard {theme} />
          {/each}
        </div>
      {:else}
        <div class="flex flex-col gap-1.5">
          {#each paginatedThemes as theme}
            <ThemeListRow {theme} />
          {/each}
        </div>
      {/if}

      {#if totalPages > 1}
        <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-[11px] text-cl-dim hidden sm:block">
            {$t('themes.showing', { values: { start: paginationStart, end: paginationEnd, total: author.themes.length } })}
          </div>
          <div class="flex items-center gap-1">
            <button
              onclick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              class="px-2 h-7 rounded text-[11px] font-medium border border-cl-border text-cl-muted hover:text-cl-text hover:border-cl-border-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {$t('themes.previous')}
            </button>

            {#each Array(totalPages) as _, idx}
              {@const pageNum = idx + 1}
              {#if pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)}
                <button
                  onclick={() => goToPage(pageNum)}
                  class="w-7 h-7 rounded text-[11px] font-medium transition-colors {currentPage === pageNum ? 'bg-cl-text text-cl-accent-inverse' : 'text-cl-muted hover:text-cl-text hover:bg-cl-elevated'}"
                >
                  {pageNum}
                </button>
              {:else if pageNum === currentPage - 2 || pageNum === currentPage + 2}
                <span class="text-cl-dim text-[11px] px-0.5">...</span>
              {/if}
            {/each}

            <button
              onclick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              class="px-2 h-7 rounded text-[11px] font-medium border border-cl-border text-cl-muted hover:text-cl-text hover:border-cl-border-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {$t('themes.next')}
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</section>
