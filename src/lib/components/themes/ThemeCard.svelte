<script lang="ts">
  import type { Theme } from "$lib/types/theme";

  let { theme }: { theme: Theme } = $props();

  let imgLoaded = $state(false);
</script>

<a
  href="/themes/{theme.id}"
  class="block bg-neutral-900 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
>
  <div class="aspect-[16/9] bg-neutral-800 relative overflow-hidden">
    {#if theme.previewUrl}
      <img
        src={theme.previewUrl}
        alt={theme.name}
        loading="lazy"
        class="w-full h-full object-cover {imgLoaded ? 'opacity-100' : 'opacity-0'}"
        onload={() => (imgLoaded = true)}
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center text-neutral-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-10 h-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
        </svg>
      </div>
    {/if}
  </div>

  <div class="p-4">
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <h3 class="text-sm font-semibold text-white truncate">{theme.name}</h3>
        <p class="text-xs text-neutral-500 truncate mt-0.5">{theme.author}</p>
      </div>
      <button
        onclick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const a = document.createElement("a");
          a.href = theme.zipUrl;
          a.download = theme.zipName;
          a.click();
        }}
        class="shrink-0 flex items-center justify-center w-7 h-7 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer mt-0.5"
        title="Descargar {theme.name}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-neutral-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>
    </div>
  </div>
</a>
