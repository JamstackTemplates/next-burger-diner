import type { CSSProperties } from 'react';
import { BADGES, DIETS, formatPrice, isAvailable, menu, type MenuItem, type MenuSection } from '../content/menu';
import { codeAnchor } from '../lib/menu-codes';
import { DinerArt } from './diner-art';

/** "Single $10 · Double $13" or "$8.50". */
export function priceText(item: MenuItem): string {
  if (typeof item.price === 'number') return formatPrice(item.price);
  return item.price.map(size => `${size.label} ${formatPrice(size.amount)}`).join(' · ');
}

/**
 * One jukebox title strip: name, a coloured band with the code and price, and a one-line
 * description. Combo and other badges are die-cut starbursts; 86'd items stay listed, stamped.
 */
export function TitleStrip({ item, code, section, showSection = false, anchors = true, art = false }: {
  item: MenuItem;
  code: string;
  section: MenuSection;
  /** Print the section title in the band (for mixed lists like the home page jukebox). */
  showSection?: boolean;
  /** Give the strip its page anchors (#green-chile-burger and #b3). Only on the menu page. */
  anchors?: boolean;
  /** Show the item's line drawing beside the description (home page jukebox). */
  art?: boolean;
}) {
  const available = isAvailable(item);
  return (
    <article className="strip h-full" data-sold-out={available ? undefined : ''} id={anchors ? item.id : undefined}
      style={{ '--band': `var(--band-${section.band})` } as CSSProperties} aria-labelledby={`${item.id}-name`}>
      {anchors ? <span id={codeAnchor(code)} className="strip-anchor" aria-hidden="true" /> : null}
      <h3 id={`${item.id}-name`} className="strip-title">
        <span className="sr-only">{code}: </span>{item.name}
        {available ? null : <span className="sr-only"> (sold out today)</span>}
      </h3>
      <p className="strip-band">
        <span className="strip-code" aria-hidden="true">{code}</span>
        {showSection ? <span className="truncate text-[.92rem] tracking-[.14em] uppercase opacity-90 max-sm:hidden" aria-hidden="true">{section.title}</span> : null}
        <span className="text-right text-[1.05rem] leading-tight">
          {available ? priceText(item) : <><span aria-hidden="true">86’d</span><span className="sr-only">Not available today</span></>}
        </span>
      </p>
      <div className={`strip-desc ${art && item.art ? 'flex items-center gap-3 text-left' : ''}`}>
        {art && item.art ? <DinerArt art={item.art} size={46} className="flex-none -rotate-6" /> : null}
        <p>
          {item.description}
          {item.diet?.map(diet => (
            <abbr key={diet} title={DIETS[diet].label} data-diet={diet} className="strip-diet">{DIETS[diet].short}</abbr>
          ))}
        </p>
      </div>
      {item.combo && available ? (
        <span className="starburst">
          <span aria-hidden="true">Combo<br />+{formatPrice(menu.combo.price)}</span>
          <span className="sr-only">Make it a combo: add {menu.combo.adds.toLowerCase()} for {formatPrice(menu.combo.price)}</span>
        </span>
      ) : null}
      {item.badge ? <span className={`starburst starburst-${item.badge}`}>{BADGES[item.badge]}</span> : null}
      {available ? null : <span className="strip-stamp" aria-hidden="true">86’d today</span>}
    </article>
  );
}
