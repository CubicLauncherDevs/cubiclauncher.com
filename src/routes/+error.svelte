<script lang="ts">
  import { page } from "$app/state";
  import { t } from "$lib/i18n";
</script>

<svelte:head>
  <title>{page.status === 404 ? $t('error.notFoundTitle') : $t('error.errorTitle')} | CubicLauncher</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="pt-40 pb-32">
  <div class="container mx-auto px-6 max-w-3xl text-center">
    <h1 class="text-8xl font-black text-white/10 tracking-tighter">
      {page.status}
    </h1>
    <h2 class="text-2xl font-bold text-white mt-4">
      {page.status === 404 ? $t('error.notFoundTitle') : $t('error.errorTitle')}
    </h2>
    <p class="text-neutral-400 mt-3 text-lg">
      {page.status === 404
        ? $t('error.notFoundDescription')
        : $t('error.errorDescription')}
    </p>

    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <a
        href="/"
        class="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
      >
        {$t('error.backToHome')}
      </a>
      <a
        href="https://dev.cubiclauncher.org/docs"
        class="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
      >
        {$t('error.documentation')}
      </a>
    </div>
  </div>
</div>
