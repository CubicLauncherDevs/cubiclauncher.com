<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { t, locale, getDateLocale } from "$lib/i18n";
  import { renderMarkdown } from "$lib/utils/markdown";
  import { goToThemesList } from "$lib/utils/theme-history";
  import ThemeCard from "$lib/components/themes/ThemeCard.svelte";
  import ThemeDetailHeader from "$lib/components/themes/ThemeDetailHeader.svelte";
  import VersionTimeline from "$lib/components/themes/VersionTimeline.svelte";
  import ThemeLightbox from "$lib/components/themes/ThemeLightbox.svelte";
  import ActivityGraph from "$lib/components/themes/ActivityGraph.svelte";
  import ThemeFiles from "$lib/components/themes/ThemeFiles.svelte";
  import ThemeSocialMeta from "$lib/components/themes/ThemeSocialMeta.svelte";
  import IconArrowLeft from "~icons/ph/arrow-left";
  import IconArrowRight from "~icons/ph/arrow-right";
  import IconDownload from "~icons/ph/download-simple";

  let { data } = $props();
  let theme = $derived(data.theme);
  let relatedThemes = $derived(data.relatedThemes ?? []);
  let sortedVersions = $derived(data.sortedVersions ?? []);
  let authorUrl = $derived(data.authorUrl ?? "/themes");

  let slug = $derived(page.params.slug as string);
  type DetailTab = "description" | "versions" | "files";
  const tabs: DetailTab[] = ["description", "versions", "files"];
  // Static pages render the overview; restore URL state after hydration.
  let mounted = $state(false);
  onMount(() => { mounted = true; });
  let tabParam = $derived(mounted ? page.url.searchParams.get("tab") : null);
  let activeTab = $derived(tabs.includes(tabParam as DetailTab) ? tabParam as DetailTab : "description");
  let canonicalUrl = $derived(page.url.href.split(/[?#]/)[0]);

  let showLightbox = $state(false);
  let lightboxUrl = $state("");

  let expansion = $state<{ slug: string; version: string | null } | null>(null);
  let expandedVersion = $derived(expansion?.slug === slug ? expansion.version : theme.latestVersion);

  let descriptionHtml = $derived(
    theme?.description ? renderMarkdown(theme.description) : ""
  );

  let selection = $state<{ slug: string; version: string } | null>(null);
  let selectedVersion = $derived(selection?.slug === slug ? selection.version : theme.latestVersion);

  let currentVer = $derived(
    theme?.versions.find((v) => v.version === selectedVersion) || theme?.versions[0] || null
  );

  let activityEvents = $derived(
    theme.versions.flatMap((version) => version.date ? [{
      date: version.date,
      label: `${theme.name} · ${version.version}`,
      href: `/themes/${theme.slug}/${encodeURIComponent(version.version)}`,
    }] : [])
  );

  // The theme URL always shares the latest palette, regardless of the UI selection.
  let latestVer = $derived(theme.versions.find((version) => version.version === theme.latestVersion) ?? theme.versions[0]);
  let ogImage = $derived(latestVer?.previewUrl || theme.previewUrl || latestVer?.showcaseUrl || null);
  let shareDescription = $derived($t('themeDetail.shareDescription', {
    values: { name: theme.name, author: theme.author, version: theme.latestVersion },
  }));

  let changelogHtml = $derived(
    currentVer?.changelog ? renderMarkdown(currentVer.changelog) : ""
  );

  function setTab(tab: DetailTab) {
    if (activeTab === tab) return;
    const url = new URL(page.url);
    url.searchParams.set("tab", tab);
    void goto(url, { noScroll: true, keepFocus: true });
  }

  function toggleVersion(ver: string) {
    expansion = { slug, version: expandedVersion === ver ? null : ver };
  }

  let closeLightbox = () => { showLightbox = false; };

  let docTitle = $derived(
    theme ? `${theme.name} - CubicLauncher`
      : slug ? slug : $t('page.themesTitle')
  );

  let jsonLd = $derived(
    theme
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: theme.name,
          description: theme.description
            ? theme.description.replace(/[#*_]/g, '').slice(0, 300)
            : $t('page.themeDesc'),
          applicationCategory: "Theme",
          author: {
            "@type": "Person",
            name: theme.author
          },
          url: canonicalUrl,
          image: ogImage ?? undefined,
          datePublished: theme.date ?? undefined,
          softwareVersion: theme.latestVersion
        })
      : null
  );
</script>

<svelte:head>
  <title>{docTitle}</title>
  {#if jsonLd}
    {@html `<script type="application/ld+json">${jsonLd}<\/script>`}
  {/if}
</svelte:head>

<ThemeSocialMeta
  title={`${theme.name} — ${theme.author}`}
  description={shareDescription}
  author={theme.author}
  url={canonicalUrl}
  image={ogImage}
  imageAlt={`${theme.name} · ${theme.latestVersion} · ${$t('themeDetail.preview')}`}
/>

<section class="min-h-screen pb-16 pt-6 bg-cl-base text-cl-text">
  <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
    <a
      href="/themes"
      onclick={goToThemesList}
      class="inline-flex items-center gap-1 text-[11px] text-cl-dim hover:text-cl-text transition-colors mb-4"
    >
      <IconArrowLeft class="w-3 h-3" />
      {$t('themeDetail.allThemes')}
    </a>

    {#key theme.slug}
      <ThemeDetailHeader
        {theme}
        {currentVer}
        {selectedVersion}
        onVersionChange={(version) => selection = { slug, version }}
        onPreviewClick={(url) => { lightboxUrl = url; showLightbox = true; }}
      />
    {/key}

    <div class="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div class="min-w-0 space-y-5">
        <div class="overflow-hidden rounded-lg border border-cl-border bg-cl-surface">
          <nav class="flex gap-1 overflow-x-auto border-b border-cl-border px-3" aria-label={$t('themeDetail.sections')}>
            {#each tabs as tab}
              <button onclick={() => setTab(tab)} aria-current={activeTab === tab ? 'page' : undefined} class="flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-xs font-medium transition-colors {activeTab === tab ? 'border-cl-text text-cl-text' : 'border-transparent text-cl-dim hover:text-cl-text'}">
                {$t(`themeDetail.${tab}`)}
                {#if tab !== 'description'}<span class="rounded bg-cl-elevated px-1.5 py-0.5 text-[10px] tabular-nums">{tab === 'versions' ? sortedVersions.length : currentVer?.files.length ?? 0}</span>{/if}
              </button>
            {/each}
          </nav>
          <div class="min-h-[200px] p-4 sm:p-5">
            {#if activeTab === 'description'}
              <h2 class="mb-4 text-sm font-semibold">{$t('themeDetail.aboutTheme')}</h2>
              {#if descriptionHtml}
                <div class="prose max-w-none break-words text-sm text-cl-muted [&_img]:max-w-full [&_a]:text-cl-link [&_a]:underline">{@html descriptionHtml}</div>
              {:else}
                <p class="rounded-md border border-dashed border-cl-border bg-cl-base p-4 text-xs leading-relaxed text-cl-dim">{$t('themeDetail.noDescription')}</p>
              {/if}
              {#if currentVer}
                <div class="mt-6 border-t border-cl-border pt-5">
                  <div class="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 class="text-xs font-semibold">{$t('themeDetail.changelog')} · {currentVer.version}</h3><a href={`/themes/${theme.slug}/${encodeURIComponent(currentVer.version)}`} class="inline-flex items-center gap-1 text-[11px] text-cl-dim hover:text-cl-text">{$t('themeDetail.versionDetails')}<IconArrowRight class="size-3" /></a></div>
                  {#if changelogHtml}<div class="prose max-w-none break-words text-xs text-cl-muted">{@html changelogHtml}</div>{:else}<p class="text-xs text-cl-dim">{$t('themeDetail.noChangelog')}</p>{/if}
                </div>
              {/if}
            {:else if activeTab === 'versions'}
              <VersionTimeline versions={sortedVersions} latestVersion={theme.latestVersion} themeName={theme.name} themeAuthor={theme.author} themeSlug={theme.slug} {expandedVersion} onToggleVersion={toggleVersion} />
            {:else if currentVer}
              {#key `${theme.slug}/${currentVer.version}`}<ThemeFiles version={currentVer} />{/key}
            {/if}
          </div>
        </div>
        {#key theme.slug}<ActivityGraph events={activityEvents} title={$t('themeDetail.activityTitle')} />{/key}
      </div>

      <aside class="space-y-4">
        <section class="rounded-lg border border-cl-border bg-cl-surface p-5">
          <h2 class="flex items-center gap-2 text-sm font-semibold"><IconDownload class="size-4 text-cl-dim" />{$t('themeDetail.installTitle')}</h2>
          <ol class="mt-4 space-y-4">
            {#each ['installDownload', 'installImport', 'installApply'] as step, index}
              <li class="flex items-start gap-3 text-xs leading-relaxed text-cl-muted"><span class="flex size-5 shrink-0 items-center justify-center rounded-full border border-cl-border bg-cl-base text-[10px] font-medium text-cl-text">{index + 1}</span><span>{$t(`themeDetail.${step}`)}</span></li>
            {/each}
          </ol>
          <a href="/install" class="mt-5 inline-flex items-center gap-1 text-[11px] text-cl-dim hover:text-cl-text">{$t('themeDetail.getLauncher')}<IconArrowRight class="size-3" /></a>
        </section>
        <section class="rounded-lg border border-cl-border bg-cl-surface p-5">
          <h2 class="text-sm font-semibold">{$t('themeDetail.information')}</h2>
          <dl class="mt-4 space-y-4 text-xs">
            <div><dt class="text-cl-dim">{$t('themeDetail.author')}</dt><dd class="mt-1"><a href={authorUrl} class="hover:underline">{theme.author}</a></dd></div>
            {#if theme.date && !Number.isNaN(Date.parse(theme.date))}<div><dt class="text-cl-dim">{$t('themeDetail.publishedOn')}</dt><dd class="mt-1">{new Date(theme.date).toLocaleDateString(getDateLocale($locale), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</dd></div>{/if}
            <div><dt class="text-cl-dim">{$t('themeDetail.format')}</dt><dd class="mt-1">.cbth</dd></div>
            <div><dt class="text-cl-dim">{$t('themeDetail.latestVersion')}</dt><dd class="mt-1">{theme.latestVersion}</dd></div>
          </dl>
        </section>
      </aside>
    </div>

    {#if relatedThemes.length > 0}
      <section class="mt-8 border-t border-cl-border pt-6">
        <a href={authorUrl} class="mb-4 flex items-center justify-between gap-3 text-sm font-semibold transition-colors hover:text-cl-muted">{$t('themeDetail.moreBy', { values: { author: theme.author } })}<IconArrowRight class="size-4 shrink-0" /></a>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {#each relatedThemes.slice(0, 4) as related}<ThemeCard theme={related} />{/each}
        </div>
      </section>
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
