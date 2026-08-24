<script lang="ts">
  import { t } from "$lib/i18n";
  import type { Download } from "$lib/utils/install";
  import DownloadIcon from "./DownloadIcon.svelte";
  import VerificationRow from "./VerificationRow.svelte";
  import IconDownload from "~icons/ph/download-simple";

  interface Props {
    downloads: Download[];
    platformNameKey: string;
  }

  let { downloads, platformNameKey }: Props = $props();

  function formatNumber(n: number): string {
    return n.toLocaleString();
  }
</script>

{#if downloads.length > 0}
  <section>
    <div class="flex items-center gap-2 mb-2">
      <span class="w-1 h-1 rounded-full bg-cl-dim"></span>
      <h3 class="text-xs font-semibold text-cl-text">
        {$t("install.downloadsFor", {
          values: { os: $t(platformNameKey) },
        })}
      </h3>
    </div>

    <div class="border border-cl-border rounded bg-cl-surface overflow-hidden">
      {#each downloads as download, i}
        <div class="flex items-center gap-3 px-3 py-2.5 {i !== downloads.length - 1 ? 'border-b border-cl-border' : ''} hover:bg-cl-elevated transition-colors">
          <div
            class="w-7 h-7 rounded bg-cl-base border border-cl-border flex items-center justify-center shrink-0"
          >
            <DownloadIcon
              label={download.label}
              os={download.os}
              class="w-3.5 h-3.5 text-cl-muted"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-cl-text text-xs truncate">
              {download.label}
            </h4>
            {#if download.count !== undefined}
              <p class="text-[10px] text-cl-dim mt-0.5">
                {formatNumber(download.count)}
                {$t("install.downloads")}
              </p>
            {/if}
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <VerificationRow {download} variant="dark" />
            <a
              href={download.url}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center w-6 h-6 rounded bg-cl-base border border-cl-border text-cl-muted hover:bg-cl-text hover:text-cl-accent-inverse hover:border-cl-text transition-colors"
              aria-label={$t("install.download")}
            >
              <IconDownload class="w-3 h-3" />
            </a>
          </div>
        </div>
      {/each}
    </div>
  </section>
{/if}
