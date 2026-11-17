// Opening hours, the open/closed status line and the blue plate's day boundary.
// The sample hours: 07:00–22:00 Sunday to Thursday, 07:00–02:00 Friday and Saturday.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { diner, DAYS, type OpeningHours } from '../content/diner.ts';
import { bluePlate } from '../content/menu.ts';
import {
  bluePlateFor, closesAfterMidnight, formatHours, formatTime, groupedHours, localNow, openState, signLine,
  statusLine, todayHours, toMinutes,
} from '../lib/hours.ts';

const at = (time: string) => toMinutes(time);
const week: OpeningHours[] = [
  { day: 'Monday', opens: '07:00', closes: '22:00' },
  { day: 'Tuesday', opens: '07:00', closes: '22:00' },
  { day: 'Wednesday' },
  { day: 'Thursday', opens: '07:00', closes: '22:00' },
  { day: 'Friday', opens: '07:00', closes: '02:00' },
  { day: 'Saturday', opens: '07:00', closes: '02:00' },
  { day: 'Sunday', opens: '08:00', closes: '22:00' },
];

test('opening hours list each day once with valid times', () => {
  assert.deepEqual(diner.hours.map(entry => entry.day), [...DAYS], 'List Monday to Sunday once each, in order');
  for (const entry of diner.hours) {
    assert.equal(Boolean(entry.opens), Boolean(entry.closes), `${entry.day}: set both opens and closes, or neither`);
    if (entry.opens && entry.closes) {
      assert.match(entry.opens, /^([01]\d|2[0-3]):[0-5]\d$/, `${entry.day}.opens must be "HH:MM"`);
      assert.match(entry.closes, /^([01]\d|2[0-3]):[0-5]\d$/, `${entry.day}.closes must be "HH:MM"`);
      assert.notEqual(entry.opens, entry.closes, `${entry.day}: opens and closes can't be the same time`);
      if (closesAfterMidnight(entry)) {
        assert.ok(toMinutes(entry.closes) <= 6 * 60, `${entry.day} closes at ${entry.closes}, before it opens: that's read as after midnight, so keep it before 06:00`);
        const next = diner.hours[(DAYS.indexOf(entry.day) + 1) % 7];
        assert.ok(!next.opens || toMinutes(next.opens) >= toMinutes(entry.closes), `${entry.day}'s late night runs into ${next.day}'s opening`);
      }
    }
  }
});

test('times and hours read naturally', () => {
  assert.equal(formatTime('07:00'), '7am');
  assert.equal(formatTime('07:30'), '7:30am');
  assert.equal(formatTime('12:00'), 'noon');
  assert.equal(formatTime('22:00'), '10pm');
  assert.equal(formatTime('00:00'), 'midnight');
  assert.equal(formatTime('02:00'), '2am');
  assert.equal(formatHours({ day: 'Friday', opens: '07:00', closes: '02:00' }), '7am – 2am');
  assert.equal(formatHours({ day: 'Friday' }), 'Closed');
  assert.ok(closesAfterMidnight({ day: 'Friday', opens: '07:00', closes: '02:00' }));
  assert.ok(!closesAfterMidnight({ day: 'Monday', opens: '07:00', closes: '22:00' }));
});

test('hours group Sunday to Thursday together and flag late nights', () => {
  assert.deepEqual(groupedHours(), [
    { label: 'Sun – Thu', hours: '7am – 10pm', late: false },
    { label: 'Fri – Sat', hours: '7am – 2am', late: true },
  ]);
  assert.deepEqual(groupedHours(week).map(group => group.label), ['Mon – Tue', 'Wednesday', 'Thursday', 'Fri – Sat', 'Sunday']);
});

test('before opening, the diner is closed and back at opening time', () => {
  const state = openState('Monday', at('06:15'), week);
  assert.deepEqual(state, { open: false, next: { day: 'Monday', opens: '07:00', inDays: 0 } });
  assert.equal(statusLine(state, at('06:15')), 'Closed · back at 7am');
  assert.equal(signLine(state, at('06:15')), 'Back at 7am');
});

test('during opening hours it says when it closes', () => {
  const state = openState('Monday', at('12:00'), week);
  assert.deepEqual(state, { open: true, closes: '22:00', night: 'Monday', late: false, minutesLeft: 600 });
  assert.equal(statusLine(state, at('12:00')), 'Open · till 10pm · breakfast all day');
  assert.equal(statusLine(state, at('12:00'), false), 'Open · till 10pm');
  assert.equal(signLine(state, at('12:00')), 'Open till 10pm');
});

test('the last 30 minutes count down to closing', () => {
  const state = openState('Monday', at('21:30'), week);
  assert.ok(state.open && state.minutesLeft === 30);
  assert.equal(statusLine(state, at('21:30')), 'Closing in 30 minutes');
  assert.equal(statusLine(openState('Monday', at('21:59'), week), at('21:59')), 'Closing in a minute');
  assert.equal(signLine(state, at('21:30')), 'Last orders till 10pm');
  assert.equal(statusLine(openState('Monday', at('21:29'), week), at('21:29')), 'Open · till 10pm · breakfast all day');
});

test('a late night is open past midnight: 1am Saturday is still Friday night', () => {
  const friday = openState('Friday', at('23:00'), week);
  assert.deepEqual(friday, { open: true, closes: '02:00', night: 'Friday', late: true, minutesLeft: 180 });
  assert.equal(statusLine(friday, at('23:00')), 'Open · till 2am tonight');
  const saturday = openState('Saturday', at('01:00'), week);
  assert.deepEqual(saturday, { open: true, closes: '02:00', night: 'Friday', late: true, minutesLeft: 60 });
  assert.equal(signLine(saturday, at('01:00')), 'Open till 2am');
  assert.equal(statusLine(openState('Saturday', at('01:45'), week), at('01:45')), 'Closing in 15 minutes');
  // Saturday's own late night runs into Sunday morning too.
  assert.ok(openState('Sunday', at('00:30'), week).open);
});

test('after a late close the diner is back the same morning', () => {
  const state = openState('Saturday', at('02:00'), week);
  assert.deepEqual(state, { open: false, next: { day: 'Saturday', opens: '07:00', inDays: 0 } });
  assert.equal(statusLine(state, at('02:00')), 'Closed · back at 7am');
  assert.deepEqual(openState('Sunday', at('03:00'), week), { open: false, next: { day: 'Sunday', opens: '08:00', inDays: 0 } });
});

test('after a normal close it is back tomorrow, and a closed day is skipped', () => {
  const tuesday = openState('Tuesday', at('22:00'), week);
  assert.deepEqual(tuesday, { open: false, next: { day: 'Thursday', opens: '07:00', inDays: 2 } });
  assert.equal(statusLine(tuesday, at('22:00')), 'Closed · back Thursday at 7am');
  const monday = openState('Monday', at('22:30'), week);
  assert.deepEqual(monday, { open: false, next: { day: 'Tuesday', opens: '07:00', inDays: 1 } });
  assert.equal(statusLine(monday, at('22:30')), 'Closed · back at 7am');
  // After midnight on a closed day, the next opening is tomorrow.
  assert.equal(statusLine(openState('Wednesday', at('03:00'), week), at('03:00')), 'Closed · back tomorrow at 7am');
  // Midnight Monday into Tuesday is not a late night: Monday closed at 10pm.
  assert.ok(!openState('Tuesday', at('00:30'), week).open);
});

test('the next opening wraps around the week, and no hours means no claim', () => {
  const onlyMonday: OpeningHours[] = [{ day: 'Monday', opens: '07:00', closes: '22:00' }];
  assert.deepEqual(openState('Monday', at('23:00'), onlyMonday), { open: false, next: { day: 'Monday', opens: '07:00', inDays: 7 } });
  assert.deepEqual(openState('Monday', 600, []), { open: false });
  assert.equal(statusLine({ open: false }, 600), 'Closed');
});

test('a midnight close ends exactly at midnight', () => {
  const late: OpeningHours[] = [{ day: 'Monday', opens: '18:00', closes: '00:00' }, { day: 'Tuesday', opens: '18:00', closes: '00:00' }];
  const before = openState('Monday', at('23:45'), late);
  assert.ok(before.open && before.minutesLeft === 15 && before.late);
  assert.equal(statusLine(before, at('23:45')), 'Closing in 15 minutes');
  assert.ok(!openState('Tuesday', at('00:00'), late).open);
});

test('today’s hours for the hero', () => {
  assert.equal(todayHours('Friday'), 'Today 7am – 2am');
  assert.equal(todayHours('Wednesday', week), 'Closed today');
});

test('the blue plate changes at local midnight while the diner’s night carries on', () => {
  // 11:30pm Friday: Friday night and Friday's plate.
  assert.equal(openState('Friday', at('23:30')).open, true);
  assert.equal(bluePlateFor('Friday'), bluePlate.Friday);
  // 1am Saturday: still open on Friday's hours, but the plate has turned over to Saturday's.
  const state = openState('Saturday', at('01:00'));
  assert.ok(state.open && state.night === 'Friday');
  assert.equal(bluePlateFor('Saturday'), bluePlate.Saturday);
  assert.notEqual(bluePlateFor('Saturday'), bluePlateFor('Friday'));
  assert.equal(bluePlateFor('Monday', { ...bluePlate, Monday: null }), null);
});

test('the local clock reads the diner’s time zone, not the visitor’s', () => {
  // 08:30 UTC on Saturday 2026-01-17 is 01:30 Saturday in Albuquerque (UTC−7 in winter).
  assert.deepEqual(localNow('America/Denver', new Date('2026-01-17T08:30:00Z')), { day: 'Saturday', minutes: 90 });
  // In summer (UTC−6), 05:59 UTC Saturday is still 23:59 Friday.
  assert.deepEqual(localNow('America/Denver', new Date('2026-07-18T05:59:00Z')), { day: 'Friday', minutes: 23 * 60 + 59 });
});
