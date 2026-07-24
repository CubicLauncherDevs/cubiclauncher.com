<script lang="ts">
  import { page } from "$app/stores";
  import { pushState } from "$app/navigation";
  import { t, locale } from "$lib/i18n";
  import type { Theme } from "$lib/types/theme";
  import { fetchAllThemes, getCachedThemes, setCachedThemes } from "$lib/utils/themes";
  import { slugify } from "$lib/utils/theme-search";
  import { renderMarkdown } from "$lib/utils/markdown";
  import ThemeCard from "$lib/components/themes/ThemeCard.svelte";
  import ThemeDetailHeader from "$lib/components/themes/ThemeDetailHeader.svelte";
  import VersionTimeline from "$lib/components/themes/VersionTimeline.svelte";
  import ThemeLightbox from "$lib/components/themes/ThemeLightbox.svelte";

  let slug = $derived($page.params.slug as string);
  let tabParam = $derived(($page.url.searchParams.get("tab") || "description") as "description" | "versions");

  let theme = $state<Theme | null>(null);
  let allThemes = $state<Theme[]>([]);
  let loading = $state(true);
  let error = $state("");
  let showLightbox = $state(false);
  let lightboxUrl = $state("");

  let activeTab = $state<"description" | "versions">("description");
  let expandedVersion = $state<string | null>(null);

  let relatedThemes = $derived.by(() => {
    const current = theme;
    if (!current) return [];
    return allThemes.filter((t) => t.author === current.author && t.slug !== current.slug);
  });

  let authorUrl = $derived(theme ? `/themes/author/${slugify(theme.author)}` : "/themes");

  let descriptionHtml = $derived(
    theme?.description ? renderMarkdown(theme.description) : ""
  );

  let selectedVersion = $state("");

  let currentVer = $derived(
    theme?.versions.find((v) => v.version === selectedVersion) || theme?.versions[0] || null
  );

  let sortedVersions = $derived(
    theme ? [...theme.versions].sort((a, b) => {
      const re = /(\d+)|(\D+)/g;
      const aParts = a.version.match(re) || [];
      const bParts = b.version.match(re) || [];
      const len = Math.max(aParts.length, bParts.length);
      for (let i = 0; i < len; i++) {
        const ap = aParts[i] || "";
        const bp = bParts[i] || "";
        const aNum = parseInt(ap, 10);
        const bNum = parseInt(bp, 10);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          if (aNum !== bNum) return bNum - aNum;
        } else {
          const cmp = bp.localeCompare(ap);
          if (cmp !== 0) return cmp;
        }
      }
      return 0;
    }) : []
  );

  $effect(() => {
    activeTab = tabParam;
  });

  $effect(() => {
    loadTheme(slug);
  });

  async function loadTheme(slugId: string) {
    loading = true;
    error = "";

    let themes: Theme[] | null = await getCachedThemes();

    if (!themes) {
      try {
        themes = await fetchAllThemes();
        await setCachedThemes(themes);
      } catch (e) {
        error = e instanceof Error ? e.message : "Error loading theme";
        loading = false;
        return;
      }
    }

    allThemes = themes;
    const found = themes.find((t) => t.slug === slugId);
    if (!found) {
      error = "Theme not found";
      loading = false;
      return;
    }

    theme = found;
    selectedVersion = found.latestVersion;
    loading = false;
  }

  function setTab(tab: "description" | "versions") {
    activeTab = tab;
    pushState(`/themes/${slug}?tab=${tab}`, {});
  }

  function toggleVersion(ver: string) {
    expandedVersion = expandedVersion === ver ? null : ver;
  }

  let closeLightbox = () => { showLightbox = false; };

  let docTitle = $derived(
    theme ? `${theme.name} - CubicLauncher`
      : slug ? slug : $t('page.themesTitle')
  );
</script>

<svelte:head>
  <title>{docTitle}</title>
  <meta name="description" content={theme?.description ? theme.description.slice(0, 160) : $t('page.themeDesc')} />
  {#if currentVer?.showcaseUrl || currentVer?.previewUrl}
    {@const ogImage = currentVer.showcaseUrl || currentVer.previewUrl}
    <meta property="og:title" content={theme?.name ?? ''} />
    <meta property="og:description" content={$t('page.themeDesc')} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1600" />
    <meta property="og:image:height" content="900" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={ogImage} />
  {/if}
</svelte:head>

<section class="min-h-screen pt-40 pb-32 bg-neutral-950 text-white overflow-hidden relative">
  <div class="absolute top-0 inset-x-0 h-125 bg-linear-to-b from-white/3 to-transparent pointer-events-none"></div>
  <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/2 blur-[120px] rounded-full pointer-events-none"></div>

  <div class="container mx-auto px-6 relative z-10 max-w-6xl">
    {#if loading}
      <div class="animate-pulse space-y-8 max-w-4xl mx-auto">
        <div class="h-8 bg-neutral-800 rounded w-48"></div>
        <div class="aspect-video bg-neutral-800 rounded-2xl"></div>
        <div class="space-y-3">
          <div class="h-6 bg-neutral-800 rounded w-64"></div>
          <div class="h-4 bg-neutral-800 rounded w-96"></div>
        </div>
      </div>
    {:else if error}
      <div class="text-center py-20 max-w-4xl mx-auto">
        <p class="text-neutral-400 text-lg mb-6">{error}</p>
        <div class="flex gap-4 justify-center">
          <button
            onclick={() => loadTheme(slug)}
            class="bg-white text-black px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all active:scale-95"
          >
            {$t('themeDetail.retry')}
          </button>
          <a
            href="/themes"
            class="px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full border border-white/10 text-neutral-400 hover:text-white hover:border-white/25 transition-all"
          >
            {$t('themeDetail.viewAll')}
          </a>
        </div>
      </div>
    {:else if theme}
      <div class="max-w-5xl mx-auto">
        <ThemeDetailHeader
          {theme}
          {currentVer}
          {selectedVersion}
          onVersionChange={(ver) => selectedVersion = ver}
          onPreviewClick={(url: string) => { lightboxUrl = url; showLightbox = true; }}
        />

        <!-- Tabs -->
        <div class="border-b border-white/10 mb-8">
          <div class="flex gap-0">
            <button
              onclick={() => setTab("description")}
              class="px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px {activeTab === 'description' ? 'border-white text-white' : 'border-transparent text-neutral-500 hover:text-white'}"
            >
              {$t('themeDetail.description')}
            </button>
            <button
              onclick={() => setTab("versions")}
              class="px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px {activeTab === 'versions' ? 'border-white text-white' : 'border-transparent text-neutral-500 hover:text-white'}"
            >
              {$t('themeDetail.versions')}
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        {#if activeTab === "description"}
          {#if descriptionHtml}
            <div class="max-w-none">
              <div class="prose prose-invert prose-neutral max-w-none text-sm text-neutral-300">
                {@html descriptionHtml}
              </div>
            </div>
          {:else}
            <p class="text-sm text-neutral-500 italic">{$t('themeDetail.noDescription')}</p>
          {/if}
        {:else if activeTab === "versions"}
          <VersionTimeline
            versions={sortedVersions}
            latestVersion={theme.latestVersion}
            themeName={theme.name}
            themeAuthor={theme.author}
            {expandedVersion}
            onToggleVersion={toggleVersion}
          />
        {/if}

        <!-- Related themes -->
        {#if relatedThemes.length > 0}
          <div class="mt-20 pt-12 border-t border-white/5">
            <a href={authorUrl} class="block text-xl font-bold tracking-tighter mb-6 hover:text-white/80 transition-colors">
              {$t('themeDetail.moreBy', { values: { author: theme.author } })}
            </a>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {#each relatedThemes.slice(0, 3) as related}
                <ThemeCard theme={related} />
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>

<ThemeLightbox
  show={showLightbox}
  imageUrl={lightboxUrl || undefined}
  alt={theme?.name ?? ""}
  onClose={closeLightbox}
/>

<svelte:window onkeydown={(e) => e.key === "Escape" && showLightbox && closeLightbox()} />
