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

<main class="bg-neutral-950 overflow-x-hidden">
  <!-- Hero -->
  <section
    class="relative min-h-[45vh] flex items-center justify-center pt-[var(--discord-nav-height)] pb-16 overflow-hidden bg-neutral-950"
  >
    <div
      class="absolute inset-0 opacity-[0.05] pointer-events-none"
      style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 40px 40px;"
    ></div>

    <div class="relative z-10 mx-auto px-6 lg:px-8 text-center" style="max-width: var(--discord-max-width);">
      <h1
        class="text-[30px] sm:text-[36px] lg:text-[42px] font-semibold tracking-tight mb-4 text-white"
      >
        {$t("install.title")}
        <span class="text-neutral-400">{$t("install.titleHighlight")}</span>
      </h1>
      <p
        class="text-[16px] text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed"
      >
        {$t("install.subtitle")}
      </p>
      {#if totalDownloads > 0}
        <a
          href="https://github.com/CubicLauncherDevs/CubicLauncher/releases"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex"
        >
          <img
            src="https://img.shields.io/github/downloads/CubicLauncherDevs/CubicLauncher/total?style=for-the-badge&label={encodeURIComponent($t('install.totalDownloadsLabel'))}&labelColor=18181b&color=ffffff"
            alt={$t("install.totalDownloads", {
              values: { count: formatNumber(totalDownloads) },
            })}
            class="h-7"
          />
        </a>
      {/if}
    </div>
  </section>

  <!-- Content -->
  <section class="py-12">
    <div class="mx-auto px-6 lg:px-8" style="max-width: var(--discord-max-width);">
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

        <div class="mb-6">
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
  <section class="py-20 border-t border-white/5">
    <div class="mx-auto px-6 lg:px-8 text-center" style="max-width: var(--discord-max-width);">
      <div
        class="w-12 h-12 mx-auto mb-5 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center"
      >
        <IconDownload class="w-5 h-5 text-neutral-400" />
      </div>
      <p class="text-neutral-400 text-[16px] max-w-lg mx-auto mb-6">
        {$t("install.lookingForOther")}
      </p>
      <a
        href="https://github.com/CubicLauncherDevs/CubicLauncher/releases"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium text-[14px] rounded-[4px] hover:bg-neutral-200 transition-colors"
      >
        {$t("install.viewAllReleases")}
        <IconArrowRight class="w-4 h-4" />
      </a>
    </div>
  </section>
</main>
