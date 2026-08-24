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
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const isOfficial = $derived(level === "official");
  const tooltipText = $derived(isOfficial ? $t('themes.officialTheme') : $t('themes.verifiedTheme'));
  const iconClass = $derived(
    isOfficial
      ? "text-cl-warning"
      : "text-cl-link"
  );
</script>

<span class="group/tooltip relative inline-flex" aria-label={tooltipText}>
  <IconSealCheck class="{sizeClasses[size]} {iconClass} shrink-0" />
  <span
    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-1 rounded bg-cl-surface border border-cl-border text-[10px] font-medium text-cl-text whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none z-50"
  >
    {tooltipText}
  </span>
</span>
