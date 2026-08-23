<script lang="ts">
  import { t } from "$lib/i18n";
  import type { ThemePackage } from "$lib/types/theme";
  import IconImage from "~icons/ph/image";
  import IconPackage from "~icons/ph/package";

  let { pkg }: { pkg: ThemePackage } = $props();

  let imgLoaded = $state(false);
</script>

<div class="group flex flex-col bg-cl-surface border border-cl-border rounded overflow-hidden hover:border-cl-border-hover hover:bg-cl-elevated transition-colors h-full cursor-pointer">
  <a
    href="/themes/packs/{pkg.slug}"
    class="block aspect-video bg-cl-elevated relative overflow-hidden"
  >
    {#if pkg.previewUrl}
      <img
        src={pkg.previewUrl}
        alt={pkg.name}
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        class="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 {imgLoaded ? 'opacity-100' : 'opacity-0'}"
        onload={() => (imgLoaded = true)}
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center text-cl-dim">
        <IconImage class="w-7 h-7" />
      </div>
    {/if}
  </a>

  <div class="p-3 flex flex-col flex-1">
    <a href="/themes/packs/{pkg.slug}" class="block group/title">
      <h3 class="text-xs font-semibold text-white truncate group-hover/title:text-cl-muted transition-colors">{pkg.name}</h3>
    </a>
    <p class="text-[11px] text-cl-muted truncate mt-0.5">{pkg.author}</p>

    <div class="mt-auto pt-2 flex items-center gap-2">
      <span class="inline-flex items-center gap-1 text-[10px] font-medium text-cl-muted bg-cl-base border border-cl-border px-1.5 py-0.5 rounded">
        <IconPackage class="w-3 h-3" />
        {pkg.themes.length}
      </span>
    </div>
  </div>
</div>
