<script lang="ts">
  import { page } from "$app/stores";
  import ThemeDetail from "$lib/components/themes/ThemeDetail.svelte";
</script>

<svelte:head>
  <title>{$page.params.slug.split(":").at(0) || "Tema"} - CubicLauncher</title>
  <meta name="description" content="Detalle del tema para CubicLauncher." />
</svelte:head>

<ThemeDetail slug={$page.params.slug} />
