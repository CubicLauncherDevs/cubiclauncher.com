<script module lang="ts">
  import type { SeverityLevel } from "$lib/data/security";

  export const severityStyles: Record<SeverityLevel, string> = {
    critical: "border-red-500/40 bg-red-500/10 text-red-400",
    high: "border-orange-500/40 bg-orange-500/10 text-orange-400",
    medium: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    low: "border-sky-500/40 bg-sky-500/10 text-sky-400",
    none: "border-cl-border bg-cl-elevated text-cl-muted",
  };
</script>

<script lang="ts">
  import { t } from "$lib/i18n";

  let { severity }: { severity: SeverityLevel } = $props();
</script>

<span
  class="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider {severityStyles[
    severity
  ]}"
>
  {$t(`security.severity.${severity}`)}
</span>
