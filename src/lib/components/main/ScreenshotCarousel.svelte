<script lang="ts">
  import { t } from "$lib/i18n";
  import IconCaretLeft from "~icons/ph/caret-left";
  import IconCaretRight from "~icons/ph/caret-right";
  import IconCornersOut from "~icons/ph/corners-out";
  import ThemeLightbox from "$lib/components/themes/ThemeLightbox.svelte";

  const screenshots = [
    { key: "overview", src: "https://i.imghos.co/rrpARZRK.png", width: 1252, height: 704 },
    { key: "instance", src: "https://i.imghos.co/xUcughdC.png", width: 1252, height: 704 },
    { key: "instances", src: "https://i.imghos.co/WKkfioJm.png", width: 1252, height: 704 },
    { key: "create", src: "https://i.imghos.co/amliolzL.png", width: 1252, height: 704 },
    { key: "modpacks", src: "https://i.imghos.co/SiiyCRyM.png", width: 1252, height: 704 },
    { key: "versions", src: "https://i.imghos.co/nUdnlnCY.png", width: 1252, height: 704 },
    { key: "store", src: "https://i.imghos.co/-FqEJDCJ.png", width: 1252, height: 704 },
    { key: "installed", src: "https://i.imghos.co/gzYGnwpV.png", width: 1252, height: 704 },
    { key: "worlds", src: "https://i.imghos.co/RxjadIsv.png", width: 1252, height: 704 },
    { key: "servers", src: "https://i.imghos.co/pnnGNdkW.png", width: 1252, height: 704 },
    { key: "skins", src: "https://i.imghos.co/llbpUaqr.png", width: 1252, height: 704 },
    { key: "profile", src: "https://i.imghos.co/zacZqNPs.png", width: 1252, height: 704 },
    { key: "settings", src: "https://i.imghos.co/qKHkMsKo.png", width: 1252, height: 704 },
  ];

  let current = $state(0);
  let lightboxOpen = $state(false);
  let indexList: HTMLOListElement;
  const selected = $derived(screenshots[current]);

  const pad = (value: number) => String(value).padStart(2, "0");

  function goTo(index: number, focusItem = false) {
    current = (index + screenshots.length) % screenshots.length;
    if (focusItem) {
      indexList?.querySelectorAll("button")[current]?.focus({ preventScroll: true });
    }
  }

  function handleKeydown(event: KeyboardEvent, focusItem = false) {
    let index: number;
    switch (event.key) {
      case "ArrowLeft": index = current - 1; break;
      case "ArrowRight": index = current + 1; break;
      case "Home": index = 0; break;
      case "End": index = screenshots.length - 1; break;
      default: return;
    }
    event.preventDefault();
    goTo(index, focusItem);
  }
</script>

<section aria-labelledby="screenshots-title" class="py-10 bg-cl-base">
  <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
    <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id="screenshots-title" class="mb-1 text-lg font-semibold text-cl-text sm:text-xl">
          {$t('home.screenshots.title')}
        </h2>
        <p class="max-w-xl text-xs text-cl-muted">
          {$t('home.screenshots.subtitle')}
        </p>
      </div>
      <span class="font-mono text-[11px] tabular-nums text-cl-dim" aria-hidden="true">
        {pad(current + 1)} / {pad(screenshots.length)}
      </span>
    </div>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-6">
      <figure class="min-w-0">
        <button
          type="button"
          class="relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded border border-cl-border bg-[#0a0a0a] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cl-text"
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

        <figcaption class="mt-3 flex items-start justify-between gap-4">
          <div class="min-w-0" aria-live="polite" aria-atomic="true">
            <h3 class="text-xs font-semibold text-cl-text">
              {$t(`home.screenshots.${selected.key}.title`)}
            </h3>
            <p class="mt-1 max-w-xl text-[11px] leading-relaxed text-cl-muted">
              {$t(`home.screenshots.${selected.key}.description`)}
            </p>
          </div>
          <div class="flex shrink-0 gap-1">
            <button
              type="button"
              onclick={() => lightboxOpen = true}
              aria-label={$t('home.screenshots.expand')}
              title={$t('home.screenshots.expand')}
              aria-haspopup="dialog"
              class="flex size-9 items-center justify-center rounded border border-cl-border text-cl-muted transition-colors hover:border-cl-border-hover hover:bg-cl-elevated hover:text-cl-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cl-text"
            ><IconCornersOut class="size-4" /></button>
            <button
              type="button"
              onclick={() => goTo(current - 1)}
              aria-label={$t('home.screenshots.previous')}
              class="flex size-9 items-center justify-center rounded border border-cl-border text-cl-muted transition-colors hover:border-cl-border-hover hover:bg-cl-elevated hover:text-cl-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cl-text"
            ><IconCaretLeft class="size-4" /></button>
            <button
              type="button"
              onclick={() => goTo(current + 1)}
              aria-label={$t('home.screenshots.next')}
              class="flex size-9 items-center justify-center rounded border border-cl-border text-cl-muted transition-colors hover:border-cl-border-hover hover:bg-cl-elevated hover:text-cl-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cl-text"
            ><IconCaretRight class="size-4" /></button>
          </div>
        </figcaption>
      </figure>

      <nav class="min-w-0" aria-label={$t('home.screenshots.choose')}>
        <ol
          bind:this={indexList}
          class="scrollbar-hide flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-l lg:border-cl-border lg:pb-0"
        >
          {#each screenshots as screenshot, i}
            <li class="shrink-0 lg:-ml-px lg:shrink lg:border-l-2 {current === i ? 'lg:border-cl-text' : 'lg:border-transparent'}">
              <button
                type="button"
                onclick={() => goTo(i)}
                onkeydown={(event) => handleKeydown(event, true)}
                aria-label={$t('home.screenshots.select', { values: { name: $t(`home.screenshots.${screenshot.key}.title`) } })}
                aria-current={current === i ? 'true' : undefined}
                class="flex items-center gap-2 whitespace-nowrap rounded border px-2.5 py-1.5 text-left text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cl-text lg:w-full lg:rounded-none lg:border-0 lg:px-3 lg:py-2 {current === i ? 'border-cl-border-hover bg-cl-elevated text-cl-text lg:bg-cl-elevated' : 'border-cl-border bg-cl-surface text-cl-muted hover:border-cl-border-hover hover:text-cl-text lg:bg-transparent lg:hover:bg-cl-elevated/60'}"
              >
                <span class="font-mono text-[10px] tabular-nums text-cl-dim">{pad(i + 1)}</span>
                <span class="truncate">{$t(`home.screenshots.${screenshot.key}.title`)}</span>
              </button>
            </li>
          {/each}
        </ol>
      </nav>
    </div>
  </div>
</section>

<ThemeLightbox
  show={lightboxOpen}
  imageUrl={selected.src}
  alt={$t(`home.screenshots.${selected.key}.alt`)}
  onClose={() => lightboxOpen = false}
/>
