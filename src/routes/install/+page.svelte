<script lang="ts">
  import { t } from "$lib/i18n";
  import InstallContent from "$lib/components/install/InstallContent.svelte";
</script>

<svelte:head>
  <title>{$t('page.installTitle')}</title>
  <meta
    name="description"
    content={$t('page.installDesc')}
  />
</svelte:head>

<InstallContent />
