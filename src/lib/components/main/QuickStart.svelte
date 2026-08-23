<script lang="ts">
  import { t } from "$lib/i18n";
  import IconWindows from "~icons/simple-icons/windows";
  import IconLinux from "~icons/simple-icons/linux";
  import IconApple from "~icons/simple-icons/apple";

  const platforms = [
    { key: "windows", Icon: IconWindows },
    { key: "linux", Icon: IconLinux },
    { key: "macos", Icon: IconApple },
  ];
</script>

<section class="py-12 bg-neutral-900/30 border-y border-white/5">
  <div class="mx-auto px-6 lg:px-8 text-center" style="max-width: var(--discord-max-width);">
    <h2 class="text-[20px] sm:text-[24px] font-semibold tracking-tight text-white mb-2">
      {$t('home.quickStartTitle')}
    </h2>
    <p class="text-[13px] text-neutral-400 max-w-2xl mx-auto mb-6">
      {$t('home.quickStartSubtitle')}
    </p>

    <div
      class="inline-flex flex-wrap items-stretch justify-center border border-white/10 rounded-[4px] overflow-hidden bg-neutral-950"
    >
      {#each platforms as platform}
        {@const nameKey = `install.platforms.${platform.key}`}
        <a
          href="/install"
          class="group flex items-center justify-center gap-2 px-5 py-3 hover:bg-white/5 transition-colors border-b md:border-b-0 md:border-r border-white/10 last:border-0"
        >
          <span class="text-neutral-400 group-hover:text-white transition-colors">
            <platform.Icon class="w-4 h-4" />
          </span>
          <span class="text-[13px] font-medium text-white">
            {$t(nameKey)}
          </span>
        </a>
      {/each}
    </div>
  </div>
</section>
