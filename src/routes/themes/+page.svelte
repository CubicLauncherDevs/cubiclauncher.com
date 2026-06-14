<script lang="ts">
  import { t } from "$lib/i18n";
  import ThemesContent from "$lib/components/themes/ThemesContent.svelte";
</script>

<svelte:head>
  <title>{$t('page.themesTitle')}</title>
  <meta name="description" content={$t('page.themesDesc')} />
</svelte:head>

<ThemesContent />
