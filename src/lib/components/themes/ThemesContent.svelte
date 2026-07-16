<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { pushState } from "$app/navigation";
  import { t } from "$lib/i18n";
  import type { Theme } from "$lib/types/theme";
  import {
    fetchAllThemes,
    getCachedThemes,
    setCachedThemes,
  } from "$lib/utils/themes";
  import ThemeCard from "./ThemeCard.svelte";

  let themes = $state<Theme[]>([]);
  let loading = $state(true);
  let error = $state("");
  let hasCached = $state(false);

  let searchQuery = $state("");
  let selectedAuthor = $state("");
  type SortOption = "name-asc" | "name-desc" | "author-asc" | "author-desc" | "date-desc" | "date-asc";
  let sortBy = $state<SortOption>("date-desc");

  let authorDropdownOpen = $state(false);
  let sortDropdownOpen = $state(false);
  let searchFocused = $state(false);
  let authorDropdownRef = $state<HTMLDivElement | null>(null);
  let sortDropdownRef = $state<HTMLDivElement | null>(null);
  let searchDropdownRef = $state<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 6;
  const MAX_SEARCH_SUGGESTIONS = 5;
  let currentPage = $state(1);

  let authors = $derived(
    [...new Set(themes.map((t) => t.author))].sort((a, b) => a.localeCompare(b))
  );

  let authorCounts = $derived(
    Object.fromEntries(
      authors.map((a) => [a, themes.filter((t) => t.author === a).length])
    )
  );

  let filteredThemes = $derived.by(() => {
    let result = themes;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.author.toLowerCase().includes(q)
      );
    }

    if (selectedAuthor) {
      result = result.filter((t) => t.author === selectedAuthor);
    }

    const sorted = [...result];
    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "author-asc":
        sorted.sort((a, b) => a.author.localeCompare(b.author) || a.name.localeCompare(b.name));
        break;
      case "author-desc":
        sorted.sort((a, b) => b.author.localeCompare(a.author) || a.name.localeCompare(b.name));
        break;
      case "date-desc":
        sorted.sort((a, b) => {
          if (!a.date && !b.date) return a.name.localeCompare(b.name);
          if (!a.date) return 1;
          if (!b.date) return -1;
          return b.date.localeCompare(a.date);
        });
        break;
      case "date-asc":
        sorted.sort((a, b) => {
          if (!a.date && !b.date) return a.name.localeCompare(b.name);
          if (!a.date) return 1;
          if (!b.date) return -1;
          return a.date.localeCompare(b.date);
        });
        break;
    }

    return sorted;
  });

  let searchSuggestions = $derived.by(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return themes
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.author.toLowerCase().includes(q)
      )
      .slice(0, MAX_SEARCH_SUGGESTIONS);
  });

  let totalPages = $derived(Math.max(1, Math.ceil(filteredThemes.length / ITEMS_PER_PAGE)));

  let paginatedThemes = $derived(
    filteredThemes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  );

  let paginationStart = $derived((currentPage - 1) * ITEMS_PER_PAGE + 1);
  let paginationEnd = $derived(Math.min(currentPage * ITEMS_PER_PAGE, filteredThemes.length));

  let hasActiveFilters = $derived(searchQuery || selectedAuthor);

  $effect(() => {
    const _ = searchQuery;
    const __ = selectedAuthor;
    const ___ = sortBy;
    currentPage = 1;
    void _, __, ___;
  });

  $effect(() => {
    if (!authorDropdownOpen && !sortDropdownOpen && !searchFocused) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (authorDropdownRef && !authorDropdownRef.contains(target)) {
        authorDropdownOpen = false;
      }
      if (sortDropdownRef && !sortDropdownRef.contains(target)) {
        sortDropdownOpen = false;
      }
      if (searchDropdownRef && !searchDropdownRef.contains(target)) {
        searchFocused = false;
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  });

  onMount(async () => {
    const urlAuthor = $page.url.searchParams.get("author");
    if (urlAuthor) selectedAuthor = urlAuthor;

    const cached = getCachedThemes();
    if (cached) {
      themes = cached;
      hasCached = true;
    }

    if (!cached) {
      try {
        themes = await fetchAllThemes();
        setCachedThemes(themes);
      } catch (e) {
        error = e instanceof Error ? e.message : "Error al cargar los temas";
      } finally {
        loading = false;
      }
    } else {
      loading = false;
      try {
        const fresh = await fetchAllThemes();
        themes = fresh;
        setCachedThemes(fresh);
      } catch {
        /* silent refresh */
      }
    }
  });

  function selectAuthor(author: string) {
    selectedAuthor = selectedAuthor === author ? "" : author;
    if (selectedAuthor) {
      pushState(`/themes?author=${encodeURIComponent(selectedAuthor)}`, {});
    } else {
      pushState("/themes", {});
    }
  }

  function clearFilters() {
    searchQuery = "";
    selectedAuthor = "";
    pushState("/themes", {});
  }

  function selectSearchSuggestion(themeId: string) {
    searchFocused = false;
    window.location.href = `/themes/${themeId}`;
  }

  function goToPage(pageNum: number) {
    if (pageNum < 1 || pageNum > totalPages) return;
    currentPage = pageNum;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const sortOptions: { value: SortOption; labelKey: string }[] = [
    { value: "date-desc", labelKey: "themes.sortByDateNewest" },
    { value: "date-asc", labelKey: "themes.sortByDateOldest" },
    { value: "name-asc", labelKey: "themes.sortByNameAZ" },
    { value: "name-desc", labelKey: "themes.sortByNameZA" },
    { value: "author-asc", labelKey: "themes.sortByAuthorAZ" },
    { value: "author-desc", labelKey: "themes.sortByAuthorDesc" },
  ];
</script>

<section class="min-h-screen pt-36 pb-32 bg-neutral-950 text-white">
  <div class="container mx-auto px-6 max-w-6xl">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
        {$t('themes.title')}
      </h1>
      <p class="text-base text-neutral-400 font-light max-w-lg mx-auto">
        {$t('themes.description')}
      </p>
    </div>

    <!-- Search Bar -->
    <div class="max-w-3xl mx-auto mb-8" bind:this={searchDropdownRef}>
      <div class="group relative">
        <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg class="w-6 h-6 text-neutral-400 group-focus-within:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input
          type="text"
          bind:value={searchQuery}
          onfocus={() => searchFocused = true}
          placeholder={$t('themes.searchPlaceholder')}
          class="w-full bg-neutral-900/80 backdrop-blur-sm border border-white/10 rounded-2xl pl-14 pr-12 py-4 text-base text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 focus:bg-neutral-800/90 focus:ring-4 focus:ring-white/5 transition-all shadow-lg shadow-black/20"
        />
        {#if searchQuery}
          <button
            onclick={() => searchQuery = ""}
            class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-500 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={$t('themes.clearSearch')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        {/if}

        <!-- Search suggestions dropdown -->
        {#if searchFocused && searchQuery.trim()}
          <div class="absolute top-full left-0 right-0 mt-2 z-30 bg-neutral-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {#if searchSuggestions.length > 0}
              <div class="py-2">
                {#each searchSuggestions as theme}
                  <a
                    href="/themes/{theme.id}"
                    onclick={(e) => { e.preventDefault(); selectSearchSuggestion(theme.id); }}
                    class="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                  >
                    <div class="w-12 h-8 rounded-md bg-neutral-800 overflow-hidden shrink-0">
                      {#if theme.previewUrl}
                        <img src={theme.previewUrl} alt={theme.name} class="w-full h-full object-cover" />
                      {:else}
                        <div class="w-full h-full flex items-center justify-center text-neutral-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                          </svg>
                        </div>
                      {/if}
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-white truncate">{theme.name}</p>
                      <p class="text-xs text-neutral-500 truncate">{theme.author} · {theme.latestVersion}</p>
                    </div>
                  </a>
                {/each}
              </div>
              <div class="border-t border-white/5 px-4 py-2">
                <button
                  onclick={() => searchFocused = false}
                  class="text-xs text-neutral-500 hover:text-white transition-colors"
                >
                  {$t('themes.results', { values: { count: filteredThemes.length } })} · {$t('themes.clearSearch')}
                </button>
              </div>
            {:else}
              <div class="px-4 py-4 text-sm text-neutral-500">
                {$t('themes.noResults')}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Author dropdown -->
        <div class="relative" bind:this={authorDropdownRef}>
          <button
            onclick={() => authorDropdownOpen = !authorDropdownOpen}
            class="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white transition-colors"
            aria-haspopup="listbox"
            aria-expanded={authorDropdownOpen}
          >
            <span class="text-neutral-500">{$t('themes.author')}:</span>
            <span>{selectedAuthor || $t('themes.all')}</span>
            <svg class="w-3.5 h-3.5 text-neutral-500 {authorDropdownOpen ? 'rotate-180' : ''} transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {#if authorDropdownOpen}
            <div class="absolute left-0 top-full mt-2 z-20 w-56 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              <div class="max-h-64 overflow-y-auto py-1">
                <button
                  onclick={() => { selectAuthor(""); authorDropdownOpen = false; }}
                  class="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors {!selectedAuthor ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'}"
                >
                  <span>{$t('themes.all')}</span>
                  <span class="text-neutral-600">{themes.length}</span>
                </button>
                {#each authors as author}
                  <button
                    onclick={() => { selectAuthor(author); authorDropdownOpen = false; }}
                    class="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors {selectedAuthor === author ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'}"
                  >
                    <span>{author}</span>
                    <span class="text-neutral-600">{authorCounts[author]}</span>
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Sort dropdown -->
        <div class="relative" bind:this={sortDropdownRef}>
          <button
            onclick={() => sortDropdownOpen = !sortDropdownOpen}
            class="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white transition-colors"
            aria-haspopup="listbox"
            aria-expanded={sortDropdownOpen}
          >
            <span class="text-neutral-500">{$t('themes.sortBy')}:</span>
            {#each sortOptions as opt}
              {#if sortBy === opt.value}
                <span>{$t(opt.labelKey)}</span>
              {/if}
            {/each}
            <svg class="w-3.5 h-3.5 text-neutral-500 {sortDropdownOpen ? 'rotate-180' : ''} transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {#if sortDropdownOpen}
            <div class="absolute left-0 top-full mt-2 z-20 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              <div class="py-1">
                {#each sortOptions as opt}
                  <button
                    onclick={() => { sortBy = opt.value; sortDropdownOpen = false; }}
                    class="w-full text-left px-3 py-2 text-xs transition-colors {sortBy === opt.value ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'}"
                  >
                    {$t(opt.labelKey)}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        {#if hasActiveFilters}
          <button
            onclick={clearFilters}
            class="text-xs text-neutral-500 hover:text-white underline underline-offset-4 decoration-white/20 transition-all"
          >
            {$t('themes.clearAll')}
          </button>
        {/if}
      </div>

      <div class="text-xs text-neutral-500">
        {$t('themes.showing', { values: { start: paginationStart, end: paginationEnd, total: filteredThemes.length } })}
      </div>
    </div>

    <!-- Active filter chips -->
    {#if hasActiveFilters}
      <div class="flex flex-wrap items-center gap-2 mb-8">
        {#if selectedAuthor}
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-white">
            <span class="text-neutral-400">{$t('themes.author')}:</span> {selectedAuthor}
            <button onclick={() => selectAuthor("")} class="hover:text-white/60 transition-colors ml-0.5" aria-label={$t('themes.removeAuthorFilter')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        {/if}
        {#if searchQuery}
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-white">
            <span class="text-neutral-400">{$t('themes.search')}:</span> "{searchQuery}"
            <button onclick={() => searchQuery = ""} class="hover:text-white/60 transition-colors ml-0.5" aria-label={$t('themes.clearSearchText')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        {/if}
      </div>
    {/if}

    <!-- Grid -->
    <div>
      {#if error && themes.length === 0}
        <div class="text-center py-20">
          <p class="text-neutral-500 mb-6">{error}</p>
          <button
            onclick={() => location.reload()}
            class="bg-white text-black px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all"
          >
            {$t('themeDetail.retry')}
          </button>
        </div>
      {:else if loading && !hasCached}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each Array(6) as _}
            <div class="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden animate-pulse">
              <div class="aspect-video bg-neutral-800"></div>
              <div class="p-4 space-y-2">
                <div class="h-4 bg-neutral-800 rounded w-2/3"></div>
                <div class="h-3 bg-neutral-800 rounded w-1/3"></div>
                <div class="h-8 bg-neutral-800 rounded w-full mt-4"></div>
              </div>
            </div>
          {/each}
        </div>
      {:else if filteredThemes.length === 0 && !loading}
        <div class="text-center py-20">
          <p class="text-neutral-400 text-lg mb-2">{$t('themes.noResults')}</p>
          <p class="text-sm text-neutral-600 mb-8">{$t('themes.noResultsHint')}</p>
          {#if hasActiveFilters}
            <button
              onclick={clearFilters}
              class="bg-white text-black px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all"
            >
              {$t('themes.clearFilters')}
            </button>
          {/if}
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each paginatedThemes as theme, i}
            <div class="card-enter" style="animation-delay: {i * 80}ms">
              <ThemeCard {theme} />
            </div>
          {/each}
        </div>

        <!-- Pagination -->
        {#if totalPages > 1}
          <div class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-xs text-neutral-500 hidden sm:block">
              {$t('themes.showing', { values: { start: paginationStart, end: paginationEnd, total: filteredThemes.length } })}
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

    <!-- Contribute -->
    {#if !loading || hasCached}
      <div class="mt-20 text-center">
        <p class="text-sm text-neutral-500">
          {$t('themes.createYourOwn')}
          <a href="https://dev.cubiclauncher.org/docs/es-ES/guias/hacer-themes" class="text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-all">{$t('themes.followGuide')}</a>
          {$t('themes.shareOn')}
          <a href="https://github.com/CubicLauncherDevs/Themes" target="_blank" rel="noopener noreferrer" class="text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-all">GitHub</a>.
        </p>
      </div>
    {/if}
  </div>
</section>

<style>
  @keyframes card-enter {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .card-enter {
    animation: card-enter 0.4s ease-out both;
  }
</style>
