<script lang="ts">
  import { onMount } from "svelte";
  import type { Theme } from "$lib/types/theme";
  import {
    fetchThemeTree,
    buildThemesFromTree,
    getCachedThemes,
    setCachedThemes,
  } from "$lib/utils/themes";
  import ThemeCard from "./ThemeCard.svelte";

  let themes = $state<Theme[]>([]);
  let loading = $state(true);
  let error = $state("");
  let hasCached = $state(false);

  onMount(async () => {
    const cached = getCachedThemes();
    if (cached) {
      themes = cached;
      hasCached = true;
    }

    if (!cached) {
      try {
        const tree = await fetchThemeTree();
        const result = buildThemesFromTree(tree);
        themes = result;
        setCachedThemes(result);
      } catch (e) {
        error = e instanceof Error ? e.message : "Error al cargar los temas";
      } finally {
        loading = false;
      }
    } else {
      loading = false;
      try {
        const tree = await fetchThemeTree();
        const result = buildThemesFromTree(tree);
        themes = result;
        setCachedThemes(result);
      } catch {
        // silent refresh failure — cached data remains
      }
    }
  });
</script>

<section class="min-h-screen pt-36 pb-32 bg-neutral-950 text-white">
  <div class="container mx-auto px-6 max-w-5xl">
    <!-- Hero -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        {loading ? "..." : themes.length} temas
      </div>
      <h1 class="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
        Personalizá tu launcher
      </h1>
      <p class="text-base text-neutral-400 font-light max-w-lg mx-auto">
        Explorá y descargá temas creados por la comunidad.
      </p>
    </div>

    <!-- Content -->
    {#if error && themes.length === 0}
      <div class="text-center py-20">
        <p class="text-neutral-500 mb-6">{error}</p>
        <button
          onclick={() => location.reload()}
          class="bg-white text-black px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all"
        >
          Reintentar
        </button>
      </div>
    {:else if loading && !hasCached}
      <!-- Skeleton loader -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each Array(6) as _}
          <div class="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden animate-pulse">
            <div class="aspect-[16/9] bg-neutral-800"></div>
            <div class="p-4 space-y-2">
              <div class="h-4 bg-neutral-800 rounded w-2/3"></div>
              <div class="h-3 bg-neutral-800 rounded w-1/3"></div>
            </div>
          </div>
        {/each}
      </div>
    {:else if themes.length === 0 && !loading}
      <div class="text-center py-20">
        <p class="text-neutral-500">No hay temas disponibles todavía.</p>
      </div>
    {:else}
      <!-- Grid with staggered animation -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each themes as theme, i}
          <div
            class="card-enter"
            style="animation-delay: {i * 80}ms"
          >
            <ThemeCard {theme} />
          </div>
        {/each}
      </div>
    {/if}

    <!-- Contribute -->
    {#if !loading || hasCached}
      <div class="mt-20 text-center">
        <p class="text-sm text-neutral-500">
          ¿Querés crear tu propio tema?
          <a href="/docs/themes" class="text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-all">Seguí la guía</a>
          y compartilo en
          <a href="https://github.com/CubicLauncher/Themes" target="_blank" rel="noopener noreferrer" class="text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-all">GitHub</a>.
        </p>
      </div>
    {/if}
  </div>
</section>

<style>
  @keyframes card-enter {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .card-enter {
    animation: card-enter 0.4s ease-out both;
  }
</style>
