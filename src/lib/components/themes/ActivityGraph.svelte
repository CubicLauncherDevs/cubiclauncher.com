<script lang="ts">
  import { onMount } from "svelte";
  import { t, locale, getDateLocale } from "$lib/i18n";
  import { activityDay, buildActivityYear, type ThemeActivityEvent } from "$lib/utils/theme-activity";
  import IconPulse from "~icons/ph/pulse";
  import IconArrowUpRight from "~icons/ph/arrow-up-right";

  let { events, title }: { events: ThemeActivityEvent[]; title: string } = $props();
  const id = $props.id();
  let currentYear = $state(new Date().getUTCFullYear());
  onMount(() => { currentYear = new Date().getUTCFullYear(); });
  let chosenYear = $state<number | null>(null);
  let chosenDay = $state<string | null>(null);
  let calendarViewport: HTMLDivElement;
  let eventYears = $derived([...new Set(events.flatMap((event) => {
    const day = activityDay(event.date);
    return day ? [Number(day.slice(0, 4))] : [];
  }))].sort((a, b) => b - a));
  let years = $derived([...new Set([currentYear, ...eventYears])].sort((a, b) => b - a));
  let year = $derived(chosenYear !== null && years.includes(chosenYear) ? chosenYear : (eventYears[0] ?? currentYear));
  let graph = $derived(buildActivityYear(events, year));
  let selectedDay = $derived(
    graph.days.find((day) => day.key === chosenDay && day.events.length > 0)
      ?? graph.days.findLast((day) => day.events.length > 0)
  );
  let months = $derived(Array.from({ length: 12 }, (_, month) => {
    const index = graph.days.findIndex((day) => day.inYear && day.date.getUTCMonth() === month);
    return {
      column: Math.floor(index / 7) + 1,
      label: new Date(Date.UTC(year, month, 1)).toLocaleDateString(getDateLocale($locale), { month: "short", timeZone: "UTC" }),
    };
  }));

  $effect(() => {
    // Keep the selected release visible when the year overflows on mobile.
    const key = selectedDay?.key;
    if (!calendarViewport) return;
    const cell = key ? calendarViewport.querySelector<HTMLButtonElement>('[aria-pressed="true"]') : null;
    if (cell) {
      const viewport = calendarViewport.getBoundingClientRect();
      const bounds = cell.getBoundingClientRect();
      calendarViewport.scrollLeft += bounds.left - viewport.left - viewport.width / 2 + bounds.width / 2;
    } else {
      calendarViewport.scrollLeft = 0;
    }
  });

  function formatDate(date: Date) {
    return date.toLocaleDateString(getDateLocale($locale), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  }

  function dayLabel(count: number, date: Date) {
    return $t('themeDetail.activityTooltip', { values: { count, date: formatDate(date) } });
  }

  function level(count: number) {
    return count === 0 ? 0 : Math.max(1, Math.ceil((count / Math.max(1, graph.peak)) * 4));
  }
</script>

<section class="activity mb-5 min-w-0 rounded-lg border border-cl-border bg-cl-surface p-4 sm:p-5" aria-labelledby={`${id}-title`}>
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h2 id={`${id}-title`} class="flex items-center gap-2 text-sm font-semibold"><IconPulse class="size-4 text-cl-dim" />{title}</h2>
      <p class="mt-1 text-xs text-cl-dim">{$t('themeDetail.activitySubtitle')}</p>
    </div>
    <label class="flex items-center gap-2 text-xs text-cl-dim">
      {$t('themeDetail.activityYear')}
      <select value={year} onchange={(event) => { chosenYear = Number(event.currentTarget.value); chosenDay = null; }} class="rounded-md border border-cl-border bg-cl-base px-2 py-1.5 text-xs text-cl-text">
        {#each years as option}<option value={option}>{option}</option>{/each}
      </select>
    </label>
  </div>

  <dl class="my-5 grid grid-cols-3 gap-3 rounded-md bg-cl-base p-3">
    {#each [{ value: graph.total, key: 'activityReleases' }, { value: graph.activeDays, key: 'activityDays' }, { value: graph.peak, key: 'activityPeak' }] as stat}
      <div><dd class="text-xl font-semibold tabular-nums">{stat.value}</dd><dt class="mt-1 text-[11px] text-cl-dim">{$t(`themeDetail.${stat.key}`)}</dt></div>
    {/each}
  </dl>

  <div bind:this={calendarViewport} class="overflow-x-auto pb-2">
    <div class="calendar" style={`--weeks: ${graph.weeks}`}>
      <div class="months" aria-hidden="true">
        {#each months as month}<span style={`grid-column: ${month.column} / span 3`}>{month.label}</span>{/each}
      </div>
      <div class="calendar-body">
        <div class="weekdays" aria-hidden="true">
          {#each [0, 1, 2, 3, 4, 5, 6] as day}
            <span>{day % 2 === 0 ? new Date(Date.UTC(2024, 0, 1 + day)).toLocaleDateString(getDateLocale($locale), { weekday: 'short', timeZone: 'UTC' }) : ''}</span>
          {/each}
        </div>
        <div class="days" role="group" aria-label={`${title} ${year}`}>
          {#each graph.days as day}
            {#if day.inYear && day.events.length > 0}
              <button
                class="day"
                class:selected={selectedDay?.key === day.key}
                data-level={level(day.events.length)}
                title={dayLabel(day.events.length, day.date)}
                aria-label={dayLabel(day.events.length, day.date)}
                aria-pressed={selectedDay?.key === day.key}
                aria-controls={`${id}-events`}
                onclick={() => chosenDay = day.key}
              ></button>
            {:else}
              <span class="day" class:outside={!day.inYear} data-level="0" title={day.inYear ? dayLabel(0, day.date) : undefined}></span>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>

  <div class="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-cl-dim">
    <span>{$t('themeDetail.activityHint')}</span>
    <div class="flex items-center gap-1.5" aria-hidden="true">
      <span>{$t('themeDetail.activityLess')}</span>
      {#each [0, 1, 2, 3, 4] as value}<span class="day legend" data-level={value}></span>{/each}
      <span>{$t('themeDetail.activityMore')}</span>
    </div>
  </div>

  <div id={`${id}-events`} class="mt-4 border-t border-cl-border pt-4" aria-live="polite">
    {#if selectedDay}
      <p class="mb-2 text-xs font-medium">{dayLabel(selectedDay.events.length, selectedDay.date)}</p>
      <ul class="flex max-h-48 flex-col gap-1 overflow-y-auto">
        {#each selectedDay.events as event}
          <li><a href={event.href} class="flex items-center justify-between gap-3 rounded-md bg-cl-base px-3 py-2 text-xs text-cl-muted transition-colors hover:bg-cl-elevated hover:text-cl-text"><span class="break-words min-w-0">{event.label}</span><IconArrowUpRight class="size-3.5 shrink-0" /></a></li>
        {/each}
      </ul>
    {:else}
      <p class="text-xs text-cl-dim">{$t('themeDetail.activityEmpty', { values: { year } })}</p>
    {/if}
  </div>
</section>

<style>
  .calendar { min-width: 620px; }
  .months { display: grid; grid-template-columns: repeat(var(--weeks), minmax(0, 1fr)); margin-left: 32px; margin-bottom: 8px; font-size: 10px; color: var(--cl-dim); }
  .calendar-body { display: flex; gap: 6px; }
  .weekdays { width: 26px; flex-shrink: 0; display: grid; grid-template-rows: repeat(7, 1fr); font-size: 9px; color: var(--cl-dim); }
  .days { display: grid; flex: 1; grid-auto-flow: column; grid-template-rows: repeat(7, 1fr); grid-template-columns: repeat(var(--weeks), minmax(0, 1fr)); gap: 3px; }
  .day { display: block; aspect-ratio: 1; border-radius: 2px; background: var(--cl-elevated); border: 1px solid var(--cl-border); }
  button.day { cursor: pointer; }
  .day[data-level="1"] { background: color-mix(in srgb, var(--cl-success) 25%, var(--cl-surface)); }
  .day[data-level="2"] { background: color-mix(in srgb, var(--cl-success) 45%, var(--cl-surface)); }
  .day[data-level="3"] { background: color-mix(in srgb, var(--cl-success) 70%, var(--cl-surface)); }
  .day[data-level="4"] { background: var(--cl-success); }
  button.day:hover, .day.selected { outline: 1px solid var(--cl-text); outline-offset: 1px; }
  button.day:focus-visible { outline: 2px solid var(--cl-text); outline-offset: 2px; }
  .outside { visibility: hidden; }
  .legend { width: 10px; }
</style>
