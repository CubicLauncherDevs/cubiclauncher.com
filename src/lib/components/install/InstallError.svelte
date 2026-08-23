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

<div class="max-w-lg mx-auto text-center py-16 px-6">
  <div
    class="w-14 h-14 mx-auto mb-5 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center"
  >
    <IconWarning class="w-6 h-6 text-neutral-400" />
  </div>

  <p class="text-white font-medium text-[15px] mb-1.5">
    {message || $t("install.defaultDownloadsAvailable")}
  </p>
  <p class="text-neutral-500 text-[13px] mb-6">
    {$t("install.defaultDownloadsAvailable")}
  </p>

  <button
    type="button"
    onclick={onRetry}
    class="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 text-[13px] font-medium rounded-[4px] hover:bg-neutral-200 transition-colors"
  >
    <IconArrowClockwise class="w-4 h-4" />
    {$t("install.retry")}
  </button>
</div>
