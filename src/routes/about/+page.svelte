<script lang="ts">
  import { t } from "$lib/i18n";
  import IconGithub from "~icons/simple-icons/github";
  import DevelopersSection from "$lib/components/main/DevelopersSection.svelte";

</script>

<svelte:head>
  <title>{$t('page.aboutTitle')}</title>
  <meta name="description" content={$t('page.aboutDesc')} />
</svelte:head>

<main class="bg-neutral-950 overflow-x-hidden">
  <!-- Intro -->
  <section class="pt-[calc(var(--discord-nav-height)+48px)] pb-20">
    <div class="mx-auto px-6 lg:px-8" style="max-width: var(--discord-max-width);">
      <div class="max-w-2xl mx-auto">
        <h1
          class="text-[28px] sm:text-[36px] font-semibold tracking-tight mb-8 text-center"
        >
          {$t('about.title')}
        </h1>
        <div class="flex flex-col gap-5 text-left">
          <p class="text-[16px] leading-[1.7] text-neutral-400">
            {$t('about.paragraph1')}
          </p>
          <p class="text-[16px] leading-[1.7] text-neutral-400">
            {$t('about.paragraph2')}
          </p>
          <p class="text-[16px] leading-[1.7] text-neutral-400">
            {$t('about.paragraph3')}
          </p>
          <p class="text-[16px] leading-[1.7] text-neutral-400">
            {$t('about.paragraph4')}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Team -->
  <DevelopersSection />

  <!-- Contribute -->
  <section class="py-20 border-t border-white/5">
    <div class="mx-auto px-6 lg:px-8 text-center" style="max-width: var(--discord-max-width);">
      <h2 class="text-[26px] sm:text-[32px] font-semibold tracking-tight mb-4">
        {$t('about.contributeTitle')}
      </h2>
      <p
        class="text-neutral-400 text-[16px] leading-relaxed mb-8 max-w-xl mx-auto"
      >
        {$t('about.contributeDescription')}
      </p>
      <a
        href="https://github.com/CubicLauncherDevs/CubicLauncher"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium text-[14px] rounded-[4px] hover:bg-neutral-200 transition-colors"
      >
        <IconGithub class="w-4 h-4" />
        {$t('about.contributeButton')}
      </a>
    </div>
  </section>
</main>
