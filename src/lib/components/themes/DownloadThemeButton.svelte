<script lang="ts">
  import { get } from "svelte/store";
  import { onDestroy } from "svelte";
  import { t } from "$lib/i18n";
  import type { Theme, ThemeVersion } from "$lib/types/theme";
  import DownloadLog from "./DownloadLog.svelte";
  import ThemeInheritanceModal from "./ThemeInheritanceModal.svelte";
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
    baseTheme = null,
  }: {
    version: ThemeVersion;
    themeName: string;
    label?: string;
    baseTheme?: Theme | null;
  } = $props();

  let loading = $state(false);
  let progress = $state(0);
  let total = $state(0);
  let packingProgress = $state<number | null>(null);
  let error = $state("");
  let success = $state(false);
  let logs = $state<DownloadLogEntry[]>([]);
  let attempt = $state(0);
  let showInheritanceModal = $state(false);

  let extendsId = $derived(
    typeof version.extends === "string" ? version.extends.trim() : ""
  );

  function log(entry: DownloadLogEntry) {
    logs.push({ ...entry, timestamp: Date.now() });
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

  function packageFiles(target: ThemeVersion) {
    return (target.files ?? []).filter((f) => {
      const name = typeof f === "string" ? f : f.name;
      const lower = name.toLowerCase();
      if (lower === "showcase.png" || lower === "preview.png" || lower === "changelog.md" || lower === "theme.md") return false;
      return true;
    });
  }

  function displayName(name: string) {
    return name.replace(/[^a-zA-Z0-9_-]/g, "_");
  }

  function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      queueMicrotask(() => URL.revokeObjectURL(url));
    }
  }

  function requestDownload() {
    if (loading) return;
    if (extendsId) {
      showInheritanceModal = true;
      return;
    }
    void downloadTheme(false);
  }

  async function downloadTheme(withInheritance: boolean) {
    if (loading) return;
    cleanup();
    loading = true;
    error = "";
    success = false;
    progress = 0;
    total = 0;
    packingProgress = null;
    logs = [];
    log({ kind: "started" });
    attempt += 1;

    abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const JSZip = (await import("jszip")).default;
      signal.throwIfAborted();

      const jobs: { name: string; version: ThemeVersion }[] = [
        { name: themeName, version },
      ];

      if (withInheritance && baseTheme) {
        const baseVersion =
          baseTheme.versions.find((v) => v.version === baseTheme.latestVersion) ??
          baseTheme.versions[0];
        if (baseVersion && packageFiles(baseVersion).length > 0) {
          jobs.push({ name: baseTheme.name, version: baseVersion });
        }
      }

      total = jobs.reduce((sum, job) => sum + packageFiles(job.version).length, 0);
      if (total === 0) {
        throw new Error(get(t)('downloadLog.noFiles'));
      }

      const downloads: { blob: Blob; filename: string }[] = [];

      for (const job of jobs) {
        signal.throwIfAborted();

        const zip = new JSZip();
        for (const f of packageFiles(job.version)) {
          signal.throwIfAborted();

          const name = typeof f === "string" ? f : f.name;
          const url = typeof f === "string"
            ? versionFileUrl(job.version, f)
            : f.url;

          const blob = await fetchLoggedThemeFile(name, url, signal, log);
          zip.file(name, blob);
          progress += 1;
        }

        const filename = `${displayName(job.name)}.cbth`;
        packingProgress = 0;
        log({ kind: "packing", name: filename });
        const content = await zip.generateAsync(
          { type: "blob" },
          (metadata) => {
            packingProgress = Math.round(metadata.percent);
          }
        );

        downloads.push({ blob: content, filename });
      }

      signal.throwIfAborted();
      for (const download of downloads) {
        triggerDownload(download.blob, download.filename);
        log({ kind: "ready", name: download.filename });
      }

      success = true;
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
    onclick={requestDownload}
    disabled={loading}
    class="flex items-center justify-center gap-1.5 w-full bg-cl-text text-cl-accent-inverse px-4 py-2 font-medium text-xs rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {#if loading}
      <IconSpinner class="w-3.5 h-3.5 animate-spin" />
      <span>{packingProgress !== null ? $t('downloadLog.packingProgress', { values: { percent: packingProgress } }) : $t('downloadLog.fileProgress', { values: { done: progress, total } })}</span>
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
  <DownloadLog entries={logs} {attempt} {total} {packingProgress} />

  <ThemeInheritanceModal
    show={showInheritanceModal}
    {themeName}
    {baseTheme}
    {extendsId}
    onDownloadOnly={() => {
      showInheritanceModal = false;
      void downloadTheme(false);
    }}
    onDownloadBoth={() => {
      showInheritanceModal = false;
      void downloadTheme(true);
    }}
    onClose={() => { showInheritanceModal = false; }}
  />
</div>
