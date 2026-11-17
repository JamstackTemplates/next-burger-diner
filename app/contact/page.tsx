import type { Metadata } from 'next';
import { CopyEmail } from '../../components/copy-email';
import { DinerArt } from '../../components/diner-art';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { diner, telHref } from '../../content/diner';
import { absoluteUrl } from '../../lib/paths';
import { site } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Parties, groups & catering',
  description: `Birthday parties, group visits and catering enquiries for ${diner.name}.`,
  alternates: { canonical: absoluteUrl('/contact/') },
};

const subhead = 'mb-1 font-sign text-[1.45rem] font-extrabold uppercase';
const tips = ['The date and time', 'How many guests', 'The occasion', 'Dine-in or catering', 'Any allergies'];

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  return (
    <>
      <PageHead eyebrow="Get in touch" title={<>Birthday parties, group visits <em>&amp; catering</em></>}
        before={<DinerArt art="pie" size={110} plate className="rotate-6" />}>
        <p>
          Walk-ins never need a booking, and takeout is by phone. For a birthday in the big booths, a team lunch for
          ten or more, or burger trays and whole pies for your event, send us a message.
        </p>
        <p>A message is an enquiry: nothing is booked or ordered until we reply to confirm.</p>
      </PageHead>

      <div className="wrap grid items-start gap-[clamp(1.5rem,5vw,4rem)] pt-[clamp(2rem,5vw,3.5rem)] pb-(--space-section) grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="chrome-rim p-2.5 print:hidden" aria-label="Enquiry form">
          {hosted ? (
            <JamstacksSupportForm siteId={site.jamstacksSite} embedUrl={site.jamstacksEmbedUrl} email={diner.email} />
          ) : (
            <div className="grid justify-items-start gap-4 rounded-[calc(var(--radius-panel)-8px)] bg-surface p-[clamp(1.5rem,4vw,2.75rem)]">
              <DinerArt art="burger" size={70} plate />
              <h2 className="text-[clamp(2rem,3.6vw,2.6rem)] uppercase">Write to us directly</h2>
              <p className="max-w-[34rem] text-muted">
                Email is the best way to reach us about parties, groups and catering. Tell us the date, how many guests and
                what you have in mind, and we’ll reply with ideas and prices.
              </p>
              <p><a className="button" href={`mailto:${diner.email}?subject=${encodeURIComponent('Party, group or catering enquiry')}`}>Email {diner.name}</a></p>
            </div>
          )}
        </section>

        <aside className="grid gap-1.5 pt-1" aria-labelledby="direct-title">
          <h2 id="direct-title" className={subhead}>Email</h2>
          <p className="text-[1.25rem] font-semibold wrap-anywhere"><a className="text-link" href={`mailto:${diner.email}`}>{diner.email}</a></p>
          <p className="flex min-h-px flex-wrap items-center gap-x-4 gap-y-2"><CopyEmail email={diner.email} /></p>

          {diner.phone ? (
            <>
              <h2 className={`mt-5 ${subhead}`}>Phone &amp; takeout</h2>
              <p><a className="text-link tabular text-[1.25rem]" href={telHref()}>{diner.phone}</a></p>
              <p className="text-[.95rem] text-muted">Call for takeout or a quick question. We don’t take orders by email.</p>
            </>
          ) : null}

          <h2 className={`mt-5 ${subhead}`}>Useful to include</h2>
          <ul className="grid gap-2">
            {tips.map(tip => (
              <li key={tip} className="relative pl-7 before:absolute before:top-[.3em] before:left-0 before:size-4 before:bg-mustard before:[clip-path:var(--starburst)]">{tip}</li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
