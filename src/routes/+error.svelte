<script lang="ts">
  import { page } from "$app/state";
  import { t } from "$lib/i18n";
</script>

<svelte:head>
  <title>{page.status === 404 ? $t('error.notFoundTitle') : $t('error.errorTitle')} | CubicLauncher</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="pt-[calc(var(--discord-nav-height)+80px)] pb-32">
  <div class="mx-auto px-6 lg:px-8 text-center" style="max-width: var(--discord-max-width);">
    <h1 class="text-7xl font-semibold text-white/10 tracking-tight">
      {page.status}
    </h1>
    <h2 class="text-xl font-semibold text-white mt-3">
      {page.status === 404 ? $t('error.notFoundTitle') : $t('error.errorTitle')}
    </h2>
    <p class="text-neutral-400 mt-2 text-[15px]">
      {page.status === 404
        ? $t('error.notFoundDescription')
        : $t('error.errorDescription')}
    </p>

    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a
        href="/"
        class="px-5 py-2.5 bg-white/5 border border-white/10 rounded-[4px] text-[13px] font-medium text-white hover:bg-white/10 transition-colors"
      >
        {$t('error.backToHome')}
      </a>
      <a
        href="https://dev.cubiclauncher.org/docs"
        class="px-5 py-2.5 bg-white/5 border border-white/10 rounded-[4px] text-[13px] font-medium text-white hover:bg-white/10 transition-colors"
      >
        {$t('error.documentation')}
      </a>
    </div>
  </div>
</div>
