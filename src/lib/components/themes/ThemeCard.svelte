<script lang="ts">
  import type { Theme } from "$lib/types/theme";
  import IconImage from "~icons/ph/image";

  let { theme }: { theme: Theme } = $props();

  let imgLoaded = $state(false);
</script>

<div class="group flex flex-col bg-neutral-900 border border-white/10 rounded-xl overflow-hidden hover:border-white/25 transition-all h-full cursor-pointer">
  <a
    href="/themes/{theme.id}"
    class="block aspect-video bg-neutral-800 relative overflow-hidden"
  >
    {#if theme.previewUrl}
      <img
        src={theme.previewUrl}
        alt={theme.name}
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 {imgLoaded ? 'opacity-100' : 'opacity-0'}"
        onload={() => (imgLoaded = true)}
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center text-neutral-600">
        <IconImage class="w-10 h-10" />
      </div>
    {/if}
    <div class="absolute inset-0 bg-linear-to-t from-neutral-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </a>

  <div class="p-4 flex flex-col flex-1">
    <a href="/themes/{theme.id}" class="block group/title">
      <h3 class="text-sm font-semibold text-white truncate group-hover/title:text-white/90 transition-colors">{theme.name}</h3>
    </a>
    <p class="text-xs text-neutral-500 truncate mt-0.5">{theme.author}</p>

    <div class="mt-auto pt-4 flex items-center gap-2">
      <span class="text-[10px] font-medium text-neutral-500 bg-white/5 px-2 py-1 rounded-md">
        {theme.latestVersion}
      </span>
    </div>
  </div>
</div>
