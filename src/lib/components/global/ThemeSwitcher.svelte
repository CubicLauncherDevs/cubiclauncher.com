<script lang="ts">
  import { themeStore, type ThemeMode } from "$lib/stores/theme.svelte";
  import { t } from "$lib/i18n";
  import IconSun from "~icons/ph/sun";
  import IconMoon from "~icons/ph/moon";
  import IconMonitor from "~icons/ph/monitor";
  import IconCheck from "~icons/ph/check";

  let isOpen = $state(false);
  let container = $state<HTMLDivElement | null>(null);

  const modes: { mode: ThemeMode; labelKey: string; Icon: typeof IconSun }[] = [
    { mode: "light", labelKey: "theme.light", Icon: IconSun },
    { mode: "dark", labelKey: "theme.dark", Icon: IconMoon },
    { mode: "system", labelKey: "theme.system", Icon: IconMonitor },
  ];

  let current = $derived(modes.find((m) => m.mode === themeStore.mode) ?? modes[2]);

  function toggle() {
    isOpen = !isOpen;
  }

  function close() {
    isOpen = false;
  }

  function select(mode: ThemeMode) {
    themeStore.set(mode);
    isOpen = false;
  }

  function handleClickOutside(event: MouseEvent) {
    if (container && !container.contains(event.target as Node)) {
      close();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") close();
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="relative" bind:this={container}>
  <button
    onclick={toggle}
    class="flex items-center gap-1 text-xs font-medium text-cl-muted hover:text-cl-text transition-colors"
    aria-label={$t("theme.switchTheme")}
    aria-expanded={isOpen}
  >
    {#if themeStore.resolved === "dark"}
      <IconMoon class="w-3.5 h-3.5" />
    {:else}
      <IconSun class="w-3.5 h-3.5" />
    {/if}
    <svg
      class="w-3 h-3 transition-transform {isOpen ? 'rotate-180' : ''}"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {#if isOpen}
    <div
      class="absolute right-0 top-full mt-1 bg-cl-surface border border-cl-border rounded overflow-hidden shadow-lg z-50 min-w-[140px]"
      role="menu"
    >
      {#each modes as { mode, labelKey, Icon }}
        <button
          onclick={() => select(mode)}
          class="w-full flex items-center justify-between gap-3 text-left px-3 py-1.5 text-xs transition-colors {mode === current.mode ? 'bg-cl-elevated text-cl-text' : 'text-cl-muted hover:text-cl-text hover:bg-cl-elevated'}"
          role="menuitem"
        >
          <span class="flex items-center gap-2">
            <Icon class="w-3.5 h-3.5" />
            {$t(labelKey)}
          </span>
          {#if mode === current.mode}
            <IconCheck class="w-3 h-3" />
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
