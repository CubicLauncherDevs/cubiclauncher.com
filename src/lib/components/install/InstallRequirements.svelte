<script lang="ts">
  import { t } from "$lib/i18n";
  import { platformData, type PlatformId } from "$lib/utils/install";

  interface Props {
    platformId: PlatformId;
  }

  let { platformId }: Props = $props();

  const { reqKey } = platformData[platformId];
</script>

<div class="mt-10 pt-8 border-t border-white/5">
  <p class="text-sm text-neutral-500 font-light leading-relaxed">
    <span class="text-neutral-300 font-medium"
      >{$t("install.systemRequirements")}:</span
    >
    {$t(reqKey)}
  </p>
</div>
