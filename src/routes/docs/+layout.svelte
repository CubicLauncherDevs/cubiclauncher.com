<script lang="ts">
  import DocsLayout from "$lib/components/docs/DocsLayout.svelte";
  import { page } from "$app/state";

  let { children } = $props();
</script>

<svelte:head>
  <title>{page.data.title || "Documentación | CubicLauncher"}</title>
</svelte:head>

<DocsLayout
  docsIndex={page.data.docsIndex}
  prev={page.data.prev}
  next={page.data.next}
>
  {@render children()}
</DocsLayout>
