<script lang="ts">
  import { t } from "$lib/i18n";
  import IconWarning from "~icons/ph/warning";
  import IconArrowClockwise from "~icons/ph/arrow-clockwise";

  interface Props {
    onRetry: () => void;
    message?: string;
  }

  let { onRetry, message = "" }: Props = $props();
</script>

<div class="max-w-lg mx-auto text-center py-10 px-4 border border-cl-border rounded bg-cl-surface">
  <div
    class="w-10 h-10 mx-auto mb-3 rounded bg-cl-base border border-cl-border flex items-center justify-center"
  >
    <IconWarning class="w-5 h-5 text-cl-muted" />
  </div>

  <p class="text-cl-text font-medium text-sm mb-1">
    {message || $t("install.defaultDownloadsAvailable")}
  </p>
  <p class="text-cl-dim text-xs mb-4">
    {$t("install.defaultDownloadsAvailable")}
  </p>

  <button
    type="button"
    onclick={onRetry}
    class="inline-flex items-center gap-1.5 bg-cl-text text-cl-accent-inverse px-4 py-1.5 text-xs font-medium rounded hover:opacity-90 transition-opacity"
  >
    <IconArrowClockwise class="w-3.5 h-3.5" />
    {$t("install.retry")}
  </button>
</div>
