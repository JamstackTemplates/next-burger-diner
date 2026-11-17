import { DarkModeToggle } from 'jamstacks';
import { diner } from '../content/diner';
import { asset } from '../lib/paths';
import { SiteLink } from './site-link';

const navigation = [
  { href: '/menu/', label: 'Menu' },
  { href: '/#find-us', label: 'Find us' },
  { href: '/contact/', label: 'Contact' },
];

/** A slim chrome strip with a small neon wordmark that glows after dark. */
export function SiteHeader() {
  return (
    <header className="site-header chrome sticky top-0 z-50 border-b-2 border-chrome-edge">
      <div className="wrap flex min-h-(--header-h) items-center justify-between gap-2 sm:gap-4">
        <SiteLink href="/" className="flex items-center gap-1.5 no-underline sm:gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export: plain <img> */}
          <img src={asset('/burger.svg')} alt="" width={42} height={33} className="h-6 w-auto flex-none drop-shadow-sm max-[359px]:hidden xs:h-7 sm:h-[2.1rem]" />
          <span className="wordmark font-script text-[1.3rem] leading-none whitespace-nowrap xs:text-[1.65rem] sm:text-[2rem]">{diner.name}</span>
        </SiteLink>
        <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-3 print:hidden">
          <nav aria-label="Main">
            <ul className="flex">
              {navigation.map(item => (
                <li key={item.href}>
                  <SiteLink href={item.href} markCurrent="section"
                    className="inline-block border-b-[3px] border-transparent px-[3px] pt-1 pb-0.5 font-sign text-[.98rem] font-extrabold tracking-[.1em] whitespace-nowrap uppercase no-underline hover:border-accent aria-[current]:border-accent xs:px-2.5 sm:text-[1.2rem]">
                    {item.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </nav>
          <DarkModeToggle className="flex-none" />
        </div>
      </div>
    </header>
  );
}
