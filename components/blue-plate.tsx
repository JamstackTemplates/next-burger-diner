'use client';

import { DAYS } from '../content/diner';
import { bluePlate, formatPrice } from '../content/menu';
import { bluePlateFor } from '../lib/hours';
import { useDinerNow } from './diner-clock';

/** A blue-rimmed diner plate. Decorative. */
export function Plate({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="56" fill="var(--art-mug)" stroke="var(--plate-blue)" strokeWidth="6" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="var(--plate-blue)" strokeWidth="2" strokeDasharray="3 5" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="var(--plate-blue)" strokeWidth="1.5" opacity=".5" />
      {/* Mashed potatoes with gravy, two slices of meatloaf and green beans */}
      <path d="M62 44c4-10 22-10 24 2 6 2 6 12-2 14H62c-8-2-8-14 0-16z" fill="var(--art-cream)" stroke="var(--art-line)" strokeWidth="1.5" />
      <path d="M68 50c4-3 10-3 14 1" fill="none" stroke="var(--art-syrup)" strokeWidth="3" strokeLinecap="round" />
      <rect x="32" y="50" width="26" height="15" rx="4" fill="var(--art-patty)" stroke="var(--art-line)" strokeWidth="1.5" transform="rotate(-12 45 57)" />
      <rect x="36" y="62" width="26" height="15" rx="4" fill="var(--art-patty)" stroke="var(--art-line)" strokeWidth="1.5" transform="rotate(-6 49 69)" />
      <path d="M38 58c6-2 12-2 16 0" fill="none" stroke="var(--art-syrup)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M66 72l18-4M64 78l18-2M68 83l16 0" stroke="var(--art-lettuce)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Chalk-on-chrome blue plate board. The static HTML lists the whole week and makes no claim about
 * today; in the browser, today's special (by the diner's calendar day) is shown large.
 */
export function BluePlateBoard() {
  const now = useDinerNow();
  const today = now ? bluePlateFor(now.day) : undefined;

  return (
    <div className="chrome-rim p-2.5 sm:p-3">
      <div className="board grid gap-6 p-[clamp(1.25rem,3.5vw,2.25rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
        <div className="grid content-start justify-items-start gap-3">
          <p className="font-script text-[clamp(1.9rem,3.6vw,2.6rem)] leading-none text-chalk-accent">{now ? 'Today’s blue plate' : 'Blue plate specials'}</p>
          {now ? (
            today ? (
              <>
                <h3 className="text-[clamp(2.2rem,4.6vw,3.4rem)] text-chalk uppercase">{today.name}</h3>
                <p className="max-w-[34ch] text-[1.08rem] text-chalk-muted">{today.description}</p>
                <p className="tabular font-sign text-[2.4rem] leading-none font-extrabold text-chalk-accent">{formatPrice(today.price)}</p>
              </>
            ) : (
              <h3 className="text-[clamp(2rem,4vw,3rem)] text-chalk uppercase">No blue plate today</h3>
            )
          ) : (
            <>
              <h3 className="text-[clamp(2.2rem,4.6vw,3.4rem)] text-chalk uppercase">A different supper every day</h3>
              <p className="max-w-[36ch] text-[1.08rem] text-chalk-muted">A hot plate with two sides, served from opening to close while it lasts. Here’s the week.</p>
            </>
          )}
          <Plate size={112} className="mt-2 -rotate-6" />
        </div>
        <ul className="grid content-start border-t border-white/15" aria-label="Blue plates this week">
          {DAYS.map(day => {
            const plate = bluePlate[day];
            return (
              <li key={day} className="week-row grid grid-cols-[3.4rem_1fr_auto] sm:grid-cols-[6.2rem_1fr_auto] items-baseline gap-x-3 border-b border-white/15 px-2 py-2.5" data-today={now?.day === day ? 'true' : undefined}>
                <span className="week-day font-sign text-[1.05rem] font-bold tracking-[.12em] text-chalk-muted uppercase">{day.slice(0, 3)}</span>
                <span className="font-semibold text-chalk">{plate ? plate.name : 'No blue plate'}</span>
                <span className="tabular font-sign text-[1.15rem] font-bold text-chalk-accent">{plate ? formatPrice(plate.price) : ''}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Felt letterboard on the back wall: today's blue plate in the browser, a pointer to the week otherwise. */
export function Letterboard() {
  const now = useDinerNow();
  const today = now ? bluePlateFor(now.day) : undefined;
  return (
    <a href="#blue-plate" className="letterboard block rotate-[1.5deg] px-6 pt-5 pb-6 text-center no-underline transition hover:rotate-0">
      <span className="block text-[.95rem] font-bold tracking-[.3em] opacity-80">{now ? 'Today’s' : 'Every day'}</span>
      <span className="mt-1 block text-[1.6rem] leading-none font-extrabold">Blue plate</span>
      <span className="mx-auto my-3 block h-px w-16 bg-current opacity-40" />
      {now ? (
        today ? (
          <>
            <span className="block text-[1.45rem] leading-[1.1] font-bold">{today.name}</span>
            <span className="tabular mt-2 block text-[1.5rem] font-extrabold text-chalk-accent">{formatPrice(today.price)}</span>
          </>
        ) : <span className="block text-[1.3rem] font-bold">Not today. See the week</span>
      ) : (
        <span className="block text-[1.2rem] leading-[1.2] font-bold">A hot supper<br />every day<br />see the week ↓</span>
      )}
    </a>
  );
}
