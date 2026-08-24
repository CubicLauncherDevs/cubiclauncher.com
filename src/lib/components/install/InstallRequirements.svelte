<script lang="ts">
  import { t } from "$lib/i18n";
  import { platformData, type PlatformId } from "$lib/utils/install";

  interface Props {
    platformId: PlatformId;
  }

  let { platformId }: Props = $props();

  const { reqKey } = platformData[platformId];
</script>

<div class="mt-5 pt-4 border-t border-cl-border">
  <p class="text-xs text-cl-muted leading-relaxed">
    <span class="text-cl-text font-medium">{$t("install.systemRequirements")}:</span>
    {$t(reqKey)}
  </p>
</div>
