<section class="py-16">
  <div class="container mx-auto px-6 max-w-6xl">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each Array.from({ length: 5 }) as _}
        <div
          class="animate-pulse h-44 rounded-2xl bg-neutral-900/40 border border-white/10"
        ></div>
      {/each}
    </div>
  </div>
</section>
