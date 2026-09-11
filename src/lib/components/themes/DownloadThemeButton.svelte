<script lang="ts">
  import { get } from "svelte/store";
  import { onDestroy } from "svelte";
  import { t } from "$lib/i18n";
  import type { ThemeVersion } from "$lib/types/theme";
  import DownloadLog from "./DownloadLog.svelte";
  import { fetchLoggedThemeFile, type DownloadLogEntry } from "$lib/utils/download-log";
  import { versionFileUrl } from "$lib/utils/themes";
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
  let logs = $state<DownloadLogEntry[]>([]);
  let attempt = $state(0);

  function log(entry: DownloadLogEntry) {
    logs.push(entry);
  }

  let abortController: AbortController | null = null;
  let successTimer: ReturnType<typeof setTimeout> | null = null;

  function cleanup() {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    if (successTimer) {
      clearTimeout(successTimer);
      successTimer = null;
    }
  }

  onDestroy(cleanup);

  async function downloadTheme() {
    if (loading) return;
    cleanup();
    loading = true;
    error = "";
    success = false;
    progress = 0;
    total = 0;
    logs = [{ kind: "started" }];
    attempt += 1;

    abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const JSZip = (await import("jszip")).default;
      signal.throwIfAborted();
      const zip = new JSZip();
      const displayName = themeName.replace(/[^a-zA-Z0-9_-]/g, "_");

      const allFiles = version.files ?? [];
      const themeFiles = allFiles.filter((f) => {
        const name = typeof f === "string" ? f : f.name;
        const lower = name.toLowerCase();
        if (lower === "showcase.png" || lower === "preview.png" || lower === "changelog.md" || lower === "theme.md") return false;
        return true;
      });
      total = themeFiles.length;

      if (total === 0) {
        throw new Error(get(t)('downloadLog.noFiles'));
      }

      for (let i = 0; i < themeFiles.length; i++) {
        signal.throwIfAborted();

        const f = themeFiles[i];
        const name = typeof f === "string" ? f : f.name;
        const url = typeof f === "string"
          ? versionFileUrl(version, f)
          : f.url;

        const blob = await fetchLoggedThemeFile(name, url, signal, log);
        zip.file(name, blob);
        progress = i + 1;
      }

      log({ kind: "packing", name: `${displayName}.cbth` });
      const content = await zip.generateAsync(
        { type: "blob" },
        (metadata) => {
          progress = Math.round((metadata.percent / 100) * total);
        }
      );

      signal.throwIfAborted();
      const dlUrl = URL.createObjectURL(content);
      try {
        const a = document.createElement("a");
        a.href = dlUrl;
        a.download = `${displayName}.cbth`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } finally {
        queueMicrotask(() => URL.revokeObjectURL(dlUrl));
      }

      success = true;
      log({ kind: "ready", name: `${displayName}.cbth` });
      successTimer = setTimeout(() => { success = false; }, 3000);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        // silently ignore cancelled downloads
      } else {
        error = e instanceof Error ? e.message : get(t)('packageDetail.downloadFailed');
        if (logs.at(-1)?.kind !== "error") log({ kind: "error", detail: error });
      }
    } finally {
      loading = false;
      abortController = null;
    }
  }
</script>

<div class="flex min-w-0 flex-col gap-1.5">
  <button
    onclick={downloadTheme}
    disabled={loading}
    class="flex items-center justify-center gap-1.5 w-full bg-cl-text text-cl-accent-inverse px-4 py-2 font-medium text-xs rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {#if loading}
      <IconSpinner class="w-3.5 h-3.5 animate-spin" />
      <span>{$t('packageDetail.downloadingPackage')} ({progress}/{total})</span>
    {:else if success}
      <IconCheck class="w-3.5 h-3.5" />
      <span>{$t('packageDetail.downloaded')}</span>
    {:else}
      <IconDownload class="w-3.5 h-3.5" />
      <span>{label ?? $t('themes.downloadTheme')}</span>
    {/if}
  </button>

  {#if error}
    <div class="flex items-start gap-1.5 text-[11px] text-cl-danger">
      <IconWarning class="w-3.5 h-3.5 shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  {/if}
  <DownloadLog entries={logs} {attempt} />
</div>
