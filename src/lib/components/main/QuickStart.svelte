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

<section class="py-8 bg-cl-elevated border-y border-cl-border">
  <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      <div>
        <h2 class="text-lg font-semibold text-cl-text mb-0.5">
          {$t('home.quickStartTitle')}
        </h2>
        <p class="text-xs text-cl-muted">
          {$t('home.quickStartSubtitle')}
        </p>
      </div>
    </div>

    <div
      class="inline-flex flex-wrap items-stretch justify-center border border-cl-border rounded bg-cl-base overflow-hidden"
    >
      {#each platforms as platform}
        {@const nameKey = `install.platforms.${platform.key}`}
        <a
          href="/install"
          class="group flex items-center justify-center gap-1.5 px-4 py-2 hover:bg-cl-elevated transition-colors border-b md:border-b-0 md:border-r border-cl-border last:border-0"
        >
          <span class="text-cl-dim group-hover:text-cl-text transition-colors">
            <platform.Icon class="w-3.5 h-3.5" />
          </span>
          <span class="text-xs font-medium text-cl-text">
            {$t(nameKey)}
          </span>
        </a>
      {/each}
    </div>
  </div>
</section>
