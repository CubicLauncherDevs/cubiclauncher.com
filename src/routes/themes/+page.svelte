<script lang="ts">
  import { page } from "$app/stores";
  import { t } from "$lib/i18n";
  import { getCanonicalUrl } from "$lib/utils/site.js";
  import ThemesContent from "$lib/components/themes/ThemesContent.svelte";

  let { data } = $props();
  let canonicalUrl = $derived(getCanonicalUrl($page.url.pathname));
</script>

<svelte:head>
  <title>{$t('page.themesTitle')}</title>
  <meta name="description" content={$t('page.themesDesc')} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:title" content={$t('page.themesTitle')} />
  <meta property="og:description" content={$t('page.themesDesc')} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:type" content="website" />
</svelte:head>

<ThemesContent initialThemes={data.themes} initialPackages={data.packages} />
