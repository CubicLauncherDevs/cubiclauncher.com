<script lang="ts">
  import { tick } from "svelte";
  import { afterNavigate } from "$app/navigation";

  interface Heading {
    level: number;
    text: string;
    id: string;
  }

  let headings = $state<Heading[]>([]);
  let activeId = $state('');

  function updateHeadings() {
    tick().then(() => {
      const els = document.querySelectorAll<HTMLElement>('.prose h2, .prose h3');
      const found: Heading[] = [];
      els.forEach(el => {
        const level = el.tagName === 'H2' ? 2 : 3;
        const text = el.textContent || '';
        const id = el.id || text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        el.id = id;
        found.push({ level, text, id });
      });
      headings = found;
    });
  }

  afterNavigate(updateHeadings);

  $effect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  });
</script>

{#if headings.length > 1}
  <nav class="sticky top-24">
    <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-4 px-3">
      En esta página
    </h3>
    <div class="flex flex-col gap-0.5">
      {#each headings as heading}
        <a
          href="#{heading.id}"
          class="block text-sm py-1.5 px-3 border-l-2 transition-all duration-200 {heading.level === 3 ? 'ml-3' : ''} {activeId === heading.id ? 'text-white border-white bg-white/5' : 'text-neutral-500 border-transparent hover:text-neutral-300 hover:border-neutral-500'}"
        >
          {heading.text}
        </a>
      {/each}
    </div>
  </nav>
{/if}
