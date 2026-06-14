<script lang="ts">
  import { developers } from "$lib/data/developers";
  import { t } from "$lib/i18n";
</script>

<section class="py-24">
  <div class="container mx-auto px-6 max-w-6xl">
    <div class="text-center mb-16">
      <h2
        class="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase"
      >
        {$t('developers.title')}
      </h2>
      <p class="text-neutral-400 max-w-xl mx-auto font-light">
        {$t('developers.description')}
      </p>
    </div>

    <div class="flex flex-wrap justify-center gap-8">
      {#each developers as dev}
        <div
          class="group w-72 bg-neutral-900/50 border border-white/5 rounded-2xl p-8 text-center hover:bg-neutral-900/80 hover:border-white/10 transition-all duration-500"
        >
          <div class="flex justify-center mb-5">
            <div
              class="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-500"
            >
              <img
                src="https://github.com/{dev.github}.png"
                alt="{dev.name}"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          <div class="flex items-center justify-center gap-1.5 mb-1">
            {#if dev.flag}
              <img
                src="/flags/{dev.flag}.svg"
                alt="{dev.flag}"
                class="w-5 h-auto"
              />
            {/if}
            <h3 class="text-xl font-bold tracking-tight">
              {dev.name}
            </h3>
          </div>
          <p class="text-neutral-400 text-sm mb-6">{$t(dev.roleKey)}</p>
          <a
            href="https://github.com/{dev.github}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clip-rule="evenodd"
              />
            </svg>
            {$t('developers.github')}
          </a>
        </div>
      {/each}
    </div>
  </div>
</section>
