<script lang="ts">
  import Logo from "$lib/Logo.svelte";
  import { t } from "$lib/i18n";
  import IconDiscord from "~icons/simple-icons/discord";
  import IconGithub from "~icons/simple-icons/github";
  const currentYear = new Date().getFullYear();
</script>

<footer
  class="relative border-t border-white/5 bg-neutral-950 overflow-hidden pt-24 pb-12"
>
  <!-- Subtle background glow -->
  <div
    class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
  ></div>
  <div
    class="absolute -top-24 left-1/2 -translate-x-1/2 w-200 h-50 bg-white/2 blur-[100px] rounded-full pointer-events-none"
  ></div>

  <div class="max-w-7xl mx-auto px-6 relative z-10">
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8 mb-24"
    >
      <!-- Brand Section -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <a href="/" class="flex items-center gap-3 group w-fit">
          <Logo
            width="2.5rem"
            height="2.5rem"
            color="#ffffff"
            className="group-hover:scale-110 transition-transform duration-500"
          />
          <span class="font-bold text-xl tracking-tighter uppercase text-white"
            >CubicLauncher</span
          >
        </a>
        <p class="text-neutral-400 leading-relaxed max-w-sm font-light text-sm">
          {$t('footer.brand')}
        </p>
      </div>

      <!-- Links Column 2 -->
      <div class="flex flex-col gap-6">
        <h3 class="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
          {$t('footer.resources')}
        </h3>
        <ul class="flex flex-col gap-4">
          <li>
            <a
              href="https://dev.cubiclauncher.org/docs"
              class="text-sm text-neutral-400 hover:text-white transition-colors"
              >{$t('footer.documentation')}</a
            >
          </li>
          <li>
            <a
              href="/themes"
              class="text-sm text-neutral-400 hover:text-white transition-colors"
              >{$t('footer.themes')}</a
            >
          </li>
          <li>
            <a
              href="https://dev.cubiclauncher.org/docs/es-ES/guias/soporte"
              class="text-sm text-neutral-400 hover:text-white transition-colors"
              >{$t('footer.support')}</a
            >
          </li>
        </ul>
      </div>

      <!-- Links Column 3 -->
      <div class="flex flex-col gap-6">
        <h3 class="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
          {$t('footer.legal')}
        </h3>
        <ul class="flex flex-col gap-4">
          <li>
            <a
              href="https://dev.cubiclauncher.org/docs/es-ES/Legal/privacy"
              class="text-sm text-neutral-400 hover:text-white transition-colors"
              >{$t('footer.privacy')}</a
            >
          </li>
          <li>
            <a
              href="https://dev.cubiclauncher.org/docs/es-ES/Legal/terms"
              class="text-sm text-neutral-400 hover:text-white transition-colors"
              >{$t('footer.terms')}</a
            >
          </li>
          <li>
            <a
              href="https://dev.cubiclauncher.org/docs/es-ES/Legal/license"
              class="text-sm text-neutral-400 hover:text-white transition-colors"
              >{$t('footer.license')}</a
            >
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom Section -->
    <div
      class="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4"
    >
      <p class="text-xs text-neutral-500">
        {$t('footer.copyright', { values: { year: currentYear } })}
      </p>

      <div class="flex items-center gap-6">
        <a
          href="https://discord.com/invite/7VaqSrPukm"
          class="text-neutral-500 hover:text-white transition-colors"
          aria-label="Discord"
        >
          <IconDiscord class="w-5 h-5" />
        </a>
        <a
          href="https://github.com/CubicLauncherDevs"
          class="text-neutral-500 hover:text-white transition-colors"
          aria-label="GitHub"
        >
          <IconGithub class="w-5 h-5" />
        </a>
      </div>
    </div>
  </div>
</footer>
