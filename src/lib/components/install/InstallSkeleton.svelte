<section class="py-12">
  <div class="mx-auto px-6 lg:px-8" style="max-width: var(--discord-max-width);">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each Array.from({ length: 5 }) as _}
        <div
          class="animate-pulse h-40 rounded-lg bg-neutral-900/40 border border-white/10"
        ></div>
      {/each}
    </div>
  </div>
</section>
