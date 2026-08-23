<script lang="ts">
  import { onDestroy } from "svelte";
  import { t } from "$lib/i18n";
  import IconCopy from "~icons/ph/copy";
  import IconCheck from "~icons/ph/check";

  interface Props {
    hash: string;
    variant?: "light" | "dark";
    compact?: boolean;
  }

  let { hash, variant = "dark", compact = true }: Props = $props();

  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  function copy() {
    if (!hash || copied) return;
    if (timer) clearTimeout(timer);
    navigator.clipboard.writeText(hash).then(() => {
      if (copied) return;
      copied = true;
      timer = setTimeout(() => { copied = false; timer = null; }, 2000);
    });
  }

  onDestroy(() => {
    if (timer) clearTimeout(timer);
  });

  const baseStyles =
    "inline-flex items-center gap-1 rounded border text-[10px] font-medium uppercase tracking-wide transition-colors";

  const variantStyles =
    variant === "light"
      ? "border-black/10 text-black/60 hover:bg-black/5 hover:text-black"
      : "border-cl-border text-cl-muted hover:border-cl-border-hover hover:text-cl-text";
</script>

<button
  type="button"
  onclick={copy}
  class="{baseStyles} {variantStyles} {compact ? 'px-1.5 py-0.5' : 'px-2 py-1'}"
  aria-label={$t("install.copySha256")}
>
  {#if copied}
    <IconCheck class="w-3 h-3" />
    <span>{$t("install.sha256Copied")}</span>
  {:else}
    <IconCopy class="w-3 h-3" />
    <span>{#if compact}SHA256{:else}{$t("install.copySha256")}{/if}</span>
  {/if}
</button>
