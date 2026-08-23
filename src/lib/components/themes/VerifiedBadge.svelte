<script lang="ts">
  import { t } from "$lib/i18n";
  import type { ThemeVerification } from "$lib/types/theme";
  import IconSealCheck from "~icons/ph/seal-check";

  interface Props {
    size?: "sm" | "md" | "lg";
    level?: ThemeVerification;
  }

  let { size = "md", level = "verified" }: Props = $props();

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const isOfficial = $derived(level === "official");
  const tooltipText = $derived(isOfficial ? $t('themes.officialTheme') : $t('themes.verifiedTheme'));
  const iconClass = $derived(
    isOfficial
      ? "text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]"
      : "text-cyan-400"
  );
</script>

<span class="group/tooltip relative inline-flex" aria-label={tooltipText}>
  <IconSealCheck class="{sizeClasses[size]} {iconClass} shrink-0" />
  <span
    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-[4px] bg-neutral-900 border border-white/10 text-[10px] font-medium text-white whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg shadow-black/20 z-50"
  >
    {tooltipText}
    <span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900"></span>
  </span>
</span>
