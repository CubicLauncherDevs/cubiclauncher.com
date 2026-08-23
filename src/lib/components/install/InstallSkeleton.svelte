<section class="py-6">
  <div class="border border-cl-border rounded bg-cl-surface overflow-hidden animate-pulse">
    {#each Array.from({ length: 5 }) as _}
      <div class="h-14 border-b border-cl-border last:border-0 bg-cl-surface"></div>
    {/each}
  </div>
</section>
