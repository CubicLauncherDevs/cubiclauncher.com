<script lang="ts">
  import { onMount } from "svelte";
  import { t } from "$lib/i18n";
  import type { Theme } from "$lib/types/theme";
  import { fetchAllThemes, getCachedThemes, setCachedThemes, getThemeVerification } from "$lib/utils/themes";
  import { slugify } from "$lib/utils/theme-search";
  import IconShuffle from "~icons/ph/shuffle";
  import IconImage from "~icons/ph/image";
  import VerifiedBadge from "$lib/components/themes/VerifiedBadge.svelte";

  let themes = $state<Theme[]>([]);
  let selected = $state<Theme[]>([]);
  let loading = $state(true);

  const SHOW_COUNT = 3;

  function shuffle(arr: Theme[]): Theme[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function pickRandom() {
    selected = shuffle(themes).slice(0, SHOW_COUNT);
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
  });
</script>

{#if !loading && selected.length > 0}
  <section class="py-16 bg-neutral-950">
    <div class="mx-auto px-6 lg:px-8" style="max-width: var(--discord-max-width);">
      <div class="flex items-end justify-between mb-6">
        <h2 class="text-[22px] sm:text-[26px] font-semibold tracking-tight text-white">
          {$t("home.featuredThemes")}
        </h2>
        <div class="flex items-center gap-3">
          <button
            onclick={pickRandom}
            class="group flex items-center justify-center w-8 h-8 rounded-[4px] border border-white/10 bg-neutral-900 hover:bg-neutral-800 transition-colors"
            aria-label={$t("home.shuffleThemes")}
            title={$t("home.shuffleThemes")}
          >
            <IconShuffle
              class="w-3.5 h-3.5 text-neutral-400 group-hover:rotate-180 transition-transform duration-500"
            />
          </button>
          <a
            href="/themes"
            class="hidden sm:inline-flex items-center gap-1 text-[13px] font-medium text-neutral-400 hover:text-white transition-colors"
          >
            {$t("home.viewAllThemes")}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each selected as theme (theme.id)}
          <a
            href="/themes/{theme.id}"
            class="group block rounded-[4px] border border-white/10 bg-neutral-900 overflow-hidden hover:border-white/20 transition-colors"
          >
            <div class="relative aspect-video bg-neutral-800 overflow-hidden">
              {#if theme.previewUrl}
                <img
                  src={theme.previewUrl}
                  alt={theme.name}
                  class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
              {:else}
                <div class="w-full h-full flex items-center justify-center text-neutral-600">
                  <IconImage class="w-10 h-10" />
                </div>
              {/if}
            </div>
            <div class="p-4">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-[14px] font-semibold text-white group-hover:text-neutral-300 transition-colors truncate">
                  {theme.name}
                </h3>
                {#if getThemeVerification(theme) !== "none"}
                  <VerifiedBadge size="sm" level={getThemeVerification(theme)} />
                {/if}
              </div>
              <p class="text-[12px] text-neutral-500 truncate">
                {$t("themeDetail.by")} {theme.author}
              </p>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>
{/if}
