<script lang="ts">
  import { t, locale, getDateLocale } from "$lib/i18n";
  import type { Theme, ThemeVersion } from "$lib/types/theme";
  import { getThemeVerification } from "$lib/utils/themes";
  import { slugify } from "$lib/utils/theme-search";
  import DownloadThemeButton from "./DownloadThemeButton.svelte";
  import VerifiedBadge from "./VerifiedBadge.svelte";
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

<div class="mb-5">
  {#if currentImageUrl}
    <div
      class="rounded border border-cl-border bg-cl-surface cursor-pointer relative group overflow-hidden"
      onclick={() => onPreviewClick(currentImageUrl!)}
      onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPreviewClick(currentImageUrl!); } }}
      role="button"
      tabindex="0"
    >
      <img
        src={currentImageUrl}
        alt={theme.name}
        width="1600"
        height="900"
        loading="eager"
        decoding="async"
        class="w-full aspect-video object-cover"
      />
      {#if hasBoth}
        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onclick={(e) => { e.stopPropagation(); showingShowcase = true; }}
            class="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded transition-colors {showingShowcase ? 'bg-cl-text text-cl-accent-inverse' : 'bg-black/60 text-cl-text hover:bg-black/80'}"
          >
            Showcase
          </button>
          <button
            onclick={(e) => { e.stopPropagation(); showingShowcase = false; }}
            class="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded transition-colors {!showingShowcase ? 'bg-cl-text text-cl-accent-inverse' : 'bg-black/60 text-cl-text hover:bg-black/80'}"
          >
            Palette
          </button>
        </div>
      {/if}
    </div>
  {:else}
    <div class="rounded border border-cl-border bg-cl-surface aspect-video flex items-center justify-center text-cl-dim">
      <IconPalette class="w-10 h-10" />
    </div>
  {/if}
</div>

<div class="flex items-start justify-between gap-3 mb-4">
  <div class="min-w-0">
    <div class="flex items-center gap-2 mb-1">
      <h1 class="text-base sm:text-lg font-semibold text-white truncate">{theme.name}</h1>
      {#if getThemeVerification(theme) !== "none"}
        <VerifiedBadge size="md" level={getThemeVerification(theme)} />
      {/if}
    </div>
    <p class="text-xs text-cl-muted">
      {$t('themeDetail.by')} <a href={authorUrl} class="text-cl-text hover:underline underline-offset-4 decoration-cl-border-hover transition-all">{theme.author}</a>
    </p>
  </div>

  {#if currentVer}
    <DownloadThemeButton version={currentVer} themeName={theme.name} label={$t('themeDetail.downloadZIP')} />
  {/if}
</div>

{#if theme.tags && theme.tags.length > 0}
  <div class="flex flex-wrap gap-1 mb-3">
    {#each theme.tags as tag}
      <span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-cl-base border border-cl-border text-cl-muted">{tag}</span>
    {/each}
  </div>
{/if}

{#if theme.date}
  <p class="text-[11px] text-cl-dim mb-4">
    {$t('themeDetail.publishedOn')} {new Date(theme.date).toLocaleDateString(getDateLocale($locale), {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
  </p>
{/if}

<div class="mb-5">
  <p class="text-[10px] font-semibold uppercase tracking-wide text-cl-dim mb-1.5">{$t('themeDetail.versions')}</p>
  <div class="flex flex-wrap gap-1">
    {#each theme.versions as v}
      <button
        onclick={() => onVersionChange(v.version)}
        class="px-2 py-0.5 rounded text-[11px] transition-colors border {v.version === currentVer?.version ? 'bg-cl-elevated border-cl-border text-cl-text' : 'bg-cl-base border-cl-border text-cl-muted hover:text-cl-text hover:bg-cl-elevated'}"
      >
        {v.version}
        {#if v.version === theme.latestVersion}
          <span class="text-[10px] text-cl-dim ml-0.5">({$t('themeDetail.latestVersion')})</span>
        {/if}
      </button>
    {/each}
  </div>
</div>
