<script lang="ts">
  import { slide } from "svelte/transition";
  import { t, locale, getDateLocale } from "$lib/i18n";
  import { renderMarkdown } from "$lib/utils/markdown";
  import type { ThemeVersion } from "$lib/types/theme";
  import DownloadThemeButton from "./DownloadThemeButton.svelte";
  import IconCaretDown from "~icons/ph/caret-down";

  let {
    versions,
    latestVersion,
    themeName,
    themeAuthor,
    expandedVersion,
    onToggleVersion,
  }: {
    versions: ThemeVersion[];
    latestVersion: string;
    themeName: string;
    themeAuthor: string;
    expandedVersion: string | null;
    onToggleVersion: (ver: string) => void;
  } = $props();
</script>

<div>
  {#each versions as v, i}
    {@const changelog = v.changelog ? renderMarkdown(v.changelog) : ""}
    {@const isExpanded = expandedVersion === v.version}
    {@const isLatest = v.version === latestVersion}
    {@const isLast = i === versions.length - 1}

    <div class="relative mb-6 last:mb-0 pl-9">
      {#if !isLast}
        <div class="absolute left-[9px] -translate-x-1/2 top-[32px] bottom-[-49px] w-px bg-white/10"></div>
      {/if}

      <button
        onclick={() => onToggleVersion(v.version)}
        aria-label={isExpanded ? "Collapse version details" : "Expand version details"}
        aria-expanded={isExpanded}
        class="absolute left-0 top-[12px] w-[18px] h-[18px] rounded-full transition-all {isExpanded ? 'bg-white' : 'bg-neutral-950 ring-2 ring-white/20 hover:ring-white/40'}"
      ></button>

      <div
        class="rounded-lg border transition-all cursor-pointer {isExpanded ? 'border-white/20 bg-neutral-900/80' : 'border-white/5 bg-neutral-900/30 hover:border-white/10'} overflow-hidden"
        onclick={() => onToggleVersion(v.version)}
        role="button"
        tabindex="0"
        onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggleVersion(v.version); } }}
      >
        <div class="flex items-center justify-between px-4 py-3.5">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="text-[13px] font-medium text-white whitespace-nowrap">{v.version}</span>
            {#if isLatest}
              <span class="text-[10px] font-medium text-neutral-400 bg-white/5 px-2 py-0.5 rounded-[3px] whitespace-nowrap">{$t('themeDetail.latestVersion')}</span>
            {/if}
            {#if v.date}
              <span class="text-[11px] text-neutral-500 hidden sm:inline whitespace-nowrap">{new Date(v.date).toLocaleDateString($locale === 'en' ? 'en-US' : 'es-ES')}</span>
            {/if}
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <IconCaretDown
              class="w-4 h-4 text-neutral-500 transition-transform {isExpanded ? 'rotate-180' : ''}"
            />
          </div>
        </div>

        {#if isExpanded}
          <div class="border-t border-white/5 px-4 py-4 space-y-4" transition:slide>
            <div class="flex flex-col sm:flex-row gap-3">
              {#if v.showcaseUrl && v.previewUrl}
                <div class="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
                  <img
                    src={v.showcaseUrl}
                    alt="{themeName} {v.version}"
                    loading="lazy"
                    class="w-full sm:w-[320px] aspect-video object-cover rounded-[4px] border border-white/10"
                  />
                  <img
                    src={v.previewUrl}
                    alt="{themeName} {v.version} palette"
                    loading="lazy"
                    class="w-full sm:w-[160px] aspect-video object-cover rounded-[4px] border border-white/10"
                  />
                </div>
              {:else if v.showcaseUrl || v.previewUrl}
                <div class="shrink-0 w-full sm:w-auto">
                  <img
                    src={v.showcaseUrl || v.previewUrl}
                    alt="{themeName} {v.version}"
                    loading="lazy"
                    class="w-full sm:w-[480px] aspect-video object-cover rounded-[4px] border border-white/10"
                  />
                </div>
              {/if}
              <div class="min-w-0 flex-1">
                {#if changelog}
                  <div class="prose prose-invert prose-neutral max-w-none text-[12px] text-neutral-300 [&_p]:mb-2 [&_ul]:mb-2 [&_li]:mb-0.5">
                    {@html changelog}
                  </div>
                {:else}
                  <p class="text-[12px] text-neutral-500 italic">{$t('themeDetail.noChangelog')}</p>
                {/if}
              </div>
            </div>

            <div class="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-500">
              {#if v.date}
                <span>{new Date(v.date).toLocaleDateString(getDateLocale($locale), {
                  year: "numeric", month: "long", day: "numeric"
                })}</span>
              {/if}
              <span>{v.version}</span>
              <span>{themeAuthor}</span>
            </div>

            <DownloadThemeButton version={v} {themeName} label={$t('themeDetail.downloadZIP') + ' (' + v.version + ')'} />
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>
