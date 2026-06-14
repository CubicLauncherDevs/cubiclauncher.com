<script lang="ts">
  import { onMount } from "svelte";
  import { t } from "$lib/i18n";

  type Download = { label: string; url: string };

  let selectedOS = $state("windows");
  let releases = $state<Record<string, Download[]>>({
    windows: [
      { label: "x64-setup.exe", url: "#" },
      { label: ".msi", url: "#" }
    ],
    macos: [
      { label: ".dmg", url: "#" },
      { label: "x64.dmg", url: "#" },
      { label: ".app.tar.gz", url: "#" },
      { label: "x64.app.tar.gz", url: "#" }
    ],
    linux: [
      { label: ".deb", url: "#" },
      { label: ".appimage", url: "#" },
      { label: "x86_64.rpm", url: "#" },
      { label: "Arch PKGBUILD", url: "/docs/arch" },
    ]
  });
  let loading = $state(true);
  let error = $state("");

  const platforms = [
    {
      id: "windows",
      nameKey: "install.platforms.windows",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>`,
      descKey: "install.platforms.windowsDesc",
      reqKey: "install.platforms.windowsReq",
      stepKeys: ["install.platforms.windowsStep1", "install.platforms.windowsStep2", "install.platforms.windowsStep3", "install.platforms.windowsStep4"],
    },
    {
      id: "linux",
      nameKey: "install.platforms.linux",
      icon: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-7 h-7"><title>Linux</title><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.16.07c-.083.067-.1.133-.133.198l-.002.005c-.055.122-.09.254-.102.39-.004.088-.003.178.003.267-.14-.044-.3-.088-.448-.133-.025-.067-.045-.133-.064-.2a1.73 1.73 0 01-.064-.667c.018-.266.068-.535.164-.802.09-.267.223-.468.4-.668.173-.195.394-.323.64-.397a.93.93 0 01.298-.066z"/></svg>`,
      descKey: "install.platforms.linuxDesc",
      reqKey: "install.platforms.linuxReq",
      stepKeys: ["install.platforms.linuxStep1", "install.platforms.linuxStep2", "install.platforms.linuxStep3"],
    },
    {
      id: "macos",
      nameKey: "install.platforms.macos",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.62-1.496 3.6-2.978 1.128-1.625 1.59-3.21 1.62-3.303-.032-.014-3.1-1.187-3.136-4.733-.03-2.96 2.42-4.4 2.53-4.457-1.39-2.023-3.535-2.29-4.316-2.336-1.954-.153-3.83 1.196-4.83 1.196s-2.52-1.12-4.14-1.095zM15.54 3.82c.84-.99 1.408-2.366 1.254-3.737-1.173.045-2.62.77-3.486 1.76-.78.85-1.442 2.247-1.26 3.593 1.298.098 2.65-.688 3.492-1.616z"/></svg>`,
      descKey: "install.platforms.macosDesc",
      reqKey: "install.platforms.macosReq",
      stepKeys: ["install.platforms.macosStep1", "install.platforms.macosStep2", "install.platforms.macosStep3"],
    },
  ];

  let activePlatform = $derived({
    ...(platforms.find((p) => p.id === selectedOS) || platforms[0]),
    downloads: releases[selectedOS] || [],
  });

  onMount(async () => {
    const ua = window.navigator.userAgent.toLowerCase();

    if (ua.includes("mac")) selectedOS = "macos";
    else if (ua.includes("linux")) selectedOS = "linux";
    else selectedOS = "windows";

    try {
      const res = await fetch("https://api.github.com/repos/CubicLauncher/CubicLauncher/releases/latest");
      const data = await res.json();

      if (!data || !data.assets) throw new Error("No se pudieron obtener los assets");

      const assets = data.assets || [];
      const win: Download[] = [];
      const mac: Download[] = [];
      const lin: Download[] = [];

      assets.forEach((asset: any) => {
        const name = asset.name.toLowerCase();
        if (name.endsWith(".sig")) return;
        if (name.includes("setup.exe")) win.push({ label: "x64-setup.exe", url: asset.browser_download_url });
        else if (name.endsWith(".msi")) win.push({ label: ".msi", url: asset.browser_download_url });
        else if (name.endsWith("x64.dmg")) mac.push({ label: "x64.dmg", url: asset.browser_download_url });
        else if (name.endsWith("aarch64.dmg") || (name.endsWith(".dmg") && !name.includes("x64"))) mac.push({ label: ".dmg", url: asset.browser_download_url });
        else if (name.endsWith("x64.app.tar.gz")) mac.push({ label: "x64.app.tar.gz", url: asset.browser_download_url });
        else if (name.endsWith("aarch64.app.tar.gz") || (name.endsWith(".app.tar.gz") && !name.includes("x64"))) mac.push({ label: ".app.tar.gz", url: asset.browser_download_url });
        else if (name.endsWith(".rpm")) lin.push({ label: "x86_64.rpm", url: asset.browser_download_url });
        else if (name.endsWith(".deb")) lin.push({ label: ".deb", url: asset.browser_download_url });
        else if (name.endsWith(".appimage")) lin.push({ label: ".appimage", url: asset.browser_download_url });
      });

      if (win.length > 0) releases.windows = win;
      if (mac.length > 0) releases.macos = mac;
      if (lin.length > 0) releases.linux = lin;
      releases.linux.push({ label: "Arch PKGBUILD", url: "/docs/arch" });
    } catch (e) {
      error = e instanceof Error ? e.message : "Error al obtener la última versión";
      console.error("Error fetching latest release:", e);
    } finally {
      loading = false;
    }
  });
</script>

<section
  class="relative min-h-screen pt-36 pb-32 bg-neutral-950 text-white overflow-hidden"
>
  <div
    class="absolute inset-0 opacity-[0.07] pointer-events-none"
    style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 40px 40px;"
  ></div>
  <div
    class="absolute top-0 inset-x-0 h-125 bg-linear-to-b from-white/5 to-transparent pointer-events-none"
  ></div>
  <div
    class="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-white/3 blur-[150px] rounded-full pointer-events-none"
  ></div>
  <div
    class="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-white/3 blur-[150px] rounded-full pointer-events-none"
  ></div>

  <div class="container mx-auto px-6 relative z-10 max-w-6xl">
    <!-- Header -->
    <div class="text-center mb-20">
      <h1 class="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
        {$t('install.title')}
        <span
          class="bg-linear-to-r from-white to-neutral-500 bg-clip-text text-transparent"
        >
          {$t('install.titleHighlight')}
        </span>
      </h1>
      <p class="text-xl text-neutral-400 font-light max-w-2xl mx-auto">
        {$t('install.subtitle')}
      </p>
    </div>

    <!-- OS Selector -->
    <div class="flex flex-wrap justify-center gap-4 mb-24">
      {#each platforms as platform}
        <button
          class="relative flex flex-col items-center gap-3 px-10 py-6 rounded-[2rem] transition-all duration-500 font-bold text-[11px] uppercase tracking-[0.2em] border overflow-hidden group {selectedOS ===
          platform.id
            ? 'bg-white text-black border-white shadow-[0_0_60px_rgba(255,255,255,0.08)] scale-105'
            : 'bg-neutral-900/80 border-white/5 text-neutral-400 hover:bg-neutral-800 hover:text-white hover:border-white/20'}"
          onclick={() => (selectedOS = platform.id)}
        >
          {#if selectedOS === platform.id}
            <div
              class="absolute inset-0 bg-linear-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
          {:else}
            <div
              class="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
          {/if}
          <div
            class="{selectedOS === platform.id ? 'text-black' : 'text-neutral-400'} relative z-10"
          >
            {@html platform.icon}
          </div>
          <span class="relative z-10">{$t(platform.nameKey)}</span>
          {#if selectedOS === platform.id}
            <span
              class="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-3 h-3 text-black"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Loading -->
    {#if loading}
      <div class="max-w-4xl mx-auto animate-pulse space-y-12">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-neutral-800 rounded-2xl"></div>
          <div class="space-y-3 flex-1">
            <div class="h-6 bg-neutral-800 rounded w-40"></div>
            <div class="h-4 bg-neutral-800 rounded w-64"></div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div class="h-16 bg-neutral-800 rounded-2xl"></div>
            <div class="h-12 bg-neutral-800 rounded-2xl"></div>
            <div class="h-12 bg-neutral-800 rounded-2xl"></div>
          </div>
          <div class="space-y-6">
            <div class="h-5 bg-neutral-800 rounded w-32"></div>
            <div class="h-16 bg-neutral-800 rounded-2xl"></div>
            <div class="h-16 bg-neutral-800 rounded-2xl"></div>
            <div class="h-16 bg-neutral-800 rounded-2xl"></div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Error -->
    {#if error}
      <div class="max-w-lg mx-auto text-center py-16">
        <div
          class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-7 h-7 text-neutral-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </div>
        <p class="text-neutral-400 text-sm mb-2">{error}</p>
        <p class="text-neutral-600 text-xs mb-8">
          {$t('install.defaultDownloadsAvailable')}
        </p>
        <button
          onclick={() => {
            error = "";
            loading = true;
            setTimeout(() => window.location.reload(), 100);
          }}
          class="bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all"
        >
          {$t('install.retry')}
        </button>
      </div>
    {/if}

    <!-- Content -->
    {#if !loading}
      <div class="fade-in max-w-5xl mx-auto">
        <!-- OS Header Row -->
        <div class="flex items-center gap-6 mb-14">
          <div
            class="w-16 h-16 bg-neutral-900 rounded-2xl border border-white/10 flex items-center justify-center shrink-0"
          >
            <div class="w-8 h-8">{@html activePlatform.icon}</div>
          </div>
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h2 class="text-3xl font-bold tracking-tight">
                {$t(activePlatform.nameKey)}
              </h2>
              <span
                class="px-2.5 py-0.5 rounded-full bg-white/10 text-[9px] font-bold uppercase tracking-[0.15em] text-white/70"
              >
                {$t('install.recommended')}
              </span>
            </div>
            <p class="text-neutral-400 font-light leading-relaxed">
              {$t(activePlatform.descKey)}
            </p>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <!-- Downloads Column (3/5) -->
          <div class="lg:col-span-3">
            {#each activePlatform.downloads as download, i}
              {#if i === 0}
                <!-- Primary Download -->
                <a
                  href={download.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group relative flex items-center gap-6 w-full bg-white text-black px-8 py-6 rounded-[1.75rem] overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(255,255,255,0.06)]"
                >
                  <div
                    class="absolute inset-0 bg-linear-to-r from-black/[0.02] to-transparent"
                  ></div>
                  <div
                    class="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-7 h-7"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                  <div class="relative z-10">
                    <div
                      class="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 mb-0.5"
                    >
                      {$t('install.download')}
                    </div>
                    <div class="text-xl font-bold tracking-tight">
                      {download.label}
                    </div>
                  </div>
                  <div
                    class="ml-auto relative z-10 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </div>
                </a>
              {:else}
                <!-- Secondary Downloads -->
                <a
                  href={download.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center gap-4 w-full px-6 py-4 mt-3 rounded-2xl border border-white/[0.06] text-white transition-all duration-300 hover:bg-white/[0.03] hover:border-white/20 hover:pl-8"
                >
                  <div
                    class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                  <div>
                    <div
                      class="text-[13px] font-semibold tracking-tight group-hover:text-white transition-colors"
                    >
                      {download.label}
                    </div>
                    <div
                      class="text-[10px] text-neutral-600 uppercase tracking-widest"
                    >
                      {$t('install.download')}
                    </div>
                  </div>
                </a>
              {/if}
            {/each}

            <!-- System Requirements -->
            <div class="mt-10 pt-8 border-t border-white/[0.06]">
              <div
                class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-3 h-3"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                  />
                </svg>
                {$t('install.systemRequirements')}
              </div>
              <p class="text-sm text-neutral-500 font-light leading-relaxed">
                {$t(activePlatform.reqKey)}
              </p>
            </div>
          </div>

          <!-- Instructions Column (2/5) -->
          <div class="lg:col-span-2">
            <div class="sticky top-36">
              <div class="flex items-center gap-3 mb-10">
                <div
                  class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 text-neutral-400"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </div>
                <h3
                  class="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-300"
                >
                  {$t('install.instructions')}
                </h3>
              </div>

              <div class="relative">
                <!-- Timeline line -->
                <div
                  class="absolute left-[15px] top-2 bottom-2 w-px bg-white/[0.06]"
                ></div>

                <ul class="space-y-10">
                  {#each activePlatform.stepKeys as instruction, i}
                    <li class="relative pl-12 group">
                      <!-- Timeline dot -->
                      <div
                        class="absolute left-0 top-1 w-[30px] h-[30px] rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-[11px] font-bold text-neutral-500 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-400 z-10"
                      >
                        {i + 1}
                      </div>
                      <p
                        class="text-neutral-400 font-light leading-relaxed group-hover:text-neutral-200 transition-colors duration-400"
                      >
                        {$t(instruction)}
                      </p>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-24 text-center">
          <div
            class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5"
          >
            <span class="text-sm text-neutral-500">
              {$t('install.lookingForOther')}
            </span>
            <a
              href="https://github.com/CubicLauncher/CubicLauncher/releases"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-white font-medium underline underline-offset-4 decoration-white/30 hover:decoration-white/60 transition-all"
            >
              {$t('install.viewAllReleases')}
            </a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 text-neutral-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>

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
