<script lang="ts">
  import { t, currentLocale, getDateLocale } from "$lib/i18n";
  import { renderMarkdown } from "$lib/utils/markdown";
  import type { LauncherRelease } from "$lib/utils/releases";
  import IconCaretDown from "~icons/ph/caret-down";
  import IconArrowUpRight from "~icons/ph/arrow-up-right";

  let { release, expanded = false }: { release: LauncherRelease; expanded?: boolean } = $props();
  const notes = $derived(renderMarkdown(release.body));
  const date = $derived(new Intl.DateTimeFormat(getDateLocale($currentLocale), {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(release.publishedAt)));
</script>

<article class="relative min-w-0 pl-5 sm:pl-8">
  <span class="absolute -left-1 top-7 h-2 w-2 rounded-full border border-cl-border-hover bg-cl-text" aria-hidden="true"></span>
  <details open={expanded} class="group rounded-lg border border-cl-border bg-cl-surface transition-colors hover:border-cl-border-hover">
    <summary class="flex cursor-pointer list-none items-start justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
      <div class="min-w-0">
        <div class="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
          <span class="rounded border border-cl-border bg-cl-elevated px-2 py-0.5 font-mono text-cl-text break-all">{release.tag}</span>
          <span class="text-cl-muted">{$t(release.prerelease ? 'changelogs.prerelease' : 'changelogs.stable')}</span>
          <span class="text-cl-dim" aria-hidden="true">·</span>
          <time datetime={release.publishedAt} class="text-cl-muted">{date}</time>
        </div>
        <h2 class="text-sm sm:text-base font-semibold text-cl-text [overflow-wrap:anywhere]">{release.name}</h2>
      </div>
      <IconCaretDown class="mt-1 h-4 w-4 shrink-0 text-cl-muted transition-transform group-open:rotate-180" />
    </summary>
    <div class="border-t border-cl-border p-4 sm:p-5">
      {#if release.body.trim()}
        <div class="prose release-notes min-w-0 text-sm [overflow-wrap:anywhere]">
          {@html notes}
        </div>
      {:else}
        <p class="text-xs text-cl-muted">{$t('changelogs.noNotes')}</p>
      {/if}
      <a href={release.htmlUrl} target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-cl-muted hover:text-cl-text transition-colors">
        {$t('changelogs.viewRelease')}
        <IconArrowUpRight class="h-3.5 w-3.5" />
      </a>
    </div>
  </details>
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
