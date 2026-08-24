<script lang="ts">
  import { page } from "$app/stores";
  import { t } from "$lib/i18n";
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
    {@html `<script type="application/ld+json">${jsonLd}<\/script>`}
  {/if}
</svelte:head>

<section class="min-h-screen pb-16 pt-[calc(var(--navbar-height)+24px)] bg-cl-base text-cl-text">
  <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
    <a
      href="/themes?tab=packages"
      onclick={goToThemesList}
      class="inline-flex items-center gap-1 text-[11px] text-cl-dim hover:text-cl-text transition-colors mb-4"
    >
      <IconArrowLeft class="w-3 h-3" />
      {$t('packageDetail.viewAll')}
    </a>

    {#if resolved}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-8">
          <!-- Header -->
          <div class="mb-4">
            <h1 class="text-lg sm:text-xl font-semibold text-cl-text mb-1">
              {resolved.name}
            </h1>
            <p class="text-xs text-cl-muted">
              {$t('themeDetail.by')} <span class="text-cl-text">{resolved.author}</span>
              {#if resolved.date}
                <span class="mx-1.5 text-cl-border-hover">·</span>
                {new Date(resolved.date).toLocaleDateString()}
              {/if}
            </p>
          </div>

          <!-- Preview -->
          <div class="aspect-video w-full rounded overflow-hidden bg-cl-surface border border-cl-border mb-4">
            <img
              src={resolved.previewUrl}
              alt={resolved.name}
              loading="eager"
              decoding="async"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Info -->
          <div class="border border-cl-border rounded bg-cl-surface p-4 mb-4">
            {#if descriptionHtml}
              <div class="prose prose-invert prose-neutral max-w-none text-xs text-cl-muted">
                {@html descriptionHtml}
              </div>
            {:else}
              <p class="text-xs text-cl-dim italic">{$t('packageDetail.noDescription')}</p>
            {/if}
          </div>

          <!-- Missing themes warning -->
          {#if resolved.missingThemes.length > 0}
            <div class="flex items-start gap-2 p-3 rounded bg-cl-warning/10 border border-cl-warning/20 text-cl-warning text-xs mb-4">
              <IconWarning class="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <p class="font-medium">{$t('packageDetail.themeMissing')}</p>
                <p class="text-[10px] text-cl-warning/70 mt-0.5">{resolved.missingThemes.join(", ")}</p>
              </div>
            </div>
          {/if}

          <!-- Included themes -->
          {#if resolved.resolvedThemes.length > 0}
            <div class="border-t border-cl-border pt-4">
              <h2 class="text-sm font-semibold mb-3">
                {$t('packageDetail.includedThemes')}
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {#each resolved.resolvedThemes as theme}
                  <ThemeCard {theme} />
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div class="lg:col-span-4">
          <div class="border border-cl-border rounded bg-cl-surface p-4 sticky top-[calc(var(--navbar-height)+16px)]">
            <p class="text-[10px] text-cl-dim uppercase tracking-wide mb-2">
              {$t('themes.packageThemesCount', { values: { count: resolved.themes.length } })}
            </p>
            <PackageDownloadButton {resolved} />
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>
