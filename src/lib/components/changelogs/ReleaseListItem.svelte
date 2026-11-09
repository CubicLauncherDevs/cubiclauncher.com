<script lang="ts">
  import { t, currentLocale, getDateLocale } from "$lib/i18n";
  import type { LauncherRelease } from "$lib/utils/releases";

  let { release, active = false, latest = false, onSelect }: {
    release: LauncherRelease;
    active?: boolean;
    latest?: boolean;
    onSelect: () => void;
  } = $props();

  const date = $derived(new Intl.DateTimeFormat(getDateLocale($currentLocale), {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  }).format(new Date(release.publishedAt)));
</script>

<button
  type="button"
  onclick={onSelect}
  aria-label={`${release.tag} — ${release.name}`}
  aria-current={active ? 'true' : undefined}
  class="flex w-auto shrink-0 items-center gap-2 whitespace-nowrap rounded border px-2.5 py-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cl-text lg:w-full lg:flex-col lg:items-stretch lg:gap-1 lg:whitespace-normal lg:rounded-none lg:border-0 lg:px-3 lg:py-2.5 {active ? 'border-cl-border-hover bg-cl-elevated text-cl-text lg:bg-cl-elevated' : 'border-cl-border bg-cl-surface text-cl-muted hover:border-cl-border-hover hover:text-cl-text lg:bg-transparent lg:hover:bg-cl-elevated/60'}"
>
  <span class="flex items-center gap-1.5">
    <span class="font-mono text-[11px] font-medium text-cl-text">{release.tag}</span>
    {#if latest}
      <span class="rounded border border-cl-border bg-cl-elevated px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-cl-muted">
        {$t('changelogs.latest')}
      </span>
    {/if}
  </span>
  <span class="hidden min-w-0 lg:block">
    <span class="block truncate text-[11px] {active ? 'text-cl-text' : 'text-cl-muted'}">{release.name}</span>
    <span class="mt-1 flex items-center gap-1.5 text-[10px] text-cl-dim">
      <span
        class="size-1.5 shrink-0 rounded-full {release.prerelease ? 'bg-cl-warning' : 'bg-cl-success'}"
        aria-hidden="true"
      ></span>
      <span>{$t(release.prerelease ? 'changelogs.prerelease' : 'changelogs.stable')}</span>
      <span aria-hidden="true">·</span>
      <time datetime={release.publishedAt}>{date}</time>
    </span>
  </span>
</button>
