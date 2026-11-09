<script lang="ts">
  import { onMount } from "svelte";
  import { t } from "$lib/i18n";
  import { fetchReleasePage, ReleaseFetchError, RELEASES_URL, type LauncherRelease } from "$lib/utils/releases";
  import ReleaseCard from "./ReleaseCard.svelte";
  import ReleaseListItem from "./ReleaseListItem.svelte";
  import IconGithub from "~icons/simple-icons/github";
  import IconDownload from "~icons/ph/download-simple";
  import IconSpinner from "~icons/ph/spinner";

  let releases = $state<LauncherRelease[]>([]);
  let loading = $state(true);
  let error = $state("");
  let hasMore = $state(true);
  let nextPage = 1;
  let controller: AbortController | null = null;
  let selectedId = $state<number | null>(null);
  let panel = $state<HTMLDivElement>();

  const selectedRelease = $derived(releases.find((release) => release.id === selectedId) ?? releases[0]);

  function selectRelease(id: number) {
    selectedId = id;
    if (panel && panel.getBoundingClientRect().top < 72) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

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

<section class="bg-cl-base pb-16 pt-6 text-cl-text">
  <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-lg font-semibold text-cl-text sm:text-xl">{$t('changelogs.title')}</h1>
        <p class="mt-1 max-w-lg text-xs text-cl-muted">{$t('changelogs.subtitle')}</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <a
          href={RELEASES_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded border border-cl-border px-3 py-2 text-xs font-medium text-cl-text transition-colors hover:border-cl-border-hover hover:bg-cl-elevated"
        >
          <IconGithub class="h-3.5 w-3.5" /> {$t('changelogs.source')}
        </a>
        <a
          href="/install"
          class="inline-flex items-center gap-1.5 rounded bg-cl-text px-3 py-2 text-xs font-medium text-cl-accent-inverse transition-opacity hover:opacity-90"
        >
          <IconDownload class="h-3.5 w-3.5" /> {$t('nav.download')}
        </a>
      </div>
    </div>

    {#if releases.length === 0}
      {#if loading}
        <div class="grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-6" aria-hidden="true">
          <div class="rounded-lg border border-cl-border bg-cl-surface p-2">
            <div class="flex gap-1.5 overflow-hidden lg:flex-col lg:gap-1">
              {#each [0, 1, 2, 3, 4, 5] as item}
                <div class="h-8 w-24 shrink-0 rounded bg-cl-elevated motion-safe:animate-pulse lg:h-12 lg:w-full"></div>
              {/each}
            </div>
          </div>
          <div class="rounded-lg border border-cl-border bg-cl-surface p-5 motion-safe:animate-pulse">
            <div class="h-3 w-32 rounded bg-cl-elevated"></div>
            <div class="mt-3 h-5 w-2/3 rounded bg-cl-elevated"></div>
            <div class="mt-6 space-y-2.5">
              {#each [0, 1, 2, 3, 4, 5] as item}
                <div class="h-3 rounded bg-cl-elevated" style={`width: ${92 - item * 7}%`}></div>
              {/each}
            </div>
          </div>
        </div>
        <div role="status" class="sr-only">{$t('changelogs.loading')}</div>
      {:else if error}
        <div class="rounded-lg border border-cl-border bg-cl-surface p-6 text-center">
          <p role="alert" class="mb-3 text-xs text-cl-danger">{$t(`changelogs.${error}`)}</p>
          <button
            type="button"
            onclick={loadMore}
            class="rounded border border-cl-border bg-cl-elevated px-3 py-1.5 text-xs text-cl-text transition-colors hover:border-cl-border-hover"
          >{$t('changelogs.retry')}</button>
        </div>
      {:else}
        <p class="rounded-lg border border-cl-border bg-cl-surface p-8 text-center text-xs text-cl-muted">{$t('changelogs.empty')}</p>
      {/if}
    {:else}
      <div class="grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-6">
        <nav aria-label={$t('changelogs.versions')} class="min-w-0 lg:sticky lg:top-16">
          <div class="overflow-hidden rounded-lg border border-cl-border bg-cl-surface">
            <div class="flex items-center justify-between border-b border-cl-border px-3 py-2">
              <span class="text-[10px] font-semibold uppercase tracking-widest text-cl-dim">{$t('changelogs.versions')}</span>
              <span class="font-mono text-[10px] tabular-nums text-cl-dim">{releases.length}</span>
            </div>

            <ol class="scrollbar-hide flex gap-1.5 overflow-x-auto p-2 lg:max-h-[calc(100vh-19rem)] lg:flex-col lg:gap-0 lg:overflow-x-hidden lg:overflow-y-auto lg:p-0 lg:scrollbar-thin">
              {#each releases as release (release.id)}
                {@const active = selectedRelease?.id === release.id}
                <li class="shrink-0 lg:shrink lg:border-l-2 {active ? 'lg:border-cl-text' : 'lg:border-transparent'}">
                  <ReleaseListItem
                    {release}
                    {active}
                    latest={release.id === releases[0]?.id}
                    onSelect={() => selectRelease(release.id)}
                  />
                </li>
              {/each}
            </ol>

            {#if loading || error || hasMore}
              <div class="border-t border-cl-border p-2">
                {#if loading}
                  <div role="status" class="flex items-center justify-center gap-2 py-1.5 text-[11px] text-cl-muted">
                    <IconSpinner class="h-3.5 w-3.5 animate-spin" /> {$t('changelogs.loading')}
                  </div>
                {:else if error}
                  <div class="text-center">
                    <p role="alert" class="mb-2 text-[11px] text-cl-danger">{$t(`changelogs.${error}`)}</p>
                    <button
                      type="button"
                      onclick={loadMore}
                      class="rounded border border-cl-border bg-cl-elevated px-3 py-1.5 text-[11px] text-cl-text transition-colors hover:border-cl-border-hover"
                    >{$t('changelogs.retry')}</button>
                  </div>
                {:else}
                  <button
                    type="button"
                    onclick={loadMore}
                    class="w-full rounded border border-cl-border px-3 py-1.5 text-[11px] font-medium text-cl-text transition-colors hover:border-cl-border-hover hover:bg-cl-elevated"
                  >{$t('changelogs.loadMore')}</button>
                {/if}
              </div>
            {/if}
          </div>
        </nav>

        <div bind:this={panel} class="min-w-0 scroll-mt-20">
          {#if selectedRelease}
            <ReleaseCard release={selectedRelease} />
          {/if}
        </div>
      </div>
    {/if}

    <noscript><p class="py-4 text-xs text-cl-muted">{$t('changelogs.noScript')}</p></noscript>
  </div>
</section>
