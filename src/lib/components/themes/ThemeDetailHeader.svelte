<script lang="ts">
  import { t, locale, getDateLocale } from "$lib/i18n";
  import type { Theme, ThemeVersion } from "$lib/types/theme";
  import { slugify } from "$lib/utils/theme-search";
  import DownloadThemeButton from "./DownloadThemeButton.svelte";
  import IconArrowLeft from "~icons/ph/arrow-left";
  import IconImage from "~icons/ph/image";
  import IconPalette from "~icons/ph/palette";

  let {
    theme,
    currentVer,
    selectedVersion,
    onVersionChange,
    onPreviewClick,
  }: {
    theme: Theme;
    currentVer: ThemeVersion | null;
    selectedVersion: string;
    onVersionChange: (ver: string) => void;
    onPreviewClick: (url: string) => void;
  } = $props();

  let authorUrl = $derived(`/themes/author/${slugify(theme.author)}`);
  let showingShowcase = $state(true);

  let hasBoth = $derived(!!(currentVer?.showcaseUrl && currentVer?.previewUrl));

  let currentImageUrl = $derived.by(() => {
    if (!currentVer) return null;
    if (hasBoth) {
      return showingShowcase ? currentVer.showcaseUrl : currentVer.previewUrl;
    }
    return currentVer.showcaseUrl || currentVer.previewUrl;
  });

  $effect(() => {
    if (!hasBoth) showingShowcase = true;
  });
</script>

<a
  href="/themes"
  class="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors mb-8"
>
  <IconArrowLeft class="w-4 h-4" />
  {$t('themeDetail.allThemes')}
</a>

<div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-10">
  <div class="lg:col-span-3">
    {#if currentImageUrl}
      <div
        class="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 cursor-pointer relative"
        onclick={() => onPreviewClick(currentImageUrl!)}
        onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPreviewClick(); } }}
        role="button"
        tabindex="0"
      >
        <img
          src={currentImageUrl}
          alt={theme.name}
          loading="eager"
          decoding="async"
          class="w-full aspect-video object-cover"
        />
        {#if hasBoth}
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            <button
              onclick={(e) => { e.stopPropagation(); showingShowcase = true; }}
              class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all {showingShowcase ? 'bg-white text-black' : 'bg-black/50 text-white/70 hover:bg-black/70'}"
            >
              Showcase
            </button>
            <button
              onclick={(e) => { e.stopPropagation(); showingShowcase = false; }}
              class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all {!showingShowcase ? 'bg-white text-black' : 'bg-black/50 text-white/70 hover:bg-black/70'}"
            >
              Palette
            </button>
          </div>
        {/if}
      </div>
    {:else}
      <div class="rounded-2xl border border-white/10 bg-neutral-900 aspect-video flex items-center justify-center text-neutral-600">
        <IconPalette class="w-16 h-16" />
      </div>
    {/if}
  </div>

  <div class="lg:col-span-2">
    <div class="flex items-start gap-2 mb-2">
      <h1 class="text-4xl font-bold tracking-tighter">{theme.name}</h1>
    </div>
    <p class="text-lg text-neutral-400 mb-2">
      {$t('themeDetail.by')} <a href={authorUrl} class="text-white hover:underline underline-offset-4 decoration-white/30 transition-all">{theme.author}</a>
    </p>

    {#if theme.tags && theme.tags.length > 0}
      <div class="flex flex-wrap gap-1.5 mb-4">
        {#each theme.tags as tag}
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10">{tag}</span>
        {/each}
      </div>
    {/if}

    {#if theme.date}
      <p class="text-xs text-neutral-500 mb-6">
        {$t('themeDetail.publishedOn')} {new Date(theme.date).toLocaleDateString(getDateLocale($locale), {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    {/if}

    <div class="mb-6">
      <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">{$t('themeDetail.versions')}</p>
      <div class="flex flex-wrap gap-2">
        {#each theme.versions as v}
          <button
            onclick={() => onVersionChange(v.version)}
            class="px-3 py-1.5 rounded-lg text-xs transition-colors {v.version === currentVer?.version ? 'bg-white/15 text-white' : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'}"
          >
            {v.version}
            {#if v.version === theme.latestVersion}
              <span class="text-[10px] text-neutral-500 ml-1">({$t('themeDetail.latestVersion')})</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    {#if currentVer}
      <DownloadThemeButton version={currentVer} themeName={theme.name} label={$t('themeDetail.downloadZIP')} />
    {/if}
  </div>
</div>
