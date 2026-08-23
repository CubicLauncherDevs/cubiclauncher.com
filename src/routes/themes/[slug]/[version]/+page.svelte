<script lang="ts">
  import { page } from "$app/stores";
  import { t, locale } from "$lib/i18n";
  import type { Theme, ThemeVersion } from "$lib/types/theme";
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
    {@html `<script type="application/ld+json">${jsonLd}</script>`}
  {/if}
</svelte:head>

<section class="min-h-screen pt-[calc(var(--discord-nav-height)+40px)] pb-24 bg-neutral-950 text-white">
  <div class="mx-auto px-6 lg:px-8 relative z-10" style="max-width: var(--discord-max-width);">
    {#if loading}
      <div class="animate-pulse space-y-6 max-w-4xl mx-auto">
        <div class="h-7 bg-neutral-800 rounded w-40"></div>
        <div class="aspect-video bg-neutral-800 rounded-lg"></div>
        <div class="space-y-2">
          <div class="h-5 bg-neutral-800 rounded w-56"></div>
          <div class="h-3.5 bg-neutral-800 rounded w-80"></div>
        </div>
      </div>
    {:else if error}
      <div class="text-center py-20 max-w-4xl mx-auto">
        <p class="text-neutral-400 text-[16px] mb-5">{error}</p>
        <div class="flex gap-4 justify-center">
          <a
            href="/themes"
            onclick={goToThemesList}
            class="px-5 py-2.5 text-[13px] font-medium rounded-[4px] border border-white/10 text-neutral-400 hover:text-white hover:border-white/25 transition-colors"
          >
            {$t('themeDetail.viewAll')}
          </a>
        </div>
      </div>
    {:else if theme && ver}
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center gap-2 text-[13px] text-neutral-500 mb-6">
          <a href="/themes" onclick={goToThemesList} class="hover:text-white transition-colors">{$t('themeDetail.allThemes')}</a>
          <span>/</span>
          <a href="/themes/{theme.slug}" class="hover:text-white transition-colors">{theme.name}</a>
          <span>/</span>
          <span class="text-white">{ver.version}</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-7 lg:gap-10 mb-10">
          <div class="lg:col-span-3">
            {#if ver.showcaseUrl && ver.previewUrl}
              <div class="flex flex-col sm:flex-row gap-2.5">
                <div class="rounded-lg overflow-hidden border border-white/10 bg-neutral-900 flex-1 min-w-0">
                  <img
                    src={ver.showcaseUrl}
                    alt="{theme.name} {ver.version}"
                    loading="lazy"
                    decoding="async"
                    class="w-full aspect-video object-cover"
                  />
                </div>
                <div class="rounded-lg overflow-hidden border border-white/10 bg-neutral-900 flex-1 min-w-0">
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
              <div class="rounded-lg overflow-hidden border border-white/10 bg-neutral-900">
                <img
                  src={ver.showcaseUrl || ver.previewUrl}
                  alt="{theme.name} {ver.version}"
                  loading="lazy"
                  decoding="async"
                  class="w-full aspect-video object-cover"
                />
              </div>
            {:else}
              <div class="rounded-lg border border-white/10 bg-neutral-900 aspect-video flex items-center justify-center text-neutral-600">
                <IconImage class="w-14 h-14" />
              </div>
            {/if}
          </div>

          <div class="lg:col-span-2">
            <div class="flex items-start gap-2 mb-1">
              <h1 class="text-[26px] sm:text-[32px] font-semibold tracking-tight">{theme.name}</h1>
              {#if getThemeVerification(theme) !== "none"}
                <VerifiedBadge size="lg" level={getThemeVerification(theme)} />
              {/if}
            </div>
            <p class="text-[14px] text-neutral-400 mb-1">
              {$t('themeDetail.by')} <a href={authorUrl} class="text-white hover:underline underline-offset-4 decoration-white/30 transition-all">{theme.author}</a>
            </p>
            <p class="text-[13px] text-neutral-500 mb-4">{$t('themeDetail.version')} {ver.version}</p>

            {#if ver.date}
              <p class="text-[12px] text-neutral-500 mb-5">
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

            <div class="flex items-center gap-1.5 mt-4">
              {#each theme.versions as v}
                <a
                  href="/themes/{theme.slug}/{v.version}"
                  class="px-2 py-1 rounded-[3px] text-[11px] transition-colors {v.version === ver.version ? 'bg-white/15 text-white' : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'}"
                >
                  {v.version}
                </a>
              {/each}
            </div>

            <a
              href="/themes/{theme.slug}"
              class="block text-center text-[12px] text-neutral-500 hover:text-white transition-colors mt-4"
            >
              {$t('themeDetail.backToTheme')}
            </a>
          </div>
        </div>

        {#if changelogHtml}
          <div class="mt-6 pt-6 border-t border-white/5">
            <h2 class="text-[16px] font-semibold tracking-tight mb-3">{$t('themeDetail.changelog')} — {ver.version}</h2>
            <div class="prose prose-invert prose-neutral max-w-none text-[13px] text-neutral-300">
              {@html changelogHtml}
            </div>
          </div>
        {:else}
          <div class="mt-6 pt-6 border-t border-white/5">
            <h2 class="text-[16px] font-semibold tracking-tight mb-3">{$t('themeDetail.changelog')} — {ver.version}</h2>
            <p class="text-[13px] text-neutral-500 italic">{$t('themeDetail.noChangelog')}</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>
