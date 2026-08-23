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
    getThemeVerification,
  } from "$lib/utils/themes";
  import {
    fetchAllPackages,
    getCachedPackages,
    setCachedPackages,
  } from "$lib/utils/theme-packages";
  import { clearThemeCache } from "$lib/utils/theme-cache";
  import { saveThemesListUrl } from "$lib/utils/theme-history";
  import {
    buildSearchIndex,
    searchThemes,
    getAuthorEntries,
    slugify,
    sortItems,
    SORT_LABEL_KEYS,
    type SortOption,
  } from "$lib/utils/theme-search";
  import ThemeCard from "./ThemeCard.svelte";
  import ThemeListRow from "./ThemeListRow.svelte";
  import PackageCard from "./PackageCard.svelte";
  import VerifiedBadge from "./VerifiedBadge.svelte";
  import IconMagnifyingGlass from "~icons/ph/magnifying-glass";
  import IconX from "~icons/ph/x";
  import IconImage from "~icons/ph/image";
  import IconCaretDown from "~icons/ph/caret-down";
  import IconArrowsClockwise from "~icons/ph/arrows-clockwise";
  import IconSquaresFour from "~icons/ph/squares-four";
  import IconList from "~icons/ph/list";

  let {
    initialThemes,
    initialPackages,
  }: {
    initialThemes?: Theme[];
    initialPackages?: ThemePackage[];
  } = $props();

  let themes = $state<Theme[]>(initialThemes ?? []);
  let packages = $state<ThemePackage[]>(initialPackages ?? []);
  let loading = $state(!initialThemes);
  let packagesLoading = $state(!initialPackages);
  let error = $state("");
  let packagesError = $state("");
  let hasCached = $state(!!initialThemes);
  let hasPackagesCached = $state(!!initialPackages);
  let refreshing = $state(false);
  let refreshRotation = $state(0);
  const REFRESH_SPIN_DURATION_MS = 800;

  type Tab = "themes" | "packages";
  let activeTab = $state<Tab>("themes");
  type ViewMode = "grid" | "list";
  let viewMode = $state<ViewMode>("grid");

  let searchQuery = $state("");
  let debouncedQuery = $state("");
  let authorQuery = $state("");
  let authorDropdownOpen = $state(false);
  let sortBy = $state<SortOption>("date-desc");

  let sortDropdownOpen = $state(false);
  let sortDropdownRef = $state<HTMLDivElement | null>(null);
  let authorDropdownRef = $state<HTMLDivElement | null>(null);
  let authorInputRef = $state<HTMLInputElement | null>(null);
  let searchDropdownRef = $state<HTMLDivElement | null>(null);
  let searchFocused = $state(false);

  const ITEMS_PER_PAGE_GRID = 6;
  const ITEMS_PER_PAGE_LIST = 8;
  let currentPage = $state(1);

  const searchIndex = $derived(buildSearchIndex(themes));
  const authorEntries = $derived(getAuthorEntries(themes));

  const itemsPerPage = $derived(activeTab === "packages" || viewMode === "grid" ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST);

  const filteredThemes = $derived.by(() => {
    let result = themes;

    if (debouncedQuery.trim()) {
      result = searchThemes(debouncedQuery, searchIndex);
    }

    return sortItems(result, sortBy);
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

    return sortItems(result, sortBy);
  });

  const searchSuggestions = $derived.by(() => {
    if (!searchFocused || !searchQuery.trim()) return [];
    return searchThemes(searchQuery, searchIndex).slice(0, 5);
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
      .slice(0, 5);
  });

  const totalPages = $derived(
    Math.max(
      1,
      Math.ceil(
        (activeTab === "themes" ? filteredThemes.length : filteredPackages.length) / itemsPerPage
      )
    )
  );

  const paginatedItems = $derived(
    activeTab === "themes"
      ? filteredThemes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : filteredPackages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  );

  const totalItems = $derived(activeTab === "themes" ? filteredThemes.length : filteredPackages.length);

  const paginationStart = $derived((currentPage - 1) * itemsPerPage + 1);
  const paginationEnd = $derived(Math.min(currentPage * itemsPerPage, totalItems));

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
    saveThemesListUrl(url.pathname + url.search);
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

  function setViewMode(mode: ViewMode) {
    viewMode = mode;
    currentPage = 1;
  }

  async function loadThemes(force = false) {
    if (force) {
      loading = true;
    }
    const cachedThemes = await getCachedThemes();
    if (cachedThemes && mounted) {
      themes = cachedThemes;
      hasCached = true;
      loading = false;
    }
    try {
      const freshThemes = await fetchAllThemes();
      if (mounted) {
        themes = freshThemes;
        await setCachedThemes(freshThemes);
      }
    } catch (e) {
      if (!cachedThemes && mounted) {
        error = e instanceof Error ? e.message : "Error al cargar los temas";
      }
    } finally {
      if (mounted) loading = false;
    }
  }

  async function loadPackages(force = false) {
    if (force) {
      packagesLoading = true;
    }
    const cachedPackages = await getCachedPackages();
    if (cachedPackages && mounted) {
      packages = cachedPackages;
      hasPackagesCached = true;
      packagesLoading = false;
    }
    try {
      const freshPackages = await fetchAllPackages();
      if (mounted) {
        packages = freshPackages;
        await setCachedPackages(freshPackages);
      }
    } catch (e) {
      if (!cachedPackages && mounted) {
        packagesError = e instanceof Error ? e.message : "Error al cargar los paquetes";
      }
    } finally {
      if (mounted) packagesLoading = false;
    }
  }

  async function refreshAll() {
    if (refreshing) return;
    refreshing = true;
    refreshRotation += 360;
    error = "";
    packagesError = "";
    await clearThemeCache();
    await loadThemes(true);
    await loadPackages(true);
    refreshing = false;
  }

  let mounted = false;

  onMount(() => {
    mounted = true;

    const url = $page.url;

    const urlAuthor = url.searchParams.get("author");
    if (urlAuthor) {
      goto(`/themes/author/${slugify(urlAuthor)}`, { replaceState: true });
      return () => { mounted = false; };
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

    saveThemesListUrl(url.pathname + url.search);

    (async () => {
      if (!initialThemes) {
        await loadThemes();
      }
      if (!initialPackages) {
        await loadPackages();
      }
    })();

    return () => { mounted = false; };
  });

  $effect(() => {
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

  const sortOptions: SortOption[] = [
    "date-desc",
    "date-asc",
    "name-asc",
    "name-desc",
    "author-asc",
    "author-desc",
  ];

  onDestroy(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
  });
</script>

<section class="min-h-screen pb-16 pt-[calc(var(--navbar-height)+24px)] bg-cl-base text-cl-text">
  <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
    <!-- Header -->
    <div class="mb-5">
      <div class="flex items-center gap-3 mb-1">
        <h1 class="text-lg sm:text-xl font-semibold text-white">
          {$t('themes.title')}
        </h1>
        <span class="text-[11px] text-cl-muted">({totalItems})</span>
      </div>
      <p class="text-xs text-cl-muted max-w-lg">
        {$t('themes.description')}
      </p>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col gap-3 mb-4">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <!-- Tabs -->
        <div class="inline-flex bg-cl-surface border border-cl-border rounded p-0.5">
          <button
            onclick={() => setTab("themes")}
            class="px-3 py-1 text-xs font-medium rounded transition-colors {activeTab === 'themes' ? 'bg-cl-elevated text-white border border-cl-border' : 'text-cl-muted hover:text-cl-text'}"
          >
            {$t('themes.tabThemes')}
          </button>
          <button
            onclick={() => setTab("packages")}
            class="px-3 py-1 text-xs font-medium rounded transition-colors {activeTab === 'packages' ? 'bg-cl-elevated text-white border border-cl-border' : 'text-cl-muted hover:text-cl-text'}"
          >
            {$t('themes.tabPackages')}
          </button>
        </div>

        <!-- Search Bar -->
        <div class="flex-1 min-w-0" bind:this={searchDropdownRef}>
          <div class="group relative">
            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <IconMagnifyingGlass class="w-3.5 h-3.5 text-cl-dim group-focus-within:text-cl-muted transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              oninput={(e) => setSearch(e.currentTarget.value)}
              onfocus={() => searchFocused = true}
              placeholder={$t('themes.searchPlaceholder')}
              class="w-full h-7 bg-cl-surface border border-cl-border rounded pl-8 pr-7 text-xs text-cl-text placeholder-cl-dim focus:outline-none focus:border-cl-border-hover focus:bg-cl-elevated transition-all"
            />
            {#if searchQuery}
              <button
                onclick={clearSearch}
                class="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-cl-dim hover:text-cl-text hover:bg-cl-elevated transition-colors"
                aria-label={$t('themes.clearSearch')}
              >
                <IconX class="w-3 h-3" />
              </button>
            {/if}

            <!-- Search suggestions dropdown -->
            {#if searchFocused && activeTab === "themes"}
              <div class="absolute top-full left-0 right-0 mt-1 z-30 bg-cl-surface border border-cl-border rounded shadow-lg shadow-black/20 overflow-hidden">
                {#snippet suggestionRow(theme: Theme)}
                  <a
                    href="/themes/{theme.id}"
                    onclick={(e) => { e.preventDefault(); selectSearchSuggestion(theme.id); }}
                    class="flex items-center gap-2.5 px-2.5 py-2 hover:bg-cl-elevated transition-colors"
                  >
                    <div class="w-9 h-6 rounded bg-cl-elevated overflow-hidden shrink-0">
                      {#if theme.previewUrl}
                        <img src={theme.previewUrl} alt={theme.name} class="w-full h-full object-cover" />
                      {:else}
                        <div class="w-full h-full flex items-center justify-center text-cl-dim">
                          <IconImage class="w-3 h-3" />
                        </div>
                      {/if}
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5">
                        <p class="text-xs font-medium text-cl-text truncate">{theme.name}</p>
                        {#if getThemeVerification(theme) !== "none"}
                          <VerifiedBadge size="sm" level={getThemeVerification(theme)} />
                        {/if}
                      </div>
                      <p class="text-[10px] text-cl-dim truncate">{theme.author} · {theme.latestVersion}</p>
                    </div>
                  </a>
                {/snippet}

                {#if searchQuery.trim()}
                  {#if searchSuggestions.length > 0}
                    <div class="py-1">
                      {#each searchSuggestions as theme}
                        {@render suggestionRow(theme)}
                      {/each}
                    </div>
                    <div class="border-t border-cl-border px-2.5 py-1.5">
                      <button
                        onclick={() => searchFocused = false}
                        class="text-[10px] text-cl-dim hover:text-cl-text transition-colors"
                      >
                        {$t('themes.results', { values: { count: filteredThemes.length } })} · {$t('themes.clearSearch')}
                      </button>
                    </div>
                  {:else}
                    <div class="px-2.5 py-2 text-xs text-cl-muted">
                      {$t('themes.noResults')}
                    </div>
                  {/if}
                {:else}
                  <div class="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cl-dim">
                    Suggested themes
                  </div>
                  <div class="py-1">
                    {#each suggestedThemes as theme}
                      {@render suggestionRow(theme)}
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>

        <!-- View mode / refresh -->
        <div class="flex items-center gap-1.5">
          {#if activeTab === "themes"}
            <div class="inline-flex bg-cl-surface border border-cl-border rounded p-0.5">
              <button
                onclick={() => setViewMode("grid")}
                class="p-1 rounded transition-colors {viewMode === 'grid' ? 'bg-cl-elevated text-white' : 'text-cl-dim hover:text-cl-text'}"
                aria-label="Grid view"
              >
                <IconSquaresFour class="w-3.5 h-3.5" />
              </button>
              <button
                onclick={() => setViewMode("list")}
                class="p-1 rounded transition-colors {viewMode === 'list' ? 'bg-cl-elevated text-white' : 'text-cl-dim hover:text-cl-text'}"
                aria-label="List view"
              >
                <IconList class="w-3.5 h-3.5" />
              </button>
            </div>
          {/if}
          <button
            onclick={refreshAll}
            disabled={refreshing}
            class="inline-flex items-center gap-1 px-2.5 h-7 text-[11px] font-medium rounded border border-cl-border text-cl-muted hover:text-cl-text hover:border-cl-border-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={$t('themes.refreshCache')}
            title={$t('themes.refreshCache')}
          >
            <IconArrowsClockwise
              class="w-3 h-3"
              style="transform: rotate({refreshRotation}deg); transition: transform {REFRESH_SPIN_DURATION_MS}ms linear;"
            />
            <span class="hidden sm:inline">{$t('themes.refreshCache')}</span>
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Author search with autocomplete -->
          {#if activeTab === "themes"}
            <div class="relative" bind:this={authorDropdownRef}>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <IconMagnifyingGlass class="w-3 h-3 text-cl-dim" />
                </div>
                <input
                  bind:this={authorInputRef}
                  type="text"
                  bind:value={authorQuery}
                  onfocus={() => authorDropdownOpen = true}
                  placeholder={$t('themes.author')}
                  class="inline-flex items-center gap-2 bg-cl-surface hover:bg-cl-elevated border border-cl-border rounded pl-7 pr-2 h-7 text-xs text-cl-text placeholder-cl-dim focus:outline-none focus:border-cl-border-hover transition-colors w-40"
                />
                {#if authorQuery}
                  <button
                    onclick={() => { authorQuery = ""; authorInputRef?.focus(); }}
                    class="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-cl-dim hover:text-cl-text transition-colors"
                    aria-label={$t('themes.clearSearch')}
                  >
                    <IconX class="w-3 h-3" />
                  </button>
                {/if}
              </div>

              {#if authorDropdownOpen}
                <div class="absolute left-0 top-full mt-1 z-20 w-52 bg-cl-surface border border-cl-border rounded shadow-lg shadow-black/20 overflow-hidden">
                  <div class="max-h-52 overflow-y-auto py-1">
                    {#each filteredAuthors as author}
                      <button
                        onclick={() => selectAuthor(author.name)}
                        class="w-full flex items-center justify-between px-2.5 py-1.5 text-xs transition-colors text-cl-muted hover:text-cl-text hover:bg-cl-elevated"
                      >
                        <span>{author.name}</span>
                        <span class="text-cl-dim">{author.count}</span>
                      </button>
                    {:else}
                      {#if authorQuery.trim()}
                        <div class="px-2.5 py-1.5 text-xs text-cl-muted">
                          {$t('themes.noResults')}
                        </div>
                      {:else}
                        {#each authorEntries.slice(0, 8) as author}
                          <button
                            onclick={() => selectAuthor(author.name)}
                            class="w-full flex items-center justify-between px-2.5 py-1.5 text-xs transition-colors text-cl-muted hover:text-cl-text hover:bg-cl-elevated"
                          >
                            <span>{author.name}</span>
                            <span class="text-cl-dim">{author.count}</span>
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
              class="inline-flex items-center gap-2 bg-cl-surface hover:bg-cl-elevated border border-cl-border rounded px-2.5 h-7 text-xs text-cl-text transition-colors"
              aria-haspopup="listbox"
              aria-expanded={sortDropdownOpen}
            >
              <span class="text-cl-dim">{$t('themes.sortBy')}:</span>
              {#if SORT_LABEL_KEYS[sortBy]}
                <span>{$t(SORT_LABEL_KEYS[sortBy])}</span>
              {/if}
              <IconCaretDown class="w-3 h-3 text-cl-dim {sortDropdownOpen ? 'rotate-180' : ''} transition-transform" />
            </button>

            {#if sortDropdownOpen}
              <div class="absolute left-0 top-full mt-1 z-20 w-40 bg-cl-surface border border-cl-border rounded shadow-lg shadow-black/20 overflow-hidden">
                <div class="py-1">
                  {#each sortOptions as opt}
                    <button
                      onclick={() => { sortBy = opt; sortDropdownOpen = false; updateUrlParams(); }}
                      class="w-full text-left px-2.5 py-1.5 text-xs transition-colors {sortBy === opt ? 'bg-cl-elevated text-white' : 'text-cl-muted hover:text-cl-text hover:bg-cl-elevated'}"
                    >
                      {$t(SORT_LABEL_KEYS[opt])}
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          </div>

          {#if hasActiveFilters}
            <button
              onclick={clearFilters}
              class="text-[11px] text-cl-dim hover:text-cl-text underline underline-offset-4 decoration-cl-border-hover transition-all"
            >
              {$t('themes.clearAll')}
            </button>
          {/if}
        </div>

        <div class="text-[11px] text-cl-dim">
          {$t('themes.showing', { values: { start: paginationStart, end: paginationEnd, total: totalItems } })}
        </div>
      </div>

      <!-- Active filter chips -->
      {#if hasActiveFilters}
        <div class="flex flex-wrap items-center gap-1.5">
          {#if searchQuery || debouncedQuery}
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cl-elevated border border-cl-border text-[11px] text-cl-text">
              <span class="text-cl-dim">{$t('themes.search')}:</span> "{debouncedQuery || searchQuery}"
              <button onclick={clearSearch} class="hover:text-cl-muted transition-colors" aria-label={$t('themes.clearSearchText')}>
                <IconX class="w-3 h-3" />
              </button>
            </span>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Results -->
    <div>
      {#if (activeTab === "themes" && error && themes.length === 0) || (activeTab === "packages" && packagesError && packages.length === 0)}
        <div class="text-center py-12 rounded border border-cl-border bg-cl-surface">
          <p class="text-cl-muted text-sm mb-3">{activeTab === "themes" ? error : packagesError}</p>
          <button
            onclick={() => location.reload()}
            class="bg-cl-text text-cl-accent-inverse px-4 py-1.5 text-xs font-medium rounded hover:bg-neutral-200 transition-colors"
          >
            {$t('themeDetail.retry')}
          </button>
        </div>
      {:else if (activeTab === "themes" && loading && !hasCached) || (activeTab === "packages" && packagesLoading && !hasPackagesCached)}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {#each Array(6) as _}
            <div class="bg-cl-surface border border-cl-border rounded overflow-hidden animate-pulse">
              <div class="aspect-video bg-cl-elevated"></div>
              <div class="p-3 space-y-2">
                <div class="h-3 bg-cl-elevated rounded w-2/3"></div>
                <div class="h-2.5 bg-cl-elevated rounded w-1/3"></div>
                <div class="h-6 bg-cl-elevated rounded w-full mt-2"></div>
              </div>
            </div>
          {/each}
        </div>
      {:else if activeTab === "themes" && filteredThemes.length === 0 && !loading}
        <div class="text-center py-12 rounded border border-cl-border bg-cl-surface">
          <p class="text-cl-muted text-sm mb-1">{$t('themes.noResults')}</p>
          <p class="text-xs text-cl-dim mb-4">{$t('themes.noResultsHint')}</p>
          {#if hasActiveFilters}
            <button
              onclick={clearFilters}
              class="bg-cl-text text-cl-accent-inverse px-4 py-1.5 text-xs font-medium rounded hover:bg-neutral-200 transition-colors"
            >
              {$t('themes.clearFilters')}
            </button>
          {/if}
        </div>
      {:else if activeTab === "packages" && filteredPackages.length === 0 && !packagesLoading}
        <div class="text-center py-12 rounded border border-cl-border bg-cl-surface">
          <p class="text-cl-muted text-sm mb-1">{$t('themes.noPackages')}</p>
          <p class="text-xs text-cl-dim mb-4">{$t('themes.noPackagesHint')}</p>
          {#if hasActiveFilters}
            <button
              onclick={clearFilters}
              class="bg-cl-text text-cl-accent-inverse px-4 py-1.5 text-xs font-medium rounded hover:bg-neutral-200 transition-colors"
            >
              {$t('themes.clearFilters')}
            </button>
          {/if}
        </div>
      {:else}
          {#if activeTab === "themes"}
            {#if viewMode === "grid"}
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {#each paginatedItems as item, i (item.id)}
                  <div class="card-enter" style="animation-delay: {i * 40}ms">
                    <ThemeCard theme={item as Theme} />
                  </div>
                {/each}
              </div>
            {:else}
              <div class="flex flex-col gap-1.5">
                {#each paginatedItems as item, i (item.id)}
                  <div class="card-enter" style="animation-delay: {i * 30}ms">
                    <ThemeListRow theme={item as Theme} />
                  </div>
                {/each}
              </div>
            {/if}
          {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {#each paginatedItems as item, i (item.slug)}
                <div class="card-enter" style="animation-delay: {i * 40}ms">
                  <PackageCard pkg={item as ThemePackage} />
                </div>
              {/each}
            </div>
          {/if}

        <!-- Pagination -->
        {#if totalPages > 1}
          <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-[11px] text-cl-dim hidden sm:block">
              {$t('themes.showing', { values: { start: paginationStart, end: paginationEnd, total: totalItems } })}
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

    <!-- Contribute -->
    {#if activeTab === "themes" && (!loading || hasCached)}
      <div class="mt-10 pt-4 border-t border-cl-border text-center">
        <p class="text-[11px] text-cl-dim">
          {$t('themes.createYourOwn')}
          <a href="https://dev.cubiclauncher.org/docs/es-ES/guias/hacer-themes" class="text-cl-text hover:underline underline-offset-4 decoration-cl-border-hover transition-all">{$t('themes.followGuide')}</a>
          {$t('themes.shareOn')}
          <a href="https://github.com/CubicLauncherDevs/Themes" target="_blank" rel="noopener noreferrer" class="text-cl-text hover:underline underline-offset-4 decoration-cl-border-hover transition-all">GitHub</a>.
        </p>
      </div>
    {/if}
  </div>
</section>

<style>
  @keyframes card-enter {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .card-enter {
    animation: card-enter 0.25s ease-out both;
  }
</style>
