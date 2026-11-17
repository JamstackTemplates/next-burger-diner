/** One chrome counter stool with a cherry vinyl seat, seen from the side. Decorative. */
function Stool() {
  return (
    <svg viewBox="0 0 120 90" className="h-full w-auto flex-none overflow-visible" aria-hidden="true" focusable="false">
      <rect x="54" y="30" width="12" height="60" fill="var(--chrome-2)" stroke="var(--chrome-edge)" strokeWidth="1.5" />
      <rect x="57" y="30" width="3" height="60" fill="var(--chrome-hi)" opacity=".7" />
      <path d="M40 30h40l-6 10H46z" fill="var(--chrome-3)" stroke="var(--chrome-edge)" strokeWidth="1.5" />
      <path d="M12 16c0-8 22-12 48-12s48 4 48 12v8c0 6-22 10-48 10S12 30 12 24z" fill="var(--vinyl)" stroke="var(--chrome-edge)" strokeWidth="1.5" />
      <ellipse cx="60" cy="14" rx="44" ry="8" fill="var(--vinyl-deep)" opacity=".35" />
      <path d="M22 11c10-4 30-6 40-6" fill="none" stroke="var(--vinyl-sheen)" strokeWidth="4" strokeLinecap="round" />
      <path d="M12 22c0 6 22 10 48 10s48-4 48-10" fill="none" stroke="var(--chrome-1)" strokeWidth="4" />
      <path d="M12 22c0 6 22 10 48 10s48-4 48-10" fill="none" stroke="var(--chrome-edge)" strokeWidth="1" />
    </svg>
  );
}

/** A row of counter stools along the chrome rail, fewer on small screens. */
export function CounterStools({ count = 9 }: { count?: number }) {
  return (
    <div className="pointer-events-none flex h-[clamp(3.25rem,6vw,4.75rem)] justify-around overflow-hidden px-[3vw] print:hidden" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={`h-full ${index >= 4 ? 'max-sm:hidden' : ''} ${index >= 6 ? 'max-lg:hidden' : ''}`}><Stool /></span>
      ))}
    </div>
  );
}
