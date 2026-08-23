<script lang="ts">
  import { t } from "$lib/i18n";
  import IconCoffee from "~icons/ph/coffee";
  import IconGitHubLogo from "~icons/ph/github-logo";
  import IconBug from "~icons/ph/bug";
  import IconLightbulb from "~icons/ph/lightbulb";
  import IconPaintBucket from "~icons/ph/paint-bucket";
  import IconCode from "~icons/ph/code";
  import IconArrowRight from "~icons/ph/arrow-right";
  import IconDiscord from "~icons/simple-icons/discord";
</script>

<main class="bg-neutral-950 overflow-x-hidden">
    <section class="relative flex items-center justify-center pt-[calc(var(--discord-nav-height)+40px)] pb-16 overflow-hidden bg-neutral-950">
    <div
      class="absolute inset-0 opacity-[0.05] pointer-events-none"
      style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 40px 40px;"
    ></div>

    <div class="mx-auto px-6 lg:px-8 relative z-10 text-center" style="max-width: var(--discord-max-width);">
      <h1 class="text-[30px] sm:text-[40px] font-semibold tracking-tight mb-4 text-white">
        {$t("donate.title")}
      </h1>
      <p class="text-[16px] text-neutral-400 max-w-xl mx-auto mb-6 leading-relaxed">
        {$t("donate.subtitle")}
      </p>
      <a
        href="https://discord.com/invite/7VaqSrPukm"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 bg-[#5865F2] text-white px-5 py-2.5 text-[13px] font-medium rounded-[4px] hover:bg-[#4752c4] transition-colors"
      >
        <IconDiscord class="w-4 h-4" /> Discord
      </a>
    </div>
  </section>

  <section class="py-16">
    <div class="mx-auto px-6 lg:px-8" style="max-width: var(--discord-max-width);">
      <div class="max-w-2xl mx-auto text-center mb-8">
        <p class="text-neutral-300 text-[16px] leading-relaxed">
          {$t("donate.description")}
        </p>
      </div>

      <div class="max-w-sm mx-auto">
        <div class="rounded-lg border border-white/10 bg-neutral-900/50 p-8 text-center">
          <div class="w-14 h-14 mx-auto mb-5 rounded-lg bg-white/5 flex items-center justify-center">
            <IconCoffee class="w-7 h-7 text-white" />
          </div>
          <h3 class="text-xl font-semibold tracking-tight text-white mb-2">
            Ko-fi
          </h3>
          <p class="text-neutral-400 text-[13px] leading-relaxed mb-6">
            {$t("donate.impact")}
          </p>
          <a
            href="https://ko-fi.com/cubiclauncher"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium text-[14px] rounded-[4px] hover:bg-neutral-200 transition-colors"
          >
            <IconCoffee class="w-4 h-4" />
            {$t("donate.kofi")}
          </a>
        </div>
      </div>
    </div>
  </section>

  <section class="py-20 border-t border-white/5 bg-neutral-900/20">
    <div class="mx-auto px-6 lg:px-8" style="max-width: var(--discord-max-width);">
      <div class="max-w-2xl mx-auto text-center mb-12">
        <h2 class="text-[26px] sm:text-[32px] font-semibold tracking-tight text-white mb-3">
          {$t("donate.supportTitle")}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div class="rounded-lg border border-white/10 bg-neutral-900/50 p-5 text-center group hover:border-white/20 transition-colors">
          <div class="w-11 h-11 mx-auto mb-3 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <IconBug class="w-5 h-5 text-neutral-400" />
          </div>
            <h3 class="text-[12px] font-semibold uppercase tracking-wide text-white mb-1.5">{$t('donate.cardReportTitle')}</h3>
            <p class="text-[11px] text-neutral-500 leading-relaxed">{$t('donate.cardReportDesc')}</p>
        </div>
        <div class="rounded-lg border border-white/10 bg-neutral-900/50 p-5 text-center group hover:border-white/20 transition-colors">
          <div class="w-11 h-11 mx-auto mb-3 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <IconLightbulb class="w-5 h-5 text-neutral-400" />
          </div>
            <h3 class="text-[12px] font-semibold uppercase tracking-wide text-white mb-1.5">{$t('donate.cardSuggestTitle')}</h3>
            <p class="text-[11px] text-neutral-500 leading-relaxed">{$t('donate.cardSuggestDesc')}</p>
        </div>
        <div class="rounded-lg border border-white/10 bg-neutral-900/50 p-5 text-center group hover:border-white/20 transition-colors">
          <div class="w-11 h-11 mx-auto mb-3 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <IconPaintBucket class="w-5 h-5 text-neutral-400" />
          </div>
            <h3 class="text-[12px] font-semibold uppercase tracking-wide text-white mb-1.5">{$t('donate.cardThemesTitle')}</h3>
            <p class="text-[11px] text-neutral-500 leading-relaxed">{$t('donate.cardThemesDesc')}</p>
        </div>
        <div class="rounded-lg border border-white/10 bg-neutral-900/50 p-5 text-center group hover:border-white/20 transition-colors">
          <div class="w-11 h-11 mx-auto mb-3 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <IconCode class="w-5 h-5 text-neutral-400" />
          </div>
            <h3 class="text-[12px] font-semibold uppercase tracking-wide text-white mb-1.5">{$t('donate.cardCodeTitle')}</h3>
            <p class="text-[11px] text-neutral-500 leading-relaxed">{$t('donate.cardCodeDesc')}</p>
        </div>
      </div>

      <div class="text-center mt-10">
        <p class="text-neutral-400 text-[13px] max-w-lg mx-auto mb-6">
          {$t("donate.supportDesc")}
        </p>
        <a
          href="https://github.com/CubicLauncherDevs"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-medium text-[14px] rounded-[4px] hover:bg-white/5 hover:border-white/30 transition-colors"
        >
          <IconGitHubLogo class="w-4 h-4" />
          {$t("donate.contribute")}
        </a>
      </div>
    </div>
  </section>
</main>
