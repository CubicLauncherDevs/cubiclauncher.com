<script lang="ts">
  import { t } from "$lib/i18n";
  import IconX from "~icons/ph/x";

  let { show, imageUrl, alt, onClose }: {
    show: boolean;
    imageUrl: string | undefined;
    alt: string;
    onClose: () => void;
  } = $props();
  let dialog: HTMLDialogElement;

  $effect(() => {
    if (show && imageUrl) {
      dialog.showModal();
      const overflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { dialog.close(); document.body.style.overflow = overflow; };
    }
  });
</script>

<dialog bind:this={dialog} aria-label={alt} oncancel={(event) => { event.preventDefault(); onClose(); }} onclick={(event) => { if (event.target === dialog) onClose(); }} onclose={() => { if (show) onClose(); }} class="fixed inset-0 m-auto h-full max-h-none w-full max-w-none bg-transparent p-4 text-white backdrop:bg-black/90 sm:p-10">
  {#if show && imageUrl}
    <div class="pointer-events-none flex h-full flex-col items-center justify-center gap-3">
      <button type="button" onclick={onClose} aria-label={$t('themeDetail.closePreview')} class="pointer-events-auto absolute right-4 top-4 rounded-full border border-white/20 bg-black/70 p-3 hover:bg-black"><IconX class="size-5" /></button>
      <img src={imageUrl} {alt} class="pointer-events-auto max-h-[85vh] max-w-full rounded-md object-contain" />
      <p class="text-xs text-white/70">{alt}</p>
    </div>
  {/if}
</dialog>
