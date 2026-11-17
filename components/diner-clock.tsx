'use client';

import { useEffect, useState } from 'react';
import type { Day } from '../content/diner';
import { localNow, openState, type OpenState } from '../lib/hours';
import { site } from '../lib/site';

export interface DinerNow {
  /** Calendar day in the diner's time zone (the blue plate follows this). */
  day: Day;
  /** Minutes after local midnight. */
  minutes: number;
  state: OpenState;
}

/**
 * The diner's local day, time and open state, computed in the browser from the time zone in
 * site.config.json and refreshed every minute. Returns null during the static render, before
 * hydration and when no time zone is configured, so nothing time-dependent is ever baked into the HTML.
 */
export function useDinerNow(): DinerNow | null {
  const [now, setNow] = useState<DinerNow | null>(null);

  useEffect(() => {
    if (!site.timeZone) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const { day, minutes } = localNow(site.timeZone);
      setNow({ day, minutes, state: openState(day, minutes) });
      // Wake just after the next minute starts, so "Closing in 30 minutes" stays exact.
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 250);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return now;
}
