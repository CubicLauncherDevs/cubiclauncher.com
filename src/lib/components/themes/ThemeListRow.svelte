<script lang="ts">
  import type { Theme } from "$lib/types/theme";
  import { getThemeVerification } from "$lib/utils/themes";
  import IconImage from "~icons/ph/image";
  import VerifiedBadge from "./VerifiedBadge.svelte";

  let { theme }: { theme: Theme } = $props();
</script>

<a
  href="/themes/{theme.id}"
  class="group flex items-center gap-3 p-2 rounded border border-cl-border bg-cl-surface hover:bg-cl-elevated hover:border-cl-border-hover transition-colors"
>
  <div class="relative w-14 h-8 shrink-0 rounded bg-cl-elevated overflow-hidden">
    {#if theme.previewUrl}
      <img
        src={theme.previewUrl}
        alt={theme.name}
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover"
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center text-cl-dim">
        <IconImage class="w-4 h-4" />
      </div>
    {/if}
  </div>

  <div class="min-w-0 flex-1 flex flex-col">
    <div class="flex items-center gap-1.5">
      <h3 class="text-xs font-semibold text-cl-text truncate group-hover:text-cl-muted transition-colors">
        {theme.name}
      </h3>
      {#if getThemeVerification(theme) !== "none"}
        <VerifiedBadge size="sm" level={getThemeVerification(theme)} />
      {/if}
    </div>
    <p class="text-[11px] text-cl-muted truncate">{theme.author}</p>
  </div>

  <div class="hidden sm:flex items-center gap-3 shrink-0">
    <span class="text-[10px] font-medium text-cl-muted bg-cl-base border border-cl-border px-1.5 py-0.5 rounded">
      {theme.latestVersion}
    </span>
    {#if theme.date}
      <span class="text-[10px] text-cl-dim hidden md:inline">
        {new Date(theme.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
      </span>
    {/if}
  </div>
</a>
