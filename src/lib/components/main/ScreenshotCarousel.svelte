<script lang="ts">
  import { t } from "$lib/i18n";
  import IconCaretLeft from "~icons/ph/caret-left";
  import IconCaretRight from "~icons/ph/caret-right";
  import IconCornersOut from "~icons/ph/corners-out";
  import IconDesktop from "~icons/ph/desktop";
  import ThemeLightbox from "$lib/components/themes/ThemeLightbox.svelte";

  const screenshots = [
    { key: "store", src: "https://i.ibb.co/nMZVWBRN/imagen.png", width: 1366, height: 768 },
    { key: "installed", src: "https://iili.io/Cr68lMN.png", width: 1366, height: 768 },
    { key: "instances", src: "https://iili.io/Cr687wv.png", width: 704, height: 535 },
    { key: "overview", src: "https://iili.io/Cr68EFt.png", width: 1366, height: 768 },
    { key: "settings", src: "https://iili.io/Cr68YtR.png", width: 1366, height: 768 },
  ];

  let current = $state(0);
  let lightboxOpen = $state(false);
  let thumbnailList: HTMLDivElement;
  const selected = $derived(screenshots[current]);

  function goTo(index: number, focusThumbnail = false) {
    current = (index + screenshots.length) % screenshots.length;
    const thumbnail = thumbnailList?.querySelectorAll("button")[current];
    if (focusThumbnail) thumbnail?.focus({ preventScroll: true });
    if (thumbnail) {
      const item = thumbnail.getBoundingClientRect();
      const list = thumbnailList.getBoundingClientRect();
      const offset = item.left < list.left ? item.left - list.left
        : item.right > list.right ? item.right - list.right : 0;
      thumbnailList.scrollBy({ left: offset, behavior: "instant" });
    }
  }

  function handleKeydown(event: KeyboardEvent, focusThumbnail = false) {
    let index: number;
    switch (event.key) {
      case "ArrowLeft": index = current - 1; break;
      case "ArrowRight": index = current + 1; break;
      case "Home": index = 0; break;
      case "End": index = screenshots.length - 1; break;
      default: return;
    }
    event.preventDefault();
    goTo(index, focusThumbnail);
  }
</script>

<section aria-labelledby="screenshots-title" class="bg-cl-base py-10 sm:py-14">
  <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id="screenshots-title" class="mb-1 text-lg font-semibold text-cl-text sm:text-xl">
          {$t('home.screenshots.title')}
        </h2>
        <p class="max-w-xl text-xs leading-relaxed text-cl-muted">
          {$t('home.screenshots.subtitle')}
        </p>
      </div>
    </div>

    <div class="overflow-hidden rounded-lg border border-cl-border bg-cl-surface shadow-xl shadow-black/5">
      <div class="flex items-center justify-between gap-3 border-b border-cl-border px-3 py-2.5 sm:px-4">
        <span class="text-[11px] font-medium tracking-wide text-cl-muted">CubicLauncher</span>
        <button
          type="button"
          onclick={() => lightboxOpen = true}
          aria-haspopup="dialog"
          class="inline-flex min-h-8 items-center gap-1.5 rounded px-2 text-[11px] text-cl-dim transition-colors hover:bg-cl-elevated hover:text-cl-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cl-text"
        >
          <IconCornersOut class="size-3.5" />
          {$t('home.screenshots.expand')}
        </button>
      </div>

      <button
        type="button"
        class="relative block aspect-video w-full cursor-zoom-in overflow-hidden bg-[#0a0a0a] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cl-text"
        onclick={() => lightboxOpen = true}
        onkeydown={(event) => handleKeydown(event)}
        aria-label={$t('home.screenshots.open', { values: { name: $t(`home.screenshots.${selected.key}.title`) } })}
        aria-haspopup="dialog"
      >
        {#each screenshots as screenshot, i}
          <img
            src={screenshot.src}
            alt={$t(`home.screenshots.${screenshot.key}.alt`)}
            width={screenshot.width}
            height={screenshot.height}
            loading="lazy"
            decoding="async"
            draggable="false"
            aria-hidden={i !== current}
            class="absolute inset-0 h-full w-full object-contain transition-opacity duration-200 motion-reduce:transition-none {i === current ? 'opacity-100' : 'opacity-0'}"
          />
        {/each}
      </button>

      <div class="flex items-center justify-between gap-3 border-t border-cl-border p-3 sm:px-5 sm:py-4">
        <div class="min-w-0" aria-live="polite" aria-atomic="true">
          <div class="flex items-center gap-2.5">
            <span class="shrink-0 font-mono text-[10px] tabular-nums text-cl-dim">
              {String(current + 1).padStart(2, '0')} / {String(screenshots.length).padStart(2, '0')}
            </span>
            <h3 class="text-xs font-semibold text-cl-text">{$t(`home.screenshots.${selected.key}.title`)}</h3>
          </div>
          <p class="mt-1.5 max-w-xl text-[11px] leading-relaxed text-cl-muted">
            {$t(`home.screenshots.${selected.key}.description`)}
          </p>
        </div>
        <div class="flex shrink-0 gap-1.5">
          <button
            type="button"
            onclick={() => goTo(current - 1)}
            aria-label={$t('home.screenshots.previous')}
            class="flex size-10 items-center justify-center rounded border border-cl-border text-cl-muted transition-colors hover:border-cl-border-hover hover:bg-cl-elevated hover:text-cl-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cl-text"
          ><IconCaretLeft class="size-4" /></button>
          <button
            type="button"
            onclick={() => goTo(current + 1)}
            aria-label={$t('home.screenshots.next')}
            class="flex size-10 items-center justify-center rounded border border-cl-border text-cl-muted transition-colors hover:border-cl-border-hover hover:bg-cl-elevated hover:text-cl-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cl-text"
          ><IconCaretRight class="size-4" /></button>
        </div>
      </div>
    </div>

    <div
      bind:this={thumbnailList}
      role="group"
      aria-label={$t('home.screenshots.choose')}
      class="-mx-1 mt-3 flex snap-x snap-proximity gap-2 overflow-x-auto p-1 sm:gap-3"
    >
      {#each screenshots as screenshot, i}
        <button
          type="button"
          onclick={() => goTo(i)}
          onkeydown={(event) => handleKeydown(event, true)}
          aria-label={$t('home.screenshots.select', { values: { name: $t(`home.screenshots.${screenshot.key}.title`) } })}
          aria-pressed={current === i}
          class="group w-32 shrink-0 snap-start overflow-hidden rounded-md border p-1 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cl-text sm:w-0 sm:flex-1 {current === i ? 'border-cl-text bg-cl-elevated' : 'border-cl-border bg-cl-surface hover:border-cl-border-hover hover:bg-cl-elevated'}"
        >
          <div class="aspect-video overflow-hidden rounded-sm bg-[#0a0a0a]">
            <img
              src={screenshot.src}
              alt=""
              width={screenshot.width}
              height={screenshot.height}
              loading="lazy"
              decoding="async"
              class="h-full w-full object-contain transition-opacity motion-reduce:transition-none {current === i ? 'opacity-100' : 'opacity-60 group-hover:opacity-100 group-focus-visible:opacity-100'}"
            />
          </div>
          <span class="flex items-center gap-1.5 px-1 py-2 text-[10px] {current === i ? 'text-cl-text' : 'text-cl-dim'}">
            <span aria-hidden="true" class="font-mono tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <span class="truncate">{$t(`home.screenshots.${screenshot.key}.title`)}</span>
          </span>
        </button>
      {/each}
    </div>
  </div>
</section>

<ThemeLightbox
  show={lightboxOpen}
  imageUrl={selected.src}
  alt={$t(`home.screenshots.${selected.key}.alt`)}
  onClose={() => lightboxOpen = false}
/>
