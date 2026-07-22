<script lang="ts">
  import { t } from "$lib/i18n";
  import IconCube from "~icons/ph/cube";
  import IconGithub from "~icons/simple-icons/github";
  import IconUsers from "~icons/ph/users";
  import IconLightning from "~icons/ph/lightning";
  import IconSliders from "~icons/ph/sliders-horizontal";
  import IconPackage from "~icons/ph/package";
  import IconSparkle from "~icons/ph/sparkle";
  import Hero from "./Hero.svelte";
  import AboutSection from "./AboutSection.svelte";
  import QuickStart from "./QuickStart.svelte";
  import RandomThemes from "./RandomThemes.svelte";
  import DevelopersSection from "./DevelopersSection.svelte";

  const features = [
    {
      titleKey: "home.feature1Title",
      descKey: "home.feature1Desc",
      Icon: IconCube,
    },
    {
      titleKey: "home.feature2Title",
      descKey: "home.feature2Desc",
      Icon: IconGithub,
    },
    {
      titleKey: "home.feature3Title",
      descKey: "home.feature3Desc",
      Icon: IconUsers,
    },
    {
      titleKey: "home.feature4Title",
      descKey: "home.feature4Desc",
      Icon: IconLightning,
    },
    {
      titleKey: "home.feature5Title",
      descKey: "home.feature5Desc",
      Icon: IconSliders,
    },
    {
      titleKey: "home.feature6Title",
      descKey: "home.feature6Desc",
      Icon: IconPackage,
    },
    {
      titleKey: "home.feature7Title",
      descKey: "home.feature7Desc",
      Icon: IconSparkle,
    },
  ];
</script>

<main class="bg-neutral-950 overflow-x-hidden">
  <Hero />

  <AboutSection />

  <!-- Features -->
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
        {#each features as feature}
          <div class="flex gap-5">
            <div
              class="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 text-white border border-white/5"
            >
              <feature.Icon class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-xl font-bold tracking-tight text-white mb-1">
                {$t(feature.titleKey)}
              </h3>
              <p class="text-neutral-400 leading-relaxed font-light">
                {$t(feature.descKey)}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <QuickStart />

  <RandomThemes />

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
    </div>
  </section>
</main>
