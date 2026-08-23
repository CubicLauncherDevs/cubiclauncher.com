<script lang="ts">
  import { page } from "$app/stores";
  import { t } from "$lib/i18n";
  import type { ResolvedThemePackage } from "$lib/types/theme";
  import { renderMarkdown } from "$lib/utils/markdown";
  import ThemeCard from "$lib/components/themes/ThemeCard.svelte";
  import PackageDownloadButton from "$lib/components/themes/PackageDownloadButton.svelte";
  import IconWarning from "~icons/ph/warning";
  import IconArrowLeft from "~icons/ph/arrow-left";
  import { goToThemesList } from "$lib/utils/theme-history";

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

<section class="min-h-screen pt-[calc(var(--discord-nav-height)+40px)] pb-24 bg-neutral-950 text-white">
  <div class="mx-auto px-6 lg:px-8 relative z-10" style="max-width: var(--discord-max-width);">
    <a
      href="/themes?tab=packages"
      onclick={goToThemesList}
      class="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-white transition-colors mb-6"
    >
      <IconArrowLeft class="w-4 h-4" />
      {$t('packageDetail.viewAll')}
    </a>

    {#if resolved}
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-[28px] sm:text-[34px] font-semibold tracking-tight text-white mb-2">
            {resolved.name}
          </h1>
          <p class="text-[13px] text-neutral-400">
            {$t('themeDetail.by')} <span class="text-white">{resolved.author}</span>
            {#if resolved.date}
              <span class="mx-2 text-neutral-600">·</span>
              {$t('themeDetail.publishedOn')} {new Date(resolved.date).toLocaleDateString()}
            {/if}
          </p>
        </div>

        <!-- Preview -->
        <div class="aspect-video w-full rounded-lg overflow-hidden bg-neutral-900 border border-white/10 mb-6">
          <img
            src={resolved.previewUrl}
            alt={resolved.name}
            loading="eager"
            decoding="async"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Info and download -->
        <div class="flex flex-col lg:flex-row gap-7 mb-10">
          <div class="flex-1">
            {#if descriptionHtml}
              <div class="prose prose-invert prose-neutral max-w-none text-[13px] text-neutral-300">
                {@html descriptionHtml}
              </div>
            {:else}
              <p class="text-[13px] text-neutral-500 italic">{$t('packageDetail.noDescription')}</p>
            {/if}
          </div>
          <div class="lg:w-64 shrink-0">
            <div class="bg-neutral-900/50 border border-white/10 rounded-lg p-5">
              <p class="text-[11px] text-neutral-500 uppercase tracking-wide mb-3">
                {$t('themes.packageThemesCount', { values: { count: resolved.themes.length } })}
              </p>
              <PackageDownloadButton {resolved} />
            </div>
          </div>
        </div>

        <!-- Missing themes warning -->
        {#if resolved.missingThemes.length > 0}
          <div class="flex items-start gap-3 p-3.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-[13px] mb-6">
            <IconWarning class="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p class="font-medium">{$t('packageDetail.themeMissing')}</p>
              <p class="text-[11px] text-yellow-200/70 mt-1">{resolved.missingThemes.join(", ")}</p>
            </div>
          </div>
        {/if}

        <!-- Included themes -->
        {#if resolved.resolvedThemes.length > 0}
          <div class="border-t border-white/10 pt-10">
            <h2 class="text-lg font-semibold tracking-tight mb-5">
              {$t('packageDetail.includedThemes')}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
