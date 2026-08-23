<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import IconCaretLeft from "~icons/ph/caret-left";
  import IconCaretRight from "~icons/ph/caret-right";
  import ThemeLightbox from "$lib/components/themes/ThemeLightbox.svelte";

  const IMAGES = [
    "https://iili.io/Cr68EFt.png",
    "https://iili.io/Cr68YtR.png",
    "https://iili.io/Cr687wv.png",
    "https://iili.io/Cr68cnp.png",
    "https://iili.io/Cr68lMN.png",
  ].filter(Boolean);

  let current = $state(0);
  let hovered = $state(false);
  let interval: ReturnType<typeof setInterval> | undefined;
  let lightboxOpen = $state(false);
  let lightboxIndex = $state(0);

  function goTo(index: number) {
    current = ((index % IMAGES.length) + IMAGES.length) % IMAGES.length;
    resetAuto();
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function resetAuto() {
    if (interval) {
      clearInterval(interval);
      interval = undefined;
    }
    if (IMAGES.length > 1 && !hovered) {
      interval = setInterval(() => goTo(current + 1), 5000);
    }
  }

  function openLightbox(index: number) {
    lightboxIndex = index;
    lightboxOpen = true;
  }

  function closeLightbox() {
    lightboxOpen = false;
  }

  onMount(() => {
    for (const src of IMAGES) {
      const img = new Image();
      img.src = src;
      img.decoding = "async";
    }
    resetAuto();
  });

  onDestroy(() => {
    if (interval) {
      clearInterval(interval);
      interval = undefined;
    }
  });
</script>

{#if IMAGES.length > 0}
  <div
    role="region"
    aria-roledescription="carousel"
    aria-label="CubicLauncher screenshots"
    class="relative w-full aspect-video rounded-lg overflow-hidden border border-cl-border bg-cl-surface group/main shadow-lg shadow-black/20"
    onmouseenter={() => {
      hovered = true;
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
    }}
    onmouseleave={() => {
      hovered = false;
      resetAuto();
    }}
  >
    <div
      class="flex h-full transition-transform duration-500 ease-out"
      style="transform: translateX(-{current * 100}%)"
      aria-live="polite"
    >
      {#each IMAGES as src, i}
        <button
          type="button"
          onclick={() => openLightbox(i)}
          class="w-full h-full shrink-0 p-0 m-0 border-0 bg-transparent cursor-zoom-in"
          aria-label="Open screenshot preview"
        >
          <img
            {src}
            alt="CubicLauncher screenshot {i + 1}"
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable="false"
            class="w-full h-full object-cover"
          />
        </button>
      {/each}
    </div>

    {#if IMAGES.length > 1}
      <button
        onclick={prev}
        class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded bg-black/60 text-cl-text opacity-0 group-hover/main:opacity-100 hover:bg-black/80 transition-all"
        aria-label="Previous screenshot"
      >
        <IconCaretLeft class="w-5 h-5" />
      </button>
      <button
        onclick={next}
        class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded bg-black/60 text-cl-text opacity-0 group-hover/main:opacity-100 hover:bg-black/80 transition-all"
        aria-label="Next screenshot"
      >
        <IconCaretRight class="w-5 h-5" />
      </button>
    {/if}
  </div>

  {#if IMAGES.length > 1}
    <div
      class="flex items-center justify-center gap-2 mt-4"
      role="tablist"
      aria-label="CubicLauncher screenshots"
    >
      {#each IMAGES as _, i}
        <button
          onclick={() => goTo(i)}
          class="h-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-cl-border-hover {i === current
            ? 'w-4 bg-cl-text'
            : 'w-1.5 h-1.5 bg-cl-dim hover:bg-cl-muted'}"
          role="tab"
          aria-selected={i === current}
          aria-label="Go to screenshot {i + 1}"
        ></button>
      {/each}
    </div>
  {/if}
{:else}
  <div
    class="flex items-center justify-center w-full aspect-video rounded border border-cl-border bg-cl-surface text-cl-dim"
  >
    <span class="text-xs tracking-wide">CubicLauncher</span>
  </div>
{/if}

<ThemeLightbox
  show={lightboxOpen}
  imageUrl={IMAGES[lightboxIndex]}
  alt="CubicLauncher screenshot {lightboxIndex + 1}"
  onClose={closeLightbox}
/>
