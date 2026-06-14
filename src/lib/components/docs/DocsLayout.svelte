<script lang="ts">
  import DocsSidebar from "./DocsSidebar.svelte";
  import DocSearch from "./DocSearch.svelte";
  import TableOfContents from "./TableOfContents.svelte";
  import { t } from "$lib/i18n";
  import { get } from "svelte/store";
  import { fade } from "svelte/transition";
  import { afterNavigate } from "$app/navigation";
  import { tick } from "svelte";

  interface DocIndexEntry {
    title: string;
    slug: string;
    category: string;
    content: string;
  }

  interface DocItem {
    name: string;
    nameKey: string;
    slug: string;
  }

  let {
    children,
    docsIndex = [],
    prev = null,
    next = null,
  }: {
    children: any;
    docsIndex: DocIndexEntry[];
    prev: DocItem | null;
    next: DocItem | null;
  } = $props();

  let isMobileMenuOpen = $state(false);
  let listenerAdded = $state(false);

  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;
  };

  function enhance() {
    const prose = document.querySelector(".prose");
    if (!prose) return;

    if (!listenerAdded) {
      prose.addEventListener("click", handleCopy);
      listenerAdded = true;
    }

    prose.querySelectorAll<HTMLPreElement>(
      "pre[class^='language-']:not(.enhanced), pre[class*=' language-']:not(.enhanced)"
    ).forEach((pre) => {
      pre.classList.add("enhanced");

      const match = pre.className.match(/language-(\w+)/);
      const lang = match ? match[1] : "text";

      const wrapper = document.createElement("div");
      wrapper.className = "code-block";

      const header = document.createElement("div");
      header.className = "code-block-header";
      header.dataset.lang = lang;

      const langSpan = document.createElement("span");
      langSpan.className = "code-block-lang";
      langSpan.textContent = lang;

      const copyBtn = document.createElement("button");
      copyBtn.className = "code-block-copy";
      copyBtn.dataset.copy = "";
      const copyLabel = get(t)('docs.copy');
      copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>${copyLabel}`;

      header.appendChild(langSpan);
      header.appendChild(copyBtn);

      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }

  const handleCopy = (e: Event) => {
    const target = (e.target as HTMLElement).closest("[data-copy]");
    if (!target) return;

    const block = target.closest(".code-block");
    if (!block) return;

    const code = block.querySelector("pre code");
    if (!code) return;

    const text = code.textContent || "";

    navigator.clipboard.writeText(text).then(() => {
      const btn = target as HTMLButtonElement;
      btn.innerHTML = get(t)('docs.copied');
      setTimeout(() => {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>${get(t)('docs.copy')}`;
      }, 2000);
    });
  };

  afterNavigate(() => {
    tick().then(enhance);
  });
</script>

<div class="pt-32 pb-24">
  <div class="container mx-auto px-6 max-w-7xl">
    <div class="flex flex-col lg:flex-row gap-12">
      <!-- Desktop Sidebar -->
      <div class="hidden md:block w-64 shrink-0">
        <div class="sticky top-24 flex flex-col max-h-[calc(100vh-6rem)]">
          <DocSearch {docsIndex} />
          <div class="mt-6 flex-1 overflow-y-auto pr-2 -mr-2 pb-4 scrollbar-hide">
            <DocsSidebar />
          </div>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
        onclick={toggleMobileMenu}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><line x1="3" y1="12" x2="21" y2="12"></line><line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
          ></line><line x1="3" y1="18" x2="21" y2="18"></line></svg
        >
        {$t('docs.mobileMenu')}
      </button>

      <!-- Mobile Sidebar Overlay -->
      {#if isMobileMenuOpen}
        <div
          class="fixed inset-0 z-100 bg-neutral-950/90 backdrop-blur-md p-8 md:hidden"
          transition:fade={{ duration: 200 }}
        >
          <div class="flex justify-end mb-8">
            <button
              class="p-2 text-neutral-400 hover:text-white"
              onclick={toggleMobileMenu}
              aria-label={$t('docs.closeMenu')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><line x1="18" y1="6" x2="6" y2="18"></line><line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                ></line></svg
              >
            </button>
          </div>
          <DocsSidebar onSelect={() => (isMobileMenuOpen = false)} />
        </div>
      {/if}

      <!-- Content + TOC wrapper -->
      <div class="flex-1 min-w-0 flex flex-col lg:flex-row gap-12">
        <!-- Main Content -->
        <main class="flex-1 min-w-0">
          <div class="prose prose-invert prose-neutral max-w-none">
            {@render children()}
          </div>

          {#if prev || next}
            <div class="mt-16 pt-8 border-t border-white/10 flex justify-between items-start">
              {#if prev}
                <a
                  href={prev.slug ? `/docs/${prev.slug}` : "/docs"}
                  class="group flex flex-col gap-1 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <span class="text-xs text-neutral-500">{$t('docs.prev')}</span>
                  <span class="text-sm text-white group-hover:text-neutral-200 transition-colors">{$t(prev.nameKey)}</span>
                </a>
              {:else}
                <div></div>
              {/if}
              {#if next}
                <a
                  href={next.slug ? `/docs/${next.slug}` : "/docs"}
                  class="group flex flex-col gap-1 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-right"
                >
                  <span class="text-xs text-neutral-500">{$t('docs.next')}</span>
                  <span class="text-sm text-white group-hover:text-neutral-200 transition-colors">{$t(next.nameKey)}</span>
                </a>
              {:else}
                <div></div>
              {/if}
            </div>
          {/if}
        </main>

        <!-- Table of Contents (Desktop) -->
        <div class="hidden lg:block w-56 shrink-0">
          <TableOfContents />
        </div>
      </div>
    </div>
  </div>
</div>
