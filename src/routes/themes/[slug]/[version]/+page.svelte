<script lang="ts">
  import { page } from "$app/stores";
  import { t, locale } from "$lib/i18n";
  import { slugify } from "$lib/utils/theme-search";
  import { renderMarkdown } from "$lib/utils/markdown";
  import { getThemeVerification } from "$lib/utils/themes";
  import { goToThemesList } from "$lib/utils/theme-history";
  import IconImage from "~icons/ph/image";
  import DownloadThemeButton from "$lib/components/themes/DownloadThemeButton.svelte";
  import VerifiedBadge from "$lib/components/themes/VerifiedBadge.svelte";

  let { data } = $props();
  let theme = $derived(data.theme);
  let ver = $derived(data.version);

  let slug = $derived($page.params.slug as string);
  let versionName = $derived($page.params.version as string);
  let canonicalUrl = $derived($page.url.href.split('?')[0]);

  let loading = $state(false);
  let error = $state("");

  let changelogHtml = $derived(
    ver?.changelog ? renderMarkdown(ver.changelog) : ""
  );

  let authorUrl = $derived(theme ? `/themes/author/${slugify(theme.author)}` : "/themes");

  let docTitle = $derived(
    theme ? `${theme.name} ${versionName} - CubicLauncher` : "CubicLauncher"
  );

  let jsonLd = $derived(
    theme && ver
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: `${theme.name} ${ver.version}`,
          description: ver.changelog
            ? ver.changelog.replace(/[#*_]/g, '').slice(0, 300)
            : $t('page.themeDesc'),
          applicationCategory: "Theme",
          author: {
            "@type": "Person",
            name: theme.author
          },
          url: canonicalUrl,
          image: ver.showcaseUrl || ver.previewUrl || theme.previewUrl || undefined,
          datePublished: ver.date ?? theme.date ?? undefined,
          softwareVersion: ver.version
        })
      : null
  );
</script>

<svelte:head>
  <title>{docTitle}</title>
  <meta name="description" content={$t('page.themeDesc')} />
  <link rel="canonical" href={canonicalUrl} />
  {#if jsonLd}
    {@html `<script type="application/ld+json">${jsonLd}<\/script>`}
  {/if}
</svelte:head>

<section class="min-h-screen pb-16 pt-[calc(var(--navbar-height)+24px)] bg-cl-base text-cl-text">
  <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
    {#if loading}
      <div class="animate-pulse space-y-4 max-w-4xl">
        <div class="h-5 bg-cl-elevated rounded w-32"></div>
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
    {:else if theme && ver}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-8">
          <div class="flex items-center gap-2 text-[11px] text-cl-dim mb-4">
            <a href="/themes" onclick={goToThemesList} class="hover:text-cl-text transition-colors">{$t('themeDetail.allThemes')}</a>
            <span>/</span>
            <a href="/themes/{theme.slug}" class="hover:text-cl-text transition-colors">{theme.name}</a>
            <span>/</span>
            <span class="text-cl-text">{ver.version}</span>
          </div>

          {#if ver.showcaseUrl && ver.previewUrl}
            <div class="flex flex-col sm:flex-row gap-2 mb-4">
              <div class="rounded overflow-hidden border border-cl-border bg-cl-surface flex-1 min-w-0">
                <img
                  src={ver.showcaseUrl}
                  alt="{theme.name} {ver.version}"
                  loading="lazy"
                  decoding="async"
                  class="w-full aspect-video object-cover"
                />
              </div>
              <div class="rounded overflow-hidden border border-cl-border bg-cl-surface flex-1 min-w-0">
                <img
                  src={ver.previewUrl}
                  alt="{theme.name} {ver.version} palette"
                  loading="lazy"
                  decoding="async"
                  class="w-full aspect-video object-cover"
                />
              </div>
            </div>
          {:else if ver.showcaseUrl || ver.previewUrl}
            <div class="rounded overflow-hidden border border-cl-border bg-cl-surface mb-4">
              <img
                src={ver.showcaseUrl || ver.previewUrl}
                alt="{theme.name} {ver.version}"
                loading="lazy"
                decoding="async"
                class="w-full aspect-video object-cover"
              />
            </div>
          {:else}
            <div class="rounded border border-cl-border bg-cl-surface aspect-video flex items-center justify-center text-cl-dim mb-4">
              <IconImage class="w-10 h-10" />
            </div>
          {/if}

          {#if changelogHtml}
            <div class="border border-cl-border rounded bg-cl-surface p-4">
              <h2 class="text-sm font-semibold mb-2">{$t('themeDetail.changelog')} — {ver.version}</h2>
              <div class="prose prose-invert prose-neutral max-w-none text-xs text-cl-muted">
                {@html changelogHtml}
              </div>
            </div>
          {:else}
            <div class="border border-cl-border rounded bg-cl-surface p-4">
              <h2 class="text-sm font-semibold mb-2">{$t('themeDetail.changelog')} — {ver.version}</h2>
              <p class="text-xs text-cl-dim italic">{$t('themeDetail.noChangelog')}</p>
            </div>
          {/if}
        </div>

        <div class="lg:col-span-4">
          <div class="border border-cl-border rounded bg-cl-surface p-4 sticky top-[calc(var(--navbar-height)+16px)]">
            <div class="flex items-start gap-2 mb-1">
              <h1 class="text-base font-semibold text-cl-text">{theme.name}</h1>
              {#if getThemeVerification(theme) !== "none"}
                <VerifiedBadge size="md" level={getThemeVerification(theme)} />
              {/if}
            </div>
            <p class="text-xs text-cl-muted mb-0.5">
              {$t('themeDetail.by')} <a href={authorUrl} class="text-cl-text hover:underline underline-offset-4 decoration-cl-border-hover transition-all">{theme.author}</a>
            </p>
            <p class="text-xs text-cl-dim mb-3">{$t('themeDetail.version')} {ver.version}</p>

            {#if ver.date}
              <p class="text-[11px] text-cl-dim mb-3">
                {$t('themeDetail.publishedOn')} {new Date(ver.date).toLocaleDateString($locale === 'en' ? 'en-US' : 'es-ES', {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            {/if}

            <DownloadThemeButton
              version={ver}
              themeName={theme.name}
              label={`${$t('themeDetail.downloadZIP')} (${ver.version})`}
            />

            <div class="flex flex-wrap gap-1 mt-3">
              {#each theme.versions as v}
                <a
                  href="/themes/{theme.slug}/{v.version}"
                  class="px-1.5 py-0.5 rounded text-[10px] transition-colors border {v.version === ver.version ? 'bg-cl-elevated border-cl-border text-cl-text' : 'bg-cl-base border-cl-border text-cl-muted hover:text-cl-text hover:bg-cl-elevated'}"
                >
                  {v.version}
                </a>
              {/each}
            </div>

            <a
              href="/themes/{theme.slug}"
              class="block text-center text-[11px] text-cl-dim hover:text-cl-text transition-colors mt-3"
            >
              {$t('themeDetail.backToTheme')}
            </a>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>
