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
      : "text-neutral-500 group-hover:text-neutral-400";

  const linkColor =
    variant === "light"
      ? "text-black/60 hover:text-black"
      : "text-neutral-400 hover:text-white";
</script>

{#if download.sha256}
  <div class="group flex items-center gap-1.5 min-w-0" title={download.sha256}>
    <span class="text-[11px] font-mono truncate max-w-[10rem] {hashColor} transition-colors">
      {download.sha256.slice(0, 14)}…{download.sha256.slice(-6)}
    </span>
    <CopyHashButton hash={download.sha256} {variant} compact />
  </div>
{/if}

{#if download.sigUrl}
  <a
    href={download.sigUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide transition-colors {linkColor}"
  >
    {$t("install.signature")}
    <IconArrowSquareOut class="w-3 h-3" />
  </a>
{/if}
