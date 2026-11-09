<script lang="ts">
  import { t, currentLocale, getDateLocale } from "$lib/i18n";
  import { renderMarkdown } from "$lib/utils/markdown";
  import type { LauncherRelease } from "$lib/utils/releases";
  import IconArrowUpRight from "~icons/ph/arrow-up-right";

  let { release }: { release: LauncherRelease } = $props();
  const notes = $derived(renderMarkdown(release.body));
  const date = $derived(new Intl.DateTimeFormat(getDateLocale($currentLocale), {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(release.publishedAt)));
</script>

<article class="min-w-0 overflow-hidden rounded-lg border border-cl-border bg-cl-surface">
  <header class="border-b border-cl-border p-4 sm:p-5">
    <div class="flex flex-wrap items-center gap-2 text-[11px]">
      <span class="break-all rounded border border-cl-border bg-cl-elevated px-1.5 py-0.5 font-mono text-[10px] text-cl-text">{release.tag}</span>
      <span class="inline-flex items-center gap-1.5 text-cl-muted">
        <span
          class="size-1.5 rounded-full {release.prerelease ? 'bg-cl-warning' : 'bg-cl-success'}"
          aria-hidden="true"
        ></span>
        {$t(release.prerelease ? 'changelogs.prerelease' : 'changelogs.stable')}
      </span>
      <span class="text-cl-dim" aria-hidden="true">·</span>
      <time datetime={release.publishedAt} class="text-cl-muted">{date}</time>
    </div>
    <h2 class="mt-2 text-base font-semibold text-cl-text sm:text-lg [overflow-wrap:anywhere]">{release.name}</h2>
  </header>

  <div class="p-4 sm:p-5">
    {#if release.body.trim()}
      <div class="prose release-notes min-w-0 text-sm [overflow-wrap:anywhere]">
        {@html notes}
      </div>
    {:else}
      <p class="text-xs text-cl-muted">{$t('changelogs.noNotes')}</p>
    {/if}
    <a
      href={release.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-cl-muted transition-colors hover:text-cl-text"
    >
      {$t('changelogs.viewRelease')}
      <IconArrowUpRight class="h-3.5 w-3.5" />
    </a>
  </div>
</article>

<style>
  .release-notes :global(> :first-child) { margin-top: 0; }
  .release-notes :global(a) { color: var(--cl-text); text-decoration: underline; text-underline-offset: 3px; }
  .release-notes :global(img) { max-width: 100%; height: auto; border-radius: 6px; margin: 1rem 0; }
  .release-notes :global(ol) { list-style: decimal; padding-left: 1.5rem; }
  .release-notes :global(ol > li::before) { content: none; }
  .release-notes :global(hr) { border-color: var(--cl-border); margin: 1rem 0; }
  .release-notes :global(pre) { max-width: 100%; overflow-x: auto; }
</style>
