// Content invariants for the diner and its menu. Runs with Node's built-in TypeScript type stripping.
// When one of these fails after an edit, the message names the item, section or day to fix.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { DAYS, diner, formatAddress, publicLinks, telHref } from '../content/diner.ts';
import {
  allItems, BADGES, BANDS, bluePlate, DIETS, featuredItems, formatPrice, menu, startingPrice, type Art, type MenuItem,
} from '../content/menu.ts';
import { codeAnchor, codedItems, codesById, jukeboxCode } from '../lib/menu-codes.ts';
import { matchesAll, matchesFilter, visibleCounts } from '../lib/menu-filter.ts';
import { mapDirectionsUrl, mapEmbedUrl, mapSearchUrl } from '../lib/maps.ts';
import { timeZoneLabel } from '../lib/time-zone.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ARTS: Art[] = ['burger', 'hotdog', 'mug', 'pie', 'pancakes', 'fries', 'shake'];
const validPrice = (amount: number) => Number.isFinite(amount) && amount > 0 && Math.round(amount * 100) === amount * 100;

test('the blue plate is set for every open day, with a positive price', () => {
  assert.deepEqual(Object.keys(bluePlate), [...DAYS], 'bluePlate lists Monday to Sunday, in order');
  for (const day of DAYS) {
    const open = diner.hours.find(entry => entry.day === day)?.opens;
    const plate = bluePlate[day];
    if (open) assert.ok(plate !== undefined, `bluePlate.${day}: set a special, or null for none`);
    if (!plate) continue;
    assert.ok(plate.name.trim(), `bluePlate.${day}.name`);
    assert.ok(plate.description.trim(), `bluePlate.${day}.description`);
    assert.ok(validPrice(plate.price), `bluePlate.${day}.price must be a positive amount, e.g. 14.5`);
    for (const diet of plate.diet ?? []) assert.ok(diet in DIETS, `bluePlate.${day} has unknown diet "${diet}"`);
  }
});

test('sections are jukebox pages with unique letters and known band colours', () => {
  assert.ok(menu.sections.length >= 1 && menu.sections.length <= 26, 'Use 1–26 menu sections');
  const letters = menu.sections.map(section => section.letter);
  for (const section of menu.sections) {
    assert.match(section.letter, /^[A-Z]$/, `section ${section.id}: letter must be one capital A–Z`);
    assert.ok(BANDS.includes(section.band), `section ${section.id}: band must be one of ${BANDS.join(', ')}`);
    assert.ok(section.title.trim() && section.description.trim(), `section ${section.id} needs a title and description`);
    assert.ok(section.items.length >= 1, `section ${section.id} has no items`);
    assert.ok(section.items.length <= 20, `section ${section.id} has more than 20 items: split it into two pages`);
  }
  assert.deepEqual(letters.filter((letter, index) => letters.indexOf(letter) !== index), [], 'Each section needs its own letter');
});

test('sections, items and shake flavours have unique, URL-safe ids that never look like codes', () => {
  const ids = [...menu.sections.map(section => section.id), ...allItems.map(item => item.id), ...menu.shakes.flavours.map(f => f.id)];
  for (const id of new Set(ids)) {
    assert.match(id, SLUG, `"${id}" must be lowercase words joined by hyphens`);
    assert.doesNotMatch(id, /^[a-z]\d+$/, `"${id}" looks like a jukebox code (b3); pick a descriptive id`);
  }
  const itemIds = [...menu.sections.map(section => section.id), ...allItems.map(item => item.id)];
  const duplicates = itemIds.filter((id, index) => itemIds.indexOf(id) !== index);
  assert.deepEqual(duplicates, [], `ids must be unique across sections and items: ${duplicates.join(', ')}`);
});

test('every menu item is complete, with known tags and badges', () => {
  for (const item of allItems) {
    assert.ok(item.name.trim(), `${item.id}.name`);
    assert.ok(item.description.trim(), `${item.id}.description`);
    assert.ok(item.description.length <= 110, `${item.id}.description is long for a title strip: keep it to one line (110 characters)`);
    for (const diet of item.diet ?? []) assert.ok(diet in DIETS, `${item.id} has unknown diet "${diet}"`);
    assert.equal(new Set(item.diet).size, item.diet?.length ?? 0, `${item.id} repeats a diet tag`);
    assert.ok(!(item.diet?.includes('vegan') && item.diet.includes('vegetarian')), `${item.id}: tag vegan or vegetarian, not both (vegan counts as vegetarian)`);
    if (item.badge) assert.ok(item.badge in BADGES, `${item.id} has unknown badge "${item.badge}"`);
    if (item.art) assert.ok(ARTS.includes(item.art), `${item.id}.art must be one of ${ARTS.join(', ')}`);
  }
});

test('prices are positive numbers with at most two decimals, and sizes are labelled', () => {
  for (const item of allItems) {
    if (typeof item.price === 'number') {
      assert.ok(validPrice(item.price), `${item.id} price ${item.price}`);
    } else {
      assert.ok(item.price.length >= 1 && item.price.length <= 3, `${item.id} needs one to three sizes`);
      for (const size of item.price) {
        assert.ok(size.label.trim(), `${item.id} size label`);
        assert.ok(validPrice(size.amount), `${item.id} ${size.label} price ${size.amount}`);
      }
      assert.equal(new Set(item.price.map(size => size.label)).size, item.price.length, `${item.id} repeats a size`);
    }
  }
  assert.ok(validPrice(menu.combo.price), 'combo.price');
  for (const size of menu.shakes.price) assert.ok(validPrice(size.amount) && size.label.trim(), `shakes.price ${size.label}`);
  for (const extra of menu.shakes.extras) assert.ok(extra.price >= 0 && extra.name.trim(), `shake extra ${extra.name}`);
});

test('combos are only offered where they make sense', () => {
  assert.ok(menu.combo.adds.trim(), 'combo.adds says what a combo includes');
  const sectionIds = menu.sections.map(section => section.id);
  for (const id of menu.combo.sections) assert.ok(sectionIds.includes(id), `combo.sections lists unknown section "${id}"`);
  for (const section of menu.sections) {
    for (const item of section.items) {
      if (item.combo) assert.ok(menu.combo.sections.includes(section.id), `${item.id} offers a combo, but ${section.id} isn't in combo.sections`);
    }
  }
});

test('shake flavours are complete and tint their glasses', () => {
  const flavours = menu.shakes.flavours;
  assert.ok(flavours.length >= 3 && flavours.length <= 10, 'List 3–10 shake flavours');
  for (const flavour of flavours) {
    assert.ok(flavour.name.trim() && flavour.description.trim(), `shake ${flavour.id}`);
    assert.match(flavour.color, /^#[0-9a-f]{6}$/i, `shake ${flavour.id}.color must be a hex colour like #f08aa0`);
  }
  const shakeSection = menu.sections.find(section => section.items.some(item => item.id === flavours[0].id));
  assert.ok(shakeSection, 'The shakes page is built from menu.shakes.flavours');
});

test('jukebox codes are unique, derived from letters and stable when items are 86’d', () => {
  const coded = codedItems(menu.sections);
  const codes = coded.map(entry => entry.code);
  assert.equal(new Set(codes).size, codes.length, 'Every title strip needs a unique code');
  for (const entry of coded) assert.match(entry.code, new RegExp(`^${entry.section.letter}\\d{1,2}$`), `${entry.item.id} code ${entry.code}`);
  assert.equal(jukeboxCode('b', 2), 'B3');
  assert.equal(codeAnchor('B3'), 'b3');
  assert.equal(codesById(menu.sections).get('green-chile-burger'), 'B3');

  // Mark every other item sold out: no code changes.
  const before = codesById(menu.sections);
  const soldOut = menu.sections.map(section => ({
    ...section,
    items: section.items.map((item, index): MenuItem => (index % 2 ? { ...item, soldOut: true } : item)),
  }));
  assert.deepEqual(codesById(soldOut), before);
});

test('the menu covers the basics: an 86’d item, vegetarian and vegan options', () => {
  assert.ok(allItems.some(item => item.soldOut), 'Sample menu shows one 86’d item');
  assert.ok(allItems.filter(item => item.diet?.includes('vegetarian') || item.diet?.includes('vegan')).length >= 3, 'At least three vegetarian options');
  assert.ok(allItems.some(item => item.diet?.includes('vegan')), 'At least one vegan option');
});

test('prices format in the menu currency', () => {
  assert.equal(formatPrice(4.5), '$4.50');
  assert.equal(formatPrice(4), '$4');
  assert.equal(formatPrice(0), 'Free');
  assert.equal(startingPrice({ ...allItems[0], price: [{ label: 'L', amount: 6 }, { label: 'S', amount: 5 }] }), 5);
  assert.doesNotThrow(() => new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency }));
});

test('the home page jukebox has 6–8 featured items, each with a drawing', () => {
  assert.ok(featuredItems.length >= 6 && featuredItems.length <= 8, `Mark 6–8 items featured: true (now ${featuredItems.length})`);
  for (const item of featuredItems) assert.ok(item.art, `${item.id} is featured: give it art (${ARTS.join(', ')})`);
});

test('filters: vegan counts as vegetarian; breakfast follows the section', () => {
  const breakfast = menu.sections.find(section => section.breakfast)!;
  const burgers = menu.sections.find(section => section.id === 'burgers')!;
  const vegan = { ...allItems[0], diet: ['vegan' as const] };
  assert.ok(matchesFilter(vegan, burgers, 'vegetarian') && matchesFilter(vegan, burgers, 'vegan'));
  assert.ok(!matchesFilter({ ...vegan, diet: ['vegetarian'] }, burgers, 'vegan'));
  assert.ok(matchesFilter(vegan, breakfast, 'breakfast') && !matchesFilter(vegan, burgers, 'breakfast'));
  assert.ok(matchesAll(vegan, burgers, []));
  const counts = visibleCounts(menu.sections, []);
  assert.equal(Object.values(counts).reduce((a, b) => a + b, 0), allItems.length);
  assert.equal(visibleCounts(menu.sections, ['breakfast']).burgers, 0);
});

test('contact details and links are publishable', () => {
  assert.match(diner.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.equal(telHref('(505) 555-0142'), 'tel:5055550142');
  for (const link of publicLinks) assert.match(link.url, /^https:\/\//, link.url);
  assert.ok(diner.sign.script.trim() && diner.sign.script.length <= 12, 'sign.script: up to 12 characters so the neon stays big');
  assert.ok(diner.sign.block.trim() && diner.sign.block.length <= 12, 'sign.block: up to 12 characters');
  assert.equal(diner.promises.length, 3, 'Give the story three promises');
  assert.ok(diner.amenities.length >= 1 && diner.faqs.length >= 1);
  assert.ok(existsSync(new URL('../public/og.png', import.meta.url)), 'public/og.png social image');
});

test('time zones read naturally next to the hours', () => {
  assert.equal(timeZoneLabel('America/Denver'), 'Mountain Time');
  assert.equal(timeZoneLabel('America/New_York'), 'Eastern Time');
  assert.equal(timeZoneLabel('UTC'), 'UTC');
  assert.equal(timeZoneLabel(''), '');
});

test('the address is complete and Google Maps links are keyless and encoded', () => {
  for (const key of ['street', 'locality', 'region', 'postalCode', 'country'] as const) assert.ok(diner.address[key].trim(), `address.${key}`);
  assert.match(diner.address.country, /^[A-Z]{2}$/);
  const query = formatAddress();
  assert.equal(query, '200 N Plaza St NW, Albuquerque, NM 87104');
  assert.equal(mapSearchUrl('A & B, #1'), 'https://www.google.com/maps/search/?api=1&query=A%20%26%20B%2C%20%231');
  assert.ok(mapDirectionsUrl(query).startsWith('https://www.google.com/maps/dir/?api=1&destination=200%20N%20Plaza%20St%20NW'));
  assert.equal(mapEmbedUrl(query), 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s200+N+Plaza+St+NW%2C+Albuquerque%2C+NM+87104!6i16');
  assert.ok(mapEmbedUrl('Shop! 1').includes('1sShop%21+1!6i16'));
  for (const url of [mapSearchUrl(query), mapDirectionsUrl(query), mapEmbedUrl(query)]) assert.doesNotMatch(url, /key=/);
});
