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
    <section class="relative flex items-center justify-center pt-32 pb-16 overflow-hidden bg-neutral-950">
    <div
      class="absolute inset-0 opacity-[0.07] pointer-events-none"
      style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 40px 40px;"
    ></div>
    <div class="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

    <div class="container mx-auto px-6 relative z-10 text-center max-w-4xl">
      <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
        {$t("donate.title")}
      </h1>
      <p class="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mx-auto mb-8 leading-relaxed">
        {$t("donate.subtitle")}
      </p>
      <a
        href="https://discord.com/invite/7VaqSrPukm"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 bg-[#5865F2] text-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all active:scale-95"
      >
        <IconDiscord class="w-4 h-4" /> Discord
      </a>
    </div>
  </section>

  <section class="py-16">
    <div class="container mx-auto px-6 max-w-6xl">
      <div class="max-w-3xl mx-auto text-center mb-8">
        <p class="text-neutral-300 text-lg leading-relaxed font-light">
          {$t("donate.description")}
        </p>
      </div>

      <div class="max-w-md mx-auto fade-in">
        <div class="rounded-2xl border border-white/10 bg-neutral-900/50 p-10 text-center">
          <div class="w-16 h-16 mx-auto mb-6 rounded-xl bg-white/5 flex items-center justify-center">
            <IconCoffee class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-2xl font-bold tracking-tight text-white mb-3">
            Ko-fi
          </h3>
          <p class="text-neutral-400 text-sm leading-relaxed mb-8">
            {$t("donate.impact")}
          </p>
          <a
            href="https://ko-fi.com/cubiclauncher"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-3 bg-white text-black px-10 py-5 font-bold text-sm uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all active:scale-95"
          >
            <IconCoffee class="w-5 h-5" />
            {$t("donate.kofi")}
            <IconArrowRight class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </section>

  <section class="py-24 border-t border-white/5 bg-neutral-900/20">
    <div class="container mx-auto px-6 max-w-6xl">
      <div class="max-w-3xl mx-auto text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">
          {$t("donate.supportTitle")}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <div class="rounded-2xl border border-white/10 bg-neutral-900/50 p-6 text-center group hover:border-white/20 transition-colors">
          <div class="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <IconBug class="w-6 h-6 text-neutral-400" />
          </div>
          <h3 class="text-sm font-bold uppercase tracking-[0.15em] text-white mb-2">Reportar Bugs</h3>
          <p class="text-xs text-neutral-500 leading-relaxed">Ayudanos encontrando y reportando errores.</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-neutral-900/50 p-6 text-center group hover:border-white/20 transition-colors">
          <div class="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <IconLightbulb class="w-6 h-6 text-neutral-400" />
          </div>
          <h3 class="text-sm font-bold uppercase tracking-[0.15em] text-white mb-2">Sugerir Ideas</h3>
          <p class="text-xs text-neutral-500 leading-relaxed">Compartí tus ideas para mejorar el launcher.</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-neutral-900/50 p-6 text-center group hover:border-white/20 transition-colors">
          <div class="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <IconPaintBucket class="w-6 h-6 text-neutral-400" />
          </div>
          <h3 class="text-sm font-bold uppercase tracking-[0.15em] text-white mb-2">Crear Themes</h3>
          <p class="text-xs text-neutral-500 leading-relaxed">Diseñá temas para personalizar el launcher.</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-neutral-900/50 p-6 text-center group hover:border-white/20 transition-colors">
          <div class="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <IconCode class="w-6 h-6 text-neutral-400" />
          </div>
          <h3 class="text-sm font-bold uppercase tracking-[0.15em] text-white mb-2">Contribuir Código</h3>
          <p class="text-xs text-neutral-500 leading-relaxed">Colaborá con código en el repositorio.</p>
        </div>
      </div>

      <div class="text-center mt-12">
        <p class="text-neutral-400 text-sm font-light max-w-xl mx-auto mb-8">
          {$t("donate.supportDesc")}
        </p>
        <a
          href="https://github.com/CubicLauncherDevs"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-3 px-10 py-5 border border-white/20 text-white font-bold text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-white/5 hover:border-white/30 transition-all"
        >
          <IconGitHubLogo class="w-5 h-5" />
          {$t("donate.contribute")}
          <IconArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>
</main>

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
