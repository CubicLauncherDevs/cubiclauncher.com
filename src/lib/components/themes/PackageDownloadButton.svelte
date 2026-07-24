<script lang="ts">
  import { get } from "svelte/store";
  import { t } from "$lib/i18n";
  import type { ResolvedThemePackage } from "$lib/types/theme";
  import JSZip from "jszip";
  import IconDownload from "~icons/ph/download-simple";
  import IconSpinner from "~icons/ph/spinner";
  import IconWarning from "~icons/ph/warning";
  import IconCheck from "~icons/ph/check";

  let { resolved }: { resolved: ResolvedThemePackage } = $props();

  let loading = $state(false);
  let progress = $state(0);
  let total = $state(0);
  let error = $state("");
  let success = $state(false);

  async function downloadPackage() {
    if (loading) return;
    loading = true;
    error = "";
    success = false;
    progress = 0;
    total = resolved.resolvedThemes.length;

    const zip = new JSZip();

    try {
      for (let i = 0; i < resolved.resolvedThemes.length; i++) {
        const theme = resolved.resolvedThemes[i];
        const latest = theme.versions.find((v) => v.version === theme.latestVersion) || theme.versions[0];
        if (!latest) continue;

        const files = latest.files ?? [];

        for (const f of files) {
          const name = typeof f === "string" ? f : f.name;
          const url = typeof f === "string"
            ? `https://raw.githubusercontent.com/CubicLauncherDevs/Themes/refs/heads/master/${latest.dirPath}/${f}`
            : f.url;

          const res = await fetch(url);
          if (!res.ok) {
            throw new Error(get(t)('packageDetail.downloadThemeFailed', { values: { name: theme.name, status: res.status } }));
          }
          const blob = await res.blob();
          zip.file(`${theme.slug}/${name}`, blob);
        }
        progress = i + 1;
      }

      const content = await zip.generateAsync(
        { type: "blob" },
        (metadata) => {
          progress = Math.round(metadata.percent / 100 * total);
        }
      );

      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resolved.slug}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      success = true;
    } catch (e) {
      error = e instanceof Error ? e.message : get(t)('packageDetail.downloadFailed');
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex flex-col gap-2">
  <button
    onclick={downloadPackage}
    disabled={loading || resolved.resolvedThemes.length === 0}
    class="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
  >
    {#if loading}
      <IconSpinner class="w-4 h-4 animate-spin" />
      {#if total > 0}
        <span>{$t('packageDetail.downloadingPackage')} ({progress}/{total})</span>
      {:else}
        <span>{$t('packageDetail.downloadingPackage')}</span>
      {/if}
    {:else if success}
      <IconCheck class="w-4 h-4" />
      <span>{$t('packageDetail.downloaded')}</span>
    {:else}
      <IconDownload class="w-4 h-4" />
      <span>{$t('packageDetail.downloadPackage')}</span>
    {/if}
  </button>

  {#if error}
    <div class="flex items-start gap-2 text-xs text-red-400">
      <IconWarning class="w-4 h-4 shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  {/if}
</div>
