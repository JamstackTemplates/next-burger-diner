import type { CSSProperties, ReactNode } from 'react';
import type { Art } from '../content/menu';

/**
 * Small line drawings for featured items: a burger, a hot dog, a coffee mug, a pie slice, a stack
 * of pancakes, fries and a shake. Coloured by tokens in app/tailwind.input.css, so they follow
 * light and dark mode. Decorative.
 */
export function DinerArt({ art, size = 72, className = '', plate = false }: {
  art: Art;
  size?: number;
  className?: string;
  /** Sit the drawing on a paper plate so its outlines read on dark surfaces. */
  plate?: boolean;
}) {
  if (plate) {
    return (
      <span className={`inline-grid place-items-center rounded-full bg-paper shadow-card ring-4 ring-plate-blue/70 ${className}`} style={{ width: size * 1.35, height: size * 1.35 }}>
        <DinerArt art={art} size={size} />
      </span>
    );
  }
  return (
    <svg className={`art ${className}`} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {drawings[art]}
    </svg>
  );
}

const drawings: Record<Art, ReactNode> = {
  burger: (
    <g>
      <path d="M16 46c0-17 15-27 34-27s34 10 34 27z" fill="var(--art-bun)" className="ln" />
      <path d="M36 30l2 2m10-6 1 2m12 2 2 2m-30 6 2 1m24-1 2-1" className="ln" strokeWidth={2.4} />
      <path d="M14 52c6-4 10 4 16 0s10 4 16 0 10 4 16 0 10 4 16 0 8 2 8 2" fill="none" stroke="var(--art-lettuce)" strokeWidth={6} strokeLinecap="round" />
      <path d="M18 56h64l-6 8H24z" fill="var(--art-cheese)" className="ln" />
      <rect x="15" y="58" width="70" height="12" rx="6" fill="var(--art-patty)" className="ln" />
      <path d="M17 74h66c0 8-8 12-16 12H33c-8 0-16-4-16-12z" fill="var(--art-bun)" className="ln" />
    </g>
  ),
  hotdog: (
    <g>
      <path d="M10 56c0-8 8-12 14-8 10 7 42 7 52 0 6-4 14 0 14 8 0 14-16 22-40 22S10 70 10 56z" fill="var(--art-bun)" className="ln" />
      <rect x="6" y="44" width="88" height="14" rx="7" fill="var(--art-sausage)" className="ln" />
      <path d="M16 48c6 6 10-6 16 0s10-6 16 0 10-6 16 0 10-6 16 0" fill="none" stroke="var(--art-cheese)" strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  mug: (
    <g>
      <g className="art-steam" fill="none" stroke="var(--art-steam)" strokeWidth={3} strokeLinecap="round">
        <path d="M38 22c-4-4 4-7 0-12" /><path d="M52 22c-4-4 4-7 0-12" />
      </g>
      <path d="M72 44h6a10 10 0 0 1 0 20h-7" fill="none" className="ln" strokeWidth={5} />
      <path d="M72 44h6a10 10 0 0 1 0 20h-7" fill="none" stroke="var(--art-mug)" strokeWidth={2} />
      <path d="M22 32h52v40c0 8-6 14-14 14H36c-8 0-14-6-14-14z" fill="var(--art-mug)" className="ln" />
      <ellipse cx="48" cy="34" rx="24" ry="4" fill="var(--art-coffee)" />
      <path d="M22 50h52" stroke="var(--art-filling)" strokeWidth={5} />
    </g>
  ),
  pie: (
    <g>
      {/* A wedge of lattice pie: top crust, cherry filling on the cut face, crimped back crust */}
      <path d="M10 64 80 34c8 4 12 12 10 24z" fill="var(--art-crust)" className="ln" />
      <path d="M30 56l14-4M46 50l16-6M60 44l14-5M36 47l10 12M52 41l12 13M66 37l10 13" stroke="var(--art-filling)" strokeWidth={3.4} strokeLinecap="round" />
      <path d="M10 64l80-6v18l-78 2z" fill="var(--art-filling)" className="ln" />
      <path d="M12 74l78-2" stroke="var(--art-crust)" strokeWidth={6} strokeLinecap="round" />
      <path d="M80 34c8 4 12 12 10 24v18" fill="none" stroke="var(--art-crust)" strokeWidth={7} strokeLinecap="round" />
      <path d="M80 34c8 4 12 12 10 24v18" fill="none" className="ln" strokeDasharray="5 4" />
    </g>
  ),
  pancakes: (
    <g>
      <ellipse cx="50" cy="80" rx="40" ry="8" fill="var(--art-mug)" className="ln" />
      {[68, 58, 48, 38].map(y => <rect key={y} x="18" y={y} width="64" height="12" rx="6" fill="var(--art-bun)" className="ln" />)}
      <path d="M22 40c8-6 20 2 28-2s18-4 28 0v6c-4 2-4 10-8 10s-2-8-8-8-6 12-12 12-4-10-10-10-6 6-10 4-8-8-8-12z" fill="var(--art-syrup)" opacity={.9} />
      <rect x="42" y="28" width="16" height="10" rx="2" fill="var(--art-cheese)" className="ln" />
    </g>
  ),
  fries: (
    <g>
      {[[30, 18], [38, 12], [46, 16], [54, 10], [62, 16], [70, 20]].map(([x, y]) => (
        <rect key={x} x={x - 3} y={y} width="8" height="46" rx="2" fill="var(--art-fry)" className="ln" strokeWidth={2.4} transform={`rotate(${(x - 50) / 3} ${x} 60)`} />
      ))}
      <path d="M22 44h56l-6 44H28z" fill="var(--art-fries-box)" className="ln" />
      <path d="M36 60q14 10 28 0" fill="none" stroke="var(--art-cream)" strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  shake: <ShakeShape color="var(--art-cherry)" />,
};

/** A tall milkshake glass tinted by `color`: whipped cream, a cherry and a striped straw. */
export function ShakeGlass({ color, size = 120, className = '' }: { color: string; size?: number; className?: string }) {
  return (
    <svg className={`art ${className}`} width={size * .7} height={size} viewBox="0 0 70 100" aria-hidden="true" focusable="false"
      style={{ '--shake': color } as CSSProperties}>
      <ShakeShape color="var(--shake)" />
    </svg>
  );
}

function ShakeShape({ color }: { color: string }) {
  return (
    <g>
      <g className="shake-straw">
        <path d="M40 34 52 4" stroke="var(--art-line)" strokeWidth={8} strokeLinecap="round" />
        <path d="M40 34 52 4" stroke="var(--art-straw-2)" strokeWidth={5} strokeLinecap="round" />
        <path d="M40 34 52 4" stroke="var(--art-straw-1)" strokeWidth={5} strokeDasharray="4 4" />
      </g>
      <path d="M14 34h42l-6 50H20z" fill="var(--art-glass)" className="ln" strokeWidth={2.6} />
      <path d="M16.5 40h37l-5 42h-27z" fill={color} />
      <path d="M22 44l3 34" stroke="rgba(255,255,255,.55)" strokeWidth={3} strokeLinecap="round" />
      <path d="M12 36c-2-8 6-10 8-8 0-8 10-10 14-6 4-6 14-4 14 2 6-2 12 4 8 12z" fill="var(--art-cream)" className="ln" strokeWidth={2.6} />
      <circle cx="36" cy="20" r="5" fill="var(--art-cherry)" className="ln" strokeWidth={2.4} />
      <path d="M36 15c0-5 3-8 7-10" className="ln" strokeWidth={2} />
      <path d="M22 84h26l4 8H18z" fill="var(--art-glass)" className="ln" strokeWidth={2.6} />
    </g>
  );
}
