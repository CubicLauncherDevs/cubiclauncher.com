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
  <div class="text-center mb-10">
    <span
      class="inline-block px-3 py-1 rounded-full border border-white/10 bg-neutral-900/50 text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3"
    >
      {$t("install.latestVersion")}
    </span>
    <h2 class="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
      {release.tag}
    </h2>
    <p class="text-neutral-500 text-sm mb-4">
      {$t("install.releasedOn", { values: { date: formatDate(release.publishedAt) } })}
    </p>
    <a
      href={release.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
    >
      <IconGithubLogo class="w-4 h-4" />
      {$t("install.viewAllReleases")}
    </a>
  </div>
{/if}
