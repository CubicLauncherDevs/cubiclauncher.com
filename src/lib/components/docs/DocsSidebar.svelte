<script lang="ts">
  import { page } from "$app/state";
  import { docsStructure } from "$lib/docs/structure";

  interface Props {
    active?: boolean;
    onSelect?: (event: MouseEvent) => void;
  }

  let { active = false, onSelect = () => {} }: Props = $props();
</script>

<aside
  class="w-full"
>
  <nav class="flex flex-col gap-8">
    {#each docsStructure as section}
      <div class="flex flex-col gap-3">
        <h3
          class="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] px-2"
        >
          {section.title}
        </h3>
        <div class="flex flex-col gap-1">
          {#each section.items as item}
            <a
              href={item.slug ? `/docs/${item.slug}` : "/docs"}
              onclick={onSelect}
              class="px-3 py-2 rounded-lg text-sm transition-all duration-200 {page
                .url.pathname === (item.slug ? `/docs/${item.slug}` : "/docs")
                ? 'bg-white/5 text-white font-medium'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'}"
            >
              {item.name}
            </a>
          {/each}
        </div>
      </div>
    {/each}
  </nav>
</aside>
