<script lang="ts">
  import { onMount } from "svelte";
  import { t } from "$lib/i18n";
  import { fetchReleasePage, ReleaseFetchError, RELEASES_URL, type LauncherRelease } from "$lib/utils/releases";
  import ReleaseCard from "./ReleaseCard.svelte";
  import IconClock from "~icons/ph/clock-counter-clockwise";
  import IconGithub from "~icons/simple-icons/github";
  import IconDownload from "~icons/ph/download-simple";
  import IconSpinner from "~icons/ph/spinner";

  let releases = $state<LauncherRelease[]>([]);
  let loading = $state(true);
  let error = $state("");
  let hasMore = $state(true);
  let nextPage = 1;
  let controller: AbortController | null = null;

  async function loadMore() {
    if (controller || !hasMore) return;
    const request = new AbortController();
    controller = request;
    loading = true;
    error = "";
    const timeout = setTimeout(() => request.abort(new DOMException("Request timed out", "TimeoutError")), 20000);
    try {
      const result = await fetchReleasePage(nextPage, request.signal);
      request.signal.throwIfAborted();
      const merged = new Map(releases.map((release) => [release.id, release]));
      for (const release of result.releases) merged.set(release.id, release);
      releases = [...merged.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
      hasMore = result.hasMore;
      nextPage += 1;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      error = e instanceof ReleaseFetchError ? e.code : "fetchError";
    } finally {
      clearTimeout(timeout);
      loading = false;
      controller = null;
    }
  }

  onMount(() => {
    void loadMore();
    return () => controller?.abort();
  });
</script>

<section class="relative border-b border-cl-border bg-cl-surface overflow-hidden">
  <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle, var(--cl-text) 1px, transparent 1px); background-size: 40px 40px;"></div>
  <div class="relative mx-auto px-4 lg:px-6 py-10" style="max-width: var(--discord-max-width);">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div>
        <div class="mb-3 flex items-center gap-2 text-cl-muted text-[11px] font-medium uppercase tracking-widest">
          <IconClock class="h-4 w-4" /> CubicLauncher
        </div>
        <h1 class="text-xl sm:text-2xl font-semibold text-cl-text mb-2">{$t('changelogs.title')}</h1>
        <p class="text-xs leading-relaxed text-cl-muted max-w-lg">{$t('changelogs.subtitle')}</p>
      </div>
      <a href="/install" class="inline-flex self-start sm:self-auto shrink-0 items-center gap-1.5 rounded bg-cl-text text-cl-accent-inverse px-3 py-2 text-xs font-medium hover:opacity-90 transition-opacity">
        <IconDownload class="h-3.5 w-3.5" /> {$t('nav.download')}
      </a>
    </div>
  </div>
</section>

<section class="mx-auto w-full px-4 lg:px-6 py-6 sm:py-8" style="max-width: var(--discord-max-width);" aria-label={$t('changelogs.title')}>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-cl-muted">
      <p>{$t('changelogs.originalNotes')}</p>
      <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:text-cl-text transition-colors">
        <IconGithub class="h-3.5 w-3.5" /> {$t('changelogs.source')}
      </a>
    </div>

    {#if releases.length > 0}
      <div class="ml-1 border-l border-cl-border space-y-4 pb-2">
        {#each releases as release, index (release.id)}
          <ReleaseCard {release} expanded={index === 0} />
        {/each}
      </div>
    {/if}

    {#if loading}
      <div role="status" class="flex items-center justify-center gap-2 py-6 text-xs text-cl-muted">
        <IconSpinner class="h-4 w-4 animate-spin" /> {$t('changelogs.loading')}
      </div>
      {#if releases.length === 0}
        <div class="space-y-4 motion-safe:animate-pulse" aria-hidden="true">
          {#each [0, 1, 2] as item}
            <div class="rounded-lg border border-cl-border bg-cl-surface p-5">
              <div class="h-3 w-32 rounded bg-cl-elevated mb-4"></div>
              <div class="h-4 w-2/3 rounded bg-cl-elevated"></div>
              {#if item === 0}<div class="h-20 mt-5 rounded bg-cl-elevated"></div>{/if}
            </div>
          {/each}
        </div>
      {/if}
    {:else if error}
      <div class="mt-5 rounded-lg border border-cl-border bg-cl-surface p-5 text-center">
        <p role="alert" class="text-xs text-cl-danger mb-3">{$t(`changelogs.${error}`)}</p>
        <button onclick={loadMore} class="rounded border border-cl-border bg-cl-elevated px-3 py-1.5 text-xs text-cl-text hover:border-cl-border-hover transition-colors">{$t('changelogs.retry')}</button>
      </div>
    {:else if releases.length === 0}
      <p class="rounded-lg border border-cl-border bg-cl-surface p-8 text-center text-xs text-cl-muted">{$t('changelogs.empty')}</p>
    {/if}

    {#if !loading && !error && hasMore}
      <div class="mt-6 text-center">
        <button onclick={loadMore} class="rounded border border-cl-border bg-cl-elevated px-4 py-2 text-xs font-medium text-cl-text hover:border-cl-border-hover hover:bg-cl-hover transition-colors">{$t('changelogs.loadMore')}</button>
      </div>
    {/if}
    <noscript><p class="py-4 text-xs text-cl-muted">{$t('changelogs.noScript')}</p></noscript>
  </div>
</section>
