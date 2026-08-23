<script lang="ts">
  import { page } from "$app/state";
  import { t } from "$lib/i18n";
</script>

<svelte:head>
  <title>{page.status === 404 ? $t('error.notFoundTitle') : $t('error.errorTitle')} | CubicLauncher</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="pt-[calc(var(--navbar-height)+64px)] pb-16">
  <div class="mx-auto px-4 lg:px-6 text-center" style="max-width: var(--discord-max-width);">
    <h1 class="text-6xl font-semibold text-cl-border-hover tracking-tight">
      {page.status}
    </h1>
    <h2 class="text-lg font-semibold text-white mt-2">
      {page.status === 404 ? $t('error.notFoundTitle') : $t('error.errorTitle')}
    </h2>
    <p class="text-cl-muted mt-1 text-xs">
      {page.status === 404
        ? $t('error.notFoundDescription')
        : $t('error.errorDescription')}
    </p>

    <div class="mt-5 flex flex-wrap justify-center gap-2">
      <a
        href="/"
        class="px-4 py-2 bg-cl-surface border border-cl-border rounded text-xs font-medium text-cl-text hover:bg-cl-elevated transition-colors"
      >
        {$t('error.backToHome')}
      </a>
      <a
        href="https://dev.cubiclauncher.org/docs"
        class="px-4 py-2 bg-cl-surface border border-cl-border rounded text-xs font-medium text-cl-text hover:bg-cl-elevated transition-colors"
      >
        {$t('error.documentation')}
      </a>
    </div>
  </div>
</div>
