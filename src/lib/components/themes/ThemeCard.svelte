<script lang="ts">
  import type { Theme } from "$lib/types/theme";
  import { getThemeVerification } from "$lib/utils/themes";
  import IconImage from "~icons/ph/image";
  import VerifiedBadge from "./VerifiedBadge.svelte";

  let { theme }: { theme: Theme } = $props();

  let imgLoaded = $state(false);
</script>

<div class="group flex flex-col bg-cl-surface border border-cl-border rounded overflow-hidden hover:border-cl-border-hover hover:bg-cl-elevated transition-colors h-full cursor-pointer">
  <a
    href="/themes/{theme.id}"
    class="block aspect-video bg-cl-elevated relative overflow-hidden"
  >
    {#if theme.previewUrl}
      <img
        src={theme.previewUrl}
        alt={theme.name}
        width="400"
        height="225"
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
    <a href="/themes/{theme.id}" class="block group/title">
      <h3 class="text-xs font-semibold text-white truncate group-hover/title:text-cl-muted transition-colors">{theme.name}</h3>
    </a>
    <div class="flex items-center gap-1.5 mt-0.5">
      <p class="text-[11px] text-cl-muted truncate">{theme.author}</p>
      {#if getThemeVerification(theme) !== "none"}
        <VerifiedBadge size="sm" level={getThemeVerification(theme)} />
      {/if}
    </div>

    <div class="mt-auto pt-2 flex items-center gap-2">
      <span class="text-[10px] font-medium text-cl-muted bg-cl-base border border-cl-border px-1.5 py-0.5 rounded">
        {theme.latestVersion}
      </span>
    </div>
  </div>
</div>
