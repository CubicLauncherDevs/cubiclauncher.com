<script lang="ts">
  import { onMount } from "svelte";
  import { t } from "$lib/i18n";
  import type { Theme } from "$lib/types/theme";
  import { fetchAllThemes, getCachedThemes, setCachedThemes, getThemeVerification } from "$lib/utils/themes";
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

  onMount(() => {
    let mounted = true;
    (async () => {
      let data = await getCachedThemes();
      if (!data) {
        try {
          data = await fetchAllThemes();
          await setCachedThemes(data);
        } catch {
          if (mounted) loading = false;
          return;
        }
      }
      if (mounted) {
        themes = data;
        selected = shuffle(data).slice(0, SHOW_COUNT);
        loading = false;
      }
    })();
    return () => { mounted = false; };
  });
</script>

{#if !loading && selected.length > 0}
  <section class="py-10 bg-cl-base">
    <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">
          {$t("home.featuredThemes")}
        </h2>
        <div class="flex items-center gap-2">
          <button
            onclick={pickRandom}
            class="group flex items-center justify-center w-7 h-7 rounded border border-cl-border bg-cl-surface hover:bg-cl-elevated transition-colors"
            aria-label={$t("home.shuffleThemes")}
            title={$t("home.shuffleThemes")}
          >
            <IconShuffle
              class="w-3 h-3 text-cl-muted transition-colors group-hover:text-cl-text"
            />
          </button>
          <a
            href="/themes"
            class="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-cl-muted hover:text-cl-text transition-colors"
          >
            {$t("home.viewAllThemes")}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {#each selected as theme (theme.id)}
          {@const verification = getThemeVerification(theme)}
          <a
            href="/themes/{theme.id}"
            class="group flex gap-3 p-2.5 rounded border border-cl-border bg-cl-surface hover:border-cl-border-hover hover:bg-cl-elevated transition-colors"
          >
            <div class="relative w-20 h-12 shrink-0 rounded bg-cl-elevated overflow-hidden">
              {#if theme.previewUrl}
                <img
                  src={theme.previewUrl}
                  alt={theme.name}
                  class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
              {:else}
                <div class="w-full h-full flex items-center justify-center text-cl-dim">
                  <IconImage class="w-5 h-5" />
                </div>
              {/if}
            </div>
            <div class="min-w-0 flex-1 flex flex-col justify-center">
              <div class="flex items-center gap-1.5 mb-0.5">
                <h3 class="text-xs font-semibold text-white group-hover:text-cl-muted transition-colors truncate">
                  {theme.name}
                </h3>
                {#if verification !== "none"}
                  <VerifiedBadge size="sm" level={verification} />
                {/if}
              </div>
              <p class="text-[11px] text-cl-muted truncate">
                {$t("themeDetail.by")} {theme.author}
              </p>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>
{/if}
