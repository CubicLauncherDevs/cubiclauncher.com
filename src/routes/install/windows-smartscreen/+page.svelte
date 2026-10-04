<script lang="ts">
  import { t } from "$lib/i18n";
  import IconArrowLeft from "~icons/ph/arrow-left";
  import IconArrowSquareOut from "~icons/ph/arrow-square-out";
  import IconGithubLogo from "~icons/ph/github-logo";
</script>

<svelte:head>
  <title>{$t("install.windowsWarning.pageTitle")}</title>
  <meta name="description" content={$t("install.windowsWarning.pageDescription")} />
</svelte:head>

<main class="bg-cl-base">
  <section class="py-8 sm:py-12">
    <div class="mx-auto max-w-3xl px-4 lg:px-6">
      <a
        href="/install"
        class="mb-6 inline-flex items-center gap-1.5 text-xs text-cl-muted transition-colors hover:text-cl-text"
      >
        <IconArrowLeft class="h-3.5 w-3.5" />
        {$t("install.windowsWarning.backToDownloads")}
      </a>

      <article>
        <header class="mb-8 border-b border-cl-border pb-6">
          <p class="mb-2 text-xs font-medium uppercase tracking-wider text-amber-400">
            Windows · SmartScreen
          </p>
          <h1 class="text-2xl font-semibold tracking-tight text-cl-text sm:text-3xl">
            {$t("install.windowsWarning.pageTitle")}
          </h1>
          <p class="mt-3 text-sm leading-relaxed text-cl-muted">
            {$t("install.windowsWarning.intro")}
          </p>
        </header>

        <div class="space-y-7 text-sm leading-relaxed text-cl-muted">
          <section>
            <h2 class="mb-2 text-base font-semibold text-cl-text">
              {$t("install.windowsWarning.publisherTitle")}
            </h2>
            <p>{$t("install.windowsWarning.publisherText")}</p>
          </section>

          <section>
            <h2 class="mb-2 text-base font-semibold text-cl-text">
              {$t("install.windowsWarning.smartScreenTitle")}
            </h2>
            <p>{$t("install.windowsWarning.smartScreenText")}</p>
          </section>

          <section class="rounded border border-cl-border bg-cl-surface p-4">
            <h2 class="mb-2 text-base font-semibold text-cl-text">
              {$t("install.windowsWarning.certificateTitle")}
            </h2>
            <p>{$t("install.windowsWarning.certificateText")}</p>
          </section>

          <section>
            <h2 class="mb-2 text-base font-semibold text-cl-text">
              {$t("install.windowsWarning.whatToDoTitle")}
            </h2>
            <ol class="list-decimal space-y-2 pl-5 marker:text-cl-text">
              <li>{$t("install.windowsWarning.stepOne")}</li>
              <li>{$t("install.windowsWarning.stepTwo")}</li>
              <li>{$t("install.windowsWarning.stepThree")}</li>
            </ol>
          </section>

          <section>
            <h2 class="mb-2 text-base font-semibold text-cl-text">
              {$t("install.windowsWarning.openSourceTitle")}
            </h2>
            <p>{$t("install.windowsWarning.openSourceText")}</p>
            <a
              href="https://github.com/CubicLauncherDevs/CubicLauncher"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-3 inline-flex items-center gap-2 font-medium text-cl-text underline decoration-cl-border underline-offset-4 hover:decoration-cl-text"
            >
              <IconGithubLogo class="h-4 w-4" />
              {$t("install.windowsWarning.viewSource")}
              <IconArrowSquareOut class="h-3.5 w-3.5" />
            </a>
          </section>
        </div>

        <a
          href="/install"
          class="mt-9 inline-flex items-center gap-2 rounded bg-cl-text px-4 py-2.5 text-xs font-medium text-cl-accent-inverse transition-opacity hover:opacity-90"
        >
          {$t("install.windowsWarning.backToDownloads")}
          <IconArrowLeft class="h-3.5 w-3.5 rotate-180" />
        </a>
      </article>
    </div>
  </section>
</main>
