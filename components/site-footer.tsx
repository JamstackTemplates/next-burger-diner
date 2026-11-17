import { diner, formatAddress, publicLinks, telHref } from '../content/diner';
import { groupedHours } from '../lib/hours';
import { SiteLink } from './site-link';
import { TimeZoneNote } from './time-zone-note';

const heading = 'mb-3 font-sign text-[1.05rem] font-extrabold tracking-[.18em] text-footer-muted uppercase';
const footerLink = 'font-bold text-footer-ink underline decoration-footer-accent/50 underline-offset-[.2em] hover:text-footer-accent hover:decoration-footer-accent';

/** A chrome kick-rail, a dark band with the details, and the checkerboard floor in perspective. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer mt-16 bg-footer text-footer-ink">
      <div className="counter-rail-thin" aria-hidden="true" />
      <div className="wrap grid gap-x-12 gap-y-9 pt-12 pb-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_.8fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-script text-[2.6rem] leading-none text-footer-accent">{diner.name}</p>
          <p className="mt-2 mb-5 font-sign text-[1.05rem] font-bold tracking-[.14em] text-footer-muted uppercase">{diner.tagline}</p>
          <address className="leading-[1.85] not-italic">
            {formatAddress()}<br />
            {diner.phone ? <><a className={`${footerLink} tabular`} href={telHref()}>{diner.phone}</a><br /></> : null}
            <a className={footerLink} href={`mailto:${diner.email}`}>{diner.email}</a>
          </address>
        </div>
        <div>
          <h2 className={heading}>Hours</h2>
          <ul className="text-[.97rem]">
            {groupedHours().map(group => (
              <li key={group.label} className="flex justify-between gap-4 border-b border-white/15 py-2">
                <span>{group.label}</span>
                <span className="tabular font-semibold">
                  {group.hours}
                  {group.late ? <span className="ml-2 rounded-sm bg-footer-accent px-1.5 py-px font-sign text-[.8rem] font-extrabold tracking-wider text-footer uppercase">Late</span> : null}
                </span>
              </li>
            ))}
          </ul>
          <TimeZoneNote className="text-footer-muted" />
        </div>
        <div>
          <h2 className={heading}>Around here</h2>
          <ul className="grid gap-2 font-bold [&_a]:no-underline [&_a:hover]:text-footer-accent [&_a:hover]:underline">
            <li><SiteLink href="/menu/">Menu</SiteLink></li>
            <li><SiteLink href="/#blue-plate">Blue plate specials</SiteLink></li>
            <li><SiteLink href="/#find-us">Find us</SiteLink></li>
            <li><SiteLink href="/#faq">FAQs</SiteLink></li>
            <li><SiteLink href="/contact/">Parties &amp; catering</SiteLink></li>
            {publicLinks.map(link => <li key={link.url}><a href={link.url} rel="me noopener">{link.label}</a></li>)}
          </ul>
        </div>
      </div>
      <p className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/15 pt-5 pb-7 text-[.9rem] text-footer-muted">
        <span>© {year} {diner.name} · pie’s fresh at 11</span>
        <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-footer-accent hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
      </p>
      <div className="counter-rail-thin" aria-hidden="true" />
      <div className="floor print:hidden" aria-hidden="true" />
    </footer>
  );
}
