<script lang="ts">
  import { t } from "$lib/i18n";
  import type { Download } from "$lib/utils/install";
  import DownloadIcon from "./DownloadIcon.svelte";
  import VerificationRow from "./VerificationRow.svelte";
  import IconDownload from "~icons/ph/download-simple";

  interface Props {
    downloads: Download[];
    platformNameKey: string;
    onHomebrew?: () => void;
  }

  let { downloads, platformNameKey, onHomebrew }: Props = $props();

  function formatNumber(n: number): string {
    return n.toLocaleString();
  }
</script>

{#if downloads.length > 0}
  <section>
    <div class="mb-2 flex min-w-0 items-center gap-2">
      <span class="w-1 h-1 rounded-full bg-cl-dim"></span>
      <h3 class="min-w-0 text-xs font-semibold text-cl-text">
        {$t("install.downloadsFor", {
          values: { os: $t(platformNameKey) },
        })}
      </h3>
    </div>

    <div class="border border-cl-border rounded bg-cl-surface overflow-hidden">
      {#each downloads as download, i}
        <div class="grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-3 py-3 transition-colors hover:bg-cl-elevated sm:grid-cols-[1.75rem_minmax(0,1fr)_auto] sm:py-2.5 {i !== downloads.length - 1 ? 'border-b border-cl-border' : ''}">
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

          <div class="col-span-2 flex min-w-0 items-center justify-between gap-2 sm:col-span-1 sm:justify-end">
            <VerificationRow {download} variant="dark" />
            {#if download.kind === "homebrew"}
              <button
                type="button"
                onclick={() => onHomebrew?.()}
                class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border border-cl-border bg-cl-base text-cl-muted transition-colors hover:border-cl-text hover:bg-cl-text hover:text-cl-accent-inverse sm:h-6 sm:w-6"
                aria-label={$t("install.homebrew.open")}
              >
                <IconDownload class="w-3 h-3" />
              </button>
            {:else}
              <a
                href={download.url}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border border-cl-border bg-cl-base text-cl-muted transition-colors hover:border-cl-text hover:bg-cl-text hover:text-cl-accent-inverse sm:h-6 sm:w-6"
                aria-label={$t("install.download")}
              >
                <IconDownload class="w-3 h-3" />
              </a>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>
{/if}
