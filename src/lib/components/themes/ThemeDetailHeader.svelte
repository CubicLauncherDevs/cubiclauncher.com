<script lang="ts">
  import { t, locale } from "$lib/i18n";
  import type { Theme, ThemeVersion } from "$lib/types/theme";
  import { slugify } from "$lib/utils/theme-search";
  import IconArrowLeft from "~icons/ph/arrow-left";
  import IconImage from "~icons/ph/image";
  import IconDownloadSimple from "~icons/ph/download-simple";

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
    onPreviewClick: () => void;
  } = $props();

  let authorUrl = $derived(`/themes/author/${slugify(theme.author)}`);
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
    {#if currentVer?.previewUrl}
      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
      <div
        class="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 cursor-pointer"
        onclick={() => onPreviewClick()}
        onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPreviewClick(); } }}
        role="button"
        tabindex="0"
      >
        <img
          src={currentVer.previewUrl}
          alt={theme.name}
          loading="eager"
          decoding="async"
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
    <h1 class="text-4xl font-bold tracking-tighter mb-2">{theme.name}</h1>
    <p class="text-lg text-neutral-400 mb-6">
      {$t('themeDetail.by')} <a href={authorUrl} class="text-white hover:underline underline-offset-4 decoration-white/30 transition-all">{theme.author}</a>
    </p>

    {#if theme.date}
      <p class="text-xs text-neutral-500 mb-6">
        {$t('themeDetail.publishedOn')} {new Date(theme.date).toLocaleDateString($locale === 'en' ? 'en-US' : 'es-ES', {
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

    <a
      href={currentVer?.zipUrl || "#"}
      download={currentVer?.zipName}
      class="flex items-center justify-center gap-3 w-full bg-white text-black px-8 py-4 font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-200 transition-all active:scale-95 shadow-xl shadow-white/5 mb-3"
    >
      <IconDownloadSimple class="w-5 h-5" />
      {$t('themes.downloadTheme')}
    </a>
  </div>
</div>
