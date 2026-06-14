<script lang="ts">
  import { t } from "$lib/i18n";
  import HomeContent from "$lib/components/main/HomeContent.svelte";
</script>

<svelte:head>
  <title>{$t('page.homeTitle')}</title>
  <meta
    name="description"
    content={$t('page.homeDesc')}
  />
</svelte:head>

<HomeContent />
