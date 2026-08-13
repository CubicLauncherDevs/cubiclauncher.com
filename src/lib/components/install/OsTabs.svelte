<script lang="ts">
  import { t } from "$lib/i18n";
  import type { PlatformId } from "$lib/utils/install";
  import IconWindows from "~icons/simple-icons/windows";
  import IconLinux from "~icons/simple-icons/linux";
  import IconApple from "~icons/simple-icons/apple";

  interface Props {
    selected: PlatformId;
    totals: Record<PlatformId, number>;
    onSelect: (os: PlatformId) => void;
  }

  let { selected, totals, onSelect }: Props = $props();

  const tabs = [
    {
      id: "windows" as const,
      nameKey: "install.platforms.windows",
      Icon: IconWindows,
    },
    {
      id: "linux" as const,
      nameKey: "install.platforms.linux",
      Icon: IconLinux,
    },
    {
      id: "macos" as const,
      nameKey: "install.platforms.macos",
      Icon: IconApple,
    },
  ];

  function formatCount(n: number): string {
    return n.toLocaleString();
  }
</script>

<div
  class="flex p-1 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm"
  role="tablist"
  aria-label={$t("install.choosePlatform")}
>
  {#each tabs as tab}
    {@const active = selected === tab.id}
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onclick={() => onSelect(tab.id)}
      class="relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 {active
        ? 'text-black'
        : 'text-neutral-400 hover:text-white'}"
    >
      {#if active}
        <span
          class="absolute inset-0 bg-white rounded-xl shadow-sm"
          aria-hidden="true"
        ></span>
      {/if}
      <span class="relative z-10 flex items-center gap-2">
        <tab.Icon class="w-5 h-5" />
        <span>{$t(tab.nameKey)}</span>
      </span>
      <span
        class="relative z-10 text-[10px] font-medium opacity-70 {active
          ? 'text-black/60'
          : 'text-neutral-500'}"
      >
        {formatCount(totals[tab.id])}
        {$t("install.downloads")}
      </span>
    </button>
  {/each}
</div>
