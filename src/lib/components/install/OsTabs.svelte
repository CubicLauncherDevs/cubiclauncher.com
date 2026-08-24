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
  class="flex border border-cl-border bg-cl-surface rounded overflow-hidden"
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
      class="relative flex-1 flex items-center justify-center gap-2 py-2 px-2 text-xs font-medium transition-colors {active
        ? 'bg-cl-elevated text-cl-text border-b border-cl-text'
        : 'text-cl-muted hover:text-cl-text hover:bg-cl-elevated'}"
    >
      <tab.Icon class="w-4 h-4" />
      <span>{$t(tab.nameKey)}</span>
      <span class="text-[10px] text-cl-dim hidden sm:inline">
        {formatCount(totals[tab.id])}
      </span>
    </button>
  {/each}
</div>
