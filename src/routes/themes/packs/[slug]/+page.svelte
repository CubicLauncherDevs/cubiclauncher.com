<script lang="ts">
  import { page } from "$app/stores";
  import { t } from "$lib/i18n";
  import type { ResolvedThemePackage } from "$lib/types/theme";
  import { renderMarkdown } from "$lib/utils/markdown";
  import ThemeCard from "$lib/components/themes/ThemeCard.svelte";
  import PackageDownloadButton from "$lib/components/themes/PackageDownloadButton.svelte";
  import IconWarning from "~icons/ph/warning";
  import IconArrowLeft from "~icons/ph/arrow-left";

  let { data } = $props();
  let resolved = $derived(data.resolved);

  let canonicalUrl = $derived($page.url.href.split('?')[0]);

  let descriptionHtml = $derived(
    resolved?.description ? renderMarkdown(resolved.description) : ""
  );

  let docTitle = $derived(
    $t('page.packageTitle', { values: { name: resolved.name } })
  );

  let jsonLd = $derived(
    resolved
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: resolved.name,
          description: resolved.description
            ? resolved.description.replace(/[#*_]/g, '').slice(0, 300)
            : $t('page.packageDesc'),
          applicationCategory: "ThemePackage",
          author: {
            "@type": "Person",
            name: resolved.author
          },
          url: canonicalUrl,
          image: resolved.previewUrl || undefined,
          datePublished: resolved.date ?? undefined,
          hasPart: resolved.resolvedThemes.map((theme) => ({
            "@type": "SoftwareApplication",
            name: theme.name,
            url: `${$page.url.origin}/themes/${theme.slug}`
          }))
        })
      : null
  );
</script>

<svelte:head>
  <title>{docTitle}</title>
  <meta name="description" content={resolved?.description ? resolved.description.slice(0, 160) : $t('page.packageDesc')} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:title" content={resolved?.name ?? ''} />
  <meta property="og:description" content={resolved?.description ? resolved.description.slice(0, 160) : $t('page.packageDesc')} />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:type" content="website" />
  {#if resolved?.previewUrl}
    <meta property="og:image" content={resolved.previewUrl} />
    <meta property="og:image:width" content="1600" />
    <meta property="og:image:height" content="900" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={resolved.previewUrl} />
  {/if}
  {#if jsonLd}
    {@html `<script type="application/ld+json">${jsonLd}</script>`}
  {/if}
</svelte:head>

<section class="min-h-screen pt-40 pb-32 bg-neutral-950 text-white overflow-hidden relative">
  <div class="absolute top-0 inset-x-0 h-125 bg-linear-to-b from-white/3 to-transparent pointer-events-none"></div>
  <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/2 blur-[120px] rounded-full pointer-events-none"></div>

  <div class="container mx-auto px-6 relative z-10 max-w-6xl">
    <a
      href="/themes?tab=packages"
      class="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors mb-8"
    >
      <IconArrowLeft class="w-4 h-4" />
      {$t('packageDetail.viewAll')}
    </a>

    {#if resolved}
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-3">
            {resolved.name}
          </h1>
          <p class="text-sm text-neutral-400">
            {$t('themeDetail.by')} <span class="text-white">{resolved.author}</span>
            {#if resolved.date}
              <span class="mx-2 text-neutral-600">·</span>
              {$t('themeDetail.publishedOn')} {new Date(resolved.date).toLocaleDateString()}
            {/if}
          </p>
        </div>

        <!-- Preview -->
        <div class="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 mb-8">
          <img
            src={resolved.previewUrl}
            alt={resolved.name}
            loading="eager"
            decoding="async"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Info and download -->
        <div class="flex flex-col lg:flex-row gap-8 mb-12">
          <div class="flex-1">
            {#if descriptionHtml}
              <div class="prose prose-invert prose-neutral max-w-none text-sm text-neutral-300">
                {@html descriptionHtml}
              </div>
            {:else}
              <p class="text-sm text-neutral-500 italic">{$t('packageDetail.noDescription')}</p>
            {/if}
          </div>
          <div class="lg:w-72 shrink-0">
            <div class="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
              <p class="text-xs text-neutral-500 uppercase tracking-wider mb-4">
                {$t('themes.packageThemesCount', { values: { count: resolved.themes.length } })}
              </p>
              <PackageDownloadButton {resolved} />
            </div>
          </div>
        </div>

        <!-- Missing themes warning -->
        {#if resolved.missingThemes.length > 0}
          <div class="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm mb-8">
            <IconWarning class="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p class="font-medium">{$t('packageDetail.themeMissing')}</p>
              <p class="text-xs text-yellow-200/70 mt-1">{resolved.missingThemes.join(", ")}</p>
            </div>
          </div>
        {/if}

        <!-- Included themes -->
        {#if resolved.resolvedThemes.length > 0}
          <div class="border-t border-white/10 pt-12">
            <h2 class="text-xl font-bold tracking-tighter mb-6">
              {$t('packageDetail.includedThemes')}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {#each resolved.resolvedThemes as theme}
                <ThemeCard {theme} />
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>
