<script lang="ts">
  import { currentLocale } from './index';
  import { setLocale } from './index';

  let isOpen = $state(false);

  const locales = [
    { code: 'es', label: 'ES', name: 'Español' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'de', label: 'DE', name: 'Deutsch' },
  ];

  let current = $derived(locales.find(l => l.code === $currentLocale) || locales[0]);

  function toggle() {
    isOpen = !isOpen;
  }

  function select(code: string) {
    setLocale(code);
    isOpen = false;
  }
</script>

<div class="relative">
  <button
    onclick={toggle}
    class="flex items-center gap-1 text-xs font-medium text-cl-muted hover:text-cl-text transition-colors"
    aria-label="Switch language"
  >
    {current.label}
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
    <div class="absolute right-0 top-full mt-1 bg-cl-surface border border-cl-border rounded overflow-hidden shadow-lg shadow-black/20 z-50 min-w-[120px]">
      {#each locales as loc}
        <button
          onclick={() => select(loc.code)}
          class="w-full text-left px-3 py-1.5 text-xs transition-colors {loc.code === current.code ? 'bg-cl-elevated text-cl-text' : 'text-cl-muted hover:text-cl-text hover:bg-cl-elevated'}"
        >
          {loc.name}
        </button>
      {/each}
    </div>
  {/if}
</div>
