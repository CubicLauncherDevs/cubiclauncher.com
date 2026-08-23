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
  import QuickStart from "./QuickStart.svelte";
  import RandomThemes from "./RandomThemes.svelte";

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

  <!-- Features -->
  <section class="py-16 bg-neutral-900">
    <div class="mx-auto px-6 lg:px-8" style="max-width: var(--discord-max-width);">
      <div class="text-center mb-10">
        <h2 class="text-[22px] sm:text-[26px] font-semibold tracking-tight text-white mb-2">
          {$t('home.featuresTitle')}
        </h2>
        <p class="text-[14px] text-neutral-400 max-w-xl mx-auto">
          {$t('home.featuresSubtitle')}
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {#each features as feature}
          <div class="flex items-start gap-3 p-4 rounded-[4px] bg-neutral-950 border border-white/5 hover:border-white/10 transition-colors">
            <div
              class="shrink-0 flex items-center justify-center w-9 h-9 rounded-[4px] bg-neutral-900 text-white"
            >
              <feature.Icon class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-[14px] font-semibold text-white mb-0.5">
                {$t(feature.titleKey)}
              </h3>
              <p class="text-[13px] leading-[1.5] text-neutral-400">
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

  <!-- Community Section -->
  <section class="py-16 bg-neutral-950">
    <div class="mx-auto px-6 lg:px-8 text-center" style="max-width: var(--discord-max-width);">
      <h2 class="text-[22px] sm:text-[26px] font-semibold tracking-tight text-white mb-3">
        {$t('home.openSource')}
      </h2>
      <p class="max-w-xl mx-auto text-[14px] leading-[1.6] text-neutral-400 mb-6">
        {$t('home.mission')}
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="https://discord.com/invite/7VaqSrPukm"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5865F2] text-white text-[13px] font-medium rounded-[4px] hover:bg-[#4853c5] transition-colors"
        >
          {$t('home.joinDiscord')}
        </a>
        <a
          href="https://github.com/CubicLauncherDevs/CubicLauncher"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white text-[13px] font-medium rounded-[4px] hover:bg-white/5 transition-colors"
        >
          {$t('home.contributeGitHub')}
        </a>
      </div>
    </div>
  </section>
</main>
