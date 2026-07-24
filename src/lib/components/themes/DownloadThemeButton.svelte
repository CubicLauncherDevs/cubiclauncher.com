<script lang="ts">
  import { get } from "svelte/store";
  import { t } from "$lib/i18n";
  import type { ThemeVersion } from "$lib/types/theme";
  import JSZip from "jszip";
  import IconDownload from "~icons/ph/download-simple";
  import IconSpinner from "~icons/ph/spinner";
  import IconCheck from "~icons/ph/check";
  import IconWarning from "~icons/ph/warning";

  let {
    version,
    themeName,
    label,
  }: {
    version: ThemeVersion;
    themeName: string;
    label?: string;
  } = $props();

  let loading = $state(false);
  let progress = $state(0);
  let total = $state(0);
  let error = $state("");
  let success = $state(false);

  const defaultLabel = get(t)('themes.downloadTheme');

  async function downloadTheme() {
    if (loading) return;
    loading = true;
    error = "";
    success = false;
    progress = 0;

    const zip = new JSZip();
    const displayName = themeName.replace(/[^a-zA-Z0-9_-]/g, "_");

    try {
      const allFiles = version.files ?? [];
      const themeFiles = allFiles.filter((f) => {
        const name = typeof f === "string" ? f : f.name;
        const lower = name.toLowerCase();
        if (lower === "showcase.png" || lower === "preview.png" || lower === "changelog.md" || lower === "theme.md") return false;
        return true;
      });
      total = themeFiles.length;

      if (total === 0) {
        throw new Error("No files found in theme directory");
      }

      for (let i = 0; i < themeFiles.length; i++) {
        const f = themeFiles[i];
        const name = typeof f === "string" ? f : f.name;
        const url = typeof f === "string"
          ? `https://raw.githubusercontent.com/santiagolxx/asdasd/refs/heads/master/${version.dirPath}/${f}`
          : f.url;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to download ${name} (HTTP ${res.status})`);
        }
        const blob = await res.blob();
        zip.file(name, blob);
        progress = i + 1;
      }

      const content = await zip.generateAsync(
        { type: "blob" },
        (metadata) => {
          progress = Math.round((metadata.percent / 100) * total);
        }
      );

      const dlUrl = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = dlUrl;
      a.download = `${displayName}.cbth`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(dlUrl);

      success = true;
      setTimeout(() => { success = false; }, 3000);
    } catch (e) {
      error = e instanceof Error ? e.message : get(t)('packageDetail.downloadFailed');
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex flex-col gap-2">
  <button
    onclick={downloadTheme}
    disabled={loading}
    class="flex items-center justify-center gap-3 w-full bg-white text-black px-8 py-4 font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-xl shadow-white/5"
  >
    {#if loading}
      <IconSpinner class="w-5 h-5 animate-spin" />
      <span>{get(t)('packageDetail.downloadingPackage')} ({progress}/{total})</span>
    {:else if success}
      <IconCheck class="w-5 h-5" />
      <span>{get(t)('packageDetail.downloaded')}</span>
    {:else}
      <IconDownload class="w-5 h-5" />
      <span>{label || defaultLabel}</span>
    {/if}
  </button>

  {#if error}
    <div class="flex items-start gap-2 text-xs text-red-400">
      <IconWarning class="w-4 h-4 shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  {/if}
</div>
