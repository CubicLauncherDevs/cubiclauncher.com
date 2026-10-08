<script lang="ts">
  import { t } from "$lib/i18n";
  import IconArrowLeft from "~icons/ph/arrow-left";
  import IconArrowSquareOut from "~icons/ph/arrow-square-out";
  import IconGithubLogo from "~icons/ph/github-logo";

  const sources = [
    {
      href: "https://github.com/tauri-apps/tauri/issues/4749",
      label: "tauri-apps/tauri · Issue #4749 · MSI and <app>.exe false positives on anti-virus apps",
      textKey: "install.virusTotalWarning.src4749Text",
    },
    {
      href: "https://github.com/tauri-apps/tauri/issues/2486",
      label: "tauri-apps/tauri · Issue #2486 · [Windows] Trojan alert from windows defender and other anti-virus providers",
      textKey: "install.virusTotalWarning.src2486Text",
    },
    {
      href: "https://github.com/tauri-apps/tauri/issues/10649",
      label: "tauri-apps/tauri · Issue #10649 · [bug] flagged as viruses by Windows Defender",
      textKey: "install.virusTotalWarning.src10649Text",
    },
    {
      href: "https://v2.tauri.app/distribute/sign/windows/",
      label: "Tauri Docs · Windows Code Signing",
      textKey: "install.virusTotalWarning.srcDocsText",
    },
  ];
</script>

<svelte:head>
  <title>{$t("install.virusTotalWarning.pageTitle")}</title>
  <meta name="description" content={$t("install.virusTotalWarning.pageDescription")} />
</svelte:head>

<main class="bg-cl-base">
  <section class="py-8 sm:py-12">
    <div class="mx-auto max-w-3xl px-4 lg:px-6">
      <a
        href="/install"
        class="mb-6 inline-flex items-center gap-1.5 text-xs text-cl-muted transition-colors hover:text-cl-text"
      >
        <IconArrowLeft class="h-3.5 w-3.5" />
        {$t("install.virusTotalWarning.backToDownloads")}
      </a>

      <article>
        <header class="mb-8 border-b border-cl-border pb-6">
          <p class="mb-2 text-xs font-medium uppercase tracking-wider text-amber-400">
            VirusTotal · Falsos positivos
          </p>
          <h1 class="text-2xl font-semibold tracking-tight text-cl-text sm:text-3xl">
            {$t("install.virusTotalWarning.pageTitle")}
          </h1>
          <p class="mt-3 text-sm leading-relaxed text-cl-muted">
            {$t("install.virusTotalWarning.intro")}
          </p>
        </header>

        <div class="space-y-7 text-sm leading-relaxed text-cl-muted">
          <section>
            <h2 class="mb-2 text-base font-semibold text-cl-text">
              {$t("install.virusTotalWarning.whatTitle")}
            </h2>
            <p>{$t("install.virusTotalWarning.whatText")}</p>
          </section>

          <section>
            <h2 class="mb-2 text-base font-semibold text-cl-text">
              {$t("install.virusTotalWarning.whyTitle")}
            </h2>
            <p>{$t("install.virusTotalWarning.whyText")}</p>
          </section>

          <section class="rounded border border-cl-border bg-cl-surface p-4">
            <h2 class="mb-2 text-base font-semibold text-cl-text">
              {$t("install.virusTotalWarning.sourcesTitle")}
            </h2>
            <p>{$t("install.virusTotalWarning.sourcesText")}</p>
            <ul class="mt-4 space-y-4">
              {#each sources as source}
                <li>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-start gap-2 font-medium text-cl-text underline decoration-cl-border underline-offset-4 hover:decoration-cl-text"
                  >
                    <span class="min-w-0 break-words">{source.label}</span>
                    <IconArrowSquareOut class="mt-1 h-3.5 w-3.5 shrink-0" />
                  </a>
                  <p class="mt-1 text-xs leading-relaxed text-cl-muted">
                    {$t(source.textKey)}
                  </p>
                </li>
              {/each}
            </ul>
          </section>

          <section>
            <h2 class="mb-2 text-base font-semibold text-cl-text">
              {$t("install.virusTotalWarning.whatToDoTitle")}
            </h2>
            <ol class="list-decimal space-y-2 pl-5 marker:text-cl-text">
              <li>{$t("install.virusTotalWarning.stepOne")}</li>
              <li>{$t("install.virusTotalWarning.stepTwo")}</li>
              <li>{$t("install.virusTotalWarning.stepThree")}</li>
            </ol>
          </section>

          <section>
            <h2 class="mb-2 text-base font-semibold text-cl-text">
              {$t("install.virusTotalWarning.openSourceTitle")}
            </h2>
            <p>{$t("install.virusTotalWarning.openSourceText")}</p>
            <a
              href="https://github.com/CubicLauncherDevs/CubicLauncher"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-3 inline-flex items-center gap-2 font-medium text-cl-text underline decoration-cl-border underline-offset-4 hover:decoration-cl-text"
            >
              <IconGithubLogo class="h-4 w-4" />
              {$t("install.virusTotalWarning.viewSource")}
              <IconArrowSquareOut class="h-3.5 w-3.5" />
            </a>
          </section>
        </div>

        <a
          href="/install"
          class="mt-9 inline-flex items-center gap-2 rounded bg-cl-text px-4 py-2.5 text-xs font-medium text-cl-accent-inverse transition-opacity hover:opacity-90"
        >
          {$t("install.virusTotalWarning.backToDownloads")}
          <IconArrowLeft class="h-3.5 w-3.5 rotate-180" />
        </a>
      </article>
    </div>
  </section>
</main>
