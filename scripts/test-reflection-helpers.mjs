import assert from 'node:assert/strict';

function addDaysUtc(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function toDayStringUtc(date) {
  return date.toISOString().slice(0, 10);
}

function computeWeekBounds(anchorDate) {
  const anchor = new Date(`${anchorDate}T00:00:00.000Z`);
  const day = anchor.getUTCDay();
  const offsetToMonday = (day + 6) % 7;
  const weekStart = addDaysUtc(anchor, -offsetToMonday);
  const weekEnd = addDaysUtc(weekStart, 6);

  return {
    start: toDayStringUtc(weekStart),
    end: toDayStringUtc(weekEnd),
  };
}

function computeMonthBounds(anchorDate) {
  const anchor = new Date(`${anchorDate}T00:00:00.000Z`);
  const monthStart = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), 1));
  const nextMonthStart = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + 1, 1));
  const monthEnd = addDaysUtc(nextMonthStart, -1);

  return {
    start: toDayStringUtc(monthStart),
    end: toDayStringUtc(monthEnd),
  };
}

function parseJsonStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
}

assert.deepEqual(computeWeekBounds('2026-03-31'), {
  start: '2026-03-30',
  end: '2026-04-05',
});

assert.deepEqual(computeWeekBounds('2026-04-05'), {
  start: '2026-03-30',
  end: '2026-04-05',
});

assert.deepEqual(computeMonthBounds('2026-03-31'), {
  start: '2026-03-01',
  end: '2026-03-31',
});

assert.deepEqual(computeMonthBounds('2024-02-16'), {
  start: '2024-02-01',
  end: '2024-02-29',
});

assert.deepEqual(parseJsonStringArray([' a ', '', null, 'b']), ['a', 'b']);
assert.deepEqual(parseJsonStringArray({}), []);

console.log('Reflection helper tests passed.');
