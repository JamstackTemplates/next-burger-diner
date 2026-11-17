// Jukebox codes: each title strip's code is its page letter plus its position, e.g. B3.
// Owners never type them. Sold-out items stay listed, so codes don't shift when something is 86'd;
// reordering a section does renumber it.
import type { MenuItem, MenuSection } from '../content/menu';

export interface CodedItem {
  /** "B3" */
  code: string;
  item: MenuItem;
  section: MenuSection;
}

/** "B" + position 3 → "B3". Positions start at 1. */
export function jukeboxCode(letter: string, index: number): string {
  return `${letter.toUpperCase()}${index + 1}`;
}

/** Page anchor for a code: "B3" → "b3", used for links such as /menu/#b3. */
export function codeAnchor(code: string): string {
  return code.toLowerCase();
}

/** Every item with its code, in menu order. */
export function codedItems(sections: readonly MenuSection[]): CodedItem[] {
  return sections.flatMap(section => section.items.map((item, index) => ({ code: jukeboxCode(section.letter, index), item, section })));
}

/** Code lookup by item id. */
export function codesById(sections: readonly MenuSection[]): Map<string, string> {
  return new Map(codedItems(sections).map(entry => [entry.item.id, entry.code]));
}
