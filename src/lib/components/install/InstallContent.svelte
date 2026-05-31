<script lang="ts">
  import { onMount } from "svelte";

  let selectedOS = "windows";

  let releases: Record<string, {label: string, url: string}[]> = {
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
      { label: "Arch Pkgbuild", url: "/docs/arch" },
    ]
  };

  const platforms = [
    {
      id: "windows",
      name: "Windows",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>`,
      description: "Instalador recomendado para Windows 10 y 11.",
      instructions: [
        "Descarga el archivo instalador (.exe).",
        "Ejecuta el archivo. Si Windows SmartScreen muestra una advertencia, haz clic en 'Más información' y luego en 'Ejecutar de todas formas'.",
        "Sigue las instrucciones del instalador.",
        "Inicia CubicLauncher desde el menú de inicio.",
      ],
      requirements:
        "Windows 10 64-bit o superior. Se recomienda 4GB de RAM mínimo.",
    },
    {
      id: "linux",
      name: "Linux",
      icon: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-7 h-7"><title>Linux</title><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35-1.5 1.072-3.58 1.538-5.348.334a2.645 2.645 0 00-.402-.533 1.45 1.45 0 00-.275-.333c.182 0 .338-.03.465-.067a.615.615 0 00.314-.334c.108-.267 0-.697-.345-1.163-.345-.467-.931-.995-1.788-1.521-.63-.4-.986-.87-1.15-1.396-.165-.534-.143-1.085-.015-1.645.245-1.07.873-2.11 1.274-2.763.107-.065.037.135-.408.974-.396.751-1.14 2.497-.122 3.854a8.123 8.123 0 01.647-2.876c.564-1.278 1.743-3.504 1.836-5.268.048.036.217.135.289.202.218.133.38.333.59.465.21.201.477.335.876.335.039.003.075.006.11.006.412 0 .73-.134.997-.268.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876.085.4.154.78.409 1.066.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595-.63.401-1.746.712-2.457 1.57-.618.737-1.37 1.14-2.036 1.191-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69.176-.668.428-1.344.463-1.897.037-.714.076-1.335.195-1.814.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01c.053 0 .105.005.157.014.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602-.369-.066-.61-.2-.723-.4-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336zm7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8.097 8.097 0 01-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065zm-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z"/></svg>`,
      description:
        "AppImage universal para distribuciones Linux.",
      instructions: [
        "Descarga el archivo AppImage.",
        "Haz clic derecho en el archivo descargado, selecciona 'Propiedades', ve a la pestaña 'Permisos' y marca 'Permitir ejecutar el archivo como un programa'. Alternativamente, ejecuta chmod +x cubiclauncher.AppImage en la terminal.",
        "Haz doble clic para ejecutar el launcher.",
      ],
      requirements: "Cualquier distribución Linux moderna de 64-bit.",
    },
    {
      id: "macos",
      name: "macOS",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.62-1.496 3.6-2.978 1.128-1.625 1.59-3.21 1.62-3.303-.032-.014-3.1-1.187-3.136-4.733-.03-2.96 2.42-4.4 2.53-4.457-1.39-2.023-3.535-2.29-4.316-2.336-1.954-.153-3.83 1.196-4.83 1.196s-2.52-1.12-4.14-1.095zM15.54 3.82c.84-.99 1.408-2.366 1.254-3.737-1.173.045-2.62.77-3.486 1.76-.78.85-1.442 2.247-1.26 3.593 1.298.098 2.65-.688 3.492-1.616z"/></svg>`,
      description:
        "Aplicación universal para Apple Silicon (M1/M2/M3) y procesadores Intel.",
      instructions: [
        "Descarga el archivo .dmg.",
        "Abre el archivo y arrastra el ícono de CubicLauncher a la carpeta Aplicaciones.",
        "La primera vez que lo abras, puede que macOS te impida ejecutarlo. Ve a Ajustes del Sistema > Privacidad y Seguridad y haz clic en 'Abrir de todos modos'.",
      ],
      requirements: "macOS 11.0 (Big Sur) o posterior.",
    },
  ];

  onMount(async () => {
    const ua = window.navigator.userAgent.toLowerCase();

    if (ua.includes("mac")) {
      selectedOS = "macos";
    } else if (ua.includes("linux")) {
      selectedOS = "linux";
    } else {
      selectedOS = "windows";
    }

    try {
      const res = await fetch("https://api.github.com/repos/CubicLauncher/CubicLauncher/releases/latest");
      const data = await res.json();
      
      const assets = data.assets || [];
      
      const win: {label: string, url: string}[] = [];
      const mac: {label: string, url: string}[] = [];
      const lin: {label: string, url: string}[] = [];

      assets.forEach((asset: any) => {
        const name = asset.name.toLowerCase();
        if (name.endsWith('.sig')) return;

        if (name.includes('setup.exe')) win.push({ label: 'x64-setup.exe', url: asset.browser_download_url });
        else if (name.endsWith('.msi')) win.push({ label: '.msi', url: asset.browser_download_url });
        else if (name.endsWith('x64.dmg')) mac.push({ label: 'x64.dmg', url: asset.browser_download_url });
        else if (name.endsWith('aarch64.dmg') || (name.endsWith('.dmg') && !name.includes('x64'))) mac.push({ label: '.dmg', url: asset.browser_download_url });
        else if (name.endsWith('x64.app.tar.gz')) mac.push({ label: 'x64.app.tar.gz', url: asset.browser_download_url });
        else if (name.endsWith('aarch64.app.tar.gz') || (name.endsWith('.app.tar.gz') && !name.includes('x64'))) mac.push({ label: '.app.tar.gz', url: asset.browser_download_url });
        else if (name.endsWith('.rpm')) lin.push({ label: 'x86_64.rpm', url: asset.browser_download_url });
        else if (name.endsWith('.deb')) lin.push({ label: '.deb', url: asset.browser_download_url });
        else if (name.endsWith('.appimage')) lin.push({ label: '.appimage', url: asset.browser_download_url });
      });

      if (win.length > 0) releases.windows = win;
      if (mac.length > 0) releases.macos = mac;
      if (lin.length > 0) releases.linux = lin;
      releases.linux.push({ label: "Arch PKGBUILD", url: "/docs/arch" });
    } catch (e) {
      console.error("Error fetching latest release:", e);
    }
  });

  $: activePlatform = {
    ...(platforms.find((p) => p.id === selectedOS) || platforms[0]),
    downloads: releases[selectedOS] || []
  };
</script>

<section
  class="min-h-screen pt-40 pb-32 bg-neutral-950 text-white overflow-hidden relative"
>
  <!-- Decorative background elements -->
  <div
    class="absolute top-0 inset-x-0 h-125 bg-linear-to-b from-white/3 to-transparent pointer-events-none"
  ></div>
  <div
    class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/2 blur-[120px] rounded-full pointer-events-none"
  ></div>

  <div class="container mx-auto px-6 relative z-10 max-w-5xl">
    <div class="text-center mb-20">
      <h1 class="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
        Instalar <span
          class="bg-linear-to-r from-white to-neutral-500 bg-clip-text text-transparent"
          >CubicLauncher</span
        >
      </h1>
      <p class="text-xl text-neutral-400 font-light max-w-2xl mx-auto">
        Elige tu sistema operativo y disfruta lo que ofrece CubicLauncher.
      </p>
    </div>

    <!-- OS Selector -->
    <div class="flex flex-wrap justify-center gap-4 mb-16">
      {#each platforms as platform}
        <button
          class="flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-[11px] uppercase tracking-[0.2em] border {selectedOS ===
          platform.id
            ? 'bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.1)] scale-105'
            : 'bg-neutral-900 border-white/10 text-neutral-400 hover:bg-neutral-800 hover:text-white'}"
          on:click={() => (selectedOS = platform.id)}
        >
          <div
            class={selectedOS === platform.id
              ? "text-black"
              : "text-neutral-400"}
          >
            {@html platform.icon}
          </div>
          {platform.name}
        </button>
      {/each}
    </div>


    <!-- Active OS Content -->
    <div
      class="bg-neutral-900/50 border border-white/10 rounded-4xl p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden group transition-all duration-500"
    >
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-opacity duration-700"
      ></div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        <!-- Download Section -->
        <div>
          <h2 class="text-3xl font-bold mb-4 flex items-center gap-4">
            <span
              class="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl text-white"
            >
              {@html activePlatform.icon}
            </span>
            {activePlatform.name}
          </h2>
          <p class="text-neutral-400 font-light mb-10 leading-relaxed text-lg">
            {activePlatform.description}
          </p>

          <div class="flex flex-col gap-4">
            {#each activePlatform.downloads as download, i}
              <a
                href={download.url}
                target="_blank"
                rel="noopener noreferrer"
                class={i === 0
                  ? "flex items-center justify-center gap-3 w-full bg-white text-black px-8 py-5 font-bold text-[12px] uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-white/5"
                  : "flex items-center justify-center gap-3 w-full px-8 py-5 border border-white/10 text-white font-bold text-[12px] uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all"}
              >
                {#if i === 0}
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
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                {/if}
                Descargar {download.label}
              </a>
            {/each}
          </div>

          <div class="mt-8 pt-8 border-t border-white/10">
            <h3
              class="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-2"
            >
              Requisitos del sistema
            </h3>
            <p class="text-sm text-neutral-400 font-light">
              {activePlatform.requirements}
            </p>
          </div>
        </div>

        <!-- Instructions Section -->
        <div class="bg-black/20 rounded-2xl p-8 border border-white/5">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6 text-neutral-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            Instrucciones
          </h3>
          <ul class="space-y-6">
            {#each activePlatform.instructions as instruction, i}
              <li class="flex gap-4 items-start group">
                <span
                  class="shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-neutral-400 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300"
                >
                  {i + 1}
                </span>
                <p class="text-neutral-300 font-light leading-relaxed mt-1">
                  {instruction}
                </p>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>