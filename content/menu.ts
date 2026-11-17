// The diner menu. Add, remove, reorder or reprice items here; every page reads from this file.
// Item names and prices are placeholders: replace them with your own.
// Plain strings only: text is rendered as text, never as HTML.
import type { Day } from './diner';

/* ==================================================================
   Blue plate specials: one per day, changed most often, so it's first.
   Set a day to `null` for "no blue plate today".
   ================================================================== */

export interface BluePlate {
  name: string;
  /** One line: what's on the plate. */
  description: string;
  /** Price in `menu.currency`, e.g. 13.5 for $13.50. */
  price: number;
  diet?: Diet[];
}

export const bluePlate: Record<Day, BluePlate | null> = {
  Monday: {
    name: 'Meatloaf Monday',
    description: 'Two thick slices with brown gravy, mashed potatoes, buttered corn and a dinner roll.',
    price: 14.5,
  },
  Tuesday: {
    name: 'Chicken-fried steak',
    description: 'Hand-breaded and smothered in pepper cream gravy, with mashed potatoes and green beans.',
    price: 15.5,
  },
  Wednesday: {
    name: 'Hot turkey sandwich',
    description: 'Roast turkey on white bread under turkey gravy, with mashed potatoes and cranberry sauce.',
    price: 13.5,
  },
  Thursday: {
    name: 'Green chile stew',
    description: 'Pork, potato and roasted green chile, a warm flour tortilla and a side salad.',
    price: 13,
  },
  Friday: {
    name: 'Friday fish fry',
    description: 'Beer-battered cod, fries, coleslaw and tartar sauce. Served until close, even at 1am.',
    price: 16,
  },
  Saturday: {
    name: 'Short rib & noodles',
    description: 'Braised beef short rib over buttered egg noodles with roasted carrots.',
    price: 17.5,
  },
  Sunday: {
    name: 'Sunday pot roast',
    description: 'Slow-cooked chuck roast with potatoes, carrots, pan gravy and a biscuit.',
    price: 16.5,
  },
};

/* ==================================================================
   Menu types
   ================================================================== */

/** Dietary markers shown on title strips and used by the menu filters. */
export type Diet = 'vegetarian' | 'vegan' | 'gluten-free' | 'contains-nuts';

export const DIETS: Record<Diet, { label: string; short: string }> = {
  vegetarian: { label: 'Vegetarian', short: 'V' },
  vegan: { label: 'Vegan', short: 'VG' },
  'gluten-free': { label: 'Gluten-free ingredients, cooked on a shared grill and fryer', short: 'GF' },
  'contains-nuts': { label: 'Contains nuts', short: 'N' },
};

/** Starburst stickers. */
export type Badge = 'house' | 'new' | 'seasonal' | 'big-appetite';

export const BADGES: Record<Badge, string> = {
  house: 'House favourite',
  new: 'New',
  seasonal: 'Seasonal',
  'big-appetite': 'Big appetite',
};

/** Colour of a jukebox page's title-strip band. Each one is a token in app/tailwind.input.css. */
export type Band = 'cherry' | 'mustard' | 'seafoam' | 'chrome' | 'sky' | 'plum' | 'tangerine';

export const BANDS: readonly Band[] = ['cherry', 'mustard', 'seafoam', 'chrome', 'sky', 'plum', 'tangerine'];

/** Small line drawing for featured items. See components/diner-art.tsx. */
export type Art = 'burger' | 'hotdog' | 'mug' | 'pie' | 'pancakes' | 'fries' | 'shake';

export interface SizePrice {
  /** e.g. "Single", "Double", "Slice", "Whole pie". */
  label: string;
  amount: number;
}

export interface MenuItem {
  /** Unique, URL-safe id used for links such as /menu/#green-chile-burger. */
  id: string;
  name: string;
  /** One line, printed on the title strip. */
  description: string;
  /** One price, or a price per size. Amounts are in `menu.currency`, e.g. 4.5 for $4.50. */
  price: number | SizePrice[];
  /** True when "make it a combo" applies (see `menu.combo`). Only in sections listed in `combo.sections`. */
  combo?: boolean;
  /** Optional starburst sticker. */
  badge?: Badge;
  diet?: Diet[];
  /** Show on the home page jukebox (6–8 items). Featured items need `art`. */
  featured?: boolean;
  /** Line drawing shown when the item is featured. */
  art?: Art;
  /** Set to true when it's 86'd (sold out) today. It stays listed, so the codes don't change. */
  soldOut?: boolean;
}

export interface MenuSection {
  /** Unique, URL-safe id used for links such as /menu/#burgers. */
  id: string;
  /** Jukebox page letter, A–Z, unique. Item codes (B3) are this letter plus the item's position. */
  letter: string;
  title: string;
  /** Short line shown under the page title. */
  description: string;
  /** Colour of the band on this page's title strips. */
  band: Band;
  /** True when every item here counts as breakfast (the "Breakfast now" filter). */
  breakfast?: boolean;
  items: MenuItem[];
}

export interface ShakeFlavour {
  /** Unique, URL-safe id. */
  id: string;
  /** e.g. "Chocolate". The menu adds "shake" or "malt". */
  name: string;
  description: string;
  /** Colour of the shake in the glass drawings. Any CSS colour. */
  color: string;
  /** True when this flavour is served malted by default. */
  malt?: boolean;
  /** Seasonal flavour: shown with a starburst. */
  seasonal?: boolean;
  diet?: Diet[];
  /** 86'd today. */
  soldOut?: boolean;
}

export interface Menu {
  /** ISO 4217 currency code. */
  currency: string;
  /** Locale used to format prices, e.g. "en-US". */
  locale: string;
  /** What "make it a combo" adds and costs, defined once for every combo item. */
  combo: {
    /** e.g. "Fries and a fountain soda". */
    adds: string;
    price: number;
    /** Section ids where combos make sense. */
    sections: string[];
  };
  shakes: {
    /** Price per size for every flavour. */
    price: SizePrice[];
    flavours: ShakeFlavour[];
    /** Extras for any shake. */
    extras: { name: string; price: number }[];
  };
  sections: MenuSection[];
  /** Small print beside the menu, e.g. allergy advice. */
  notes: string[];
}

/* ==================================================================
   Shakes (defined once; the E page is built from these flavours)
   ================================================================== */

const shakes: Menu['shakes'] = {
  price: [{ label: 'Regular', amount: 7 }, { label: 'Kid', amount: 4.5 }],
  flavours: [
    { id: 'vanilla-shake', name: 'Vanilla bean', description: 'Real vanilla bean ice cream, whole milk, nothing fancy.', color: '#f3e3bf', diet: ['vegetarian', 'gluten-free'] },
    { id: 'chocolate-malt', name: 'Chocolate', description: 'Double chocolate, malted the old-fashioned way.', color: '#6b3f2a', malt: true, diet: ['vegetarian'] },
    { id: 'strawberry-shake', name: 'Strawberry', description: 'Fresh strawberries blended in. Pink as a booth.', color: '#f08aa0', diet: ['vegetarian', 'gluten-free'] },
    { id: 'black-and-white', name: 'Black & white', description: 'Vanilla ice cream with chocolate syrup ribbons.', color: '#d9d2c5', diet: ['vegetarian', 'gluten-free'] },
    { id: 'banana-malt', name: 'Banana', description: 'Ripe bananas and a scoop of malt powder.', color: '#f2d36b', malt: true, diet: ['vegetarian'] },
    { id: 'peanut-butter-shake', name: 'Peanut butter', description: 'Creamy peanut butter and vanilla. Thick enough to need a spoon.', color: '#c98c4a', diet: ['vegetarian', 'gluten-free', 'contains-nuts'] },
    { id: 'pinon-coffee-shake', name: 'Piñon coffee', description: 'Toasted pine-nut coffee with a pinch of cinnamon.', color: '#a0714f', seasonal: true, diet: ['vegetarian', 'gluten-free', 'contains-nuts'] },
    { id: 'oat-cherry-shake', name: 'Cherry oat', description: 'Oat-milk soft serve and sour cherries. Vegan, no whipped cream.', color: '#c8344a', diet: ['vegan', 'gluten-free'] },
  ],
  extras: [
    { name: 'Whipped cream & a cherry', price: 0 },
    { name: 'Make it a malt', price: 0.75 },
    { name: 'Extra thick', price: 1 },
    { name: 'Oat-milk soft serve', price: 1 },
  ],
};

/** A shake flavour as a title strip on the E page. */
function shakeItem(flavour: ShakeFlavour): MenuItem {
  return {
    id: flavour.id,
    name: `${flavour.name} ${flavour.malt ? 'malt' : 'shake'}`,
    description: flavour.description,
    price: shakes.price,
    diet: flavour.diet,
    ...(flavour.seasonal ? { badge: 'seasonal' as const } : {}),
    ...(flavour.soldOut ? { soldOut: true } : {}),
  };
}

/* ==================================================================
   The menu: seven jukebox pages, A to G
   ================================================================== */

export const menu: Menu = {
  currency: 'USD',
  locale: 'en-US',
  combo: {
    adds: 'Fries and a fountain soda',
    price: 4.5,
    sections: ['burgers', 'dogs-and-sandwiches'],
  },
  shakes,
  sections: [
    {
      id: 'breakfast',
      letter: 'A',
      title: 'Breakfast',
      description: 'Served all day, every day. Eggs any style, hash browns or toast.',
      band: 'mustard',
      breakfast: true,
      items: [
        {
          id: 'buttermilk-pancakes',
          name: 'Buttermilk pancakes',
          description: 'A tall stack with whipped butter and warm syrup. Add blueberries for $1.50.',
          price: [{ label: 'Short stack', amount: 8 }, { label: 'Tall stack', amount: 10.5 }],
          diet: ['vegetarian'],
          badge: 'house',
          featured: true,
          art: 'pancakes',
        },
        {
          id: 'two-eggs-any-style',
          name: 'Two eggs any style',
          description: 'With hash browns, toast and bacon, sausage or green chile.',
          price: 11,
        },
        {
          id: 'breakfast-burrito',
          name: 'Breakfast burrito',
          description: 'Eggs, potatoes, cheese and bacon, smothered in red or green chile.',
          price: 12.5,
          badge: 'big-appetite',
        },
        {
          id: 'biscuits-and-gravy',
          name: 'Biscuits & gravy',
          description: 'Two buttermilk biscuits under sausage cream gravy.',
          price: [{ label: 'Half', amount: 7.5 }, { label: 'Full', amount: 11 }],
        },
        {
          id: 'corned-beef-hash',
          name: 'Corned beef hash',
          description: 'Crispy house hash, two eggs on top and rye toast.',
          price: 13,
          soldOut: true,
        },
        {
          id: 'veggie-scramble',
          name: 'Garden scramble',
          description: 'Eggs scrambled with peppers, onion, spinach and cheddar, plus hash browns.',
          price: 11.5,
          diet: ['vegetarian', 'gluten-free'],
        },
      ],
    },
    {
      id: 'burgers',
      letter: 'B',
      title: 'Burgers',
      description: 'Hand-pressed beef smashed on the flat-top, on a toasted bun with pickles and onion.',
      band: 'cherry',
      items: [
        {
          id: 'classic-burger',
          name: 'The classic',
          description: 'American cheese, lettuce, tomato, onion and house sauce.',
          price: [{ label: 'Single', amount: 10 }, { label: 'Double', amount: 13 }],
          combo: true,
          featured: true,
          art: 'burger',
        },
        {
          id: 'double-cheese',
          name: 'Double cheeseburger',
          description: 'Two patties, two slices of cheese, griddled onions.',
          price: 13.5,
          combo: true,
        },
        {
          id: 'green-chile-burger',
          name: 'Green chile cheeseburger',
          description: 'Roasted New Mexico green chile and melted cheddar. Our best seller.',
          price: [{ label: 'Single', amount: 12 }, { label: 'Double', amount: 15 }],
          combo: true,
          badge: 'house',
          featured: true,
          art: 'burger',
        },
        {
          id: 'patty-melt',
          name: 'Patty melt',
          description: 'Swiss and caramelised onions on grilled rye.',
          price: 12.5,
          combo: true,
        },
        {
          id: 'mushroom-swiss',
          name: 'Mushroom Swiss',
          description: 'Sautéed mushrooms, Swiss cheese and a little garlic butter.',
          price: 12.5,
          combo: true,
        },
        {
          id: 'veggie-burger',
          name: 'Veggie burger',
          description: 'Black bean and corn patty, avocado and pico on a vegan bun.',
          price: 12,
          combo: true,
          diet: ['vegan'],
          badge: 'new',
        },
      ],
    },
    {
      id: 'dogs-and-sandwiches',
      letter: 'C',
      title: 'Dogs & sandwiches',
      description: 'Griddled, stacked and cut corner to corner.',
      band: 'sky',
      items: [
        {
          id: 'chili-dog',
          name: 'Chili dog',
          description: 'All-beef frank, house chili, cheddar and onions.',
          price: 8.5,
          combo: true,
          featured: true,
          art: 'hotdog',
        },
        {
          id: 'club-sandwich',
          name: 'Turkey club',
          description: 'Three decks of turkey, bacon, lettuce and tomato on toast.',
          price: 13,
          combo: true,
          badge: 'big-appetite',
        },
        {
          id: 'blt',
          name: 'BLT',
          description: 'Thick-cut bacon, crisp lettuce and ripe tomato on sourdough.',
          price: 10.5,
          combo: true,
        },
        {
          id: 'grilled-cheese',
          name: 'Grilled cheese',
          description: 'American and cheddar on buttery griddled white bread.',
          price: 8,
          combo: true,
          diet: ['vegetarian'],
        },
      ],
    },
    {
      id: 'sides',
      letter: 'D',
      title: 'Sides',
      description: 'Out of the fryer and onto the counter.',
      band: 'tangerine',
      items: [
        {
          id: 'fries',
          name: 'Shoestring fries',
          description: 'Skin-on, double-fried, salted. Red chile salt on request.',
          price: 4.5,
          diet: ['vegan', 'gluten-free'],
          featured: true,
          art: 'fries',
        },
        {
          id: 'onion-rings',
          name: 'Onion rings',
          description: 'Thick-cut, beer-battered, with ranch.',
          price: 6,
          diet: ['vegetarian'],
        },
        {
          id: 'tots',
          name: 'Tater tots',
          description: 'Crispy, golden and better with green chile queso (+$2).',
          price: 5,
          diet: ['vegan', 'gluten-free'],
        },
        {
          id: 'coleslaw',
          name: 'Coleslaw',
          description: 'Creamy, crunchy and a little sweet.',
          price: 3.5,
          diet: ['vegetarian', 'gluten-free'],
        },
        {
          id: 'bowl-of-chili',
          name: 'Bowl of chili',
          description: 'Beef and bean chili with cheddar and onions.',
          price: [{ label: 'Cup', amount: 5 }, { label: 'Bowl', amount: 8 }],
          diet: ['gluten-free'],
        },
      ],
    },
    {
      id: 'shakes-and-malts',
      letter: 'E',
      title: 'Shakes & malts',
      description: 'Hand-spun in a frosty steel cup, served with the extra on the side.',
      band: 'plum',
      items: shakes.flavours.map(shakeItem),
    },
    {
      id: 'pie-and-sweets',
      letter: 'F',
      title: 'Pie & sweets',
      description: 'Baked every morning. Fruit pies are out at 11. À la mode +$2.',
      band: 'seafoam',
      items: [
        {
          id: 'apple-pie',
          name: 'Apple pie',
          description: 'Lattice crust, cinnamon and plenty of butter.',
          price: [{ label: 'Slice', amount: 5.5 }, { label: 'Whole pie', amount: 28 }],
          diet: ['vegetarian'],
          featured: true,
          art: 'pie',
        },
        {
          id: 'cherry-pie',
          name: 'Cherry pie',
          description: 'Sour cherries, a little almond and a golden lattice.',
          price: [{ label: 'Slice', amount: 5.5 }, { label: 'Whole pie', amount: 28 }],
          diet: ['vegetarian', 'contains-nuts'],
          badge: 'house',
        },
        {
          id: 'coconut-cream-pie',
          name: 'Coconut cream pie',
          description: 'Toasted coconut custard under a tall cloud of meringue.',
          price: [{ label: 'Slice', amount: 6 }, { label: 'Whole pie', amount: 30 }],
          diet: ['vegetarian'],
        },
        {
          id: 'hot-fudge-sundae',
          name: 'Hot fudge sundae',
          description: 'Three scoops, hot fudge, whipped cream, peanuts and a cherry.',
          price: 7.5,
          diet: ['vegetarian', 'gluten-free', 'contains-nuts'],
        },
      ],
    },
    {
      id: 'drinks',
      letter: 'G',
      title: 'Drinks',
      description: 'Bottomless coffee from open to close.',
      band: 'chrome',
      items: [
        {
          id: 'bottomless-coffee',
          name: 'Bottomless coffee',
          description: 'Diner blend, poured until you say when. Decaf too.',
          price: 2.75,
          diet: ['vegan', 'gluten-free'],
          featured: true,
          art: 'mug',
        },
        {
          id: 'fountain-soda',
          name: 'Fountain soda',
          description: 'Cola, lemon-lime, root beer or orange. Free refills.',
          price: 3,
          diet: ['vegan', 'gluten-free'],
        },
        {
          id: 'root-beer-float',
          name: 'Root beer float',
          description: 'Two scoops of vanilla in a frosty mug of root beer.',
          price: 6,
          diet: ['vegetarian', 'gluten-free'],
        },
        {
          id: 'fresh-lemonade',
          name: 'Fresh lemonade',
          description: 'Squeezed every morning. Add strawberry for 50¢.',
          price: 3.75,
          diet: ['vegan', 'gluten-free'],
        },
      ],
    },
  ],
  notes: [
    'V vegetarian · VG vegan · GF made with gluten-free ingredients · N contains nuts.',
    'Everything shares one grill and one fryer, so we can’t promise anything is free from gluten or other allergens. Please tell us about any allergy when you order.',
  ],
};

/* ==================================================================
   Helpers
   ================================================================== */

/** Every item, in menu order. */
export const allItems: MenuItem[] = menu.sections.flatMap(section => section.items);

/** Items shown on the home page jukebox. */
export const featuredItems: MenuItem[] = allItems.filter(item => item.featured);

const formatter = new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency });

/** "$4.50", or "$4" for whole amounts. */
export function formatPrice(amount: number): string {
  if (amount === 0) return 'Free';
  const text = formatter.format(amount);
  return Number.isInteger(amount) ? text.replace(/[.,]00(?=\D*$)/, '') : text;
}

/** Lowest price, for compact listings. */
export function startingPrice(item: MenuItem): number {
  return typeof item.price === 'number' ? item.price : Math.min(...item.price.map(size => size.amount));
}

export function isAvailable(item: MenuItem): boolean {
  return item.soldOut !== true;
}
