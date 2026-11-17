# Working on this website

This is a customer-owned Next.js website for a burger diner. Read [README.md](README.md) for setup,
content editing, deployment and the optional Jamstacks contact form.

## Working preferences

- Work in this repository on its current branch unless asked otherwise.
- Preserve existing changes. Leave edits uncommitted; push or deploy only when requested.
- Adapt the website to its owner's requested content and features. Replace the sample diner, menu,
  blue plates, address and contact details with the owner's real details; the fictional examples are starting content.

## Structure and content

- `content/menu.ts` owns the menu. Most owner requests are edits here only:
  - `bluePlate` (top of the file): the daily blue plate special for each day, or `null` for none.
  - `sections`: the jukebox pages, each with a unique `letter` (A–Z), `title`, `description`, a `band`
    colour and `items`. Set `breakfast: true` on a section to include it in the "Breakfast now" filter.
  - Items: `id`, `name`, one-line `description`, `price` (a number or sizes), `combo`, `badge`
    (`house` | `new` | `seasonal` | `big-appetite`), `diet`, `featured` (+ `art`) and `soldOut`
    ("86'd today": the item stays listed).
  - `combo` (what a combo adds, its price and the sections where it applies), `shakes` (price, flavours with
    a `color` that tints the glass drawings, extras) and `notes` (allergy advice).
- Jukebox codes (B3) are derived from the section letter and the item's position; never type them. Sold-out
  items keep their place, so codes don't shift. Moving an item renumbers its page, which changes links like `/menu/#b3`.
- `content/diner.ts` owns the name, the neon `sign` wording, tagline, introduction, story and promises,
  `breakfastAllDay`, contact details, address (with a landmark `note`), directions, opening hours (local times),
  notice, amenities, FAQs and social links.
- Opening hours: a `closes` time earlier than `opens` means after midnight (Friday `07:00`–`02:00`). The
  open/closed logic and blue plate selection live in `lib/hours.ts` and are unit tested.
- The address drives the "Find us" section, Google map, directions links and structured data. Maps use keyless
  Google URLs from `lib/maps.ts`; never add a secret key, and keep the map lazy-loaded.
- The diner's time zone is the IANA `timeZone` in `site.config.json` (Jamstacks writes the owner's choice there).
  Change it there, not in content; without it the neon OPEN sign and status line stay neutral.
- Keep item and section ids unique, lowercase and hyphenated; they are page anchors. Ids must not look like
  codes (`b3`). For new featured items, use an existing `art` drawing; new shake flavours only need a `color`.
  Don't add image files for menu items. The only image files are `public/burger.svg` (header logo and hero) and
  `public/milkshake.svg` (hero and menu page header); reference them through `asset()` so base paths work.
- Keep content out of `site.config.json`: Jamstacks may rewrite it.
- Text is rendered as plain text. Don't invent reviews, awards or claims for a real business.

## Styling (Tailwind CSS v4)

- Style components with Tailwind utility classes in the TSX. Don't add global CSS for one-off styles.
- `app/tailwind.input.css` holds what utilities can't express: the colour tokens (`:root` for light,
  plus two dark blocks that must stay identical), the `@theme` built from them, base element styles,
  shared building blocks (`.chrome`, `.chrome-rim`, `.button`, `.button-chrome`, `.key`, `.chip`, `.starburst`,
  `.text-link`, `.eyebrow`, `.card`), the interior surfaces (`.tile-wall`, `.counter-rail`, `.formica`, `.booth`,
  `.board`, `.letterboard`, `.wallbox`, `.strip`, `.floor`), the neon sign, animation and data-attribute states.
- Only this template's palette exists (`bg`, `surface`, `ink`, `muted`, `line`, `accent`, `mustard`, `teal`,
  `vinyl`, `chalk`, `paper`, `footer` and their variants). Tailwind's default colours are switched off. To add
  a colour, add a variable to `:root` and both dark blocks, then map it in `@theme inline` as
  `--color-name: var(--variable)` to get `bg-name`, `text-name` and so on. Title-strip bands are `--band-*` tokens.
- Colours switch with the theme through the tokens, so prefer them to `dark:` variants (`dark:` follows `html.dark`).
- Reuse the building blocks and components (`PageHead`, `TitleStrip`, `StatusLine`, `DinerArt`, `ShakeGlass`)
  instead of restyling each instance. Add a reusable layout helper with `@utility`.
- Keep the `--jamstacks-*` component variables mapped to the tokens. Preserve readable contrast in both
  themes, responsive layouts from 360px, visible keyboard focus, semantic headings and reduced-motion support
  (the OPEN flicker, strip slide-in and straw bob all stop under `prefers-reduced-motion`). The OPEN tube flickers
  on once; never make it flash continuously.

## Static architecture

- Production is a static export in `out/`. Preserve static-export compatibility; no
  request-time rendering, API routes, Server Actions, database or production Next.js server.
- Use local content for pages and ordinary client code for browser-only interactions
  (the neon OPEN sign, status line, today's blue plate, menu paging and filters, copy button).
  Time-dependent text is computed in the browser (`components/diner-clock.tsx`), never at build time:
  the static HTML shows neutral text and the full week.
- Preserve both custom-domain root URLs and arbitrary GitHub Pages repository paths.
  Use the shared path helpers and `SiteLink` for links, images and metadata.
- Read relevant installed Next.js guides in `node_modules/next/dist/docs/` before
  changing framework behaviour. Keep dependencies modest and the npm lockfile reproducible.

## Optional Jamstacks form

- Keep the integration documented in README.md. The host is `<jamstacks-support-form>`
  with `data-jamstacks-component="support-form"` and `data-jamstacks-site` attributes.
- `JAMSTACKS_SITE` is a public website ID. Load one configured CDN bootstrap at
  `/sites/{publicSiteId}/embed.js`; no ID means no script request and a useful email fallback.
- The shared runtime owns form rendering, validation, spam protection and submission.
  Do not copy it, register a replacement element, intercept submission or simulate success.
- Preserve the documented full-document Contact navigation until a supported remount
  contract is available. Keep the email fallback usable during outages.
- The form supports name, email and message. Don't promise bookings, ordering or extra fields in page copy:
  a message is an enquiry, and nothing is booked until the diner replies.
- Style through supported `--jamstacks-*` CSS variables; do not reach into shadow-root internals.
- Configuration and build-time environment values are public. Never put credentials,
  publishing keys or private notification recipients in them. Remote builds must not depend on localhost.
- Preserve `.github/workflows/pages.yml`, its optional `provisioning_id` input and correlated
  run name when changing the workflow. Pull requests validate without deploying.

## Commands and checks

```sh
npm ci
npm run dev       # http://localhost:3000
npm test          # menu, blue plate, hours, config and embed checks
npm run typecheck
npm run build     # static export
npm run check     # all three
PAGES_BASE_PATH=/diner-preview npm run build
```

Run `npm run check` after every content or code change; test failures name the item, section or day to fix.
`npm start` previews the export on port 3000; stop the dev server first, or use
`npm start -- --port 3200`. Browser-check affected routes in light and dark, and root/project-path
assets when changing layout, navigation or deployment behaviour. Report local
checks separately from any actual GitHub deployment or accepted contact submission.

## Template publishing assets

- `jamstacks/` contains optional source-template metadata, gallery captures and their checks.
- Read `jamstacks/config.json`; capture evidence is `jamstacks/screenshots.json` and JPEGs stay directly inside `jamstacks/`.
- Run `node --test jamstacks/config.test.mjs` only when maintaining a source template.
- Customer websites can remove this entire folder. Normal tests, website code, builds and the Pages workflow must not import it.
- Keep `site.config.json`, embed integration and the Pages workflow outside the optional folder.
