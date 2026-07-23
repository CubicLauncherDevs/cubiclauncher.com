<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { goto, pushState } from "$app/navigation";
  import { t } from "$lib/i18n";
  import type { Theme, ThemePackage } from "$lib/types/theme";
  import {
    fetchAllThemes,
    getCachedThemes,
    setCachedThemes,
  } from "$lib/utils/themes";
  import {
    fetchAllPackages,
    getCachedPackages,
    setCachedPackages,
  } from "$lib/utils/theme-packages";
  import {
    buildSearchIndex,
    searchThemes,
    getAuthorEntries,
    slugify,
  } from "$lib/utils/theme-search";
  import ThemeCard from "./ThemeCard.svelte";
  import PackageCard from "./PackageCard.svelte";
  import IconMagnifyingGlass from "~icons/ph/magnifying-glass";
  import IconX from "~icons/ph/x";
  import IconImage from "~icons/ph/image";
  import IconCaretDown from "~icons/ph/caret-down";

  let themes = $state<Theme[]>([]);
  let packages = $state<ThemePackage[]>([]);
  let loading = $state(true);
  let packagesLoading = $state(true);
  let error = $state("");
  let packagesError = $state("");
  let hasCached = $state(false);
  let hasPackagesCached = $state(false);

  type Tab = "themes" | "packages";
  let activeTab = $state<Tab>("themes");

  let searchQuery = $state("");
  let debouncedQuery = $state("");
  let authorQuery = $state("");
  let authorDropdownOpen = $state(false);
  type SortOption = "name-asc" | "name-desc" | "author-asc" | "author-desc" | "date-desc" | "date-asc";
  let sortBy = $state<SortOption>("date-desc");

  let sortDropdownOpen = $state(false);
  let sortDropdownRef = $state<HTMLDivElement | null>(null);
  let authorDropdownRef = $state<HTMLDivElement | null>(null);
  let authorInputRef = $state<HTMLInputElement | null>(null);
  let searchDropdownRef = $state<HTMLDivElement | null>(null);
  let searchFocused = $state(false);

  const ITEMS_PER_PAGE = 6;
  const MAX_SEARCH_SUGGESTIONS = 5;
  let currentPage = $state(1);

  const searchIndex = $derived(buildSearchIndex(themes));
  const authorEntries = $derived(getAuthorEntries(themes));

  const filteredThemes = $derived.by(() => {
    let result = themes;

    if (debouncedQuery.trim()) {
      result = searchThemes(debouncedQuery, searchIndex);
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

  const filteredPackages = $derived.by(() => {
    let result = packages;

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = packages.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
      );
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

  const searchSuggestions = $derived.by(() => {
    if (!searchFocused || !searchQuery.trim()) return [];
    return searchThemes(searchQuery, searchIndex).slice(0, MAX_SEARCH_SUGGESTIONS);
  });

  const suggestedThemes = $derived.by(() => {
    if (!searchFocused) return [];
    return [...themes]
      .sort((a, b) => {
        if (!a.date && !b.date) return a.name.localeCompare(b.name);
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
      })
      .slice(0, MAX_SEARCH_SUGGESTIONS);
  });

  const totalPages = $derived(
    Math.max(
      1,
      Math.ceil(
        (activeTab === "themes" ? filteredThemes.length : filteredPackages.length) / ITEMS_PER_PAGE
      )
    )
  );

  const paginatedItems = $derived(
    activeTab === "themes"
      ? filteredThemes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
      : filteredPackages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  );

  const totalItems = $derived(activeTab === "themes" ? filteredThemes.length : filteredPackages.length);

  const paginationStart = $derived((currentPage - 1) * ITEMS_PER_PAGE + 1);
  const paginationEnd = $derived(Math.min(currentPage * ITEMS_PER_PAGE, totalItems));

  const hasActiveFilters = $derived(debouncedQuery || sortBy !== "date-desc");

  const filteredAuthors = $derived.by(() => {
    if (!authorDropdownOpen || !authorQuery.trim()) return [];
    const q = authorQuery.toLowerCase();
    return authorEntries
      .filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.slug.includes(slugify(authorQuery))
      )
      .slice(0, 8);
  });

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function updateUrlParams() {
    const url = new URL($page.url);
    if (activeTab === "packages") {
      url.searchParams.set("tab", "packages");
    } else {
      url.searchParams.delete("tab");
    }
    if (debouncedQuery.trim()) {
      url.searchParams.set("search", debouncedQuery.trim());
    } else {
      url.searchParams.delete("search");
    }
    if (currentPage > 1) {
      url.searchParams.set("page", String(currentPage));
    } else {
      url.searchParams.delete("page");
    }
    url.searchParams.delete("author");
    pushState(url, {});
  }

  function setSearch(value: string) {
    searchQuery = value;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debouncedQuery = value;
      currentPage = 1;
      updateUrlParams();
    }, 200);
  }

  function clearFilters() {
    if (debounceTimer) clearTimeout(debounceTimer);
    searchQuery = "";
    debouncedQuery = "";
    authorQuery = "";
    sortBy = "date-desc";
    currentPage = 1;
    updateUrlParams();
  }

  function clearSearch() {
    if (debounceTimer) clearTimeout(debounceTimer);
    searchQuery = "";
    debouncedQuery = "";
    searchFocused = false;
    currentPage = 1;
    updateUrlParams();
  }

  function goToPage(pageNum: number) {
    if (pageNum < 1 || pageNum > totalPages) return;
    currentPage = pageNum;
    updateUrlParams();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectAuthor(authorName: string) {
    authorDropdownOpen = false;
    authorQuery = "";
    goto(`/themes/author/${slugify(authorName)}`);
  }

  function selectSearchSuggestion(themeId: string) {
    searchFocused = false;
    window.location.href = `/themes/${themeId}`;
  }

  function closeDropdowns() {
    authorDropdownOpen = false;
    sortDropdownOpen = false;
  }

  function setTab(tab: Tab) {
    activeTab = tab;
    currentPage = 1;
    updateUrlParams();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  onMount(async () => {
    const url = $page.url;

    const urlAuthor = url.searchParams.get("author");
    if (urlAuthor) {
      goto(`/themes/author/${slugify(urlAuthor)}`, { replaceState: true });
      return;
    }

    const urlTab = url.searchParams.get("tab");
    if (urlTab === "packages") {
      activeTab = "packages";
    }

    const urlSearch = url.searchParams.get("search");
    const urlPage = url.searchParams.get("page");

    if (urlSearch) {
      searchQuery = urlSearch;
      debouncedQuery = urlSearch;
    }
    if (urlPage) {
      currentPage = Math.max(1, parseInt(urlPage, 10) || 1);
    }

    // Load themes
    const cachedThemes = await getCachedThemes();
    if (cachedThemes) {
      themes = cachedThemes;
      hasCached = true;
      loading = false;
    }

    try {
      const freshThemes = await fetchAllThemes();
      themes = freshThemes;
      await setCachedThemes(freshThemes);
    } catch (e) {
      if (!cachedThemes) {
        error = e instanceof Error ? e.message : "Error al cargar los temas";
      }
    } finally {
      loading = false;
    }

    // Load packages
    const cachedPackages = await getCachedPackages();
    if (cachedPackages) {
      packages = cachedPackages;
      hasPackagesCached = true;
      packagesLoading = false;
    }

    try {
      const freshPackages = await fetchAllPackages();
      packages = freshPackages;
      await setCachedPackages(freshPackages);
    } catch (e) {
      if (!cachedPackages) {
        packagesError = e instanceof Error ? e.message : "Error al cargar los paquetes";
      }
    } finally {
      packagesLoading = false;
    }
  });

  $effect(() => {
    if (!authorDropdownOpen && !sortDropdownOpen && !searchFocused) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (sortDropdownRef && !sortDropdownRef.contains(target)) {
        sortDropdownOpen = false;
      }
      if (authorDropdownRef && !authorDropdownRef.contains(target)) {
        authorDropdownOpen = false;
      }
      if (searchDropdownRef && !searchDropdownRef.contains(target)) {
        searchFocused = false;
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  });

  const sortOptions: { value: SortOption; labelKey: string }[] = [
    { value: "date-desc", labelKey: "themes.sortByDateNewest" },
    { value: "date-asc", labelKey: "themes.sortByDateOldest" },
    { value: "name-asc", labelKey: "themes.sortByNameAZ" },
    { value: "name-desc", labelKey: "themes.sortByNameZA" },
    { value: "author-asc", labelKey: "themes.sortByAuthorAZ" },
    { value: "author-desc", labelKey: "themes.sortByAuthorDesc" },
  ];

  onDestroy(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
  });
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

    <!-- Tabs -->
    <div class="flex justify-center mb-8">
      <div class="inline-flex bg-neutral-900 border border-white/10 rounded-full p-1">
        <button
          onclick={() => setTab("themes")}
          class="px-5 py-2 text-xs font-medium rounded-full transition-all {activeTab === 'themes' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}"
        >
          {$t('themes.tabThemes')}
        </button>
        <button
          onclick={() => setTab("packages")}
          class="px-5 py-2 text-xs font-medium rounded-full transition-all {activeTab === 'packages' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}"
        >
          {$t('themes.tabPackages')}
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="max-w-3xl mx-auto mb-8" bind:this={searchDropdownRef}>
      <div class="group relative">
        <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <IconMagnifyingGlass class="w-6 h-6 text-neutral-400 group-focus-within:text-white transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          oninput={(e) => setSearch(e.currentTarget.value)}
          onfocus={() => searchFocused = true}
          placeholder={$t('themes.searchPlaceholder')}
          class="w-full bg-neutral-900/80 backdrop-blur-sm border border-white/10 rounded-2xl pl-14 pr-12 py-4 text-base text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 focus:bg-neutral-800/90 focus:ring-4 focus:ring-white/5 transition-all shadow-lg shadow-black/20"
        />
        {#if searchQuery}
          <button
            onclick={clearSearch}
            class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-500 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={$t('themes.clearSearch')}
          >
            <IconX class="w-5 h-5" />
          </button>
        {/if}

        <!-- Search suggestions dropdown -->
        {#if searchFocused && activeTab === "themes"}
          <div class="absolute top-full left-0 right-0 mt-2 z-30 bg-neutral-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {#snippet suggestionRow(theme: Theme)}
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
                      <IconImage class="w-4 h-4" />
                    </div>
                  {/if}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-white truncate">{theme.name}</p>
                  <p class="text-xs text-neutral-500 truncate">{theme.author} · {theme.latestVersion}</p>
                </div>
              </a>
            {/snippet}

            {#if searchQuery.trim()}
              {#if searchSuggestions.length > 0}
                <div class="py-2">
                  {#each searchSuggestions as theme}
                    {@render suggestionRow(theme)}
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
            {:else}
              <div class="px-4 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Suggested themes
              </div>
              <div class="py-2">
                {#each suggestedThemes as theme}
                  {@render suggestionRow(theme)}
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Author search with autocomplete -->
        {#if activeTab === "themes"}
          <div class="relative" bind:this={authorDropdownRef}>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconMagnifyingGlass class="w-4 h-4 text-neutral-500" />
              </div>
              <input
                bind:this={authorInputRef}
                type="text"
                bind:value={authorQuery}
                onfocus={() => authorDropdownOpen = true}
                placeholder={$t('themes.author')}
                class="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors w-48"
              />
              {#if authorQuery}
                <button
                  onclick={() => { authorQuery = ""; authorInputRef?.focus(); }}
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-neutral-500 hover:text-white transition-colors"
                  aria-label={$t('themes.clearSearch')}
                >
                  <IconX class="w-3.5 h-3.5" />
                </button>
              {/if}
            </div>

            {#if authorDropdownOpen}
              <div class="absolute left-0 top-full mt-2 z-20 w-64 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                <div class="max-h-64 overflow-y-auto py-1">
                  {#each filteredAuthors as author}
                    <button
                      onclick={() => selectAuthor(author.name)}
                      class="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-neutral-400 hover:text-white hover:bg-white/5"
                    >
                      <span>{author.name}</span>
                      <span class="text-neutral-600">{author.count}</span>
                    </button>
                  {:else}
                    {#if authorQuery.trim()}
                      <div class="px-3 py-2 text-xs text-neutral-500">
                        {$t('themes.noResults')}
                      </div>
                    {:else}
                      {#each authorEntries.slice(0, 8) as author}
                        <button
                          onclick={() => selectAuthor(author.name)}
                          class="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-neutral-400 hover:text-white hover:bg-white/5"
                        >
                          <span>{author.name}</span>
                          <span class="text-neutral-600">{author.count}</span>
                        </button>
                      {/each}
                    {/if}
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}

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
            <IconCaretDown class="w-3.5 h-3.5 text-neutral-500 {sortDropdownOpen ? 'rotate-180' : ''} transition-transform" />
          </button>

          {#if sortDropdownOpen}
            <div class="absolute left-0 top-full mt-2 z-20 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              <div class="py-1">
                {#each sortOptions as opt}
                  <button
                    onclick={() => { sortBy = opt.value; sortDropdownOpen = false; updateUrlParams(); }}
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
        {$t('themes.showing', { values: { start: paginationStart, end: paginationEnd, total: totalItems } })}
      </div>
    </div>

    <!-- Active filter chips -->
    {#if hasActiveFilters}
      <div class="flex flex-wrap items-center gap-2 mb-8">
        {#if searchQuery || debouncedQuery}
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-white">
            <span class="text-neutral-400">{$t('themes.search')}:</span> "{debouncedQuery || searchQuery}"
            <button onclick={clearSearch} class="hover:text-white/60 transition-colors ml-0.5" aria-label={$t('themes.clearSearchText')}>
              <IconX class="w-3 h-3" />
            </button>
          </span>
        {/if}
      </div>
    {/if}

    <!-- Grid -->
    <div>
      {#if (activeTab === "themes" && error && themes.length === 0) || (activeTab === "packages" && packagesError && packages.length === 0)}
        <div class="text-center py-20">
          <p class="text-neutral-500 mb-6">{activeTab === "themes" ? error : packagesError}</p>
          <button
            onclick={() => location.reload()}
            class="bg-white text-black px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all"
          >
            {$t('themeDetail.retry')}
          </button>
        </div>
      {:else if (activeTab === "themes" && loading && !hasCached) || (activeTab === "packages" && packagesLoading && !hasPackagesCached)}
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
      {:else if activeTab === "themes" && filteredThemes.length === 0 && !loading}
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
      {:else if activeTab === "packages" && filteredPackages.length === 0 && !packagesLoading}
        <div class="text-center py-20">
          <p class="text-neutral-400 text-lg mb-2">{$t('themes.noPackages')}</p>
          <p class="text-sm text-neutral-600 mb-8">{$t('themes.noPackagesHint')}</p>
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
          {#each paginatedItems as item, i (activeTab === "themes" ? (item as Theme).id : (item as ThemePackage).slug)}
            <div class="card-enter" style="animation-delay: {i * 80}ms">
              {#if activeTab === "themes"}
                <ThemeCard theme={item as Theme} />
              {:else}
                <PackageCard pkg={item as ThemePackage} />
              {/if}
            </div>
          {/each}
        </div>

        <!-- Pagination -->
        {#if totalPages > 1}
          <div class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-xs text-neutral-500 hidden sm:block">
              {$t('themes.showing', { values: { start: paginationStart, end: paginationEnd, total: totalItems } })}
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
    {#if activeTab === "themes" && (!loading || hasCached)}
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
