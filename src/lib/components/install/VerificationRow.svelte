<script lang="ts">
  import { t } from "$lib/i18n";
  import type { Download } from "$lib/utils/install";
  import CopyHashButton from "./CopyHashButton.svelte";
  import IconArrowSquareOut from "~icons/ph/arrow-square-out";

  interface Props {
    download: Download;
    variant?: "light" | "dark";
  }

  let { download, variant = "dark" }: Props = $props();

  const hashColor =
    variant === "light"
      ? "text-black/40 group-hover:text-black/60"
      : "text-cl-dim group-hover:text-cl-muted";

  const linkColor =
    variant === "light"
      ? "text-black/60 hover:text-black"
      : "text-cl-muted hover:text-cl-text";
</script>

<div class="flex items-center gap-2">
  {#if download.sha256}
    <div class="group flex items-center gap-1 min-w-0" title={download.sha256}>
      <span class="text-[10px] font-mono truncate max-w-[8rem] {hashColor} transition-colors">
        {download.sha256.slice(0, 12)}…{download.sha256.slice(-4)}
      </span>
      <CopyHashButton hash={download.sha256} {variant} compact />
    </div>
  {/if}

  {#if download.sigUrl}
    <a
      href={download.sigUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide transition-colors {linkColor}"
    >
      {$t("install.signature")}
      <IconArrowSquareOut class="w-2.5 h-2.5" />
    </a>
  {/if}
</div>
