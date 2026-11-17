import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { BluePlateBoard, Letterboard } from '../components/blue-plate';
import { CounterStools } from '../components/counter-stools';
import { ShakeGlass } from '../components/diner-art';
import { GoogleMap } from '../components/google-map';
import { Icon, type IconName } from '../components/icons';
import { NeonSign } from '../components/neon-sign';
import { SiteLink } from '../components/site-link';
import { StatusLine, TodayHours } from '../components/status-line';
import { TimeZoneNote } from '../components/time-zone-note';
import { TitleStrip } from '../components/title-strip';
import { diner, formatAddress, telHref } from '../content/diner';
import { allItems, featuredItems, formatPrice, menu } from '../content/menu';
import { groupedHours } from '../lib/hours';
import { mapDirectionsUrl, mapSearchUrl } from '../lib/maps';
import { codeAnchor, codesById } from '../lib/menu-codes';
import { absoluteUrl, asset, menuAnchor } from '../lib/paths';
import { dinerStructuredData, jsonLd } from '../lib/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

// Repeated text styles, kept here so every section matches.
const sectionTitle = 'mt-2 text-[clamp(2.4rem,5vw,3.6rem)] uppercase';
const lede = 'max-w-(--measure) text-[clamp(1.05rem,1.5vw,1.18rem)]';

const codes = codesById(menu.sections);
const sectionOf = (id: string) => menu.sections.find(section => section.items.some(item => item.id === id))!;
const weekSummary = groupedHours().map(group => `${group.label} ${group.hours}`).join(' · ');

export default function HomePage() {
  const shakePrice = menu.shakes.price.map(size => `${size.label.toLowerCase()} ${formatPrice(size.amount)}`).join(' · ');
  const malt = menu.shakes.extras.find(extra => /malt/i.test(extra.name));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(dinerStructuredData()) }} />

      {/* 1. The back wall: a checkered trim, the neon sign, and a burger and shake on the counter */}
      <section className="tile-wall tile-wall-glow relative overflow-hidden" aria-labelledby="hero-title">
        <div className="checker-trim" aria-hidden="true" />
        <div className="wrap grid items-end gap-x-8 gap-y-4 pt-[clamp(1.25rem,3vw,2.25rem)] lg:grid-cols-[minmax(0,1.12fr)_minmax(0,.88fr)]">
          <div className="pb-[clamp(1.75rem,3.5vw,2.75rem)]">
            <h1 id="hero-title" className="-ml-[2%] max-w-[46rem]">
              <span className="sr-only">{diner.name}</span>
              <NeonSign />
            </h1>
            <p className="mt-1 font-sign text-[clamp(1.2rem,2.1vw,1.55rem)] font-extrabold tracking-[.14em] uppercase">{diner.tagline}</p>
            <p className={`mt-3 ${lede}`}>{diner.introduction}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <SiteLink href="/menu/" className="button">See the menu <Icon name="arrow" width={18} height={18} /></SiteLink>
              <a href="#find-us" className="button button-chrome">Find us</a>
            </div>
          </div>

          {/* On the counter: the owner's burger and shake art (public/burger.svg, public/milkshake.svg) */}
          <div className="relative mx-auto w-full max-w-[34rem] print:hidden">
            <div className="relative z-20 mx-auto mb-5 w-full max-w-[13rem] lg:absolute lg:top-0 lg:right-0 lg:mb-0 lg:w-[14.5rem]">
              <Letterboard />
            </div>
            <div className="relative h-[clamp(14rem,30vw,20rem)] lg:mt-[13.5rem]">
              <div className="sunburst absolute bottom-[-30%] left-[-12%] aspect-square w-[95%]" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element -- static export: plain <img> */}
              <img src={asset('/burger.svg')} alt="" width={332} height={263}
                className="absolute bottom-0 left-0 w-[64%] translate-y-[6%] drop-shadow-[0_10px_8px_rgba(0,0,0,.25)]" />
              {/* eslint-disable-next-line @next/next/no-img-element -- static export: plain <img> */}
              <img src={asset('/milkshake.svg')} alt="" width={98} height={200}
                className="absolute right-[3%] bottom-0 h-[100%] w-auto translate-y-[3%] drop-shadow-[0_10px_8px_rgba(0,0,0,.25)]" />
              <span className="starburst absolute top-[-6%] left-[-3%] -rotate-12 px-4 text-[.82rem] leading-none [--burst-size:7.6rem]" aria-hidden="true">
                {diner.promises[1]?.title ?? 'Hand-pressed'}
              </span>
            </div>
          </div>
        </div>
        <div className="countertop h-[clamp(1.5rem,3vw,2.4rem)]" aria-hidden="true" />
      </section>

      {/* 2. The counter edge carries the status, then Find us on the counter front */}
      <div className="counter-rail counter-rail-text relative z-10">
        <div className="wrap flex flex-wrap items-center gap-x-7 gap-y-1.5 pt-4 pb-5 text-[1rem] font-semibold">
          <StatusLine fallback="Hours below" className="font-sign text-[1.25rem] font-extrabold tracking-[.06em] uppercase" />
          <span className="inline-flex items-center gap-2"><Icon name="clock" width={18} height={18} /><TodayHours className="tabular" fallback={weekSummary} /></span>
          <a href="#find-us" className="inline-flex items-center gap-2 no-underline hover:underline"><Icon name="pin" width={18} height={18} />{diner.address.street}</a>
          {diner.phone ? <a href={telHref()} className="tabular inline-flex items-center gap-2 no-underline hover:underline"><Icon name="phone" width={18} height={18} />{diner.phone}</a> : null}
        </div>
      </div>

      <div className="formica" aria-hidden="true"><CounterStools /></div>
      <section id="find-us" className="formica pt-[clamp(1rem,2.5vw,2rem)] pb-[clamp(2.5rem,5vw,4rem)]" aria-labelledby="find-us-title">
        <div className="wrap grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)_minmax(0,1.2fr)]">
          <div className="card p-[clamp(1.25rem,3vw,2rem)] shadow-card">
            <p className="eyebrow">Find us</p>
            <h2 id="find-us-title" className="mt-3 text-[clamp(2rem,3.6vw,2.6rem)] uppercase">
              {diner.address.street}
              <span className="mt-1.5 block font-sans text-[1.05rem] font-semibold tracking-normal normal-case text-muted">
                {diner.address.locality}, {diner.address.region} {diner.address.postalCode}
              </span>
            </h2>
            {diner.address.note ? <p className="mt-3 flex items-start gap-2 text-[.98rem]"><Icon name="pin" width={18} height={18} className="mt-1 flex-none text-accent" />{diner.address.note}</p> : null}
            <p className="mt-5 flex flex-wrap gap-3">
              <a className="button" href={mapDirectionsUrl(formatAddress())} rel="noopener">Get directions</a>
              <a className="button button-chrome" href={mapSearchUrl(formatAddress())} rel="noopener">Open in Google Maps</a>
            </p>
            {diner.directions.length ? (
              <ul className="mt-5 grid gap-2 text-[.96rem] text-muted">
                {diner.directions.map(line => (
                  <li key={line} className="relative pl-6 before:absolute before:top-[.45em] before:left-0 before:size-3 before:bg-mustard before:[clip-path:var(--starburst)]">{line}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="card p-[clamp(1.25rem,3vw,2rem)] shadow-card">
            <h3 className="flex items-center gap-2 text-[1.8rem] uppercase"><Icon name="clock" width={22} height={22} className="text-accent" />Hours</h3>
            {diner.notice ? <p className="mt-3 rounded-ui bg-mustard-soft px-4 py-3 text-[.96rem] font-semibold">{diner.notice}</p> : null}
            <ul className="mt-3">
              {groupedHours().map(group => (
                <li key={group.label} className={`flex items-center justify-between gap-4 border-b border-line py-3 ${group.late ? 'font-bold' : ''}`}>
                  <span>{group.label}</span>
                  <span className="tabular flex items-center gap-2 font-sign text-[1.3rem] font-bold tracking-wide">
                    {group.hours}
                    {group.late ? <span className="starburst [--burst-size:2.6rem] text-[.6rem]">Late</span> : null}
                  </span>
                </li>
              ))}
            </ul>
            <TimeZoneNote />
            <p className="mt-4 text-[.96rem] text-muted">
              {diner.breakfastAllDay ? 'Breakfast is served every minute we’re open. ' : ''}The grill and fryer stay on until closing.
            </p>
          </div>

          <div className="chrome-rim p-2.5">
            <GoogleMap className="h-full min-h-80" />
          </div>
        </div>
      </section>

      {/* 3. Today's blue plate in a booth */}
      <section id="blue-plate" className="wrap pt-(--space-section)" aria-labelledby="blue-plate-title">
        <div className="booth px-[clamp(1rem,3.5vw,2.75rem)] pt-[clamp(1.5rem,3.5vw,2.5rem)] pb-[clamp(1rem,3.5vw,2.75rem)]">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-script text-[clamp(1.6rem,3vw,2.2rem)] leading-none">Blue plate special</p>
              <h2 id="blue-plate-title" className="mt-1 text-[clamp(2.4rem,5vw,3.6rem)] uppercase">Supper’s on</h2>
            </div>
            <p className="max-w-[30rem] text-[1.02rem]">A home-cooked plate with two sides, a different one each day. Ask at the counter if it’s still on: when it’s gone, it’s gone.</p>
          </div>
          <BluePlateBoard />
        </div>
      </section>

      {/* 4. On the jukebox: featured title strips */}
      <section className="wrap section-y" aria-labelledby="jukebox-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <p className="eyebrow">Make a selection</p>
            <h2 id="jukebox-title" className={sectionTitle}>On the jukebox</h2>
          </div>
          <p className="max-w-[28rem] text-muted">Every dish has a code, like the records in a wallbox. Tell us “B3, make it a combo” and we’ll know.</p>
        </div>
        <div className="wallbox mx-auto max-w-[64rem]">
          <div className="wallbox-window px-[clamp(.75rem,2.5vw,1.75rem)] pt-[clamp(1.5rem,3vw,2.25rem)] pb-[clamp(1rem,2.5vw,1.75rem)]">
            <ul className="strip-pairs grid gap-x-4 gap-y-5 sm:grid-cols-2">
              {featuredItems.map(item => {
                const code = codes.get(item.id)!;
                return (
                  <li key={item.id} className="group relative">
                    <SiteLink href={menuAnchor(codeAnchor(code))} className="block h-full no-underline transition group-hover:-translate-y-0.5" aria-label={`${code} ${item.name} on the menu`}>
                      <TitleStrip item={item} section={sectionOf(item.id)} code={code} showSection anchors={false} art />
                    </SiteLink>
                  </li>
                );
              })}
            </ul>
          </div>
          <nav aria-label="Menu pages" className="flex flex-wrap items-center justify-center gap-2 px-2 pt-4 pb-2">
            {menu.sections.map(section => (
              <SiteLink key={section.id} href={menuAnchor(section.id)} className="key" title={section.title}>
                {section.letter}<span className="sr-only"> {section.title}</span>
              </SiteLink>
            ))}
            <SiteLink href="/menu/" className="key px-4 font-sign text-[1.1rem] tracking-[.1em] uppercase">Full menu · {allItems.length}</SiteLink>
          </nav>
        </div>
      </section>

      {/* 5. Shakes: tinted glasses from the flavours in content/menu.ts */}
      <section className="tile-wall tile-wall-glow overflow-hidden" aria-labelledby="shakes-title">
        <div className="wrap pt-[clamp(2.5rem,5vw,4rem)]">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div>
              <p className="wordmark font-script text-[clamp(1.8rem,3.2vw,2.4rem)] leading-none">Hand-spun</p>
              <h2 id="shakes-title" className="mt-1 text-[clamp(2.4rem,5vw,3.6rem)] uppercase">Shakes &amp; malts</h2>
            </div>
            <p className="tabular font-sign text-[1.35rem] font-bold tracking-[.06em] uppercase">
              {shakePrice}{malt ? ` · malt it +${formatPrice(malt.price)}` : ''}
            </p>
          </div>
          <ul className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] items-end gap-x-3 gap-y-6">
            {menu.shakes.flavours.map(flavour => (
              <li key={flavour.id} className="shake grid justify-items-center gap-2 text-center" style={{ '--shake-tint': flavour.color } as CSSProperties}>
                <SiteLink href={menuAnchor(flavour.id)} className="grid justify-items-center gap-2 no-underline">
                  <ShakeGlass color={flavour.color} size={118} />
                  <span className="font-sign text-[1.2rem] leading-tight font-extrabold tracking-[.04em] uppercase">
                    {flavour.name}
                    <span className="block text-[.9rem] font-bold tracking-[.12em] opacity-75">{flavour.malt ? 'malt' : 'shake'}{flavour.seasonal ? ' · seasonal' : ''}{flavour.soldOut ? ' · 86’d' : ''}</span>
                  </span>
                </SiteLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="counter-rail mt-8 h-6" aria-hidden="true" />
      </section>

      {/* 6. Our story in a booth */}
      <section className="wrap pt-(--space-section)" aria-labelledby="story-title">
        <div className="booth grid gap-8 px-[clamp(1.25rem,4vw,3.25rem)] py-[clamp(1.75rem,4vw,3.25rem)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="font-script text-[clamp(1.6rem,3vw,2.2rem)] leading-none">Our story</p>
            <h2 id="story-title" className="mt-1 text-[clamp(2.4rem,5vw,3.6rem)] uppercase">Same counter, same pie</h2>
            {diner.story.map(paragraph => <p key={paragraph} className={`mt-4 ${lede}`}>{paragraph}</p>)}
          </div>
          <ul className="grid content-center gap-3.5">
            {diner.promises.map((promise, index) => (
              <li key={promise.title} className="flex items-center gap-4 rounded-card bg-paper p-4 text-paper-ink shadow-card">
                <span className="starburst [--burst-size:3.4rem] text-[1.4rem]" aria-hidden="true">{index + 1}</span>
                <span>
                  <strong className="block font-sign text-[1.45rem] leading-tight font-extrabold uppercase">{promise.title}</strong>
                  <span className="block text-[.96rem] text-paper-muted">{promise.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {diner.amenities.map(amenity => (
            <li key={amenity.title} className="flex items-start gap-3">
              <span className="key pointer-events-none size-11 min-w-0 flex-none rounded-full p-0"><Icon name={amenity.icon as IconName} width={20} height={20} /></span>
              <span>
                <strong className="block font-sign text-[1.25rem] leading-tight font-extrabold uppercase">{amenity.title}</strong>
                <span className="block text-[.95rem] text-muted">{amenity.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Parties and group visits */}
      <section className="wrap pt-(--space-section)" aria-labelledby="parties-title">
        <div className="chrome-rim p-2.5">
          <div className="formica grid items-center gap-6 overflow-hidden rounded-[calc(var(--radius-panel)-8px)] px-[clamp(1.25rem,4vw,3rem)] py-[clamp(1.5rem,4vw,2.75rem)] md:grid-cols-[auto_1fr_auto]">
            <span className="starburst [--burst-size:7rem] text-[1.6rem] max-md:hidden" aria-hidden="true">10+</span>
            <div>
              <h2 id="parties-title" className="text-[clamp(2rem,4vw,2.9rem)] uppercase">Birthday parties, group visits &amp; catering</h2>
              <p className="mt-2 max-w-[44rem] text-muted">
                Walk-ins never need a booking. Bringing ten or more, planning a birthday in the big booths, or want pies and burger trays
                for the office? Send us a note and we’ll reply to work out the details.
              </p>
            </div>
            <p><SiteLink href="/contact/" className="button">Send an enquiry</SiteLink></p>
          </div>
        </div>
      </section>

      {/* 8. FAQs */}
      {diner.faqs.length ? (
        <section id="faq" className="wrap section-y" aria-labelledby="faq-title">
          <p className="eyebrow">FAQs</p>
          <h2 id="faq-title" className={sectionTitle}>Good to know</h2>
          <div className="mt-7 grid items-start gap-3 lg:grid-cols-2">
            {diner.faqs.map(faq => (
              <details key={faq.question} className="faq card shadow-card">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[1.06rem] font-bold">{faq.question}</summary>
                <p className="px-5 pb-5 text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-muted">
            Something else? <SiteLink href="/contact/" className="text-link">Send us a note</SiteLink>
            {diner.phone ? <> or call <a className="text-link tabular" href={telHref()}>{diner.phone}</a></> : null}.
          </p>
        </section>
      ) : null}
    </>
  );
}
