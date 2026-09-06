<script lang="ts">
  import { t, locale, getDateLocale } from "$lib/i18n";

  type Props = {
    dates: string[];
    title: string;
  };

  let { dates, title }: Props = $props();

  const DAY_MS = 1000 * 60 * 60 * 24;
  const WEEKS = 53;

  const validDates = $derived(
    dates
      .map((d) => {
        const parsed = new Date(d);
        if (isNaN(parsed.getTime())) return null;
        return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      })
      .filter((d): d is Date => d !== null)
  );

  type DayCell = {
    date: Date;
    count: number;
    dayIndex: number;
    weekIndex: number;
  };

  type GraphData = {
    weeks: DayCell[][];
    monthLabels: { weekIndex: number; label: string }[];
  };

  const graph = $derived.by<GraphData>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let latest = today;
    for (const d of validDates) {
      if (d.getTime() > latest.getTime()) latest = d;
    }

    // Align end to the next Saturday so the grid always starts on Sunday.
    const end = new Date(latest.getFullYear(), latest.getMonth(), latest.getDate());
    end.setDate(end.getDate() + ((6 + 7 - end.getDay()) % 7));

    const totalDays = WEEKS * 7;
    const start = new Date(end.getTime() - (totalDays - 1) * DAY_MS);

    const dayCounts = new Map<number, number>();
    for (const d of validDates) {
      const diff = Math.floor((d.getTime() - start.getTime()) / DAY_MS);
      if (diff >= 0 && diff < totalDays) {
        dayCounts.set(diff, (dayCounts.get(diff) ?? 0) + 1);
      }
    }

    const days: DayCell[] = [];
    const monthLabels: { weekIndex: number; label: string }[] = [];
    let lastMonthLabel = "";

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(start.getTime() + i * DAY_MS);
      const dayIndex = date.getDay();
      const weekIndex = Math.floor(i / 7);
      const count = dayCounts.get(i) ?? 0;

      if (dayIndex === 0 || i === 0) {
        const label = date.toLocaleDateString(getDateLocale($locale), { month: "short" });
        if (label !== lastMonthLabel) {
          monthLabels.push({ weekIndex, label });
          lastMonthLabel = label;
        }
      }

      days.push({ date, count, dayIndex, weekIndex });
    }

    const weeks: DayCell[][] = [];
    for (let w = 0; w < WEEKS; w++) {
      weeks.push(days.slice(w * 7, (w + 1) * 7));
    }

    return { weeks, monthLabels };
  });

  function opacity(count: number) {
    if (count === 0) return 0.1;
    if (count === 1) return 0.35;
    if (count === 2) return 0.6;
    if (count === 3) return 0.85;
    return 1;
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString(getDateLocale($locale), {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  type TooltipState = {
    x: number;
    y: number;
    count: number;
    date: Date;
    visible: boolean;
  } | null;

  let tooltip = $state<TooltipState>(null);

  function tooltipText(count: number, date: Date) {
    return $t('themeDetail.activityTooltip', {
      values: { count, date: formatDate(date) },
    });
  }

  function showTooltipAtCursor(e: MouseEvent, count: number, date: Date) {
    tooltip = { x: e.clientX, y: e.clientY, count, date, visible: true };
  }

  function showTooltipAtCell(el: Element, count: number, date: Date) {
    const r = el.getBoundingClientRect();
    tooltip = { x: r.left + r.width / 2, y: r.top, count, date, visible: true };
  }

  function moveTooltip(e: MouseEvent) {
    if (!tooltip) return;
    tooltip.x = e.clientX;
    tooltip.y = e.clientY;
  }

  function hideTooltip() {
    tooltip = null;
  }
</script>

<div class="mb-5">
  <p class="text-[10px] font-semibold uppercase tracking-wide text-cl-dim mb-2">{title}</p>
  <div class="overflow-x-auto -mx-1 px-1">
    <svg
      width="676"
      height="110"
      viewBox="0 0 676 110"
      role="img"
      aria-label={title}
      class="block"
    >
      <g transform="translate(24, 18)">
        {#each graph.monthLabels as { weekIndex, label }}
          <text x={weekIndex * 12 + 5} y="-4" font-size="9" fill="var(--cl-dim)">{label}</text>
        {/each}

        {#each graph.weeks as week, w}
          {#each week as day}
            {@const x = w * 12}
            {@const y = day.dayIndex * 12}
            <rect
              {x}
              {y}
              width="10"
              height="10"
              rx="2"
              fill="var(--cl-text)"
              style="opacity: {opacity(day.count)}"
              aria-label={tooltipText(day.count, day.date)}
              role="button"
              tabindex="0"
              onmouseenter={(e) => showTooltipAtCursor(e, day.count, day.date)}
              onmousemove={moveTooltip}
              onmouseleave={hideTooltip}
              onfocus={(e) => { const t = e.currentTarget; if (t) showTooltipAtCell(t, day.count, day.date); }}
              onblur={hideTooltip}
            />
          {/each}
        {/each}
      </g>
    </svg>
  </div>
  <div class="flex items-center gap-2 mt-2 text-[10px] text-cl-dim">
    <span>{$t('themeDetail.activityLess')}</span>
    <div class="flex gap-0.5">
      {#each [0.1, 0.35, 0.6, 0.85, 1] as op}
        <div
          class="w-3 h-3 rounded-sm"
          style="background-color: var(--cl-text); opacity: {op};"
          aria-hidden="true"
        ></div>
      {/each}
    </div>
    <span>{$t('themeDetail.activityMore')}</span>
  </div>
</div>

{#if tooltip}
  <div
    class="fixed z-50 pointer-events-none px-2 py-1.5 rounded bg-cl-surface border border-cl-border text-xs text-cl-text shadow-lg shadow-black/20 whitespace-nowrap transition-opacity duration-150"
    style="left: {tooltip.x}px; top: {tooltip.y}px; transform: translate(-50%, -130%);"
    role="tooltip"
  >
    {tooltipText(tooltip.count, tooltip.date)}
  </div>
{/if}
