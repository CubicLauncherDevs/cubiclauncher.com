<script lang="ts">
  import { t, locale } from "$lib/i18n";
  import type { Theme, ThemeVersion } from "$lib/types/theme";
  import { slugify } from "$lib/utils/theme-search";

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
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-16 h-16">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
        </svg>
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
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      {$t('themes.downloadTheme')}
    </a>
  </div>
</div>
