<script lang="ts">
  import DocsSidebar from "./DocsSidebar.svelte";
  import { fade } from "svelte/transition";
  import { afterNavigate } from "$app/navigation";
  import { tick } from "svelte";

  let { children } = $props();
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
      copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copiar`;

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
      btn.innerHTML = "¡Copiado!";
      setTimeout(() => {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copiar`;
      }, 2000);
    });
  };

  afterNavigate(() => {
    tick().then(enhance);
  });
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
