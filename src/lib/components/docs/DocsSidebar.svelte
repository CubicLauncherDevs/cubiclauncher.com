<script lang="ts">
  import { page } from "$app/state";

  const menuItems = [
    {
      title: "Comenzando",
      items: [
        { name: "Introducción", href: "/docs" },
        { name: "Instalación", href: "/docs/install" },
      ],
    },
    {
      title: "Uso",
      items: [
        { name: "Gestión de Instancias", href: "/docs/instances" },
        { name: "Cuentas", href: "/docs/accounts" },
        { name: "Mods y Recursos", href: "/docs/mods" },
      ],
    },
    {
      title: "Avanzado",
      items: [
        { name: "Configuración", href: "/docs/config" },
        { name: "Logs y Debugging", href: "/docs/debug" },
      ],
    },
    {
      title: "Legal",
      items: [
        { name: "Privacidad", href: "/docs/privacy" },
        { name: "Términos de Uso", href: "/docs/terms" },
        { name: "Licencia", href: "/docs/license" },
      ],
    },
  ];

  interface Props {
    active?: boolean;
    onSelect?: (event: MouseEvent) => void;
  }

  let { active = false, onSelect = () => {} }: Props = $props();
</script>

<aside
  class="w-full md:w-64 flex-shrink-0 md:sticky md:top-24 md:h-[calc(100vh-6rem)] overflow-y-auto pr-4 pb-12 scrollbar-hide"
>
  <nav class="flex flex-col gap-8">
    {#each menuItems as section}
      <div class="flex flex-col gap-3">
        <h3
          class="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] px-2"
        >
          {section.title}
        </h3>
        <div class="flex flex-col gap-1">
          {#each section.items as item}
            <a
              href={item.href}
              onclick={onSelect}
              class="px-3 py-2 rounded-lg text-sm transition-all duration-200 {page
                .url.pathname === item.href
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

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
