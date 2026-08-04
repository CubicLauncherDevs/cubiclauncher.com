<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { t } from "$lib/i18n";
  import IconFingerprint from "~icons/ph/fingerprint";
  import IconCaretLeft from "~icons/ph/caret-left";
  import IconCaretRight from "~icons/ph/caret-right";

  const IMAGES = [
    "https://i.ibb.co/07gK9mp/imagen.png",
    "https://i.ibb.co/b5zvXR8h/imagen.png",
    "https://i.ibb.co/20PhrVgD/imagen.png",
  ].filter(Boolean);

  let current = $state(0);
  let hovered = $state(false);
  let interval: ReturnType<typeof setInterval> | undefined;

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

<section class="py-24 border-y border-white/5 bg-neutral-950">
  <div class="container mx-auto px-6 max-w-6xl">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24 items-center">
      <div class="lg:col-span-2">
        <h2 class="text-4xl md:text-5xl font-black tracking-tighter mb-6">
          {$t('home.valueTitle')}
        </h2>
        <p class="text-neutral-400 text-lg font-light leading-relaxed">
          {$t('home.valueSubtitle')}
        </p>
      </div>

      <div class="relative lg:col-span-3">
        {#if IMAGES.length > 0}
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="CubicLauncher screenshots"
            class="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 group/main"
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
              class="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style="transform: translateX(-{current * 100}%)"
              aria-live="polite"
            >
              {#each IMAGES as src, i}
                <img
                  src={src}
                  alt="CubicLauncher"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable="false"
                  class="w-full h-full object-cover shrink-0"
                />
              {/each}
            </div>

            {#if IMAGES.length > 1}
              <button
                onclick={prev}
                class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-black/40 text-white opacity-0 group-hover/main:opacity-100 hover:bg-black/60 backdrop-blur-sm transition-all"
                aria-label="Previous screenshot"
              >
                <IconCaretLeft class="w-5 h-5" />
              </button>
              <button
                onclick={next}
                class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-black/40 text-white opacity-0 group-hover/main:opacity-100 hover:bg-black/60 backdrop-blur-sm transition-all"
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
                  class="rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white/30 {i === current
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'}"
                  role="tab"
                  aria-selected={i === current}
                  aria-label="Go to screenshot {i + 1}"
                ></button>
              {/each}
            </div>
          {/if}
        {:else}
          <div
            class="flex items-center justify-center w-full aspect-video rounded-2xl border border-white/10 bg-neutral-900 text-neutral-600"
          >
            <span class="text-sm font-light tracking-wide">CubicLauncher</span>
          </div>
        {/if}
      </div>
    </div>

    <div
      class="mt-24 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left"
    >
      <div
        class="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 text-white"
      >
        <IconFingerprint class="w-8 h-8" />
      </div>
      <div class="max-w-2xl">
        <h3 class="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
          {$t('home.value5Title')}
        </h3>
        <p class="text-neutral-400 text-lg font-light leading-relaxed">
          {$t('home.value5Desc')}
        </p>
      </div>
    </div>
  </div>
</section>
