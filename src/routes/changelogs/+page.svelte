<script lang="ts">
  import { t } from "$lib/i18n";
  import { getCanonicalUrl } from "$lib/utils/site.js";
  import ChangelogsContent from "$lib/components/changelogs/ChangelogsContent.svelte";
</script>

<svelte:head>
  <title>{$t('changelogs.pageTitle')}</title>
  <meta name="description" content={$t('changelogs.subtitle')} />
  <link rel="canonical" href={getCanonicalUrl('/changelogs')} />
</svelte:head>

<ChangelogsContent />
