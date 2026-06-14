<script lang="ts">
  import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
  import { page } from "$app/state";
  import { t } from "$lib/i18n";

  let { children } = $props();
</script>

<svelte:head>
  <title>{page.data.title || $t('page.docsTitle')}</title>
</svelte:head>

<DocsLayout
  docsIndex={page.data.docsIndex}
  prev={page.data.prev}
  next={page.data.next}
>
  {@render children()}
</DocsLayout>
