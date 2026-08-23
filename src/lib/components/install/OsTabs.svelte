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
  class="flex border border-white/10 bg-neutral-900 rounded-[4px] overflow-hidden"
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
      class="relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 text-[13px] font-medium transition-colors {active
        ? 'bg-white text-black'
        : 'text-neutral-400 hover:text-white hover:bg-white/5'}"
    >
      <span class="relative z-10 flex items-center gap-2">
        <tab.Icon class="w-5 h-5" />
        <span>{$t(tab.nameKey)}</span>
      </span>
      <span
        class="relative z-10 text-[11px] opacity-70"
      >
        {formatCount(totals[tab.id])}
        {$t("install.downloads")}
      </span>
    </button>
  {/each}
</div>
