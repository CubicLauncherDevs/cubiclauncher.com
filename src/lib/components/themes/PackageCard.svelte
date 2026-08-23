<script lang="ts">
  import { t } from "$lib/i18n";
  import type { ThemePackage } from "$lib/types/theme";
  import IconImage from "~icons/ph/image";
  import IconPackage from "~icons/ph/package";

  let { pkg }: { pkg: ThemePackage } = $props();

  let imgLoaded = $state(false);
</script>

<div class="group flex flex-col bg-neutral-900 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors h-full cursor-pointer">
  <a
    href="/themes/packs/{pkg.slug}"
    class="block aspect-video bg-neutral-800 relative overflow-hidden rounded-t-lg"
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
      <div class="w-full h-full flex items-center justify-center text-neutral-600">
        <IconImage class="w-9 h-9" />
      </div>
    {/if}
    <div class="absolute inset-0 bg-linear-to-t from-neutral-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
  </a>

  <div class="p-3.5 flex flex-col flex-1">
    <a href="/themes/packs/{pkg.slug}" class="block group/title">
      <h3 class="text-[13px] font-medium text-white truncate group-hover/title:text-white/90 transition-colors">{pkg.name}</h3>
    </a>
    <p class="text-[11px] text-neutral-500 truncate mt-0.5">{pkg.author}</p>

    <div class="mt-auto pt-3 flex items-center gap-2">
      <span class="inline-flex items-center gap-1.5 text-[10px] font-medium text-neutral-500 bg-white/5 px-2 py-0.5 rounded-[3px]">
        <IconPackage class="w-3 h-3" />
        {$t('themes.packageThemesCount', { values: { count: pkg.themes.length } })}
      </span>
    </div>
  </div>
</div>
