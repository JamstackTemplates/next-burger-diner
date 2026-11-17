import { diner } from '../content/diner';
import { menu } from '../content/menu';
import { absoluteUrl } from './paths';

/**
 * schema.org Restaurant for search engines and maps, built from the same content as the pages.
 * Late nights keep `closes` earlier than `opens` (Friday 07:00–02:00), which schema.org reads as
 * closing after midnight.
 */
export function dinerStructuredData() {
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: diner.name,
    description: diner.introduction,
    ...(url ? { url, hasMenu: absoluteUrl('/menu/') } : {}),
    email: diner.email,
    ...(diner.phone ? { telephone: diner.phone } : {}),
    servesCuisine: ['American', 'Burgers', 'Breakfast'],
    acceptsReservations: false,
    priceRange: '$',
    currenciesAccepted: menu.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: diner.address.street,
      addressLocality: diner.address.locality,
      addressRegion: diner.address.region,
      postalCode: diner.address.postalCode,
      addressCountry: diner.address.country,
    },
    openingHoursSpecification: diner.hours.filter(entry => entry.opens && entry.closes).map(entry => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: entry.day,
      opens: entry.opens,
      closes: entry.closes,
    })),
    sameAs: diner.links.filter(link => link.url.trim()).map(link => link.url),
  };
}

/** JSON for an inline <script type="application/ld+json">, safe against closing the script tag. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
