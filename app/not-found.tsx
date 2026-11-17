import type { Metadata } from 'next';
import { ShakeGlass } from '../components/diner-art';
import { PageHead } from '../components/page-head';
import { SiteLink } from '../components/site-link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="pb-(--space-section)" aria-labelledby="not-found-title">
      <PageHead id="not-found-title" eyebrow="404" title={<>This record’s not <em>on the jukebox</em></>}
        before={<ShakeGlass color="#f3e3bf" size={140} className="-rotate-6" />}>
        <p>The link may be out of date, or the page may have moved. Try one of these instead:</p>
      </PageHead>
      <ul className="wrap mt-10 flex flex-wrap gap-3">
        <li><SiteLink href="/" className="button">Home</SiteLink></li>
        <li><SiteLink href="/menu/" className="button button-chrome">The menu</SiteLink></li>
        <li><SiteLink href="/#find-us" className="button button-chrome">Hours &amp; directions</SiteLink></li>
        <li><SiteLink href="/contact/" className="button button-chrome">Contact</SiteLink></li>
      </ul>
    </section>
  );
}
