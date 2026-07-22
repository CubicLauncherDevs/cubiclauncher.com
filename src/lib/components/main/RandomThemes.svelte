<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { crossfade, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { t } from "$lib/i18n";
  import type { Theme } from "$lib/types/theme";
  import { fetchAllThemes, getCachedThemes, setCachedThemes } from "$lib/utils/themes";
  import { slugify } from "$lib/utils/theme-search";
  import IconShuffle from "~icons/ph/shuffle";
  import IconCaretLeft from "~icons/ph/caret-left";
  import IconCaretRight from "~icons/ph/caret-right";
  import IconUser from "~icons/ph/user";
  import IconImage from "~icons/ph/image";

  let themes = $state<Theme[]>([]);
  let selected = $state<Theme[]>([]);
  let current = $state(0);
  let loading = $state(true);
  let hovered = $state(false);
  let interval: ReturnType<typeof setInterval> | undefined;

  const SHOW_COUNT = 6;
  const AUTOPLAY_MS = 5000;

  const [send, receive] = crossfade({
    duration: 500,
    easing: cubicOut,
  });

  function shuffle(arr: Theme[]): Theme[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function pickRandom() {
    stopAuto();
    selected = shuffle(themes).slice(0, SHOW_COUNT);
    current = 0;
    startAuto();
  }

  function goTo(index: number) {
    current = ((index % selected.length) + selected.length) % selected.length;
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startAuto() {
    stopAuto();
    if (!hovered && selected.length > 1) {
      interval = setInterval(next, AUTOPLAY_MS);
    }
  }

  function stopAuto() {
    if (interval) {
      clearInterval(interval);
      interval = undefined;
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  }

  onMount(async () => {
    let data = await getCachedThemes();
    if (!data) {
      try {
        data = await fetchAllThemes();
        await setCachedThemes(data);
      } catch {
        loading = false;
        return;
      }
    }
    themes = data;
    selected = shuffle(data).slice(0, SHOW_COUNT);
    loading = false;
    startAuto();
  });

  onDestroy(() => {
    stopAuto();
  });
</script>

<svelte:window onkeydown={onKeydown} />

{#if !loading && selected.length > 0}
  <section class="py-24 bg-neutral-950">
    <div class="container mx-auto px-6 max-w-6xl">
      <!-- Header -->
      <div class="flex items-end justify-between mb-10">
        <div>
          <span
            class="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2 block"
          >
            {$t("home.featuredThemes")}
          </span>
          <h2 class="text-3xl md:text-5xl font-black tracking-tighter">
            {$t("home.featuredThemes")}
          </h2>
        </div>
        <div class="flex items-center gap-3">
          <button
            onclick={pickRandom}
            class="group flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:scale-105"
            aria-label={$t("home.shuffleThemes")}
            title={$t("home.shuffleThemes")}
          >
            <IconShuffle
              class="w-4 h-4 text-neutral-300 group-hover:rotate-180 transition-transform duration-500"
            />
          </button>
          <a
            href="/themes"
            class="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            {$t("home.viewAllThemes")}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      <!-- Showcase -->
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured themes"
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
        onmouseenter={() => {
          hovered = true;
          stopAuto();
        }}
        onmouseleave={() => {
          hovered = false;
          startAuto();
        }}
      >
        <!-- Main Image + Dots -->
        <div class="md:col-span-2 flex flex-col gap-4">
          <div
            class="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 group/main"
          >
            {#key current}
              <a
                href="/themes/{selected[current].id}"
                class="absolute inset-0 block"
                in:receive={{ key: "main-image" }}
                out:send={{ key: "main-image" }}
              >
                {#if selected[current].previewUrl}
                  <img
                    src={selected[current].previewUrl}
                    alt={selected[current].name}
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                {:else}
                  <div
                    class="w-full h-full flex items-center justify-center text-neutral-600 bg-neutral-800"
                  >
                    <IconImage class="w-16 h-16" />
                  </div>
                {/if}
              </a>
            {/key}

            <!-- Overlay gradient -->
            <div
              class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-0 group-hover/main:opacity-100 transition-opacity"
            ></div>

            <!-- Navigation arrows -->
            <button
              onclick={prev}
              class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-black/40 text-white opacity-0 group-hover/main:opacity-100 hover:bg-black/60 backdrop-blur-sm transition-all pointer-events-auto"
              aria-label="Previous theme"
            >
              <IconCaretLeft class="w-5 h-5" />
            </button>
            <button
              onclick={next}
              class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-black/40 text-white opacity-0 group-hover/main:opacity-100 hover:bg-black/60 backdrop-blur-sm transition-all pointer-events-auto"
              aria-label="Next theme"
            >
              <IconCaretRight class="w-5 h-5" />
            </button>
          </div>

          <!-- Dots -->
          <div class="flex items-center justify-center gap-2" role="tablist" aria-label="Theme slides">
            {#each selected as _, i}
              <button
                onclick={() => goTo(i)}
                class="rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white/30 {i === current
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'}"
                role="tab"
                aria-selected={i === current}
                aria-label="Go to slide {i + 1}"
              ></button>
            {/each}
          </div>
        </div>

        <!-- Info Panel -->
        <div
          class="md:col-span-1 relative min-h-[280px] rounded-2xl border border-white/10 bg-neutral-900/50 p-6 md:p-8 overflow-hidden"
        >
          {#key current}
            <div
              class="flex flex-col h-full justify-center"
              in:fade={{ duration: 400, delay: 100 }}
              out:fade={{ duration: 250 }}
            >
              <a href="/themes/{selected[current].id}" class="group">
                <h3
                  class="text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-neutral-300 transition-colors leading-tight"
                >
                  {selected[current].name}
                </h3>
              </a>

              <a
                href="/themes/author/{slugify(selected[current].author)}"
                class="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors mt-2"
              >
                <IconUser class="w-3.5 h-3.5" />
                {$t("themeDetail.by")}
                {selected[current].author}
              </a>

              {#if selected[current].description}
                <p
                  class="text-sm text-neutral-500 mt-4 line-clamp-3 leading-relaxed"
                >
                  {@html selected[current].description}
                </p>
              {/if}

              <div class="flex flex-wrap items-center gap-3 mt-6">
                <span
                  class="text-xs font-medium text-neutral-300 bg-white/5 px-3 py-1.5 rounded-md border border-white/5"
                >
                  v{selected[current].latestVersion}
                </span>
                {#if selected[current].date}
                  <span class="text-xs text-neutral-600">{selected[current].date}</span>
                {/if}
              </div>

              <a
                href="/themes/{selected[current].id}"
                class="inline-flex items-center gap-2 mt-8 text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-neutral-300 transition-colors"
              >
                {$t("home.viewTheme")}
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          {/key}
        </div>
      </div>
    </div>
  </section>
{/if}
