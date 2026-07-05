<script lang="ts">
  let {
    show,
    imageUrl,
    alt,
    onClose,
  }: {
    show: boolean;
    imageUrl: string | undefined;
    alt: string;
    onClose: () => void;
  } = $props();
</script>

{#if show && imageUrl}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
    onclick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <img
      src={imageUrl}
      alt={alt}
      class="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl"
    />
  </div>
{/if}
