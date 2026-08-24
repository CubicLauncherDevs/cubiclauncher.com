<script lang="ts">
  import { currentLocale, setLocale } from './index';
  import { t } from '$lib/i18n';
  import IconGlobe from '~icons/ph/globe';
  import IconCheck from '~icons/ph/check';

  let isOpen = $state(false);
  let container = $state<HTMLDivElement | null>(null);

  const locales = [
    { code: 'es', label: 'ES', nameKey: 'language.spanish' },
    { code: 'en', label: 'EN', nameKey: 'language.english' },
    { code: 'fr', label: 'FR', nameKey: 'language.french' },
    { code: 'de', label: 'DE', nameKey: 'language.german' },
  ] as const;

  let current = $derived(locales.find(l => l.code === $currentLocale) || locales[0]);

  function toggle() {
    isOpen = !isOpen;
  }

  function close() {
    isOpen = false;
  }

  function select(code: string) {
    setLocale(code);
    close();
  }

  function handleClickOutside(event: MouseEvent) {
    if (container && !container.contains(event.target as Node)) {
      close();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') close();
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="relative" bind:this={container}>
  <button
    onclick={toggle}
    class="flex items-center gap-1 text-xs font-medium text-cl-muted hover:text-cl-text transition-colors"
    aria-label={$t('language.switchLanguage')}
    aria-expanded={isOpen}
  >
    <IconGlobe class="w-3.5 h-3.5" />
    <span>{current.label}</span>
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
      class="absolute right-0 top-full mt-1 bg-cl-surface border border-cl-border rounded overflow-hidden shadow-lg z-50 min-w-[150px]"
      role="menu"
    >
      {#each locales as loc}
        <button
          onclick={() => select(loc.code)}
          class="w-full flex items-center justify-between gap-3 text-left px-3 py-1.5 text-xs transition-colors {loc.code === current.code ? 'bg-cl-elevated text-cl-text' : 'text-cl-muted hover:text-cl-text hover:bg-cl-elevated'}"
          role="menuitem"
        >
          <span class="flex items-center gap-2">
            <span class="w-5 text-center font-medium">{loc.label}</span>
            <span>{$t(loc.nameKey)}</span>
          </span>
          {#if loc.code === current.code}
            <IconCheck class="w-3 h-3" />
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
