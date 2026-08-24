<script lang="ts">
  import Logo from "$lib/Logo.svelte";
  import { t } from "$lib/i18n";
  import IconDiscord from "~icons/simple-icons/discord";
  import IconGithub from "~icons/simple-icons/github";
  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-cl-surface border-t border-cl-border mt-auto">
  <div class="mx-auto px-4 lg:px-6 py-6" style="max-width: var(--discord-max-width);">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <a href="/" class="flex items-center gap-2 group shrink-0">
          <Logo
            width="1.25rem"
            height="1.25rem"
            color="var(--cl-text)"
            className="transition-transform duration-200 group-hover:scale-105"
          />
          <span class="font-semibold text-sm text-cl-text tracking-tight">CubicLauncher</span>
        </a>

        <nav class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a href="/themes" class="text-xs text-cl-muted hover:text-cl-text transition-colors">{$t('footer.themes')}</a>
          <a href="/about" class="text-xs text-cl-muted hover:text-cl-text transition-colors">{$t('nav.about')}</a>
          <a href="/donate" class="text-xs text-cl-muted hover:text-cl-text transition-colors">{$t('nav.donate')}</a>
          <a href="https://dev.cubiclauncher.org/docs" class="text-xs text-cl-muted hover:text-cl-text transition-colors">{$t('footer.documentation')}</a>
          <a href="https://dev.cubiclauncher.org/docs/es-ES/Legal/privacy" class="text-xs text-cl-muted hover:text-cl-text transition-colors">{$t('footer.privacy')}</a>
          <a href="https://dev.cubiclauncher.org/docs/es-ES/Legal/terms" class="text-xs text-cl-muted hover:text-cl-text transition-colors">{$t('footer.terms')}</a>
        </nav>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3">
          <a
            href="https://discord.com/invite/7VaqSrPukm"
            class="text-cl-dim hover:text-cl-text transition-colors"
            aria-label="Discord"
          >
            <IconDiscord class="w-4 h-4" />
          </a>
          <a
            href="https://github.com/CubicLauncherDevs"
            class="text-cl-dim hover:text-cl-text transition-colors"
            aria-label="GitHub"
          >
            <IconGithub class="w-4 h-4" />
          </a>
        </div>
        <p class="text-[11px] text-cl-dim">
          {$t('footer.copyright', { values: { year: currentYear } })}
        </p>
      </div>
    </div>
  </div>
</footer>
