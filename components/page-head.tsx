import type { ReactNode } from 'react';

/**
 * Heading block for inner pages, on a strip of the tiled back wall above a chrome rail:
 * a glowing script eyebrow, a tall signage title (use <em> for script accent words) and a lede.
 */
export function PageHead({ eyebrow, title, children, id, before }: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional illustration beside the title. */
  before?: ReactNode;
}) {
  return (
    <header className="tile-wall tile-wall-glow">
      <div className="wrap flex items-end justify-between gap-8 pt-[clamp(2.25rem,5vw,4rem)] pb-[clamp(1.75rem,3.5vw,2.75rem)]">
        <div>
          <p className="wordmark font-script text-[clamp(1.7rem,3.4vw,2.4rem)] leading-none">{eyebrow}</p>
          <h1 id={id} className="mt-2 mb-4 max-w-[20ch] text-[clamp(2.7rem,6.5vw,4.8rem)] uppercase">{title}</h1>
          {children ? <div className="max-w-(--measure) text-[clamp(1.05rem,1.6vw,1.2rem)] [&_p+p]:mt-3">{children}</div> : null}
        </div>
        {before ? <div className="hidden flex-none sm:block print:hidden">{before}</div> : null}
      </div>
      <div className="counter-rail h-7" aria-hidden="true" />
    </header>
  );
}
