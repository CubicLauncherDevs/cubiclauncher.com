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
  <div class="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-cl-border">
    <div>
      <div class="flex items-center gap-2 mb-0.5">
        <span class="px-1.5 py-0.5 rounded border border-cl-border bg-cl-base text-[10px] font-semibold uppercase tracking-wide text-cl-muted">
          {$t("install.latestVersion")}
        </span>
        <h2 class="text-base font-semibold text-white">
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
      class="inline-flex items-center gap-1 text-[11px] font-medium text-cl-dim hover:text-cl-text transition-colors"
    >
      <IconGithubLogo class="w-3.5 h-3.5" />
      <span class="hidden sm:inline">{$t("install.viewAllReleases")}</span>
    </a>
  </div>
{/if}
