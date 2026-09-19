<script lang="ts">
  import { t } from "$lib/i18n";
  import type { ThemeVersion } from "$lib/types/theme";
  import IconFile from "~icons/ph/file";
  import IconArrowUpRight from "~icons/ph/arrow-up-right";
  import IconMagnifyingGlass from "~icons/ph/magnifying-glass";

  let { version }: { version: ThemeVersion } = $props();
  let query = $state('');
  let files = $derived(version.files.filter((file) => file.name.toLowerCase().includes(query.trim().toLowerCase())).toSorted((a, b) => a.name.localeCompare(b.name)));
</script>

<div>
  <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <div><h2 class="text-sm font-semibold">{$t('themeDetail.files')} <span class="text-cl-dim">· {version.version}</span></h2><p class="mt-1 text-xs text-cl-dim">{$t('themeDetail.filesHint')}</p></div>
    <label class="flex w-full items-center gap-2 rounded-md border border-cl-border bg-cl-base px-3 py-2 sm:w-56"><IconMagnifyingGlass class="size-3.5 shrink-0 text-cl-dim" /><input type="search" bind:value={query} aria-label={$t('themeDetail.searchFiles')} placeholder={$t('themeDetail.searchFiles')} class="min-w-0 w-full bg-transparent text-xs text-cl-text outline-none" /></label>
  </div>
  <ul class="max-h-[480px] overflow-y-auto divide-y divide-cl-border rounded-md border border-cl-border">
    {#each files as file}
      <li><a href={file.url} target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 px-3 py-3 text-xs transition-colors hover:bg-cl-elevated"><IconFile class="size-4 shrink-0 text-cl-dim" /><span class="min-w-0 flex-1 break-all font-mono">{file.name}</span><IconArrowUpRight class="size-3.5 shrink-0 text-cl-dim" /><span class="sr-only">{$t('themeDetail.openFile')}</span></a></li>
    {:else}
      <li class="p-6 text-center text-xs text-cl-dim">{$t('themeDetail.noFiles')}</li>
    {/each}
  </ul>
</div>
