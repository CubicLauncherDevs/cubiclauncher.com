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
  <div class="text-center mb-8">
    <span
      class="inline-block px-2.5 py-1 rounded-[3px] border border-white/10 bg-neutral-900 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-3"
    >
      {$t("install.latestVersion")}
    </span>
    <h2 class="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-1.5">
      {release.tag}
    </h2>
    <p class="text-neutral-500 text-[13px] mb-4">
      {$t("install.releasedOn", { values: { date: formatDate(release.publishedAt) } })}
    </p>
    <a
      href={release.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-400 hover:text-white transition-colors"
    >
      <IconGithubLogo class="w-4 h-4" />
      {$t("install.viewAllReleases")}
    </a>
  </div>
{/if}
