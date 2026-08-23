<script lang="ts">
  import { onMount } from "svelte";
  import { t, currentLocale } from "$lib/i18n";
  import IconDownload from "~icons/ph/download-simple";
  import IconArrowRight from "~icons/ph/arrow-right";
  import {
    detectOS,
    fetchLatestRelease,
    fallbackDownloads,
    platformData,
    type PlatformId,
    type ReleaseInfo as ReleaseData,
  } from "$lib/utils/install";
  import DownloadList from "./DownloadList.svelte";
  import InstallError from "./InstallError.svelte";
  import InstallRequirements from "./InstallRequirements.svelte";
  import InstallSkeleton from "./InstallSkeleton.svelte";
  import OsTabs from "./OsTabs.svelte";
  import ReleaseInfo from "./ReleaseInfo.svelte";

  let selectedOS = $state<PlatformId>("windows");
  let release = $state<ReleaseData | null>(null);
  let loading = $state(true);
  let error = $state("");

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
    selectedOS = detectOS(window.navigator.userAgent);

    fetchLatestRelease()
      .then((data) => (release = data))
      .catch((e) => {
        error =
          e instanceof Error
            ? e.message
            : "Error al obtener la última versión";
        console.error("Error fetching latest release:", e);
      })
      .finally(() => {
        loading = false;
      });
  });
</script>

<main class="bg-cl-base overflow-x-hidden">
  <!-- Header -->
  <section class="relative border-b border-cl-border bg-cl-surface/30 overflow-hidden">
    <div
      class="absolute inset-0 opacity-[0.03] pointer-events-none"
      style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 40px 40px;"
    ></div>

    <div class="relative z-10 mx-auto px-4 lg:px-6 py-10" style="max-width: var(--discord-max-width);">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-semibold text-white mb-1">
            {$t("install.title")}
            <span class="text-cl-muted">{$t("install.titleHighlight")}</span>
          </h1>
          <p class="text-xs text-cl-muted max-w-md">
            {$t("install.subtitle")}
          </p>
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
    </div>
  </section>

  <!-- Content -->
  <section class="py-6">
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

        <DownloadList
          downloads={activeDownloads}
          platformNameKey={platform.nameKey}
        />

        <InstallRequirements platformId={selectedOS} />
      {/if}
    </div>
  </section>

  <!-- Footer -->
  <section class="py-8 border-t border-cl-border">
    <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded border border-cl-border bg-cl-surface p-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-cl-base border border-cl-border flex items-center justify-center">
            <IconDownload class="w-4 h-4 text-cl-muted" />
          </div>
          <p class="text-cl-muted text-xs max-w-md">
            {$t("install.lookingForOther")}
          </p>
        </div>
        <a
          href="https://github.com/CubicLauncherDevs/CubicLauncher/releases"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cl-text text-cl-accent-inverse font-medium text-xs rounded hover:bg-neutral-200 transition-colors shrink-0"
        >
          {$t("install.viewAllReleases")}
          <IconArrowRight class="w-3 h-3" />
        </a>
      </div>
    </div>
  </section>
</main>
