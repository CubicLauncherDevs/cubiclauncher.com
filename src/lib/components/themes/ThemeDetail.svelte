<script lang="ts">
  import { t, locale } from "$lib/i18n";
  import type { Theme, ThemeCommitInfo } from "$lib/types/theme";
  import { fetchThemeTree, buildThemesFromTree, getCachedThemes, setCachedThemes, fetchThemeCommitInfo } from "$lib/utils/themes";
  import ThemeCard from "./ThemeCard.svelte";

  let { slug }: { slug: string } = $props();

  let theme = $state<Theme | null>(null);
  let allThemes = $state<Theme[]>([]);
  let loading = $state(true);
  let error = $state("");
  let commitInfo = $state<ThemeCommitInfo | null>(null);
  let commitLoading = $state(false);
  let showLightbox = $state(false);

  let relatedThemes = $derived.by(() => {
    const current = theme;
    if (!current) return [];
    return allThemes.filter((t) => t.author === current.author && t.id !== current.id);
  });

  $effect(() => {
    const id = slug;
    loadTheme(id);
  });

  async function loadTheme(id: string) {
    loading = true;
    error = "";
    commitInfo = null;

    let themes: Theme[] | null = getCachedThemes();

    if (!themes) {
      try {
        const tree = await fetchThemeTree();
        themes = buildThemesFromTree(tree);
        setCachedThemes(themes);
      } catch (e) {
        error = e instanceof Error ? e.message : "Error loading theme";
        loading = false;
        return;
      }
    }

    allThemes = themes;
    const found = themes.find((t) => t.id === id);
    if (!found) {
      error = "Theme not found";
      loading = false;
      return;
    }

    theme = found;
    loading = false;

    if (found.dirPath) {
      commitLoading = true;
      fetchThemeCommitInfo(found.dirPath).then((info) => {
        commitInfo = info;
        commitLoading = false;
      });
    }
  }

  let closeLightbox = () => { showLightbox = false; };
</script>

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
        <!-- Breadcrumb -->
        <a
          href="/themes"
          class="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          {$t('themeDetail.allThemes')}
        </a>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <!-- Preview -->
          <div class="lg:col-span-3">
            {#if theme.previewUrl}
              <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
              <div
                class="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 cursor-pointer"
                onclick={() => (showLightbox = true)}
                onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showLightbox = true; } }}
                role="button"
                tabindex="0"
              >
                <img
                  src={theme.previewUrl}
                  alt={theme.name}
                  loading="lazy"
                  class="w-full aspect-video object-cover"
                />
              </div>
            {:else}
              <div class="rounded-2xl border border-white/10 bg-neutral-900 aspect-video flex items-center justify-center text-neutral-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-16 h-16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
              </div>
            {/if}
          </div>

          <!-- Info -->
          <div class="lg:col-span-2">
            <h1 class="text-4xl font-bold tracking-tighter mb-2">{theme.name}</h1>
            <p class="text-lg text-neutral-400 mb-6">
              {$t('themeDetail.by')} <a href="/themes?author={encodeURIComponent(theme.author)}" class="text-white hover:underline underline-offset-4 decoration-white/30 transition-all">{theme.author}</a>
            </p>

            {#if commitLoading}
              <div class="animate-pulse mb-6">
                <div class="h-3 bg-neutral-800 rounded w-40"></div>
              </div>
            {:else if commitInfo}
              <p class="text-xs text-neutral-500 mb-6">
                {$t('themeDetail.publishedOn')} {new Date(commitInfo.date).toLocaleDateString($locale === 'en' ? 'en-US' : 'es-ES', {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            {/if}

            <a
              href={theme.zipUrl}
              download={theme.zipName}
              class="flex items-center justify-center gap-3 w-full bg-white text-black px-8 py-4 font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-200 transition-all active:scale-95 shadow-xl shadow-white/5 mb-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {$t('themeDetail.downloadZIP')}
            </a>
          </div>
        </div>

        <!-- Related themes -->
        {#if relatedThemes.length > 0}
          <div class="mt-20 pt-12 border-t border-white/5">
            <h2 class="text-xl font-bold tracking-tighter mb-6">
              {$t('themeDetail.moreBy', { author: theme.author })}
            </h2>
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

{#if showLightbox && theme?.previewUrl}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
    onclick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <img
      src={theme.previewUrl}
      alt={theme.name}
      class="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl"
    />
  </div>
{/if}

<svelte:window onkeydown={(e) => e.key === "Escape" && showLightbox && closeLightbox()} />
