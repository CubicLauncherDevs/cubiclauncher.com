<script lang="ts">
  import { t } from "$lib/i18n";
  import IconSealCheck from "~icons/ph/seal-check";

  interface Props {
    size?: "sm" | "md" | "lg";
  }

  let { size = "md" }: Props = $props();

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };
</script>

<span class="group/tooltip relative inline-flex" aria-label={$t('themes.verifiedTheme')}>
  <IconSealCheck class="{sizeClasses[size]} text-cyan-400 shrink-0" />
  <span
    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-neutral-900 border border-white/10 text-[10px] font-medium text-white whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg shadow-black/20 z-50"
  >
    {$t('themes.verifiedTheme')}
    <span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900"></span>
  </span>
</span>
