<script lang="ts">
  import { t } from "$lib/i18n";
  import IconX from "~icons/ph/x";
  import IconCopy from "~icons/ph/copy";
  import IconCheck from "~icons/ph/check";
  import IconApple from "~icons/simple-icons/apple";
  import IconGithubLogo from "~icons/ph/github-logo";

  interface Props {
    show: boolean;
    onClose: () => void;
  }

  let { show, onClose }: Props = $props();

  const TAP_REPO = "https://github.com/CubicLauncherDevs/homebrew-Cubiclauncher";
  const quickCommand =
    "brew install --cask CubicLauncherDevs/cubiclauncher/cubiclauncher";
  const tapCommand = "brew tap CubicLauncherDevs/cubiclauncher";
  const installCommand = "brew install --cask cubiclauncher";

  let dialog: HTMLDialogElement;
  let copiedKey = $state<string | null>(null);
  let timer: ReturnType<typeof setTimeout> | null = null;

  async function copy(key: string, text: string) {
    if (timer) clearTimeout(timer);
    try {
      await navigator.clipboard.writeText(text);
      copiedKey = key;
      timer = setTimeout(() => {
        copiedKey = null;
        timer = null;
      }, 2000);
    } catch {
      // clipboard not available
    }
  }

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

{#snippet commandRow(key: string, command: string)}
  <div class="flex items-center gap-2 rounded border border-cl-border bg-cl-base py-1.5 pl-2.5 pr-1.5">
    <code class="scrollbar-thin min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-0.5 font-mono text-xs text-cl-text">{command}</code>
    <button
      type="button"
      onclick={() => copy(key, command)}
      class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded border border-cl-border bg-cl-surface text-cl-muted transition-colors hover:border-cl-text hover:bg-cl-text hover:text-cl-accent-inverse"
      aria-label={$t("install.homebrew.copy")}
    >
      {#if copiedKey === key}
        <IconCheck class="h-3.5 w-3.5" />
      {:else}
        <IconCopy class="h-3.5 w-3.5" />
      {/if}
    </button>
  </div>
{/snippet}

<dialog
  bind:this={dialog}
  aria-labelledby="homebrew-modal-title"
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
  class="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-lg rounded border border-cl-border bg-cl-surface p-0 text-cl-text backdrop:bg-black/70"
>
  <div class="flex max-h-[85vh] flex-col">
    <header class="flex items-start justify-between gap-3 border-b border-cl-border p-4">
      <div class="flex min-w-0 items-center gap-3">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-cl-border bg-cl-base">
          <IconApple class="h-4 w-4 text-cl-muted" />
        </div>
        <div class="min-w-0">
          <h2 id="homebrew-modal-title" class="text-sm font-semibold text-cl-text">
            {$t("install.homebrew.title")}
          </h2>
          <p class="text-xs text-cl-muted">{$t("install.homebrew.subtitle")}</p>
        </div>
      </div>
      <button
        type="button"
        onclick={onClose}
        aria-label={$t("install.homebrew.close")}
        class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded border border-cl-border text-cl-muted transition-colors hover:border-cl-text hover:text-cl-text"
      >
        <IconX class="h-4 w-4" />
      </button>
    </header>

    <div class="overflow-y-auto p-4">
      <p class="text-xs leading-relaxed text-cl-muted">
        {$t("install.homebrew.description")}
      </p>

      <div class="mt-4">
        <span class="text-[10px] font-semibold uppercase tracking-wider text-cl-dim">
          {$t("install.homebrew.quickInstall")}
        </span>
        <div class="mt-1.5">
          {@render commandRow("quick", quickCommand)}
        </div>
      </div>

      <div class="mt-4">
        <span class="text-[10px] font-semibold uppercase tracking-wider text-cl-dim">
          {$t("install.homebrew.stepByStep")}
        </span>
        <ol class="mt-1.5 space-y-3">
          <li>
            <p class="mb-1.5 text-xs text-cl-muted">
              <span class="font-medium text-cl-text">1.</span>
              {$t("install.homebrew.step1")}
            </p>
            {@render commandRow("tap", tapCommand)}
          </li>
          <li>
            <p class="mb-1.5 text-xs text-cl-muted">
              <span class="font-medium text-cl-text">2.</span>
              {$t("install.homebrew.step2")}
            </p>
            {@render commandRow("install", installCommand)}
          </li>
        </ol>
      </div>
    </div>

    <footer class="border-t border-cl-border p-4">
      <a
        href={TAP_REPO}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-xs font-medium text-cl-text underline decoration-cl-border underline-offset-4 hover:decoration-cl-text"
      >
        <IconGithubLogo class="h-3.5 w-3.5" />
        {$t("install.homebrew.viewTap")}
      </a>
    </footer>
  </div>
</dialog>
