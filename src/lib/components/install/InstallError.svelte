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

<div class="max-w-lg mx-auto text-center py-20 px-6">
  <div
    class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center"
  >
    <IconWarning class="w-7 h-7 text-neutral-400" />
  </div>

  <p class="text-white font-medium mb-2">
    {message || $t("install.defaultDownloadsAvailable")}
  </p>
  <p class="text-neutral-500 text-sm mb-8">
    {$t("install.defaultDownloadsAvailable")}
  </p>

  <button
    type="button"
    onclick={onRetry}
    class="inline-flex items-center gap-2 bg-white text-black px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-transform"
  >
    <IconArrowClockwise class="w-4 h-4" />
    {$t("install.retry")}
  </button>
</div>
