import assert from 'node:assert/strict';
import test from 'node:test';
import { activityDay, buildActivityYear } from '../src/lib/utils/theme-activity.ts';

const event = (date) => ({ date, label: 'Theme · V1', href: '/themes/example/V1' });

test('groups releases by UTC day across timezone offsets and DST changes', () => {
  const graph = buildActivityYear([
    event('2026-03-08T23:30:00-04:00'),
    event('2026-03-09T03:30:00Z'),
    event('2026-03-09T23:30:00Z'),
    event('2026-03-10T00:30:00Z'),
  ], 2026);
  assert.equal(graph.total, 4);
  assert.equal(graph.activeDays, 2);
  assert.equal(graph.peak, 3);
  assert.equal(graph.days.find((day) => day.key === '2026-03-09').events.length, 3);
});

test('includes leap day and pads the calendar with complete Monday-first weeks', () => {
  const graph = buildActivityYear([event('2024-02-29')], 2024);
  assert.equal(graph.days.filter((day) => day.inYear).length, 366);
  assert.equal(graph.days[0].date.getUTCDay(), 1);
  assert.equal(graph.days.at(-1).date.getUTCDay(), 0);
  assert.equal(graph.days.length % 7, 0);
  assert.equal(graph.days.find((day) => day.key === '2024-02-29').events.length, 1);
  assert.equal(new Set(graph.days.map((day) => day.key)).size, graph.days.length);
});

test('handles leap years requiring 54 calendar columns without dropping December 31', () => {
  const graph = buildActivityYear([event('2012-12-31')], 2012);
  assert.equal(graph.weeks, 54);
  assert.equal(graph.total, 1);
  assert.equal(graph.days.find((day) => day.key === '2012-12-31').events.length, 1);
});

test('ignores invalid dates and releases outside the selected UTC year', () => {
  const graph = buildActivityYear([
    event('invalid'), event(''), event('2025-12-31T23:00:00Z'),
    event('2026-12-31T23:30:00-04:00'), event('2026-01-01T00:00:00Z'),
  ], 2026);
  assert.equal(graph.total, 1);
  assert.equal(graph.activeDays, 1);
  assert.equal(graph.peak, 1);
  assert.equal(activityDay('invalid'), null);
  assert.equal(activityDay('2026-12-31T23:30:00-04:00'), '2027-01-01');
  assert.ok(graph.days.filter((day) => !day.inYear).every((day) => day.events.length === 0));
});

test('empty years have zero statistics and all calendar days', () => {
  const graph = buildActivityYear([], 2026);
  assert.equal(graph.total, 0);
  assert.equal(graph.activeDays, 0);
  assert.equal(graph.peak, 0);
  assert.equal(graph.days.filter((day) => day.inYear).length, 365);
});
