<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { t, currentLocale } from "$lib/i18n";
  import IconDownload from "~icons/ph/download-simple";
  import IconArrowRight from "~icons/ph/arrow-right";
  import IconWarningCircle from "~icons/ph/warning-circle";
  import IconGithubLogo from "~icons/ph/github-logo";
  import {
    detectOS,
    fetchLatestRelease,
    fallbackDownloads,
    platformData,
    type PlatformId,
    type ReleaseInfo as ReleaseData,
  } from "$lib/utils/install";
  import DownloadList from "./DownloadList.svelte";
  import HomebrewModal from "./HomebrewModal.svelte";
  import InstallError from "./InstallError.svelte";
  import InstallRequirements from "./InstallRequirements.svelte";
  import InstallSkeleton from "./InstallSkeleton.svelte";
  import OsTabs from "./OsTabs.svelte";
  import ReleaseInfo from "./ReleaseInfo.svelte";

  function getInitialOS(): PlatformId {
    if (!browser) return "windows";
    return detectOS(window.navigator.userAgent);
  }

  let selectedOS = $state<PlatformId>(getInitialOS());
  let release = $state<ReleaseData | null>(null);
  let loading = $state(true);
  let error = $state("");
  let showHomebrew = $state(false);

  const platform = $derived(platformData[selectedOS]);

  const platformDownloads = $derived(
    release?.totals ?? { windows: 0, macos: 0, linux: 0 }
  );

  const activeDownloads = $derived(
    release
      ? release.downloads.filter((d) => d.os === selectedOS)
      : fallbackDownloads[selectedOS]
  );

  const totalDownloads = $derived(
    release
      ? release.totals.windows + release.totals.macos + release.totals.linux
      : 0
  );

  function formatNumber(n: number): string {
    return n.toLocaleString($currentLocale || "es-ES");
  }

  onMount(() => {
    let mounted = true;
    const controller = new AbortController();

    fetchLatestRelease(controller.signal)
      .then((data) => {
        if (mounted) release = data;
      })
      .catch((e) => {
        if (!mounted) return;
        if (e instanceof DOMException && e.name === "AbortError") return;
        error =
          e instanceof Error
            ? e.message
            : "Error al obtener la última versión";
        console.error("Error fetching latest release:", e);
      })
      .finally(() => {
        if (mounted) loading = false;
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  });
</script>

<main class="bg-cl-base overflow-x-hidden">
  <!-- Header -->
  <section class="relative border-b border-cl-border bg-cl-surface overflow-hidden">
    <div
      class="absolute inset-0 opacity-[0.03] pointer-events-none"
      style="background-image: radial-gradient(circle, var(--cl-text) 1px, transparent 1px); background-size: 40px 40px;"
    ></div>

    <div class="relative z-10 mx-auto px-4 lg:px-6 py-10" style="max-width: var(--discord-max-width);">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-semibold text-cl-text mb-1">
            {$t("install.title")}
            <span class="text-cl-muted">{$t("install.titleHighlight")}</span>
          </h1>
          <p class="text-xs text-cl-muted max-w-md">
            {$t("install.subtitle")}
          </p>
          <a href="/changelogs" class="mt-3 inline-flex items-center gap-1 text-xs text-cl-muted hover:text-cl-text transition-colors">
            {$t('changelogs.viewChanges')}
            <IconArrowRight class="h-3 w-3" />
          </a>
        </div>
        {#if totalDownloads > 0}
          <a
            href="https://github.com/CubicLauncherDevs/CubicLauncher/releases"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex shrink-0"
          >
            <img
              src="https://img.shields.io/github/downloads/CubicLauncherDevs/CubicLauncher/total?style=for-the-badge&label={encodeURIComponent($t('install.totalDownloadsLabel'))}&labelColor=0f0f10&color=ffffff"
              alt={$t("install.totalDownloads", {
                values: { count: formatNumber(totalDownloads) },
              })}
              class="h-6"
            />
          </a>
        {/if}
      </div>

      <aside
        class="mt-5 rounded border border-amber-400/30 bg-amber-400/[0.06] p-3 sm:p-4"
        aria-labelledby="virus-total-warning-title"
      >
        <div class="flex items-start gap-3">
          <IconWarningCircle class="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div class="min-w-0">
            <h3 id="virus-total-warning-title" class="text-sm font-semibold text-cl-text">
              {$t("install.virusTotalWarning.bannerTitle")}
            </h3>
            <p class="mt-1 text-xs leading-relaxed text-cl-muted">
              {$t("install.virusTotalWarning.bannerText")}
            </p>
            <p class="mt-1 text-xs leading-relaxed text-cl-muted">
              {$t("install.virusTotalWarning.bannerSource")}
            </p>
            <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                href="/install/virustotal"
                class="inline-flex items-center gap-1 text-xs font-medium text-cl-text underline decoration-cl-border underline-offset-4 hover:decoration-cl-text"
              >
                {$t("install.virusTotalWarning.readGuide")}
                <IconArrowRight class="h-3 w-3" />
              </a>
              <a
                href="https://github.com/CubicLauncherDevs/CubicLauncher"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-xs font-medium text-cl-text underline decoration-cl-border underline-offset-4 hover:decoration-cl-text"
              >
                <IconGithubLogo class="h-3.5 w-3.5" />
                {$t("install.virusTotalWarning.reviewCode")}
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>

  <!-- Content -->
  <section class="py-4 sm:py-6">
    <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
      {#if loading}
        <InstallSkeleton />
      {:else if error}
        <InstallError
          message={error}
          onRetry={() => {
            error = "";
            loading = true;
            setTimeout(() => window.location.reload(), 100);
          }}
        />
        <InstallRequirements platformId={selectedOS} />
      {:else}
        <ReleaseInfo {release} />

        <div class="mb-4">
          <OsTabs
            selected={selectedOS}
            totals={platformDownloads}
            onSelect={(os) => (selectedOS = os)}
          />
        </div>

        {#if selectedOS === "windows"}
          <aside class="mb-4 rounded border border-amber-400/30 bg-amber-400/[0.06] p-3 sm:p-4" aria-labelledby="windows-warning-title">
            <div class="flex items-start gap-3">
              <IconWarningCircle class="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div class="min-w-0">
                <h3 id="windows-warning-title" class="text-sm font-semibold text-cl-text">
                  {$t("install.windowsWarning.bannerTitle")}
                </h3>
                <p class="mt-1 text-xs leading-relaxed text-cl-muted">
                  {$t("install.windowsWarning.bannerText")}
                </p>
                <p class="mt-1 text-xs leading-relaxed text-cl-muted">
                  {$t("install.windowsWarning.bannerCost")}
                </p>
                <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <a
                    href="/install/windows-smartscreen"
                    class="inline-flex items-center gap-1 text-xs font-medium text-cl-text underline decoration-cl-border underline-offset-4 hover:decoration-cl-text"
                  >
                    {$t("install.windowsWarning.readGuide")}
                    <IconArrowRight class="h-3 w-3" />
                  </a>
                  <a
                    href="https://github.com/CubicLauncherDevs/CubicLauncher"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-xs font-medium text-cl-text underline decoration-cl-border underline-offset-4 hover:decoration-cl-text"
                  >
                    <IconGithubLogo class="h-3.5 w-3.5" />
                    {$t("install.windowsWarning.reviewCode")}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        {/if}

        <DownloadList
          downloads={activeDownloads}
          platformNameKey={platform.nameKey}
          onHomebrew={() => (showHomebrew = true)}
        />

        <InstallRequirements platformId={selectedOS} />
      {/if}
    </div>
  </section>

  <HomebrewModal show={showHomebrew} onClose={() => (showHomebrew = false)} />

  <!-- Footer -->
  <section class="py-8 border-t border-cl-border">
    <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded border border-cl-border bg-cl-surface p-3 sm:p-4">
        <div class="flex min-w-0 items-center gap-3">
          <div class="w-8 h-8 rounded bg-cl-base border border-cl-border flex items-center justify-center">
            <IconDownload class="w-4 h-4 text-cl-muted" />
          </div>
          <p class="min-w-0 text-cl-muted text-xs max-w-md">
            {$t("install.lookingForOther")}
          </p>
        </div>
        <a
          href="https://github.com/CubicLauncherDevs/CubicLauncher/releases"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-10 w-full items-center justify-center gap-1.5 px-3 py-1.5 bg-cl-text text-cl-accent-inverse font-medium text-xs rounded hover:opacity-90 transition-opacity sm:min-h-0 sm:w-auto sm:shrink-0"
        >
          {$t("install.viewAllReleases")}
          <IconArrowRight class="w-3 h-3" />
        </a>
      </div>
    </div>
  </section>
</main>
