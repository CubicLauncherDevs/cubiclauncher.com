<script lang="ts">
  import { page } from "$app/stores";
  import { t, locale } from "$lib/i18n";
  import type { Theme, ThemeVersion } from "$lib/types/theme";
  import { fetchAllThemes, getCachedThemes, setCachedThemes } from "$lib/utils/themes";
  import { slugify } from "$lib/utils/theme-search";
  import { renderMarkdown } from "$lib/utils/markdown";
  import IconImage from "~icons/ph/image";
  import DownloadThemeButton from "$lib/components/themes/DownloadThemeButton.svelte";

  let slug = $derived($page.params.slug as string);
  let version = $derived($page.params.version as string);

  let theme = $state<Theme | null>(null);
  let ver = $state<ThemeVersion | null>(null);
  let loading = $state(true);
  let error = $state("");

  let changelogHtml = $derived(
    ver?.changelog ? renderMarkdown(ver.changelog) : ""
  );

  let authorUrl = $derived(theme ? `/themes/author/${slugify(theme.author)}` : "/themes");

  $effect(() => {
    loadVersion(slug, version);
  });

  async function loadVersion(slugId: string, versionName: string) {
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

    const found = themes.find((t) => t.slug === slugId);
    if (!found) {
      error = "Theme not found";
      loading = false;
      return;
    }

    theme = found;
    const foundVer = found.versions.find((v) => v.version === versionName);
    if (!foundVer) {
      error = `Version ${versionName} not found`;
      loading = false;
      return;
    }

    ver = foundVer;
    loading = false;
  }

  let docTitle = $derived(
    theme ? `${theme.name} ${version} - CubicLauncher` : "CubicLauncher"
  );
</script>

<svelte:head>
  <title>{docTitle}</title>
  <meta name="description" content={$t('page.themeDesc')} />
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
            onclick={() => loadVersion(slug, version)}
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
    {:else if theme && ver}
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center gap-2 text-sm text-neutral-500 mb-8">
          <a href="/themes" class="hover:text-white transition-colors">{$t('themeDetail.allThemes')}</a>
          <span>/</span>
          <a href="/themes/{theme.slug}" class="hover:text-white transition-colors">{theme.name}</a>
          <span>/</span>
          <span class="text-white">{ver.version}</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-10">
          <div class="lg:col-span-3">
            {#if ver.showcaseUrl && ver.previewUrl}
              <div class="flex flex-col sm:flex-row gap-3">
                <div class="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 flex-1 min-w-0">
                  <img
                    src={ver.showcaseUrl}
                    alt="{theme.name} {ver.version}"
                    loading="lazy"
                    class="w-full aspect-video object-cover"
                  />
                </div>
                <div class="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 flex-1 min-w-0">
                  <img
                    src={ver.previewUrl}
                    alt="{theme.name} {ver.version} palette"
                    loading="lazy"
                    class="w-full aspect-video object-cover"
                  />
                </div>
              </div>
            {:else if ver.showcaseUrl || ver.previewUrl}
              <div class="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
                <img
                  src={ver.showcaseUrl || ver.previewUrl}
                  alt="{theme.name} {ver.version}"
                  loading="lazy"
                  class="w-full aspect-video object-cover"
                />
              </div>
            {:else}
              <div class="rounded-2xl border border-white/10 bg-neutral-900 aspect-video flex items-center justify-center text-neutral-600">
                <IconImage class="w-16 h-16" />
              </div>
            {/if}
          </div>

          <div class="lg:col-span-2">
            <h1 class="text-4xl font-bold tracking-tighter mb-1">{theme.name}</h1>
            <p class="text-base text-neutral-400 mb-1">
              {$t('themeDetail.by')} <a href={authorUrl} class="text-white hover:underline underline-offset-4 decoration-white/30 transition-all">{theme.author}</a>
            </p>
            <p class="text-sm text-neutral-500 mb-4">{$t('themeDetail.version')} {ver.version}</p>

            {#if ver.date}
              <p class="text-xs text-neutral-500 mb-6">
                {$t('themeDetail.publishedOn')} {new Date(ver.date).toLocaleDateString($locale === 'en' ? 'en-US' : 'es-ES', {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            {/if}

            <DownloadThemeButton
              version={ver}
              themeName={theme.name}
              label={`{$t('themeDetail.downloadZIP')} (${ver.version})`}
            />

            <div class="flex items-center gap-2 mt-4">
              {#each theme.versions as v}
                <a
                  href="/themes/{theme.slug}/{v.version}"
                  class="px-2.5 py-1 rounded-lg text-xs transition-colors {v.version === ver.version ? 'bg-white/15 text-white' : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'}"
                >
                  {v.version}
                </a>
              {/each}
            </div>

            <a
              href="/themes/{theme.slug}"
              class="block text-center text-xs text-neutral-500 hover:text-white transition-colors mt-4"
            >
              {$t('themeDetail.backToTheme')}
            </a>
          </div>
        </div>

        {#if changelogHtml}
          <div class="mt-8 pt-8 border-t border-white/5">
            <h2 class="text-lg font-bold tracking-tighter mb-4">{$t('themeDetail.changelog')} — {ver.version}</h2>
            <div class="prose prose-invert prose-neutral max-w-none text-sm text-neutral-300">
              {@html changelogHtml}
            </div>
          </div>
        {:else}
          <div class="mt-8 pt-8 border-t border-white/5">
            <h2 class="text-lg font-bold tracking-tighter mb-4">{$t('themeDetail.changelog')} — {ver.version}</h2>
            <p class="text-sm text-neutral-500 italic">{$t('themeDetail.noChangelog')}</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>
