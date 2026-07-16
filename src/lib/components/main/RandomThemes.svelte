<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { t } from "$lib/i18n";
  import type { Theme } from "$lib/types/theme";
  import { fetchAllThemes, getCachedThemes, setCachedThemes } from "$lib/utils/themes";
  import { fly } from "svelte/transition";

  let themes = $state<Theme[]>([]);
  let selected = $state<Theme[]>([]);
  let current = $state(0);
  let loading = $state(true);
  let interval: ReturnType<typeof setInterval> | undefined;
  let direction = $state(1);

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
    selected = shuffle(themes);
    current = 0;
    direction = 1;
    startAuto();
  }

  function goTo(index: number) {
    const newIndex = ((index % selected.length) + selected.length) % selected.length;
    direction = newIndex > current || (newIndex === 0 && current === selected.length - 1) ? 1 : -1;
    current = newIndex;
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startAuto() {
    stopAuto();
    interval = setInterval(next, 4000);
  }

  function stopAuto() {
    if (interval) {
      clearInterval(interval);
      interval = undefined;
    }
  }

  onMount(async () => {
    let data = getCachedThemes();
    if (!data) {
      try {
        data = await fetchAllThemes();
        setCachedThemes(data);
      } catch {
        loading = false;
        return;
      }
    }
    themes = data;
    selected = shuffle(data);
    loading = false;
    startAuto();
  });

  onDestroy(() => {
    stopAuto();
  });
</script>

{#if !loading && selected.length > 0}
  <section class="py-24">
    <div class="container mx-auto px-6 max-w-6xl">
      <div class="flex items-center justify-between mb-12">
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
          {$t('home.featuredThemes')}
        </h2>
        <div class="flex items-center gap-4">
          <button
            onclick={pickRandom}
            class="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 3 21 3 21 8"></polyline>
              <line x1="4" y1="20" x2="21" y2="3"></line>
              <polyline points="21 16 21 21 16 21"></polyline>
              <line x1="15" y1="15" x2="21" y2="21"></line>
              <line x1="4" y1="4" x2="9" y2="9"></line>
            </svg>
            {$t('home.shuffleThemes')}
          </button>
          <a
            href="/themes"
            class="text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden sm:inline"
          >
            {$t('home.viewAllThemes')} &rarr;
          </a>
        </div>
      </div>

      <div
        class="relative bg-neutral-900/50 border border-white/10 rounded-2xl overflow-hidden"
        onmouseenter={stopAuto}
        onmouseleave={startAuto}
      >
        <div class="relative min-h-[320px] md:min-h-[300px]">
          {#key current}
            {@const theme = selected[current]}
            <div
              class="flex flex-col md:flex-row"
              in:fly={{ x: direction * 300, duration: 500, opacity: 0 }}
              out:fly={{ x: direction * -300, duration: 400, opacity: 0 }}
            >
              <a
                href="/themes/{theme.id}"
                class="block md:w-3/5 aspect-video md:aspect-auto bg-neutral-800 relative overflow-hidden"
              >
                {#if theme.previewUrl}
                  <img
                    src={theme.previewUrl}
                    alt={theme.name}
                    loading="lazy"
                    class="w-full h-full object-cover"
                  />
                {:else}
                  <div class="w-full h-full flex items-center justify-center text-neutral-600 min-h-[200px]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-16 h-16">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                  </div>
                {/if}
              </a>

              <div class="p-6 md:p-8 md:w-2/5 flex flex-col justify-center">
                <a href="/themes/{theme.id}" class="block group">
                  <h3 class="text-xl md:text-2xl font-bold text-white group-hover:text-white/80 transition-colors">{theme.name}</h3>
                </a>
                <a
                  href="/themes?author={encodeURIComponent(theme.author)}"
                  class="text-sm text-neutral-400 mt-1 hover:text-neutral-200 transition-colors"
                >
                  {$t('themeDetail.by')} {theme.author}
                </a>

                {#if theme.description}
                  <p class="text-sm text-neutral-500 mt-4 line-clamp-3 leading-relaxed">
                    {@html theme.description}
                  </p>
                {/if}

                <div class="flex items-center gap-3 mt-6">
                  <span class="text-xs font-medium text-neutral-400 bg-white/5 px-3 py-1.5 rounded-md">
                    {theme.latestVersion}
                  </span>
                  {#if theme.date}
                    <span class="text-xs text-neutral-600">{theme.date}</span>
                  {/if}
                </div>
              </div>
            </div>
          {/key}
        </div>

        <button
          onclick={prev}
          class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-2 rounded-full hover:bg-black/40 bg-black/20 backdrop-blur-sm z-10"
          aria-label="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button
          onclick={next}
          class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-2 rounded-full hover:bg-black/40 bg-black/20 backdrop-blur-sm z-10"
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>

        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {#each selected as _, i}
            <button
              onclick={() => goTo(i)}
              class="rounded-full transition-all {i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}"
              aria-label="Go to slide {i + 1}"
            />
          {/each}
        </div>
      </div>
    </div>
  </section>
{/if}
