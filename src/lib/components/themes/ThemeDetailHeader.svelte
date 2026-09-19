<script lang="ts">
  import { t, locale, getDateLocale } from "$lib/i18n";
  import type { Theme, ThemeVersion } from "$lib/types/theme";
  import { getThemeVerification } from "$lib/utils/themes";
  import { slugify, compareVersionsDesc } from "$lib/utils/theme-search";
  import DownloadThemeButton from "./DownloadThemeButton.svelte";
  import VerifiedBadge from "./VerifiedBadge.svelte";
  import IconPalette from "~icons/ph/palette";
  import IconArrowsOut from "~icons/ph/arrows-out";
  import IconArrowUpRight from "~icons/ph/arrow-up-right";

  let { theme, currentVer, selectedVersion, onVersionChange, onPreviewClick }: {
    theme: Theme;
    currentVer: ThemeVersion | null;
    selectedVersion: string;
    onVersionChange: (ver: string) => void;
    onPreviewClick: (url: string) => void;
  } = $props();

  const id = $props.id();
  let authorUrl = $derived(`/themes/author/${slugify(theme.author)}`);
  let versions = $derived([...theme.versions].sort((a, b) => compareVersionsDesc(a.version, b.version)));
  let imageIndex = $state(0);
  let failedImage = $state<string | null>(null);
  let images = $derived([
    ...(currentVer?.showcaseUrl ? [{ url: currentVer.showcaseUrl, label: $t('themeDetail.showcase') }] : []),
    ...(currentVer?.previewUrl ? [{ url: currentVer.previewUrl, label: $t('themeDetail.palette') }] : []),
    ...(!currentVer?.showcaseUrl && !currentVer?.previewUrl && theme.previewUrl ? [{ url: theme.previewUrl, label: $t('themeDetail.preview') }] : []),
  ]);
  let image = $derived(images[imageIndex] ?? images[0]);
  let latestDate = $derived(theme.versions.flatMap((version) => version.date && !Number.isNaN(Date.parse(version.date)) ? [version.date] : []).sort((a, b) => Date.parse(b) - Date.parse(a))[0]);
  let sourceUrl = $derived(`https://github.com/CubicLauncherDevs/Themes/tree/master/${(currentVer?.dirPath ?? theme.dirPath).split('/').map(encodeURIComponent).join('/')}`);

  function formatDate(value: string) {
    return new Date(value).toLocaleDateString(getDateLocale($locale), { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  }
</script>

<header class="overflow-hidden rounded-lg border border-cl-border bg-cl-surface">
  <div class="grid lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
    <div class="min-w-0 border-b border-cl-border bg-cl-base p-3 sm:p-4 lg:border-b-0 lg:border-r">
      {#if image && failedImage !== image.url}
        <button class="group relative block w-full overflow-hidden rounded-md border border-cl-border bg-cl-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cl-text" onclick={() => onPreviewClick(image.url)} aria-label={$t('themeDetail.enlargePreview')}>
          <img src={image.url} alt={`${theme.name} · ${currentVer?.version ?? ''} · ${image.label}`} width="1600" height="900" loading="eager" decoding="async" class="aspect-video w-full object-contain" onerror={() => failedImage = image.url} />
          <span class="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-black/75 px-2.5 py-1.5 text-[11px] text-white transition-colors group-hover:bg-black/90"><IconArrowsOut class="size-3.5" />{$t('themeDetail.enlargePreview')}</span>
        </button>
      {:else}
        <div class="flex aspect-video flex-col items-center justify-center gap-3 rounded-md border border-cl-border bg-cl-elevated text-cl-dim"><IconPalette class="size-10" /><p class="text-xs">{$t('themeDetail.noPreview')}</p></div>
      {/if}
      <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex gap-1" role="group" aria-label={$t('themeDetail.preview')}>
          {#each images as item, index}
            <button onclick={() => imageIndex = index} aria-pressed={image?.url === item.url} class="rounded-md border px-3 py-1.5 text-[11px] transition-colors {image?.url === item.url ? 'border-cl-border-hover bg-cl-surface text-cl-text' : 'border-transparent text-cl-dim hover:text-cl-text'}">{item.label}</button>
          {/each}
        </div>
        {#if currentVer}<span class="text-[11px] text-cl-dim">{currentVer.version}</span>{/if}
      </div>
    </div>

    <div class="flex min-w-0 flex-col p-5 sm:p-6">
      <p class="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-cl-dim"><IconPalette class="size-3.5" />CubicLauncher Theme</p>
      <div class="flex items-start gap-2">
        <h1 class="min-w-0 break-words text-2xl font-semibold tracking-tight sm:text-3xl">{theme.name}</h1>
        {#if getThemeVerification(theme) !== 'none'}<VerifiedBadge size="md" level={getThemeVerification(theme)} />{/if}
      </div>
      <p class="mt-2 text-xs text-cl-dim">{$t('themeDetail.by')} <a href={authorUrl} class="text-cl-text underline-offset-4 hover:underline">{theme.author}</a></p>
      {#if theme.tags.length > 0}
        <div class="mt-4 flex flex-wrap gap-1.5">
          {#each theme.tags as tag}<span class="rounded-md border border-cl-border bg-cl-base px-2 py-1 text-[10px] text-cl-muted">{tag}</span>{/each}
        </div>
      {/if}

      <div class="mt-5 border-t border-cl-border pt-4">
        <label for={`${id}-version`} class="mb-2 block text-xs font-medium">{$t('themeDetail.selectVersion')}</label>
        <select id={`${id}-version`} value={selectedVersion} onchange={(event) => { imageIndex = 0; failedImage = null; onVersionChange(event.currentTarget.value); }} class="w-full rounded-md border border-cl-border bg-cl-base px-3 py-2 text-xs text-cl-text">
          {#each versions as version}<option value={version.version}>{version.version}{version.version === theme.latestVersion ? ` · ${$t('themeDetail.latestVersion')}` : ''}</option>{/each}
        </select>
        {#if currentVer}
          <div class="mt-3">
            {#key `${theme.slug}/${currentVer.version}`}<DownloadThemeButton version={currentVer} themeName={theme.name} label={`${$t('themeDetail.downloadZIP')} · ${currentVer.version}`} />{/key}
          </div>
          <p class="mt-2 text-[10px] leading-relaxed text-cl-dim">{$t('themeDetail.downloadHint')}</p>
        {/if}
      </div>
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex items-center justify-center gap-1.5 text-xs text-cl-dim hover:text-cl-text">{$t('themeDetail.viewSource')}<IconArrowUpRight class="size-3.5" /></a>
    </div>
  </div>
  <dl class="grid grid-cols-2 divide-x divide-cl-border border-t border-cl-border bg-cl-base/50 sm:grid-cols-4">
    <div class="px-4 py-3"><dt class="text-[10px] text-cl-dim">{$t('themeDetail.versions')}</dt><dd class="mt-1 text-sm font-medium tabular-nums">{theme.versions.length}</dd></div>
    <div class="px-4 py-3"><dt class="text-[10px] text-cl-dim">{$t('themeDetail.files')}</dt><dd class="mt-1 text-sm font-medium tabular-nums">{currentVer?.files.length ?? 0}</dd></div>
    <div class="border-t border-cl-border px-4 py-3 sm:border-t-0"><dt class="text-[10px] text-cl-dim">{$t('themeDetail.updatedOn')}</dt><dd class="mt-1 text-xs font-medium">{latestDate ? formatDate(latestDate) : '—'}</dd></div>
    <div class="border-t border-cl-border px-4 py-3 sm:border-t-0"><dt class="text-[10px] text-cl-dim">{$t('themeDetail.customization')}</dt><dd class="mt-1 text-xs font-medium">{currentVer?.injectsCss ? $t('themeDetail.customCss') : $t('themeDetail.standardTheme')}</dd></div>
  </dl>
</header>
