<script lang="ts">
  import { onMount } from "svelte";
  import { t, currentLocale } from "$lib/i18n";
  import IconWindows from "~icons/simple-icons/windows";
  import IconLinux from "~icons/simple-icons/linux";
  import IconApple from "~icons/simple-icons/apple";
  import IconDebian from "~icons/simple-icons/debian";
  import IconFedora from "~icons/simple-icons/fedora";
  import IconArchlinux from "~icons/simple-icons/archlinux";
  import IconDownload from "~icons/ph/download-simple";
  import IconArrowRight from "~icons/ph/arrow-right";
  import IconArrowClockwise from "~icons/ph/arrow-clockwise";
  import IconWarning from "~icons/ph/warning";

  type Download = { label: string; url: string; count?: number };
  type PlatformId = "windows" | "macos" | "linux";

  type AssetRule = {
    test: (name: string) => boolean;
    os: PlatformId;
    label: string;
  };

  const assetRules: AssetRule[] = [
    {
      test: (n) => n.includes("setup.exe"),
      os: "windows",
      label: "x64-setup.exe",
    },
    { test: (n) => n.endsWith(".msi"), os: "windows", label: ".msi" },
    { test: (n) => n.endsWith("x64.dmg"), os: "macos", label: "x64.dmg" },
    {
      test: (n) =>
        n.endsWith("aarch64.dmg") ||
        (n.endsWith(".dmg") && !n.includes("x64")),
      os: "macos",
      label: ".dmg",
    },
    {
      test: (n) => n.endsWith("x64.app.tar.gz"),
      os: "macos",
      label: "x64.app.tar.gz",
    },
    {
      test: (n) =>
        n.endsWith("aarch64.app.tar.gz") ||
        (n.endsWith(".app.tar.gz") && !n.includes("x64")),
      os: "macos",
      label: ".app.tar.gz",
    },
    {
      test: (n) => n.endsWith(".rpm"),
      os: "linux",
      label: "x86_64.rpm",
    },
    { test: (n) => n.endsWith(".deb"), os: "linux", label: ".deb" },
    {
      test: (n) => n.endsWith(".appimage"),
      os: "linux",
      label: ".appimage",
    },
  ];

  const pkgBuildDownload: Download = {
    label: "Arch PKGBUILD",
    url: "https://dev.cubiclauncher.org/docs/es-ES/guias/arch",
  };

  function parseReleaseAssets(assets: any[]) {
    const buckets: Record<PlatformId, Download[]> = {
      windows: [],
      macos: [],
      linux: [],
    };
    const totals: Record<PlatformId, number> = {
      windows: 0,
      macos: 0,
      linux: 0,
    };

    for (const asset of assets) {
      const name = (asset.name ?? "").toLowerCase();
      if (name.endsWith(".sig")) continue;

      const rule = assetRules.find((r) => r.test(name));
      if (!rule) continue;

      const count = asset.download_count || 0;
      buckets[rule.os].push({
        label: rule.label,
        url: asset.browser_download_url,
        count,
      });
      totals[rule.os] += count;
    }

    return { ...buckets, totals };
  }

  let totalDownloads = $state(0);
  let platformDownloads = $state<Record<PlatformId, number>>({
    windows: 0,
    macos: 0,
    linux: 0,
  });

  function formatNumber(n: number): string {
    return n.toLocaleString($currentLocale || "es-ES");
  }

  let selectedOS = $state<PlatformId>("windows");

  const defaultReleases: Record<PlatformId, Download[]> = {
    windows: [
      { label: "x64-setup.exe", url: "#" },
      { label: ".msi", url: "#" },
    ],
    macos: [
      { label: ".dmg", url: "#" },
      { label: "x64.dmg", url: "#" },
      { label: ".app.tar.gz", url: "#" },
      { label: "x64.app.tar.gz", url: "#" },
    ],
    linux: [
      { label: ".deb", url: "#" },
      { label: ".appimage", url: "#" },
      { label: "x86_64.rpm", url: "#" },
      pkgBuildDownload,
    ],
  };

  let releases = $state<Record<PlatformId, Download[]>>({
    windows: [...defaultReleases.windows],
    macos: [...defaultReleases.macos],
    linux: [...defaultReleases.linux],
  });

  let loading = $state(true);
  let error = $state("");

  const platforms = [
    {
      id: "windows" as const,
      nameKey: "install.platforms.windows",
      Icon: IconWindows,
      descKey: "install.platforms.windowsDesc",
      reqKey: "install.platforms.windowsReq",
    },
    {
      id: "linux" as const,
      nameKey: "install.platforms.linux",
      Icon: IconLinux,
      descKey: "install.platforms.linuxDesc",
      reqKey: "install.platforms.linuxReq",
    },
    {
      id: "macos" as const,
      nameKey: "install.platforms.macos",
      Icon: IconApple,
      descKey: "install.platforms.macosDesc",
      reqKey: "install.platforms.macosReq",
    },
  ];

  let activePlatform = $derived({
    ...(platforms.find((p) => p.id === selectedOS) || platforms[0]),
    downloads: releases[selectedOS] || [],
  });

  function getDownloadIcon(label: string, os: PlatformId) {
    const lower = label.toLowerCase();
    if (lower.includes("deb")) return IconDebian;
    if (lower.includes("arch") || lower.includes("pkgbuild"))
      return IconArchlinux;
    if (lower.includes("rpm")) return IconFedora;
    if (lower.includes("appimage")) return IconLinux;
    if (os === "windows") return IconWindows;
    if (os === "macos") return IconApple;
    return IconDownload;
  }

  onMount(async () => {
    const ua = window.navigator.userAgent.toLowerCase();

    if (ua.includes("mac")) selectedOS = "macos";
    else if (ua.includes("linux")) selectedOS = "linux";
    else selectedOS = "windows";

    try {
      const res = await fetch(
        "https://api.github.com/repos/CubicLauncherDevs/CubicLauncher/releases/latest"
      );
      if (!res.ok) throw new Error(`GitHub respondió con ${res.status}`);
      const data = await res.json();

      if (!data || !Array.isArray(data.assets)) {
        throw new Error("No se pudieron obtener los assets");
      }

      const { windows, macos, linux, totals } = parseReleaseAssets(data.assets);

      platformDownloads = totals;
      totalDownloads = totals.windows + totals.macos + totals.linux;

      releases = {
        windows: windows.length > 0 ? windows : [...defaultReleases.windows],
        macos: macos.length > 0 ? macos : [...defaultReleases.macos],
        linux:
          linux.length > 0
            ? [...linux, pkgBuildDownload]
            : [...defaultReleases.linux],
      };
    } catch (e) {
      error =
        e instanceof Error ? e.message : "Error al obtener la última versión";
      console.error("Error fetching latest release:", e);
    } finally {
      loading = false;
    }
  });
</script>

<main class="bg-neutral-950 overflow-x-hidden">
  <!-- Hero -->
  <section
    class="relative min-h-[60vh] flex items-center justify-center pt-32 pb-24 overflow-hidden bg-neutral-950"
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
        class="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent"
      >
        {$t("install.title")}
        {$t("install.titleHighlight")}
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

  <!-- OS Selector -->
  <section class="py-12 border-y border-white/5 bg-neutral-900/20">
    <div class="container mx-auto px-6 max-w-5xl text-center">
      <div
        class="inline-flex flex-col md:flex-row items-stretch border border-white/10 rounded-2xl overflow-hidden"
      >
        {#each platforms as platform}
          <button
            onclick={() => (selectedOS = platform.id)}
            aria-pressed={selectedOS === platform.id}
            class="group flex items-center justify-center md:justify-start gap-3 px-10 py-5 transition-colors border-b md:border-b-0 md:border-r border-white/10 last:border-0 {selectedOS ===
            platform.id
              ? 'bg-white text-black'
              : 'text-white hover:bg-white/5'}"
          >
            <platform.Icon
              class="w-5 h-5 transition-colors {selectedOS === platform.id
                ? 'text-black'
                : 'text-neutral-400 group-hover:text-white'}"
            />
            <span class="text-sm font-bold uppercase tracking-[0.15em]">
              {$t(platform.nameKey)}
            </span>
          </button>
        {/each}
      </div>
    </div>
  </section>

  <!-- Downloads -->
  <section class="py-24">
    <div class="container mx-auto px-6 max-w-6xl">
      {#if loading}
        <div class="max-w-4xl mx-auto animate-pulse space-y-8">
          <div class="flex items-center gap-5">
            <div
              class="w-14 h-14 bg-neutral-900 rounded-2xl border border-white/10"
            ></div>
            <div class="space-y-3 flex-1">
              <div
                class="h-7 bg-neutral-900 rounded-lg w-48 border border-white/10"
              ></div>
              <div
                class="h-4 bg-neutral-900 rounded-lg w-72 border border-white/10"
              ></div>
            </div>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              class="h-40 bg-neutral-900 rounded-2xl border border-white/10"
            ></div>
            <div
              class="h-40 bg-neutral-900 rounded-2xl border border-white/10"
            ></div>
            <div
              class="h-40 bg-neutral-900 rounded-2xl border border-white/10"
            ></div>
            <div
              class="h-40 bg-neutral-900 rounded-2xl border border-white/10"
            ></div>
          </div>
        </div>
      {:else if error}
        <div class="max-w-lg mx-auto text-center py-16">
          <div
            class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center"
          >
            <IconWarning class="w-7 h-7 text-neutral-400" />
          </div>
          <p class="text-neutral-400 mb-2">{error}</p>
          <p class="text-neutral-600 text-sm mb-8">
            {$t("install.defaultDownloadsAvailable")}
          </p>
          <button
            onclick={() => {
              error = "";
              loading = true;
              setTimeout(() => window.location.reload(), 100);
            }}
            class="inline-flex items-center gap-2 bg-white text-black px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all"
          >
            <IconArrowClockwise class="w-4 h-4" />
            {$t("install.retry")}
          </button>
        </div>
      {:else}
        <div class="fade-in max-w-5xl mx-auto">
          <div class="flex items-start gap-5 mb-10">
            <div
              class="shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10"
            >
              <activePlatform.Icon class="w-7 h-7 text-white" />
            </div>
            <div>
              <h2
                class="text-3xl md:text-4xl font-black tracking-tight text-white mb-1"
              >
                {$t(activePlatform.nameKey)}
              </h2>
              <p class="text-neutral-400 font-light leading-relaxed">
                {$t(activePlatform.descKey)}
              </p>
              {#if platformDownloads[selectedOS] > 0}
                <div
                  class="flex items-center gap-2 mt-2 text-xs text-neutral-500 font-medium"
                >
                  <IconDownload class="w-3.5 h-3.5" />
                  <span
                    >{formatNumber(platformDownloads[selectedOS])}
                    {$t("install.downloads")}</span
                  >
                </div>
              {/if}
            </div>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {#each activePlatform.downloads as download, i}
              {@const DownloadIcon = getDownloadIcon(
                download.label,
                selectedOS
              )}
              <a
                href={download.url}
                target="_blank"
                rel="noopener noreferrer"
                class="group flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-300 {i ===
                0
                  ? 'bg-white text-black border-white hover:scale-[1.01]'
                  : 'bg-neutral-900 border-white/10 hover:bg-neutral-900/80 hover:border-white/20'}"
              >
                <div
                  class="w-14 h-14 rounded-xl flex items-center justify-center mb-4 {i ===
                  0
                    ? 'bg-black/5'
                    : 'bg-white/5'}"
                >
                  <DownloadIcon
                    class="w-7 h-7 {i === 0
                      ? 'text-black'
                      : 'text-neutral-400 group-hover:text-white'} transition-colors"
                  />
                </div>
                <div
                  class="font-bold tracking-tight mb-1 {i === 0
                    ? 'text-lg'
                    : 'text-[15px]'}"
                >
                  {download.label}
                </div>
                {#if download.count !== undefined}
                  <div
                    class="text-xs {i === 0
                      ? 'text-black/50'
                      : 'text-neutral-500'} mb-4"
                  >
                    {formatNumber(download.count)}
                    {$t("install.downloads")}
                  </div>
                {/if}
                <div class="mt-auto">
                  <IconArrowRight
                    class="w-5 h-5 {i === 0
                      ? 'text-black'
                      : 'text-neutral-500 group-hover:text-white'} transition-colors"
                  />
                </div>
              </a>
            {/each}
          </div>

          <!-- System Requirements -->
          <div class="mt-12 pt-8 border-t border-white/5">
            <p class="text-sm text-neutral-500 font-light leading-relaxed">
              <span class="text-neutral-300 font-medium"
                >{$t("install.systemRequirements")}:</span
              >
              {$t(activePlatform.reqKey)}
            </p>
          </div>
        </div>
      {/if}
    </div>
  </section>

  <!-- Footer -->
  <section class="py-24 border-t border-white/5">
    <div class="container mx-auto px-6 max-w-6xl text-center">
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
  .fade-in {
    animation: fade-in 0.6s ease-out both;
  }
</style>
