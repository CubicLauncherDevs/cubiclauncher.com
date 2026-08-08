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
  <section class="pt-32 pb-24">
    <div class="container mx-auto px-6 max-w-3xl">
      <h1
        class="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8 text-center"
      >
        {$t('about.title')}
      </h1>
      <div class="flex flex-col gap-6 text-left">
        <p class="text-lg md:text-xl text-neutral-400 font-light leading-relaxed">
          {$t('about.paragraph1')}
        </p>
        <p class="text-lg md:text-xl text-neutral-400 font-light leading-relaxed">
          {$t('about.paragraph2')}
        </p>
        <p class="text-lg md:text-xl text-neutral-400 font-light leading-relaxed">
          {$t('about.paragraph3')}
        </p>
        <p class="text-lg md:text-xl text-neutral-400 font-light leading-relaxed">
          {$t('about.paragraph4')}
        </p>
      </div>
    </div>
  </section>

  <!-- Team -->
  <DevelopersSection />

  <!-- Contribute -->
  <section class="py-24 border-t border-white/5">
    <div class="container mx-auto px-6 max-w-4xl text-center">
      <h2 class="text-3xl md:text-5xl font-black tracking-tighter mb-6">
        {$t('about.contributeTitle')}
      </h2>
      <p
        class="text-neutral-400 text-lg font-light leading-relaxed mb-10 max-w-2xl mx-auto"
      >
        {$t('about.contributeDescription')}
      </p>
      <a
        href="https://github.com/CubicLauncherDevs/CubicLauncher"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-bold text-[11px] uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all"
      >
        <IconGithub class="w-5 h-5" />
        {$t('about.contributeButton')}
      </a>
    </div>
  </section>
</main>
