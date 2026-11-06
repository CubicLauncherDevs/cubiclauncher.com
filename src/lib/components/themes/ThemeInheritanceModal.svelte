<script lang="ts">
  import { t } from "$lib/i18n";
  import type { Theme } from "$lib/types/theme";
  import IconGitBranch from "~icons/ph/git-branch";
  import IconInfo from "~icons/ph/info";
  import IconX from "~icons/ph/x";

  let {
    show,
    themeName,
    baseTheme,
    extendsId,
    onDownloadOnly,
    onDownloadBoth,
    onClose,
  }: {
    show: boolean;
    themeName: string;
    baseTheme: Theme | null;
    extendsId: string;
    onDownloadOnly: () => void;
    onDownloadBoth: () => void;
    onClose: () => void;
  } = $props();

  let dialog: HTMLDialogElement;
  let baseName = $derived(baseTheme?.name ?? extendsId);

  $effect(() => {
    if (show) {
      dialog.showModal();
      const overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        dialog.close();
        document.body.style.overflow = overflow;
      };
    }
  });
</script>

<dialog
  bind:this={dialog}
  aria-labelledby="inheritance-modal-title"
  oncancel={(event) => {
    event.preventDefault();
    onClose();
  }}
  onclick={(event) => {
    if (event.target === dialog) onClose();
  }}
  onclose={() => {
    if (show) onClose();
  }}
  class="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded border border-cl-border bg-cl-surface p-0 text-cl-text backdrop:bg-black/70"
>
  <div class="flex max-h-[85vh] flex-col">
    <header class="flex items-start justify-between gap-3 border-b border-cl-border p-4">
      <div class="flex min-w-0 items-center gap-3">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-cl-border bg-cl-base">
          <IconGitBranch class="h-4 w-4 text-cl-muted" />
        </div>
        <h2 id="inheritance-modal-title" class="text-sm font-semibold text-cl-text">
          {$t("inheritanceDownload.title")}
        </h2>
      </div>
      <button
        type="button"
        onclick={onClose}
        aria-label={$t("inheritanceDownload.close")}
        class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded border border-cl-border text-cl-muted transition-colors hover:border-cl-text hover:text-cl-text"
      >
        <IconX class="h-4 w-4" />
      </button>
    </header>

    <div class="overflow-y-auto p-4">
      <p class="text-xs leading-relaxed text-cl-muted">
        {$t("inheritanceDownload.description", {
          values: { name: themeName, base: baseName },
        })}
      </p>

      {#if !baseTheme}
        <p class="mt-3 flex items-start gap-1.5 rounded border border-cl-border bg-cl-base px-3 py-2 text-[11px] leading-relaxed text-cl-dim">
          <IconInfo class="mt-0.5 size-3.5 shrink-0" />
          <span>{$t("inheritanceDownload.baseMissing", { values: { base: baseName } })}</span>
        </p>
      {/if}
    </div>

    <footer class="flex flex-wrap justify-end gap-2 border-t border-cl-border p-4">
      <button
        type="button"
        onclick={onDownloadOnly}
        class="rounded border border-cl-border px-3 py-2 text-xs font-medium text-cl-muted transition-colors hover:border-cl-border-hover hover:text-cl-text"
      >
        {$t("inheritanceDownload.downloadOnly")}
      </button>
      {#if baseTheme}
        <button
          type="button"
          onclick={onDownloadBoth}
          class="rounded bg-cl-text px-3 py-2 text-xs font-medium text-cl-accent-inverse transition-opacity hover:opacity-90"
        >
          {$t("inheritanceDownload.downloadBoth")}
        </button>
      {/if}
    </footer>
  </div>
</dialog>
