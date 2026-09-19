export interface ThemeActivityEvent {
  date: string;
  label: string;
  href: string;
}

export function activityDay(value: string): string | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

/** Use UTC calendar days so DST and the visitor's timezone cannot shift cells. */
export function buildActivityYear(events: ThemeActivityEvent[], year: number) {
  const byDay = new Map<string, ThemeActivityEvent[]>();
  for (const event of events) {
    const key = activityDay(event.date);
    if (!key || Number(key.slice(0, 4)) !== year) continue;
    byDay.set(key, [...(byDay.get(key) ?? []), event]);
  }

  const first = new Date(Date.UTC(year, 0, 1));
  const last = new Date(Date.UTC(year, 11, 31));
  const start = new Date(first);
  start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  const end = new Date(last);
  end.setUTCDate(end.getUTCDate() + (6 - ((end.getUTCDay() + 6) % 7)));

  const days = [];
  for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const key = cursor.toISOString().slice(0, 10);
    days.push({
      key,
      date: new Date(cursor),
      inYear: cursor.getUTCFullYear() === year,
      events: byDay.get(key) ?? [],
    });
  }

  const counts = [...byDay.values()].map((items) => items.length);
  return {
    days,
    weeks: days.length / 7,
    total: counts.reduce((sum, count) => sum + count, 0),
    activeDays: byDay.size,
    peak: Math.max(0, ...counts),
  };
}
