<script lang="ts">
  import type { Theme } from "$lib/types/theme";

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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-10 h-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
        </svg>
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
