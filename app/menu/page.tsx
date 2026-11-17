import type { Metadata } from 'next';
import { JukeboxMenu } from '../../components/jukebox-menu';
import { PageHead } from '../../components/page-head';
import { SiteLink } from '../../components/site-link';
import { StatusLine } from '../../components/status-line';
import { diner, telHref } from '../../content/diner';
import { formatPrice, menu } from '../../content/menu';
import { absoluteUrl, asset } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Menu',
  description: `Breakfast all day, burgers, dogs and sandwiches, sides, shakes and malts, pie and drinks at ${diner.name}.`,
  alternates: { canonical: absoluteUrl('/menu/') },
};

const asideTitle = 'mb-2 font-sign text-[1.5rem] font-extrabold uppercase';
const row = 'flex justify-between gap-4 border-b border-line py-2 text-[.95rem]';

/** Combo explainer, shake extras and allergen notes. Rendered once per layout (side panel or collapsible). */
function MenuNotes() {
  return (
    <div className="grid gap-6">
      <div>
        <h3 className={asideTitle}>Make it a combo</h3>
        <p className="flex items-center gap-3">
          <span className="starburst [--burst-size:3.6rem]" aria-hidden="true">+{formatPrice(menu.combo.price)}</span>
          <span>Add {menu.combo.adds.toLowerCase()} to any strip with a combo starburst for {formatPrice(menu.combo.price)}.</span>
        </p>
      </div>
      <div>
        <h3 className={asideTitle}>Shake extras</h3>
        <ul>
          {menu.shakes.extras.map(extra => (
            <li key={extra.name} className={row}>
              <span>{extra.name}</span>
              <span className="tabular font-sign text-[1.1rem] font-bold whitespace-nowrap">{extra.price ? `+${formatPrice(extra.price)}` : 'On us'}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className={asideTitle}>Allergies</h3>
        <div className="grid gap-2 text-[.92rem] text-muted">{menu.notes.map(note => <p key={note}>{note}</p>)}</div>
      </div>
      <p className="text-[.95rem]"><SiteLink href="/contact/" className="text-link">Feeding a group? Tell us</SiteLink></p>
    </div>
  );
}

export default function MenuPage() {
  return (
    <>
      <PageHead eyebrow="The jukebox" title={<>Pick a page, <em>any page</em></>}
        before={<img src={asset('/milkshake.svg')} alt="" width={88} height={180} className="h-[180px] w-auto rotate-6" />}>
        <p>Every dish has a code: tell us “B3, make it a combo” at the counter.{diner.breakfastAllDay ? ' Breakfast is served all day.' : ''}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-sign text-[1.25rem] font-extrabold tracking-[.06em] uppercase">
          <StatusLine fallback="See the hours" />
          {diner.phone ? <a className="tabular no-underline hover:underline" href={telHref()}>Takeout: {diner.phone}</a> : null}
        </p>
      </PageHead>

      <div className="wrap grid items-start gap-[clamp(1.5rem,3vw,2.5rem)] pb-(--space-section) grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_18rem]">
        <JukeboxMenu />

        <aside className="chrome-rim p-2 max-lg:hidden lg:sticky lg:top-[calc(var(--header-h)+var(--toolbar-h)+1rem)] lg:mt-[calc(var(--toolbar-h)+1.5rem)]" aria-label="Combos, extras and allergies">
          <div className="rounded-[calc(var(--radius-panel)-6px)] bg-surface p-5">
            <MenuNotes />
          </div>
        </aside>
        <details className="aside-panel chrome-rim -order-1 mt-6 p-2 lg:hidden">
          <summary className="flex cursor-pointer items-center justify-between rounded-[calc(var(--radius-panel)-6px)] bg-surface px-5 py-3 font-sign text-[1.3rem] font-extrabold uppercase">
            Combos, extras &amp; allergies
          </summary>
          <div className="mt-2 rounded-[calc(var(--radius-panel)-6px)] bg-surface p-5">
            <MenuNotes />
          </div>
        </details>
      </div>
    </>
  );
}
