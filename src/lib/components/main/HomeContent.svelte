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

<main class="bg-cl-base overflow-x-hidden">
  <Hero />

  <!-- Features -->
  <section class="py-10 bg-cl-surface border-y border-cl-border">
    <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
      <div class="mb-6">
        <h2 class="text-lg sm:text-xl font-semibold text-cl-text mb-1">
          {$t('home.featuresTitle')}
        </h2>
        <p class="text-xs text-cl-muted max-w-xl">
          {$t('home.featuresSubtitle')}
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {#each features as feature}
          <div class="flex items-start gap-2.5 p-3 rounded bg-cl-base border border-cl-border hover:border-cl-border-hover transition-colors">
            <div
              class="shrink-0 flex items-center justify-center w-7 h-7 rounded bg-cl-elevated text-cl-text"
            >
              <feature.Icon class="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 class="text-xs font-semibold text-cl-text mb-0.5">
                {$t(feature.titleKey)}
              </h3>
              <p class="text-[11px] leading-[1.5] text-cl-muted">
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
  <section class="py-10 bg-cl-base border-t border-cl-border">
    <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-lg sm:text-xl font-semibold text-cl-text mb-1">
            {$t('home.openSource')}
          </h2>
          <p class="text-xs text-cl-muted max-w-md">
            {$t('home.mission')}
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <a
            href="https://discord.com/invite/7VaqSrPukm"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cl-elevated text-cl-text text-xs font-medium rounded border border-cl-border hover:border-cl-border-hover hover:bg-cl-hover transition-colors"
          >
            {$t('home.joinDiscord')}
          </a>
          <a
            href="https://github.com/CubicLauncherDevs/CubicLauncher"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-cl-text text-xs font-medium rounded border border-cl-border hover:border-cl-border-hover hover:bg-cl-elevated transition-colors"
          >
            {$t('home.contributeGitHub')}
          </a>
        </div>
      </div>
    </div>
  </section>
</main>
