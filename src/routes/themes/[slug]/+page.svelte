<script lang="ts">
  import { page } from "$app/stores";
  import { t } from "$lib/i18n";
  import ThemeDetail from "$lib/components/themes/ThemeDetail.svelte";

  let slug = $derived($page.params.slug ?? "");
</script>

<svelte:head>
  <title>{$t('page.themeTitle', { name: slug.split(":").at(0) || "" })}</title>
  <meta name="description" content={$t('page.themeDesc')} />
</svelte:head>

<ThemeDetail {slug} />
