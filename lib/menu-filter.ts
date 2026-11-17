import type { Diet, MenuItem, MenuSection } from '../content/menu';

/** Filters offered on the menu page. Several together must all match. */
export type MenuFilter = 'vegetarian' | 'vegan' | 'breakfast';

export const MENU_FILTERS: { id: MenuFilter; label: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'breakfast', label: 'Breakfast now' },
];

function has(item: MenuItem, diet: Diet): boolean {
  return item.diet?.includes(diet) ?? false;
}

/** Vegan items count as vegetarian even when not tagged twice. */
export function matchesFilter(item: MenuItem, section: MenuSection, filter: MenuFilter): boolean {
  switch (filter) {
    case 'vegan': return has(item, 'vegan');
    case 'vegetarian': return has(item, 'vegetarian') || has(item, 'vegan');
    case 'breakfast': return section.breakfast === true;
  }
}

export function matchesAll(item: MenuItem, section: MenuSection, filters: readonly MenuFilter[]): boolean {
  return filters.every(filter => matchesFilter(item, section, filter));
}

/** Count of visible items per section for the active filters. */
export function visibleCounts(sections: readonly MenuSection[], filters: readonly MenuFilter[]): Record<string, number> {
  return Object.fromEntries(sections.map(section => [section.id, section.items.filter(item => matchesAll(item, section, filters)).length]));
}
