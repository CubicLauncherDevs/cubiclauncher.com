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
    {@const isExpanded = expandedVersion === v.version}
    {@const isLatest = v.version === latestVersion}
    {@const isLast = i === versions.length - 1}

    <div class="relative mb-3 last:mb-0 pl-7">
      {#if !isLast}
        <div class="absolute left-[8px] -translate-x-1/2 top-[22px] bottom-[-22px] w-px bg-cl-border"></div>
      {/if}

      <button
        onclick={() => onToggleVersion(v.version)}
        aria-label={isExpanded ? "Collapse version details" : "Expand version details"}
        aria-expanded={isExpanded}
        class="absolute left-0 top-[6px] w-4 h-4 rounded-full transition-all {isExpanded ? 'bg-cl-text' : 'bg-cl-base ring-1 ring-cl-border hover:ring-cl-border-hover'}"
      ></button>

      <div
        class="rounded border transition-all cursor-pointer {isExpanded ? 'border-cl-border-hover bg-cl-elevated' : 'border-cl-border bg-cl-base hover:border-cl-border-hover'} overflow-hidden"
        onclick={() => onToggleVersion(v.version)}
        role="button"
        tabindex="0"
        onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggleVersion(v.version); } }}
      >
        <div class="flex items-center justify-between px-3 py-2">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-xs font-medium text-cl-text whitespace-nowrap">{v.version}</span>
            {#if isLatest}
              <span class="text-[10px] font-medium text-cl-dim bg-cl-surface border border-cl-border px-1.5 py-0.5 rounded whitespace-nowrap">{$t('themeDetail.latestVersion')}</span>
            {/if}
            {#if v.date}
              <span class="text-[10px] text-cl-dim hidden sm:inline whitespace-nowrap">{new Date(v.date).toLocaleDateString(getDateLocale($locale))}</span>
            {/if}
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <IconCaretDown
              class="w-3.5 h-3.5 text-cl-dim transition-transform {isExpanded ? 'rotate-180' : ''}"
            />
          </div>
        </div>

        {#if isExpanded}
          <div class="border-t border-cl-border px-3 py-3 space-y-3" transition:slide>
            <div class="flex flex-col sm:flex-row gap-3">
              {#if v.showcaseUrl && v.previewUrl}
                <div class="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
                  <img
                    src={v.showcaseUrl}
                    alt="{themeName} {v.version}"
                    loading="lazy"
                    class="w-full sm:w-[240px] aspect-video object-cover rounded border border-cl-border"
                  />
                  <img
                    src={v.previewUrl}
                    alt="{themeName} {v.version} palette"
                    loading="lazy"
                    class="w-full sm:w-[120px] aspect-video object-cover rounded border border-cl-border"
                  />
                </div>
              {:else if v.showcaseUrl || v.previewUrl}
                <div class="shrink-0 w-full sm:w-auto">
                  <img
                    src={v.showcaseUrl || v.previewUrl}
                    alt="{themeName} {v.version}"
                    loading="lazy"
                    class="w-full sm:w-[360px] aspect-video object-cover rounded border border-cl-border"
                  />
                </div>
              {/if}
              <div class="min-w-0 flex-1">
                {#if v.changelog}
                  {@const changelog = renderMarkdown(v.changelog)}
                  <div class="prose prose-invert prose-neutral max-w-none text-[11px] text-cl-muted [&_p]:mb-2 [&_ul]:mb-2 [&_li]:mb-0.5">
                    {@html changelog}
                  </div>
                {:else}
                  <p class="text-[11px] text-cl-dim italic">{$t('themeDetail.noChangelog')}</p>
                {/if}
              </div>
            </div>

            <div class="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-cl-dim">
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
