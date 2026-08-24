<script lang="ts">
  import { t } from "$lib/i18n";
  import IconGithub from "~icons/simple-icons/github";
  import DevelopersSection from "$lib/components/main/DevelopersSection.svelte";
</script>

<svelte:head>
  <title>{$t('page.aboutTitle')}</title>
  <meta name="description" content={$t('page.aboutDesc')} />
</svelte:head>

<main class="bg-cl-base overflow-x-hidden">
  <!-- Intro -->
  <section class="pt-[calc(var(--navbar-height)+12px)] pb-10">
    <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-[24px] sm:text-[28px] font-semibold text-cl-text mb-6 text-center tracking-tight">
          {$t('about.title')}
        </h1>
        <div class="flex flex-col gap-4 text-left">
          <p class="text-[14px] leading-[1.7] text-cl-muted">
            {$t('about.paragraph1')}
          </p>
          <p class="text-[14px] leading-[1.7] text-cl-muted">
            {$t('about.paragraph2')}
          </p>
          <p class="text-[14px] leading-[1.7] text-cl-muted">
            {$t('about.paragraph3')}
          </p>
          <p class="text-[14px] leading-[1.7] text-cl-muted">
            {$t('about.paragraph4')}
          </p>
        </div>
      </div>
    </div>
  </section>

  <DevelopersSection />

  <!-- Contribute -->
  <section class="py-12 border-t border-cl-border">
    <div class="mx-auto px-4 lg:px-6 text-center" style="max-width: var(--discord-max-width);">
      <h2 class="text-[20px] sm:text-[24px] font-semibold text-cl-text mb-3 tracking-tight">
        {$t('about.contributeTitle')}
      </h2>
      <p class="text-cl-muted text-[13px] leading-relaxed mb-6 max-w-xl mx-auto">
        {$t('about.contributeDescription')}
      </p>
      <a
        href="https://github.com/CubicLauncherDevs/CubicLauncher"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-cl-text text-cl-accent-inverse font-medium text-[13px] rounded hover:opacity-90 transition-opacity"
      >
        <IconGithub class="w-4 h-4" />
        {$t('about.contributeButton')}
      </a>
    </div>
  </section>
</main>
