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
  let showMobileFilters = $state(false);

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

  let hasActiveFilters = $derived(searchQuery || selectedAuthor);

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
    showMobileFilters = false;
    pushState("/themes", {});
  }
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
    <div class="max-w-2xl mx-auto mb-6">
      <div class="relative">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder={$t('themes.searchPlaceholder')}
          class="w-full bg-neutral-900 border border-white/10 rounded-full pl-12 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/25 focus:bg-neutral-800/80 transition-all"
        />
        {#if searchQuery}
          <button
            onclick={() => searchQuery = ""}
            class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
            aria-label={$t('themes.clearSearch')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        {/if}
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
      <div class="flex items-center gap-2 flex-wrap">
        {#if hasActiveFilters}
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
          <button onclick={clearFilters} class="text-xs text-neutral-500 hover:text-white underline underline-offset-4 decoration-white/20 transition-all">
            {$t('themes.clearAll')}
          </button>
        {:else}
          <span class="text-xs text-neutral-600"></span>
        {/if}
      </div>

      <div class="flex items-center gap-4">
        <div class="relative">
          <select
            bind:value={sortBy}
            class="appearance-none bg-neutral-900 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-xs text-neutral-400 focus:outline-none focus:border-white/25 cursor-pointer transition-colors"
          >
            <option value="date-desc">{$t('themes.sortByDateNewest')}</option>
            <option value="date-asc">{$t('themes.sortByDateOldest')}</option>
            <option value="name-asc">{$t('themes.sortByNameAZ')}</option>
            <option value="name-desc">{$t('themes.sortByNameZA')}</option>
            <option value="author-asc">{$t('themes.sortByAuthorAZ')}</option>
            <option value="author-desc">{$t('themes.sortByAuthorDesc')}</option>
          </select>
          <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
        <button
          onclick={() => showMobileFilters = !showMobileFilters}
          class="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          {$t('themes.filters')}
        </button>
      </div>
    </div>

    <!-- Mobile author filter panel -->
    {#if showMobileFilters}
      <div class="md:hidden mb-8 p-4 rounded-xl bg-neutral-900/80 border border-white/10">
        <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-3">{$t('themes.filterByAuthor')}</h4>
        <div class="flex flex-wrap gap-2">
          <button
            onclick={() => { selectAuthor(""); showMobileFilters = false; }}
            class="px-3 py-1.5 rounded-lg text-xs transition-colors {!selectedAuthor ? 'bg-white/15 text-white' : 'bg-white/5 text-neutral-400 hover:text-white'}"
          >
            {$t('themes.all')}
          </button>
          {#each authors as author}
            <button
              onclick={() => { selectAuthor(author); showMobileFilters = false; }}
              class="px-3 py-1.5 rounded-lg text-xs transition-colors {selectedAuthor === author ? 'bg-white/15 text-white' : 'bg-white/5 text-neutral-400 hover:text-white'}"
            >
              {author}
              <span class="text-neutral-600 ml-1">({authorCounts[author]})</span>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Main Content: Sidebar + Grid -->
    <div class="flex gap-8">
      <!-- Sidebar (desktop) -->
      <aside class="hidden md:block w-48 shrink-0">
        <h3 class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-4">{$t('themes.authors')}</h3>
        <div class="space-y-0.5">
          <button
            onclick={() => selectAuthor("")}
            class="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors {!selectedAuthor ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white hover:bg-white/5'}"
          >
            <span>{$t('themes.all')}</span>
            <span class="text-neutral-600">{themes.length}</span>
          </button>
          {#each authors as author}
            <button
              onclick={() => selectAuthor(author)}
              class="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors {selectedAuthor === author ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white hover:bg-white/5'}"
            >
              <span>{author}</span>
              <span class="text-neutral-600">{authorCounts[author]}</span>
            </button>
          {/each}
        </div>
      </aside>

      <!-- Grid -->
      <div class="flex-1 min-w-0">
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
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {#each Array(6) as _}
              <div class="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden animate-pulse">
                <div class="aspect-video bg-neutral-800"></div>
                <div class="p-4 space-y-2">
                  <div class="h-4 bg-neutral-800 rounded w-2/3"></div>
                  <div class="h-3 bg-neutral-800 rounded w-1/3"></div>
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
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {#each filteredThemes as theme, i}
              <div class="card-enter" style="animation-delay: {i * 80}ms">
                <ThemeCard {theme} />
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Contribute -->
    {#if !loading || hasCached}
      <div class="mt-20 text-center">
        <p class="text-sm text-neutral-500">
          {$t('themes.createYourOwn')}
          <a href="/docs/hacer-themes" class="text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-all">{$t('themes.followGuide')}</a>
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
