<script lang="ts">
  import { t } from "$lib/i18n";
  import type { Theme } from "$lib/types/theme";
  import IconGitBranch from "~icons/ph/git-branch";
  import IconInfo from "~icons/ph/info";

  let {
    extendsId,
    baseTheme = null,
    showNote = false,
    compact = false,
  }: {
    extendsId: string;
    baseTheme?: Theme | null;
    showNote?: boolean;
    compact?: boolean;
  } = $props();

  let href = $derived(baseTheme ? `/themes/${baseTheme.id}` : null);
  let name = $derived(baseTheme?.name ?? extendsId);
</script>

<div class={compact ? "space-y-1" : "space-y-1.5"}>
  <p class="flex flex-wrap items-center gap-1.5 text-[11px] text-cl-muted">
    <IconGitBranch class="size-3.5 shrink-0 text-cl-dim" />
    <span>{$t('themeDetail.inheritsFrom')}</span>
    {#if href}
      <a href={href} class="font-medium text-cl-text underline-offset-4 hover:underline">{baseTheme?.name}</a>
    {:else}
      <code class="rounded border border-cl-border bg-cl-base px-1.5 py-0.5 font-mono text-[10px] text-cl-text">{extendsId}</code>
    {/if}
  </p>
  {#if showNote}
    <p class="flex items-start gap-1.5 text-[10px] leading-relaxed text-cl-dim">
      <IconInfo class="mt-0.5 size-3 shrink-0" />
      <span>{$t('themeDetail.installBaseFirst', { values: { name } })}</span>
    </p>
  {/if}
</div>
