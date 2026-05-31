<script lang="ts">
  import { page } from "$app/stores";
  import ThemeDetail from "$lib/components/themes/ThemeDetail.svelte";

  let slug = $derived($page.params.slug ?? "");
</script>

<svelte:head>
  <title>{slug.split(":").at(0) || "Tema"} - CubicLauncher</title>
  <meta name="description" content="Detalle del tema para CubicLauncher." />
</svelte:head>

<ThemeDetail {slug} />
