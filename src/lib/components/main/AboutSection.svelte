<script lang="ts">
  import { t } from "$lib/i18n";
  import IconGift from "~icons/ph/gift";
  import IconShieldCheck from "~icons/ph/shield-check";
  import IconMonitor from "~icons/ph/monitor";
  import IconPalette from "~icons/ph/palette";
  import IconFingerprint from "~icons/ph/fingerprint";

  const values = [
    { titleKey: "home.value1Title", descKey: "home.value1Desc", Icon: IconGift },
    {
      titleKey: "home.value2Title",
      descKey: "home.value2Desc",
      Icon: IconShieldCheck,
    },
    { titleKey: "home.value3Title", descKey: "home.value3Desc", Icon: IconMonitor },
    { titleKey: "home.value4Title", descKey: "home.value4Desc", Icon: IconPalette },
  ];
</script>

<section class="py-24 border-y border-white/5 bg-neutral-950">
  <div class="container mx-auto px-6 max-w-6xl">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
      <div>
        <h2 class="text-4xl md:text-5xl font-black tracking-tighter mb-6">
          {$t('home.valueTitle')}
        </h2>
        <p class="text-neutral-400 text-lg font-light leading-relaxed">
          {$t('home.valueSubtitle')}
        </p>
      </div>

      <ul class="space-y-8">
        {#each values as value}
          <li class="flex gap-5">
            <div
              class="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 text-white border border-white/5"
            >
              <value.Icon class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-lg font-bold tracking-tight text-white mb-1">
                {$t(value.titleKey)}
              </h3>
              <p class="text-neutral-400 leading-relaxed font-light">
                {$t(value.descKey)}
              </p>
            </div>
          </li>
        {/each}
      </ul>
    </div>

    <div
      class="mt-24 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left"
    >
      <div
        class="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 text-white"
      >
        <IconFingerprint class="w-8 h-8" />
      </div>
      <div class="max-w-2xl">
        <h3 class="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
          {$t('home.value5Title')}
        </h3>
        <p class="text-neutral-400 text-lg font-light leading-relaxed">
          {$t('home.value5Desc')}
        </p>
      </div>
    </div>
  </div>
</section>
