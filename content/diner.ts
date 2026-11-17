// Diner details. Edit this file to make the website yours.
// Everything here is placeholder content for a fictitious diner. The sample address is a public
// landmark (Old Town Plaza, Albuquerque) so the map has something to show; replace it with yours.
// Plain strings only: text is rendered as text, never as HTML.

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS: readonly Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface OpeningHours {
  day: Day;
  /** 24-hour "HH:MM" local time, e.g. "07:00". Omit both `opens` and `closes` to mark the day closed. */
  opens?: string;
  /**
   * 24-hour "HH:MM" local time. A time *earlier* than `opens` means after midnight: Friday
   * `opens: '07:00', closes: '02:00'` stays open until 2am Saturday morning.
   */
  closes?: string;
}

export interface Amenity {
  /** Icon name from components/icons.tsx. */
  icon: 'booth' | 'counter' | 'kids' | 'takeout' | 'parking' | 'access';
  title: string;
  detail: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface DinerLink {
  label: string;
  /** Absolute https:// URL. Entries with an empty URL are not rendered. */
  url: string;
}

export interface Diner {
  name: string;
  /**
   * How the name is drawn on the neon sign in the hero: `script` in flowing tubes, `block` in
   * tall capitals underneath. Keep `script` short (up to about 10 characters) so it stays big.
   */
  sign: { script: string; block: string };
  /** Short line under the sign on the home page. */
  tagline: string;
  /** One or two sentences: the first thing visitors read. */
  introduction: string;
  /** Home page "Our story" paragraphs. */
  story: string[];
  /** Three short points beside the story, e.g. "Breakfast all day". */
  promises: { title: string; detail: string }[];
  /** True when breakfast is served all day. Drives the status line and the "Breakfast now" filter. */
  breakfastAllDay: boolean;
  /** Public contact address. Choose an address you are happy to publish. */
  email: string;
  /** Public phone number as written for people, e.g. "(505) 555-0142". Set to '' to hide it. */
  phone: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2, e.g. "US". */
    country: string;
    /** Optional landmark or cross streets shown under the address. */
    note?: string;
  };
  /** How to find you: parking, transit, landmarks, access. */
  directions: string[];
  /** Local times in the diner's time zone, which is set by `timeZone` in site.config.json. */
  hours: OpeningHours[];
  /** Optional one-off notice such as holiday hours. Set to '' to hide it. */
  notice: string;
  amenities: Amenity[];
  faqs: Faq[];
  /** Public profiles. Leave `url` empty to hide an entry. */
  links: DinerLink[];
}

export const diner: Diner = {
  name: 'Acme Diner',
  sign: { script: 'Acme', block: 'Diner' },
  tagline: 'Burgers · breakfast all day · shakes & pie',
  introduction:
    'A family-run diner on Old Town Plaza since 1956. Pancakes from 7 in the morning, hand-pressed burgers off the flat-top, and the grill stays hot till 2am on Friday and Saturday nights.',
  story: [
    'Grandpa Walt opened the counter with eleven stools, a secondhand flat-top and his mother’s pie recipes. Three generations later the stools have been re-covered twice, and the pie recipes haven’t changed at all.',
    'We still press every patty by hand in the morning, crack eggs to order and bake the pies before the doors open. Sit at the counter and you can watch it all happen.',
  ],
  promises: [
    { title: 'Breakfast all day', detail: 'Pancakes at midnight? Pull up a stool.' },
    { title: 'Hand-pressed patties', detail: 'Fresh beef, pressed every morning, smashed on the flat-top.' },
    { title: 'Pie baked every morning', detail: 'Fruit pies out at 11. Cream pies set by lunch.' },
  ],
  breakfastAllDay: true,
  email: 'hello@example.com',
  phone: '(505) 555-0142',
  address: {
    street: '200 N Plaza St NW',
    locality: 'Albuquerque',
    region: 'NM',
    postalCode: '87104',
    country: 'US',
    note: 'On Old Town Plaza, by Romero St NW and San Felipe St NW',
  },
  directions: [
    'Public parking lots ring Old Town; the closest are a two-minute walk from the plaza.',
    'City buses run along Central Avenue a few blocks south. Walk north up Romero St to the plaza.',
    'Step-free entrance on the plaza side, a wide booth by the door and an accessible restroom.',
  ],
  hours: [
    { day: 'Monday', opens: '07:00', closes: '22:00' },
    { day: 'Tuesday', opens: '07:00', closes: '22:00' },
    { day: 'Wednesday', opens: '07:00', closes: '22:00' },
    { day: 'Thursday', opens: '07:00', closes: '22:00' },
    { day: 'Friday', opens: '07:00', closes: '02:00' },
    { day: 'Saturday', opens: '07:00', closes: '02:00' },
    { day: 'Sunday', opens: '07:00', closes: '22:00' },
  ],
  notice: '',
  amenities: [
    { icon: 'booth', title: 'Booths for six', detail: 'Eight cherry-red booths, first come, first served.' },
    { icon: 'counter', title: 'Counter seats', detail: 'Fourteen stools with a view of the flat-top.' },
    { icon: 'kids', title: 'Kids’ menu', detail: 'Short stacks, mini burgers and crayons for under-12s.' },
    { icon: 'takeout', title: 'Takeout by phone', detail: 'Call ahead and we’ll have it bagged at the register.' },
  ],
  faqs: [
    {
      question: 'Is breakfast really served all day?',
      answer: 'Every minute we’re open. Pancakes, eggs any style and the breakfast burrito are on from 7am until we close, including 1am on a Saturday.',
    },
    {
      question: 'How late are you open?',
      answer: 'Until 10pm Sunday to Thursday, and until 2am on Friday and Saturday nights. The grill and the fryer stay on until closing.',
    },
    {
      question: 'Do you take reservations?',
      answer: 'We’re walk-in only, and the booths turn over quickly. For groups of 10 or more, send us a note on the Contact page and we’ll work something out.',
    },
    {
      question: 'Do you have vegetarian and vegan options?',
      answer: 'Yes. The veggie burger is vegan on a vegan bun, and the menu marks vegetarian and vegan dishes. Ask us to cook your eggs and grilled cheese on a clean part of the flat-top.',
    },
    {
      question: 'Can you do gluten-free?',
      answer: 'Some dishes are made with gluten-free ingredients and marked GF, but everything shares one grill and one fryer, so we can’t promise anything is free from gluten. Please tell us about any allergy when you order.',
    },
    {
      question: 'Is there a kids’ menu?',
      answer: 'Yes: short stacks, a mini cheeseburger, grilled cheese and a kid-size shake, all for under-12s, with crayons on the house.',
    },
    {
      question: 'Can I order takeout?',
      answer: 'Call us and we’ll have it ready at the register in about 15 minutes. We don’t take orders online or by email.',
    },
  ],
  links: [
    // Add your public profiles. Entries with an empty URL are hidden, so no dead links ship.
    { label: 'Instagram', url: '' },
    { label: 'Facebook', url: '' },
    { label: 'Google Maps', url: '' },
  ],
};

/** Profile links that have a URL. */
export const publicLinks = diner.links.filter(link => link.url.trim() !== '');

/** Single-line postal address. */
export function formatAddress(address = diner.address): string {
  return `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`;
}

/** Digits for a tel: link. */
export function telHref(phone = diner.phone): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
