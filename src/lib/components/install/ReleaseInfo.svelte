<script lang="ts">
  import { t, currentLocale } from "$lib/i18n";
  import { getDateLocale } from "$lib/i18n";
  import type { ReleaseInfo } from "$lib/utils/install";
  import IconGithubLogo from "~icons/ph/github-logo";

  interface Props {
    release: ReleaseInfo | null;
  }

  let { release }: Props = $props();

  function formatDate(iso: string): string {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString(getDateLocale($currentLocale), {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  }
</script>

{#if release?.tag}
  <div class="mb-4 flex flex-col items-start gap-2 border-b border-cl-border pb-4 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
    <div class="min-w-0 max-w-full">
      <div class="mb-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span class="shrink-0 rounded border border-cl-border bg-cl-base px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cl-muted">
          {$t("install.latestVersion")}
        </span>
        <h2 class="min-w-0 text-sm font-semibold text-cl-text [overflow-wrap:anywhere] sm:text-base">
          {release.tag}
        </h2>
      </div>
      <p class="text-cl-dim text-[11px]">
        {$t("install.releasedOn", { values: { date: formatDate(release.publishedAt) } })}
      </p>
    </div>
    <a
      href={release.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={$t("install.viewAllReleases")}
      class="inline-flex min-h-10 min-w-10 items-center justify-center gap-1 text-[11px] font-medium text-cl-dim transition-colors hover:text-cl-text sm:min-h-0 sm:min-w-0 sm:justify-start"
    >
      <IconGithubLogo class="w-3.5 h-3.5" />
      <span class="hidden sm:inline">{$t("install.viewAllReleases")}</span>
    </a>
  </div>
{/if}
