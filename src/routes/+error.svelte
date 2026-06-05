<script lang="ts">
  import { page } from "$app/state";
  import { docsStructure } from "$lib/docs/structure";
</script>

<svelte:head>
  <title>{page.status === 404 ? "Página no encontrada" : "Error"} | CubicLauncher</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="pt-40 pb-32">
  <div class="container mx-auto px-6 max-w-3xl text-center">
    <h1 class="text-8xl font-black text-white/10 tracking-tighter">
      {page.status}
    </h1>
    <h2 class="text-2xl font-bold text-white mt-4">
      {page.status === 404 ? "Página no encontrada" : "Error"}
    </h2>
    <p class="text-neutral-400 mt-3 text-lg">
      {page.status === 404
        ? "La página que buscas no existe o fue movida."
        : "Ocurrió un error inesperado."}
    </p>

    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <a
        href="/"
        class="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
      >
        Volver al inicio
      </a>
      <a
        href="/docs"
        class="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
      >
        Documentación
      </a>
    </div>

    <div class="mt-16">
      <h3 class="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-6">
        Documentación
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-left max-w-xl mx-auto">
        {#each docsStructure as section}
          {#each section.items as item}
            <a
              href={item.slug ? `/docs/${item.slug}` : "/docs"}
              class="px-4 py-2.5 rounded-lg bg-white/5 border border-white/5 text-sm text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all"
            >
              {item.name}
            </a>
          {/each}
        {/each}
      </div>
    </div>
  </div>
</div>
