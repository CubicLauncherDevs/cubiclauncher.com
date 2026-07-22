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

<section class="py-24 border-y border-white/5 bg-neutral-900/20">
  <div class="container mx-auto px-6 max-w-5xl text-center">
    <h2 class="text-4xl md:text-5xl font-black tracking-tighter mb-4">
      {$t('home.quickStartTitle')}
    </h2>
    <p class="text-neutral-400 text-lg font-light max-w-2xl mx-auto mb-12">
      {$t('home.quickStartSubtitle')}
    </p>

    <div
      class="inline-flex flex-col md:flex-row items-stretch border border-white/10 rounded-2xl overflow-hidden"
    >
      {#each platforms as platform}
        {@const nameKey = `install.platforms.${platform.key}`}
        <a
          href="/install"
          class="group flex items-center justify-center md:justify-start gap-3 px-8 py-5 hover:bg-white/5 transition-colors border-b md:border-b-0 md:border-r border-white/10 last:border-0"
        >
          <span class="text-neutral-400 group-hover:text-white transition-colors">
            <platform.Icon class="w-5 h-5" />
          </span>
          <span
            class="text-sm font-bold uppercase tracking-[0.15em] text-white"
          >
            {$t(nameKey)}
          </span>
        </a>
      {/each}
    </div>
  </div>
</section>
