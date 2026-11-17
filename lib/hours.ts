// Opening hours, the open/closed state and the blue plate of the day.
// Everything here is pure (no clocks), so it's unit tested; the browser supplies the current local
// day and time in the diner's time zone (see components/diner-clock.tsx).
import { DAYS, diner, type Day, type OpeningHours } from '../content/diner.ts';
import { bluePlate as weeklyBluePlates, type BluePlate } from '../content/menu.ts';

const MINUTES_PER_DAY = 24 * 60;

/** Minutes after midnight for "HH:MM". */
export function toMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

/** True when the day's closing time is after midnight (e.g. opens 07:00, closes 02:00). */
export function closesAfterMidnight(entry: OpeningHours): boolean {
  return Boolean(entry.opens && entry.closes && toMinutes(entry.closes) < toMinutes(entry.opens));
}

/** "07:30" → "7:30am", "18:00" → "6pm", "00:00" → "midnight". */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number);
  if (h === 0 && m === 0) return 'midnight';
  if (h === 12 && m === 0) return 'noon';
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

/** "7am – 10pm" or "Closed". */
export function formatHours(entry: OpeningHours): string {
  return entry.opens && entry.closes ? `${formatTime(entry.opens)} – ${formatTime(entry.closes)}` : 'Closed';
}

export interface HoursGroup {
  /** "Sun – Thu", "Friday", "Fri – Sat". */
  label: string;
  hours: string;
  /** Closes after midnight: shown highlighted as a late night. */
  late: boolean;
}

/**
 * Consecutive days with the same hours. A run that wraps from Sunday into Monday is kept together,
 * so Sunday to Thursday reads as one "Sun – Thu" line.
 */
export function groupedHours(hours: OpeningHours[] = diner.hours): HoursGroup[] {
  const groups: { days: Day[]; entry: OpeningHours }[] = [];
  for (const entry of hours) {
    const last = groups.at(-1);
    if (last && formatHours(last.entry) === formatHours(entry)) last.days.push(entry.day);
    else groups.push({ days: [entry.day], entry });
  }
  const first = groups[0], last = groups.at(-1);
  const wraps = groups.length > 2 && first && last && formatHours(first.entry) === formatHours(last.entry)
    && first.days[0] === 'Monday' && last.days.at(-1) === 'Sunday';
  if (wraps) {
    first.days.unshift(...last.days);
    groups.pop();
  }
  const short = (day: Day) => day.slice(0, 3);
  return groups.map(group => ({
    label: group.days.length === 1 ? group.days[0] : `${short(group.days[0])} – ${short(group.days.at(-1)!)}`,
    hours: formatHours(group.entry),
    late: closesAfterMidnight(group.entry),
  }));
}

export type OpenState =
  | {
      open: true;
      /** Closing time, "HH:MM". */
      closes: string;
      /** The day whose hours we're in. 1am Saturday is still Friday night. */
      night: Day;
      /** Closing time falls after midnight. */
      late: boolean;
      /** Minutes until closing. */
      minutesLeft: number;
    }
  | {
      open: false;
      /** Next opening, or undefined when no day has hours. `inDays` is 0 for later today. */
      next?: { day: Day; opens: string; inDays: number };
    };

function entryFor(day: Day, hours: OpeningHours[]): OpeningHours | undefined {
  return hours.find(entry => entry.day === day);
}

function previousDay(day: Day): Day {
  return DAYS[(DAYS.indexOf(day) + 6) % 7];
}

/**
 * Whether the diner is open at a local day and time (minutes after midnight).
 * Handles late nights: when Friday closes at 02:00, 1am Saturday is open from Friday's hours.
 */
export function openState(day: Day, minutes: number, hours: OpeningHours[] = diner.hours): OpenState {
  // Still open from last night?
  const yesterday = entryFor(previousDay(day), hours);
  if (yesterday && closesAfterMidnight(yesterday) && minutes < toMinutes(yesterday.closes!)) {
    return { open: true, closes: yesterday.closes!, night: yesterday.day, late: true, minutesLeft: toMinutes(yesterday.closes!) - minutes };
  }
  const today = entryFor(day, hours);
  if (today?.opens && today.closes && minutes >= toMinutes(today.opens)) {
    const late = closesAfterMidnight(today);
    const close = toMinutes(today.closes) + (late ? MINUTES_PER_DAY : 0);
    if (minutes < close) return { open: true, closes: today.closes, night: day, late, minutesLeft: close - minutes };
  }
  const start = DAYS.indexOf(day);
  for (let inDays = 0; inDays < 8; inDays++) {
    const candidate = DAYS[(start + inDays) % 7];
    const entry = entryFor(candidate, hours);
    if (!entry?.opens || !entry.closes) continue;
    if (inDays === 0 && minutes >= toMinutes(entry.opens)) continue;
    return { open: false, next: { day: candidate, opens: entry.opens, inDays } };
  }
  return { open: false };
}

/** Last orders warning shown in the final half hour. */
export const CLOSING_SOON_MINUTES = 30;

/** "Closing in 30 minutes" style wording for the last stretch. */
function closingIn(minutes: number): string {
  return minutes <= 1 ? 'Closing in a minute' : `Closing in ${minutes} minutes`;
}

/** When the diner is back: "at 7am", "tomorrow at 7am" or "Monday at 7am". */
export function backWhen(next: { day: Day; opens: string; inDays: number }, minutes: number): string {
  const time = formatTime(next.opens);
  if (next.inDays === 0) return `at ${time}`;
  // After midnight the next opening is "today", but late in the evening it's "tomorrow".
  if (next.inDays === 1) return minutes >= 12 * 60 ? `at ${time}` : `tomorrow at ${time}`;
  return `${next.day} at ${time}`;
}

/**
 * The status line, e.g. "Open · till 2am tonight", "Open · till 10pm · breakfast all day",
 * "Closing in 30 minutes" or "Closed · back at 7am".
 */
export function statusLine(state: OpenState, minutes: number, breakfastAllDay = diner.breakfastAllDay): string {
  if (state.open) {
    if (state.minutesLeft <= CLOSING_SOON_MINUTES) return closingIn(state.minutesLeft);
    if (state.late) return `Open · till ${formatTime(state.closes)} tonight`;
    return breakfastAllDay ? `Open · till ${formatTime(state.closes)} · breakfast all day` : `Open · till ${formatTime(state.closes)}`;
  }
  if (!state.next) return 'Closed';
  return `Closed · back ${backWhen(state.next, minutes)}`;
}

/** The short line on the neon sign beside OPEN: "Open till 2am", "Last orders till 10pm" or "Back at 7am". */
export function signLine(state: OpenState, minutes: number): string {
  if (state.open) return `${state.minutesLeft <= CLOSING_SOON_MINUTES ? 'Last orders' : 'Open'} till ${formatTime(state.closes)}`;
  return state.next ? `Back ${backWhen(state.next, minutes)}` : 'Closed';
}

/** "Today 7am – 2am", for the hero, or "Closed today". */
export function todayHours(day: Day, hours: OpeningHours[] = diner.hours): string {
  const entry = entryFor(day, hours);
  return entry?.opens && entry.closes ? `Today ${formatHours(entry)}` : 'Closed today';
}

/**
 * The blue plate for a calendar day. It changes at local midnight, even when the diner's
 * night carries on: at 1am Saturday the diner is open on Friday's hours, but Saturday's plate is up.
 */
export function bluePlateFor(day: Day, plates: Record<Day, BluePlate | null> = weeklyBluePlates): BluePlate | null {
  return plates[day] ?? null;
}

/** Current weekday and minutes after midnight in an IANA time zone. */
export function localNow(timeZone: string, now = new Date()): { day: Day; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(now);
  const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
  const day = part('weekday') as Day;
  return { day: DAYS.includes(day) ? day : 'Monday', minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}
