<script lang="ts">
  import Hero from "./Hero.svelte";
  import RandomThemes from "./RandomThemes.svelte";
  import DevelopersSection from "./DevelopersSection.svelte";
  import { t } from "$lib/i18n";

  const features = [
    {
      titleKey: "home.feature1Title",
      descKey: "home.feature1Desc",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    },
    {
      titleKey: "home.feature2Title",
      descKey: "home.feature2Desc",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
    },
    {
      titleKey: "home.feature3Title",
      descKey: "home.feature3Desc",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><circle cx="15.5" cy="7" r="4"></circle></svg>`,
    },
    {
      titleKey: "home.feature4Title",
      descKey: "home.feature4Desc",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    },
    {
      titleKey: "home.feature5Title",
      descKey: "home.feature5Desc",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    },
    {
      titleKey: "home.feature6Title",
      descKey: "home.feature6Desc",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.047-.899-.277-1.237-.615l-1.501-1.501a2.825 2.825 0 1 0-3.996 3.996l1.501 1.501c.338.338.568.767.615 1.237.028.281-.06.553-.276.837l-1.61 1.61a2.404 2.404 0 0 1-3.408 0l-1.568-1.568a1.245 1.245 0 0 0-.878-.289 1.242 1.242 0 0 0-.81.436L4.038 21.03a2.404 2.404 0 0 1-3.408 0 2.402 2.402 0 0 1 0-3.408l1.545-1.545a1.242 1.242 0 0 0 .436-.81 1.245 1.245 0 0 0-.289-.878l-1.568-1.568a2.402 2.402 0 0 1 0-3.408l1.611-1.611c.284-.216.556-.304.837-.276.47.047.899.277 1.237.615l1.501 1.501a2.825 2.825 0 1 0 3.996-3.996l-1.501-1.501c-.338-.338-.568-.767-.615-1.237-.028-.281.06-.553.276-.837l1.61-1.61a2.404 2.404 0 0 1 3.408 0l1.568 1.568c.23.23.556.338.878.289.282-.043.528-.184.71-.41l1.545-1.545a2.404 2.404 0 0 1 3.408 0 2.402 2.402 0 0 1 0 3.408l-1.545 1.545a1.242 1.242 0 0 0-.41.71z"></path></svg>`,
    },
    {
      titleKey: "home.feature7Title",
      descKey: "home.feature7Desc",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
    },
  ];
</script>

<main class="bg-neutral-950 overflow-x-hidden">
  <Hero />

  <RandomThemes />

  <!-- Features Grid -->
  <section class="py-24">
    <div class="container mx-auto px-6 max-w-6xl">
      <div class="text-center mb-20">
        <h2 class="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          {$t('home.featuresTitle')}
        </h2>
        <p class="text-neutral-400 text-lg font-light max-w-xl mx-auto">
          {$t('home.featuresSubtitle')}
        </p>
      </div>
      <div class="flex flex-wrap justify-center gap-8">
        {#each features as feature}
          <div
            class="flex flex-col gap-5 w-full max-w-sm bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 hover:scale-[1.02] transition-all duration-300"
          >
            <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-800 text-white shrink-0">
              {@html feature.icon}
            </div>
            <h3 class="text-2xl font-bold tracking-tight text-white">
              {$t(feature.titleKey)}
            </h3>
            <p class="text-neutral-400 leading-relaxed font-light">
              {$t(feature.descKey)}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <DevelopersSection />

  <!-- Community Section -->
  <section class="py-48 bg-white text-black">
    <div class="container mx-auto px-6 text-center">
      <h2
        class="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-12 uppercase"
      >
        OPEN SOURCE
      </h2>
      <p class="max-w-2xl mx-auto text-xl mb-16 font-light">
        {$t('home.mission')}
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-8">
        <a
          href="https://discord.com/invite/7VaqSrPukm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            class="flex items-center gap-3 px-10 py-5 bg-black text-white font-bold text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all"
          >
            {$t('home.joinDiscord')}
          </button>
        </a>
        <a
          href="https://github.com/CubicLauncherDevs/CubicLauncher"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 px-10 py-5 border border-black/10 text-black font-bold text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-black/5 transition-all"
        >
          {$t('home.contributeGitHub')}
        </a>
      </div>
      <!-- Contribuidores -->
    </div>
  </section>
</main>
