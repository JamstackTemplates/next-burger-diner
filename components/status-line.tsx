'use client';

import { CLOSING_SOON_MINUTES, statusLine, todayHours } from '../lib/hours';
import { useDinerNow } from './diner-clock';

/**
 * "Open · till 2am tonight" / "Closing in 30 minutes" / "Closed · back at 7am", with a status dot.
 * The static HTML shows `fallback`, which never claims open or closed.
 */
export function StatusLine({ fallback, className = '' }: { fallback: string; className?: string }) {
  const now = useDinerNow();
  const closing = now?.state.open && now.state.minutesLeft <= CLOSING_SOON_MINUTES;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}
      data-open={now ? String(now.state.open) : undefined} data-closing={closing ? 'true' : undefined}>
      <span className="status-dot" aria-hidden="true" />
      <span>{now ? statusLine(now.state, now.minutes) : fallback}</span>
    </span>
  );
}

/** "Today 7am – 2am" in the browser; `fallback` (e.g. the weekly summary) in the static HTML. */
export function TodayHours({ fallback, className = '' }: { fallback: string; className?: string }) {
  const now = useDinerNow();
  return <span className={className}>{now ? todayHours(now.day) : fallback}</span>;
}
