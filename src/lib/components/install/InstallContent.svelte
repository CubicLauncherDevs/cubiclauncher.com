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
    class="relative min-h-[55vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-neutral-950"
  >
    <div
      class="absolute inset-0 opacity-[0.07] pointer-events-none"
      style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 40px 40px;"
    ></div>
    <div
      class="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"
    ></div>

    <div class="container mx-auto px-6 relative z-10 text-center max-w-4xl">
      <h1
        class="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 text-white"
      >
        {$t("install.title")}
        <span class="text-neutral-200">{$t("install.titleHighlight")}</span>
      </h1>
      <p
        class="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
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
            src="https://img.shields.io/github/downloads/CubicLauncherDevs/CubicLauncher/total?style=for-the-badge&label={encodeURIComponent($t('install.totalDownloadsLabel'))}&labelColor=1a1a1a&color=ffffff"
            alt={$t("install.totalDownloads", {
              values: { count: formatNumber(totalDownloads) },
            })}
            class="h-8"
          />
        </a>
      {/if}
    </div>
  </section>

  <!-- Content -->
  <section class="py-16">
    <div class="container mx-auto px-6 max-w-6xl">
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

        <div class="mb-8">
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
  <section class="py-24 border-t border-white/5">
    <div class="container mx-auto px-6 max-w-6xl text-center">
      <div
        class="w-14 h-14 mx-auto mb-6 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center"
      >
        <IconDownload class="w-6 h-6 text-neutral-400" />
      </div>
      <p class="text-neutral-400 text-lg font-light max-w-xl mx-auto mb-8">
        {$t("install.lookingForOther")}
      </p>
      <a
        href="https://github.com/CubicLauncherDevs/CubicLauncher/releases"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-bold text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all"
      >
        {$t("install.viewAllReleases")}
        <IconArrowRight class="w-4 h-4" />
      </a>
    </div>
  </section>
</main>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  :global(.fade-in) {
    animation: fade-in 0.6s ease-out both;
  }
</style>
