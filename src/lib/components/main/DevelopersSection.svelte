<script lang="ts">
  import { developers, contributors } from "$lib/data/developers";
  import { t } from "$lib/i18n";
  import IconGithub from "~icons/simple-icons/github";
</script>

<section class="py-10 bg-cl-surface border-y border-cl-border">
  <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-white mb-1">
        {$t('developers.title')}
      </h2>
      <p class="text-xs text-cl-muted max-w-xl">
        {$t('developers.description')}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
      {#each developers as dev}
        <a
          href="https://github.com/{dev.github}"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 bg-cl-base border border-cl-border rounded p-3 hover:bg-cl-elevated hover:border-cl-border-hover transition-colors"
        >
          <div
            class="shrink-0 w-10 h-10 rounded-full overflow-hidden ring-1 ring-cl-border group-hover:ring-cl-border-hover transition-all"
          >
            <img
              src="https://github.com/{dev.github}.png"
              alt="{dev.name}"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5 mb-0.5">
              {#if dev.flag}
                <img
                  src="/flags/{dev.flag}.svg"
                  alt="{dev.flag}"
                  class="w-3.5 h-auto"
                />
              {/if}
              <h3 class="text-xs font-semibold truncate text-white">
                {dev.name}
              </h3>
            </div>
            <p class="text-cl-muted text-[11px]">{$t(dev.roleKey)}</p>
          </div>
          <IconGithub class="w-3.5 h-3.5 text-cl-dim group-hover:text-cl-text transition-colors shrink-0" />
        </a>
      {/each}
    </div>

    <div class="mb-3">
      <h3 class="text-xs font-semibold uppercase tracking-wide text-cl-muted">
        {$t('developers.contributorsTitle')}
      </h3>
    </div>

    <div
      class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-x-3 gap-y-4"
    >
      {#each contributors as dev}
        <a
          href="https://github.com/{dev.github}"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex flex-col items-center gap-1 text-center"
        >
          <div
            class="w-9 h-9 rounded-full overflow-hidden ring-1 ring-cl-border group-hover:ring-cl-border-hover transition-all"
          >
            <img
              src="https://github.com/{dev.github}.png"
              alt="{dev.name}"
              class="w-full h-full object-cover"
            />
          </div>
          <span
            class="text-[10px] text-cl-dim group-hover:text-cl-text transition-colors truncate max-w-full"
          >
            {dev.name}
          </span>
          {#if dev.suspended}
            <span class="text-[10px] text-cl-danger mt-0.5">{$t('developers.suspended')}</span>
          {/if}
        </a>
      {/each}
    </div>
  </div>
</section>
