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
    class="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
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
    <div class="absolute right-0 mt-2 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 min-w-32.5">
      {#each locales as loc}
        <button
          onclick={() => select(loc.code)}
          class="w-full text-left px-4 py-2.5 text-sm transition-colors {loc.code === current.code ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'}"
        >
          {loc.name}
        </button>
      {/each}
    </div>
  {/if}
</div>
