<script lang="ts">
  import { page } from "$app/stores";
  import { pushState } from "$app/navigation";
  import { t } from "$lib/i18n";
  import type { Theme, ThemeVersion } from "$lib/types/theme";
  import { slugify } from "$lib/utils/theme-search";
  import { renderMarkdown } from "$lib/utils/markdown";
  import { goToThemesList } from "$lib/utils/theme-history";
import ThemeCard from "$lib/components/themes/ThemeCard.svelte";
import ThemeDetailHeader from "$lib/components/themes/ThemeDetailHeader.svelte";
import VersionTimeline from "$lib/components/themes/VersionTimeline.svelte";
import ThemeLightbox from "$lib/components/themes/ThemeLightbox.svelte";
import ActivityGraph from "$lib/components/themes/ActivityGraph.svelte";
import IconArrowLeft from "~icons/ph/arrow-left";

  let { data } = $props();
  let theme = $derived(data.theme);
  let relatedThemes = $derived(data.relatedThemes ?? []);
  let sortedVersions = $derived(data.sortedVersions ?? []);
  let authorUrl = $derived(data.authorUrl ?? "/themes");

  let slug = $derived($page.params.slug as string);
  let tabParam = $derived(($page.url.searchParams.get("tab") || "description") as "description" | "versions");
  let canonicalUrl = $derived($page.url.href.split('?')[0]);

  let loading = $state(false);
  let error = $state("");
  let showLightbox = $state(false);
  let lightboxUrl = $state("");

  let activeTab = $state<"description" | "versions">("description");
  let expandedVersion = $state<string | null>(null);

  $effect(() => {
    activeTab = tabParam;
  });

  let descriptionHtml = $derived(
    theme?.description ? renderMarkdown(theme.description) : ""
  );

  let selectedVersion = $state<string>("");

  $effect.pre(() => {
    selectedVersion = theme.latestVersion;
  });

  let currentVer = $derived(
    theme?.versions.find((v) => v.version === selectedVersion) || theme?.versions[0] || null
  );

  let versionDates = $derived(
    theme?.versions.flatMap((v) => (v.date ? [v.date] : [])) ?? []
  );

  let ogImage = $derived(
    currentVer?.showcaseUrl || currentVer?.previewUrl || theme?.previewUrl || null
  );

  let changelogHtml = $derived(
    currentVer?.changelog ? renderMarkdown(currentVer.changelog) : ""
  );

  function setTab(tab: "description" | "versions") {
    activeTab = tab;
    pushState(`/themes/${slug}?tab=${tab}`, {});
  }

  function toggleVersion(ver: string) {
    expandedVersion = expandedVersion === ver ? null : ver;
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
  <meta name="description" content={theme?.description ? theme.description.slice(0, 160) : $t('page.themeDesc')} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:title" content={theme?.name ?? ''} />
  <meta property="og:description" content={theme?.description ? theme.description.slice(0, 160) : $t('page.themeDesc')} />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:type" content="website" />
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1600" />
    <meta property="og:image:height" content="900" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={ogImage} />
  {/if}
  {#if jsonLd}
    {@html `<script type="application/ld+json">${jsonLd}<\/script>`}
  {/if}
</svelte:head>

<section class="min-h-screen pb-16 pt-[calc(var(--navbar-height)+24px)] bg-cl-base text-cl-text">
  <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
    <a
      href="/themes"
      onclick={goToThemesList}
      class="inline-flex items-center gap-1 text-[11px] text-cl-dim hover:text-cl-text transition-colors mb-4"
    >
      <IconArrowLeft class="w-3 h-3" />
      {$t('themeDetail.allThemes')}
    </a>

    {#if loading}
      <div class="animate-pulse space-y-4 max-w-4xl">
        <div class="h-6 bg-cl-elevated rounded w-32"></div>
        <div class="aspect-video bg-cl-elevated rounded"></div>
        <div class="space-y-2">
          <div class="h-4 bg-cl-elevated rounded w-40"></div>
          <div class="h-3 bg-cl-elevated rounded w-60"></div>
        </div>
      </div>
    {:else if error}
      <div class="text-center py-12 max-w-4xl mx-auto rounded border border-cl-border bg-cl-surface">
        <p class="text-cl-muted text-sm mb-4">{error}</p>
        <a
          href="/themes"
          onclick={goToThemesList}
          class="px-4 py-1.5 text-xs font-medium rounded border border-cl-border text-cl-muted hover:text-cl-text hover:border-cl-border-hover transition-colors"
        >
          {$t('themeDetail.viewAll')}
        </a>
      </div>
    {:else if theme}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <!-- Sidebar info -->
        <div class="lg:col-span-4 order-2 lg:order-1">
          <div class="border border-cl-border rounded bg-cl-surface p-4 sticky top-[calc(var(--navbar-height)+16px)]">
            <ThemeDetailHeader
              {theme}
              {currentVer}
              {selectedVersion}
              onVersionChange={(ver) => selectedVersion = ver}
              onPreviewClick={(url: string) => { lightboxUrl = url; showLightbox = true; }}
            />

            {#if versionDates.length > 0}
              <ActivityGraph dates={versionDates} title={$t('themeDetail.activityTitle')} />
            {/if}
          </div>
        </div>

        <!-- Main content -->
        <div class="lg:col-span-8 order-1 lg:order-2">
          <!-- Tabs -->
          <div class="border-b border-cl-border mb-4">
            <div class="flex gap-0">
              <button
                onclick={() => setTab("description")}
                class="px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px {activeTab === 'description' ? 'border-cl-text text-cl-text' : 'border-transparent text-cl-dim hover:text-cl-text'}"
              >
                {$t('themeDetail.description')}
              </button>
              <button
                onclick={() => setTab("versions")}
                class="px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px {activeTab === 'versions' ? 'border-cl-text text-cl-text' : 'border-transparent text-cl-dim hover:text-cl-text'}"
              >
                {$t('themeDetail.versions')}
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="border border-cl-border rounded bg-cl-surface p-4 min-h-[200px]">
            {#if activeTab === "description"}
              {#if descriptionHtml}
                <div class="prose prose-invert prose-neutral max-w-none text-xs text-cl-muted">
                  {@html descriptionHtml}
                </div>
              {:else}
                <p class="text-xs text-cl-dim italic">{$t('themeDetail.noDescription')}</p>
              {/if}
            {:else if activeTab === "versions"}
              <VersionTimeline
                versions={sortedVersions}
                latestVersion={theme.latestVersion}
                themeName={theme.name}
                themeAuthor={theme.author}
                {expandedVersion}
                onToggleVersion={toggleVersion}
              />
            {/if}
          </div>

          <!-- Related themes -->
          {#if relatedThemes.length > 0}
            <div class="mt-6 pt-4 border-t border-cl-border">
              <a href={authorUrl} class="block text-sm font-semibold mb-3 hover:text-cl-muted transition-colors">
                {$t('themeDetail.moreBy', { values: { author: theme.author } })}
              </a>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {#each relatedThemes.slice(0, 4) as related}
                  <ThemeCard theme={related} />
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
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
