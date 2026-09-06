<script lang="ts">
  import { t } from "$lib/i18n";
  import IconCoffee from "~icons/ph/coffee";
  import IconGitHubLogo from "~icons/ph/github-logo";
  import IconBug from "~icons/ph/bug";
  import IconLightbulb from "~icons/ph/lightbulb";
  import IconPaintBucket from "~icons/ph/paint-bucket";
  import IconCode from "~icons/ph/code";
  import IconDiscord from "~icons/simple-icons/discord";
</script>

<main class="bg-cl-base overflow-x-hidden">
  <section class="relative border-b border-cl-border bg-cl-surface overflow-hidden">
    <div
      class="absolute inset-0 opacity-[0.03] pointer-events-none"
      style="background-image: radial-gradient(circle, var(--cl-text) 1px, transparent 1px); background-size: 40px 40px;"
    ></div>

    <div class="mx-auto px-4 lg:px-6 py-10 relative z-10" style="max-width: var(--discord-max-width);">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-semibold text-cl-text mb-1">
            {$t("donate.title")}
          </h1>
          <p class="text-xs text-cl-muted max-w-md">
            {$t("donate.subtitle")}
          </p>
        </div>
        <a
          href="https://discord.com/invite/7VaqSrPukm"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cl-elevated text-cl-text text-xs font-medium rounded border border-cl-border hover:border-cl-border-hover hover:bg-cl-hover transition-colors shrink-0"
        >
          <IconDiscord class="w-3.5 h-3.5" /> Discord
        </a>
      </div>
    </div>
  </section>

  <section class="py-8">
    <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-7">
          <div class="border border-cl-border rounded bg-cl-surface p-4 mb-4">
            <p class="text-xs text-cl-muted leading-relaxed">
              {$t("donate.description")}
            </p>
          </div>

          <div class="border border-cl-border rounded bg-cl-surface p-4">
            <h2 class="text-sm font-semibold text-cl-text mb-3">{$t('donate.supportTitle')}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div class="flex items-start gap-2 p-2.5 rounded bg-cl-base border border-cl-border">
                <div class="w-7 h-7 rounded bg-cl-elevated flex items-center justify-center text-cl-muted">
                  <IconBug class="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 class="text-[11px] font-semibold text-cl-text mb-0.5">{$t('donate.cardReportTitle')}</h3>
                  <p class="text-[10px] text-cl-dim">{$t('donate.cardReportDesc')}</p>
                </div>
              </div>
              <div class="flex items-start gap-2 p-2.5 rounded bg-cl-base border border-cl-border">
                <div class="w-7 h-7 rounded bg-cl-elevated flex items-center justify-center text-cl-muted">
                  <IconLightbulb class="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 class="text-[11px] font-semibold text-cl-text mb-0.5">{$t('donate.cardSuggestTitle')}</h3>
                  <p class="text-[10px] text-cl-dim">{$t('donate.cardSuggestDesc')}</p>
                </div>
              </div>
              <div class="flex items-start gap-2 p-2.5 rounded bg-cl-base border border-cl-border">
                <div class="w-7 h-7 rounded bg-cl-elevated flex items-center justify-center text-cl-muted">
                  <IconPaintBucket class="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 class="text-[11px] font-semibold text-cl-text mb-0.5">{$t('donate.cardThemesTitle')}</h3>
                  <p class="text-[10px] text-cl-dim">{$t('donate.cardThemesDesc')}</p>
                </div>
              </div>
              <div class="flex items-start gap-2 p-2.5 rounded bg-cl-base border border-cl-border">
                <div class="w-7 h-7 rounded bg-cl-elevated flex items-center justify-center text-cl-muted">
                  <IconCode class="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 class="text-[11px] font-semibold text-cl-text mb-0.5">{$t('donate.cardCodeTitle')}</h3>
                  <p class="text-[10px] text-cl-dim">{$t('donate.cardCodeDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="border border-cl-border rounded bg-cl-surface p-4 sticky top-[calc(var(--navbar-height)+16px)]">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded bg-cl-base border border-cl-border flex items-center justify-center">
                <IconCoffee class="w-4 h-4 text-cl-text" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-cl-text">Ko-fi</h3>
                <p class="text-[10px] text-cl-muted">{$t("donate.impact")}</p>
              </div>
            </div>
            <a
              href="https://ko-fi.com/cubiclauncher"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-1.5 w-full bg-cl-text text-cl-accent-inverse px-4 py-2 font-medium text-xs rounded hover:opacity-90 transition-opacity"
            >
              <IconCoffee class="w-3.5 h-3.5" />
              {$t("donate.kofi")}
            </a>

            <div class="mt-4 pt-4 border-t border-cl-border">
              <p class="text-[11px] text-cl-muted mb-2">{$t("donate.supportDesc")}</p>
              <a
                href="https://github.com/CubicLauncherDevs"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-cl-border text-cl-text text-xs font-medium rounded hover:bg-cl-elevated hover:border-cl-border-hover transition-colors"
              >
                <IconGitHubLogo class="w-3.5 h-3.5" />
                {$t("donate.contribute")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
