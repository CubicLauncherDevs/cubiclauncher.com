<script lang="ts">
  import DocsSidebar from "./DocsSidebar.svelte";
  import { fade } from "svelte/transition";

  let { children } = $props();
  let isMobileMenuOpen = $state(false);

  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;
  };
</script>

<div class="pt-32 pb-24">
  <div class="container mx-auto px-6 max-w-7xl">
    <div class="flex flex-col md:flex-row gap-12">
      <!-- Desktop Sidebar -->
      <div class="hidden md:block w-64 shrink-0">
        <DocsSidebar />
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
        Menú de Documentación
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
              aria-label="Cerrar menú"
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

      <!-- Main Content -->
      <main class="flex-1 min-w-0">
        <div class="prose prose-invert prose-neutral max-w-none">
          {@render children()}
        </div>
      </main>
    </div>
  </div>
</div>
