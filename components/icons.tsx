import type { SVGProps } from 'react';

/** Small line icons, coloured by `currentColor`. Decorative: pair them with visible text. */
const paths = {
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  down: <path d="M12 5v14m-6-6 6 6 6-6" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  booth: <><path d="M4 20V8a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v12M14 20V8a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v12" /><path d="M4 14h6m4 0h6M10 12h4" /></>,
  counter: <><path d="M3 9h18" /><path d="M7 9v11m10-11v11" /><circle cx="7" cy="5.5" r="2.5" /><circle cx="17" cy="5.5" r="2.5" /></>,
  kids: <><circle cx="12" cy="6" r="3" /><path d="M7 21l1.5-8h7L17 21M9 13l-3-3m9 3 3-3" /></>,
  takeout: <><path d="M5 8h14l-1.5 12h-11z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  parking: <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M10 17V7h3a3 3 0 0 1 0 6h-3" /></>,
  access: <><circle cx="12" cy="4.5" r="2" /><path d="M7 8.5h10M12 8.5V14l4 6m-4-6-4 6" /></>,
  filter: <path d="M4 5h16l-6 7v6l-4 2v-8z" />,
  star: <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L12 16.6 6.6 19.6l1.2-6.1-4.5-4.2 6.1-.7z" />,
  chevron: <path d="m9 6 6 6-6 6" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, width = 20, height = 20, ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      {paths[name]}
    </svg>
  );
}
