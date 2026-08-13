<script lang="ts">
  import { t } from "$lib/i18n";
  import type { Download, PlatformId } from "$lib/utils/install";
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
  <section class="mt-8">
    <h3
      class="text-lg font-bold text-white tracking-tight mb-4 flex items-center gap-2"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-neutral-500"></span>
      {$t("install.downloadsFor", {
        values: { os: $t(platformNameKey) },
      })}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each downloads as download}
        <div
          class="group rounded-2xl border border-white/10 bg-neutral-900/40 p-5 flex flex-col gap-4 transition-all duration-300 hover:border-white/20 hover:bg-neutral-900/60"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0"
            >
              <DownloadIcon
                label={download.label}
                os={download.os}
                class="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-white text-[15px] truncate">
                {download.label}
              </h4>
              {#if download.count !== undefined}
                <p class="text-xs text-neutral-500 mt-0.5">
                  {formatNumber(download.count)}
                  {$t("install.downloads")}
                </p>
              {/if}
            </div>
          </div>

          <div
            class="mt-auto pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3"
          >
            <VerificationRow {download} variant="dark" />

            <a
              href={download.url}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 text-neutral-400 hover:bg-white hover:text-black transition-colors"
              aria-label={$t("install.download")}
            >
              <IconDownload class="w-4 h-4" />
            </a>
          </div>
        </div>
      {/each}
    </div>
  </section>
{/if}
