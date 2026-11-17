'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { diner } from '../content/diner';
import { menu } from '../content/menu';
import { jukeboxCode } from '../lib/menu-codes';
import { MENU_FILTERS, matchesAll, visibleCounts, type MenuFilter } from '../lib/menu-filter';
import { Icon } from './icons';
import { TitleStrip } from './title-strip';

const SMALL_SCREEN = '(width < 40rem)';

/**
 * The full menu as jukebox wallbox pages A–G. Everything is in the static HTML. In the browser:
 * - the chrome page keys flip the wallbox to one page at a time on small screens (and jump on larger ones);
 * - filters (vegetarian, vegan, breakfast now) hide strips that don't match. Codes never change.
 */
export function JukeboxMenu() {
  const [filters, setFilters] = useState<MenuFilter[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [enhanced, setEnhanced] = useState(false);
  const counts = visibleCounts(menu.sections, filters);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  useEffect(() => setEnhanced(true), []);

  // Leaving the small-screen layout shows every page again.
  useEffect(() => {
    const query = window.matchMedia(SMALL_SCREEN);
    const reset = () => { if (!query.matches) setActive(null); };
    query.addEventListener('change', reset);
    return () => query.removeEventListener('change', reset);
  }, []);

  const toggle = (id: MenuFilter) =>
    setFilters(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);

  function flip(event: MouseEvent<HTMLAnchorElement>, id: string | null) {
    if (!window.matchMedia(SMALL_SCREEN).matches) return; // larger screens: a normal jump link
    event.preventDefault();
    setActive(id);
    history.replaceState(null, '', id ? `#${id}` : location.pathname);
    requestAnimationFrame(() => document.getElementById(id ?? 'jukebox')?.scrollIntoView({ block: 'start' }));
  }

  return (
    <div id="jukebox" data-paged={active ? '' : undefined}>
      <div className="chrome sticky top-(--header-h) z-30 mb-6 rounded-b-2xl border-2 border-t-0 border-chrome-edge px-2.5 py-2.5 shadow-lift sm:px-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <nav aria-label="Menu pages" className="scrollbar-none -m-1 flex gap-1 overflow-x-auto p-1 sm:gap-1.5">
            {menu.sections.map(section => (
              <a key={section.id} href={`#${section.id}`} className="key relative max-sm:min-h-11 max-sm:min-w-10 max-sm:px-1 max-sm:text-[1.2rem]" title={section.title}
                aria-current={active === section.id ? 'true' : undefined} onClick={event => flip(event, section.id)}>
                {section.letter}
                <span className="sr-only"> {section.title}</span>
                {filters.length ? (
                  <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-accent font-sans text-[.68rem] text-on-accent" aria-hidden="true">{counts[section.id]}</span>
                ) : null}
              </a>
            ))}
          </nav>
          {enhanced ? (
            <div className="scrollbar-none -m-1 flex items-center gap-1.5 overflow-x-auto p-1" role="group" aria-label="Filter the menu">
              {active ? (
                <a href="#jukebox" className="chip min-h-9 py-0.5 text-[.88rem] no-underline max-sm:px-2.5" onClick={event => flip(event, null)}>All pages</a>
              ) : null}
              <Icon name="filter" width={18} height={18} className="flex-none" />
              {MENU_FILTERS.map(filter => (
                <button key={filter.id} type="button" className="chip min-h-9 py-0.5 text-[.88rem] max-sm:px-2.5" aria-pressed={filters.includes(filter.id)} onClick={() => toggle(filter.id)}>
                  {filter.id === 'breakfast' && !diner.breakfastAllDay ? 'Breakfast' : filter.label}
                </button>
              ))}
              {filters.length ? <button type="button" className="chip min-h-9 border-dashed py-0.5 text-[.88rem]" onClick={() => setFilters([])}>Clear</button> : null}
            </div>
          ) : null}
        </div>
        <p className="sr-only" role="status" aria-live="polite">{filters.length ? `${total} items match.` : ''}</p>
      </div>

      <div className="grid gap-10">
        {filters.length && !total ? (
          <p className="rounded-ui border-2 border-dashed border-line p-5 text-muted">Nothing on the menu matches all of those filters. Ask us: we can often swap a side or hold the cheese.</p>
        ) : null}
        {menu.sections.map(section => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}
            hidden={filters.length > 0 && !counts[section.id] && active !== section.id}
            className="jukebox-page wallbox scroll-mt-[calc(var(--toolbar-h)+.25rem)]" data-active={active === section.id ? '' : undefined}>
            <div className="wallbox-window px-[clamp(.75rem,2.5vw,1.75rem)] pt-[clamp(1.25rem,3vw,2rem)] pb-[clamp(1rem,2.5vw,1.75rem)]">
              <header className="mb-5 flex items-center gap-4">
                <span className="key pointer-events-none size-16 flex-none rounded-full text-[2.4rem]" aria-hidden="true">{section.letter}</span>
                <div>
                  <h2 id={`${section.id}-title`} className="text-[clamp(2rem,4vw,2.8rem)] uppercase">
                    <span className="sr-only">{section.letter}: </span>{section.title}
                  </h2>
                  <p className="text-[.98rem] text-muted">{section.description}</p>
                </div>
              </header>
              {counts[section.id] ? null : (
                <p className="rounded-ui border-2 border-dashed border-line p-4 text-muted">Nothing on this page matches those filters. Ask us: we can often swap a side or hold the cheese.</p>
              )}
              <ul className="strip-list strip-pairs grid gap-x-4 gap-y-5 pt-2 sm:grid-cols-2">
                {section.items.map((item, index) => (
                  <li key={item.id} hidden={!matchesAll(item, section, filters)}>
                    <TitleStrip item={item} section={section} code={jukeboxCode(section.letter, index)} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
