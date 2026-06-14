<script lang="ts">
  import { page } from "$app/stores";
  import ThemeDetail from "$lib/components/themes/ThemeDetail.svelte";

  let slug = $derived($page.params.slug ?? "");
</script>

<ThemeDetail {slug} />
