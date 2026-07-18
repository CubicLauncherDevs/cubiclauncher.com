<script lang="ts">
  import { page } from "$app/stores";
  import { t } from "$lib/i18n";
  import type { Theme, AuthorEntry } from "$lib/types/theme";
  import { fetchAllThemes, getCachedThemes, setCachedThemes } from "$lib/utils/themes";
  import { findAuthorBySlug } from "$lib/utils/theme-search";
  import ThemeCard from "$lib/components/themes/ThemeCard.svelte";

  const slug = $derived($page.params.slug as string);

  let themes = $state<Theme[]>([]);
  let author = $state<AuthorEntry | null>(null);
  let loading = $state(true);
  let error = $state("");

  const ITEMS_PER_PAGE = 12;
  let currentPage = $state(1);

  let totalPages = $derived(Math.max(1, Math.ceil((author?.themes.length ?? 0) / ITEMS_PER_PAGE)));

  let paginatedThemes = $derived(
    (author?.themes ?? []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  );

  let paginationStart = $derived((currentPage - 1) * ITEMS_PER_PAGE + 1);
  let paginationEnd = $derived(Math.min(currentPage * ITEMS_PER_PAGE, author?.themes.length ?? 0));

  $effect(() => {
    loadAuthor(slug);
  });

  async function loadAuthor(authorSlug: string) {
    loading = true;
    error = "";

    let data: Theme[] | null = await getCachedThemes();

    if (!data) {
      try {
        data = await fetchAllThemes();
        await setCachedThemes(data);
      } catch (e) {
        error = e instanceof Error ? e.message : "Error loading themes";
        loading = false;
        return;
      }
    }

    themes = data;
    const found = findAuthorBySlug(data, authorSlug);

    if (!found) {
      error = "Author not found";
      loading = false;
      return;
    }

    author = found;
    currentPage = 1;
    loading = false;
  }

  function goToPage(pageNum: number) {
    if (pageNum < 1 || pageNum > totalPages) return;
    currentPage = pageNum;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

<svelte:head>
  <title>{author ? `${author.name} - Themes - CubicLauncher` : "Author - CubicLauncher"}</title>
  <meta name="description" content={$t('page.themesDesc')} />
</svelte:head>

<section class="min-h-screen pt-36 pb-32 bg-neutral-950 text-white">
  <div class="container mx-auto px-6 max-w-6xl">
    <a
      href="/themes"
      class="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors mb-8"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
      {$t('themeDetail.allThemes')}
    </a>

    {#if loading}
      <div class="animate-pulse space-y-6 max-w-4xl mx-auto">
        <div class="h-8 bg-neutral-800 rounded w-64"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each Array(6) as _}
            <div class="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
              <div class="aspect-video bg-neutral-800"></div>
              <div class="p-4 space-y-2">
                <div class="h-4 bg-neutral-800 rounded w-2/3"></div>
                <div class="h-3 bg-neutral-800 rounded w-1/3"></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else if error}
      <div class="text-center py-20">
        <p class="text-neutral-400 text-lg mb-2">{error}</p>
        <a
          href="/themes"
          class="inline-block mt-6 bg-white text-black px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all"
        >
          {$t('themeDetail.viewAll')}
        </a>
      </div>
    {:else if author}
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
