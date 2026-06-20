<script lang="ts">
  import { goto } from "$app/navigation";
  import { t } from "$lib/i18n";

  interface DocIndexEntry {
    title: string;
    slug: string;
    category: string;
    content: string;
  }

  let { docsIndex }: { docsIndex: DocIndexEntry[] } = $props();

  let query = $state('');
  let isOpen = $state(false);
  let selectedIndex = $state(-1);
  let inputEl: HTMLInputElement | undefined = $state();

  function escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function getSnippet(content: string, terms: string[]): string {
    const lower = content.toLowerCase();
    let firstIdx = -1;
    for (const term of terms) {
      const idx = lower.indexOf(term);
      if (idx !== -1 && (firstIdx === -1 || idx < firstIdx)) {
        firstIdx = idx;
      }
    }
    if (firstIdx === -1) return content.substring(0, 150) + '…';

    const start = Math.max(0, firstIdx - 50);
    const end = Math.min(content.length, firstIdx + 120);
    let snippet = content.substring(start, end);
    if (start > 0) snippet = '…' + snippet;
    if (end < content.length) snippet = snippet + '…';
    return snippet;
  }

  function highlightText(text: string, terms: string[]): string {
    let result = text;
    for (const term of terms) {
      const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
      result = result.replace(regex, '<mark class="bg-yellow-500/20 text-yellow-300 rounded px-0.5">$1</mark>');
    }
    return result;
  }

  const filtered = $derived.by(() => {
    if (!query.trim()) return [];
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];

    return docsIndex
      .map(entry => {
        const titleLower = entry.title.toLowerCase();
        const categoryLower = entry.category.toLowerCase();
        const contentLower = entry.content.toLowerCase();

        let matchedTerms = 0;
        for (const term of terms) {
          if (titleLower.includes(term) || categoryLower.includes(term) || contentLower.includes(term)) {
            matchedTerms++;
          }
        }

        if (matchedTerms < terms.length) return { ...entry, score: 0, snippet: '' };

        const titleScore = terms.filter(t => titleLower.includes(t)).length * 10;
        const categoryScore = terms.filter(t => categoryLower.includes(t)).length * 5;
        const contentScore = terms.filter(t => contentLower.includes(t)).length * 1;
        const exactTitleBonus = titleLower.includes(query.toLowerCase()) ? 20 : 0;

        const rawSnippet = getSnippet(entry.content, terms);
        const snippet = highlightText(rawSnippet, terms);

        return {
          ...entry,
          score: titleScore + categoryScore + contentScore + exactTitleBonus,
          snippet,
          highlightedTitle: highlightText(entry.title, terms),
          highlightedCategory: highlightText(entry.category, terms),
        };
      })
      .filter((e): e is typeof e & { highlightedTitle: string; highlightedCategory: string } => e.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  });

  function onInput() {
    selectedIndex = -1;
    isOpen = true;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      navigate(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      isOpen = false;
      inputEl?.blur();
    }
  }

  function navigate(entry: (typeof filtered)[number]) {
    isOpen = false;
    query = '';
    goto(`/docs/${entry.slug}`);
  }

  function onBlur() {
    setTimeout(() => { isOpen = false; }, 200);
  }

  $effect(() => {
    function onKeydownGlobal(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputEl?.focus();
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        e.preventDefault();
        inputEl?.focus();
      }
    }
    document.addEventListener('keydown', onKeydownGlobal);
    return () => document.removeEventListener('keydown', onKeydownGlobal);
  });
</script>

<div class="relative" role="combobox" aria-expanded={isOpen} aria-haspopup="listbox" aria-controls="search-results">
  <div class="relative">
    <svg
      class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
    <input
      bind:this={inputEl}
      type="text"
       placeholder={$t('docs.searchPlaceholder')}
       bind:value={query}
       oninput={onInput}
       onkeydown={onKeydown}
       onfocus={() => { if (query) isOpen = true; }}
       onblur={onBlur}
       aria-label={$t('docs.searchLabel')}
      aria-autocomplete="list"
      aria-controls="search-results"
      class="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
    />
    <kbd class="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] text-neutral-600 border border-white/5 rounded-md px-1.5 py-0.5 pointer-events-none">
      <span class="text-xs">⌘</span>K
    </kbd>
  </div>

  {#if isOpen && filtered.length > 0}
    <div id="search-results" role="listbox" class="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
      <div class="px-4 pt-2 pb-1 text-[10px] font-bold text-neutral-600 uppercase tracking-wider">
        {$t('docs.results', { values: { count: filtered.length } })}
      </div>
      {#each filtered as entry, i}
        <button
          onclick={() => navigate(entry)}
          onmouseenter={() => (selectedIndex = i)}
          role="option"
          aria-selected={i === selectedIndex}
          class="w-full text-left px-4 py-3 transition-colors {i === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'}"
        >
          <div class="text-sm font-medium text-white">
            {@html entry.highlightedTitle}
          </div>
          <div class="text-xs text-neutral-500 mt-0.5">
            {@html entry.highlightedCategory}
          </div>
          {#if entry.snippet}
            <div class="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
              {@html entry.snippet}
            </div>
          {/if}
        </button>
      {/each}
    </div>
  {/if}

  {#if isOpen && query && filtered.length === 0}
    <div class="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-white/10 rounded-xl p-4 shadow-2xl z-50">
      <p class="text-sm text-neutral-400">{$t('docs.noResults', { values: { query } })}</p>
    </div>
  {/if}
</div>
