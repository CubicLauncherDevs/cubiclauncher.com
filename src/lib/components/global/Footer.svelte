<script lang="ts">
  import Logo from "$lib/Logo.svelte";
  import { t } from "$lib/i18n";
  import IconDiscord from "~icons/simple-icons/discord";
  import IconGithub from "~icons/simple-icons/github";
  const currentYear = new Date().getFullYear();
</script>

<footer
  class="bg-neutral-950 border-t border-white/5 pt-16 pb-10"
>
  <div class="mx-auto px-6 lg:px-8" style="max-width: var(--discord-max-width);">
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14"
    >
      <!-- Brand Section -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <a href="/" class="flex items-center gap-2.5 group w-fit">
          <Logo
            width="2rem"
            height="2rem"
            color="#ffffff"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <span class="font-semibold text-[16px] text-white tracking-tight"
            >CubicLauncher</span
          >
        </a>
        <p class="text-[13px] leading-relaxed max-w-sm text-neutral-400">
          {$t('footer.brand')}
        </p>
      </div>

      <!-- Links Column 2 -->
      <div class="flex flex-col gap-4">
        <h3 class="text-[12px] font-semibold text-white">
          {$t('footer.resources')}
        </h3>
        <ul class="flex flex-col gap-2.5">
          <li>
            <a
              href="https://dev.cubiclauncher.org/docs"
              class="text-[13px] text-neutral-400 hover:text-white transition-colors"
              >{$t('footer.documentation')}</a
            >
          </li>
          <li>
            <a
              href="/about"
              class="text-[13px] text-neutral-400 hover:text-white transition-colors"
              >{$t('nav.about')}</a
            >
          </li>
          <li>
            <a
              href="/themes"
              class="text-[13px] text-neutral-400 hover:text-white transition-colors"
              >{$t('footer.themes')}</a
            >
          </li>
          <li>
            <a
              href="https://dev.cubiclauncher.org/docs/es-ES/guias/soporte"
              class="text-[13px] text-neutral-400 hover:text-white transition-colors"
              >{$t('footer.support')}</a
            >
          </li>
        </ul>
      </div>

      <!-- Links Column 3 -->
      <div class="flex flex-col gap-4">
        <h3 class="text-[12px] font-semibold text-white">
          {$t('footer.legal')}
        </h3>
        <ul class="flex flex-col gap-2.5">
          <li>
            <a
              href="https://dev.cubiclauncher.org/docs/es-ES/Legal/privacy"
              class="text-[13px] text-neutral-400 hover:text-white transition-colors"
              >{$t('footer.privacy')}</a
            >
          </li>
          <li>
            <a
              href="https://dev.cubiclauncher.org/docs/es-ES/Legal/terms"
              class="text-[13px] text-neutral-400 hover:text-white transition-colors"
              >{$t('footer.terms')}</a
            >
          </li>
          <li>
            <a
              href="https://dev.cubiclauncher.org/docs/es-ES/Legal/license"
              class="text-[13px] text-neutral-400 hover:text-white transition-colors"
              >{$t('footer.license')}</a
            >
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom Section -->
    <div
      class="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/5 gap-4"
    >
      <p class="text-[12px] text-neutral-500">
        {$t('footer.copyright', { values: { year: currentYear } })}
      </p>

      <div class="flex items-center gap-5">
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
