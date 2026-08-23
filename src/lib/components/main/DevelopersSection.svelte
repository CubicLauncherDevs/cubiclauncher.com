<script lang="ts">
  import { developers, contributors } from "$lib/data/developers";
  import { t } from "$lib/i18n";
</script>

<section class="py-20">
  <div class="mx-auto px-6 lg:px-8" style="max-width: var(--discord-max-width);">
    <div class="text-center mb-12">
      <h2
        class="text-[26px] sm:text-[32px] font-semibold tracking-tight mb-3"
      >
        {$t('developers.title')}
      </h2>
      <p class="text-[15px] text-neutral-400 max-w-xl mx-auto">
        {$t('developers.description')}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      {#each developers as dev}
        <a
          href="https://github.com/{dev.github}"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-5 bg-neutral-900/50 border border-white/5 rounded-lg p-5 hover:bg-neutral-900/80 hover:border-white/10 transition-colors"
        >
          <div
            class="shrink-0 w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-white/20 transition-all"
          >
            <img
              src="https://github.com/{dev.github}.png"
              alt="{dev.name}"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 mb-1">
              {#if dev.flag}
                <img
                  src="/flags/{dev.flag}.svg"
                  alt="{dev.flag}"
                  class="w-4 h-auto"
                />
              {/if}
              <h3 class="text-[16px] font-semibold tracking-tight truncate">
                {dev.name}
              </h3>
            </div>
            <p class="text-neutral-400 text-[13px] mb-3">{$t(dev.roleKey)}</p>
            <span
              class="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-500 group-hover:text-white transition-colors"
            >
              <svg
                class="w-3.5 h-3.5"
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
            </span>
          </div>
        </a>
      {/each}
    </div>

    <div class="text-center mt-14 mb-6">
      <h3 class="text-lg font-semibold tracking-tight">
        {$t('developers.contributorsTitle')}
      </h3>
    </div>

    <div
      class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-5 gap-y-6"
    >
      {#each contributors as dev}
        <a
          href="https://github.com/{dev.github}"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex flex-col items-center gap-2 text-center"
        >
          <div
            class="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-white/30 group-hover:scale-110 transition-all"
          >
            <img
              src="https://github.com/{dev.github}.png"
              alt="{dev.name}"
              class="w-full h-full object-cover"
            />
          </div>
          <span
            class="text-[12px] text-neutral-500 group-hover:text-white transition-colors"
          >
            {dev.name}
          </span>
          {#if dev.suspended}
            <span class="text-[10px] text-red-400/90 mt-0.5">{$t('developers.suspended')}</span>
          {/if}
        </a>
      {/each}
    </div>
  </div>
</section>
