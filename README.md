# Starlite Diner (Next.js)

A retro 1950s diner theme with chrome, cherry red and a neon sign that lights up when you're open: a jukebox-style menu of burgers, breakfast, shakes and pie with combo badges, a daily blue plate special, late-night hours, location and a [Jamstacks](https://jamstacks.net) contact component for parties, group visits and catering.

The page is the diner seen from a counter stool: a neon sign on the tiled back wall, a chrome counter rail, cherry-vinyl booths, a jukebox wallbox holding the menu and a checkerboard floor under the footer. Light mode is "seafoam daylight"; dark mode is "after midnight", with the neon glowing. Both follow the visitor's device unless they pick one with the header toggle.

It exports to plain static files, deploys to GitHub Pages (custom domain or `/repository/` path) and works with no backend.

**Starlite Diner**, its story, menu, blue plates and contact details are fictitious placeholders. The sample address is a public landmark, Old Town Plaza in Albuquerque, so the map has something real to show. Replace all of them with your own.

## Pages

| Route | What's there |
| --- | --- |
| `/` | The back wall under a cherry checkered trim: the neon sign (its OPEN tube lights when you're open), tagline, "See the menu" / "Find us", and a burger and milkshake on the red formica counter beneath a felt letterboard with today's blue plate. Counter stools line the rail. The chrome counter rail carries the live status ("Open · till 2am tonight"), today's hours, address and phone. Then **Find us** (address, landmark, directions, hours with late nights highlighted, map), today's blue plate and the week, featured dishes on the jukebox, shake glasses, the story, a parties & catering invitation and FAQs |
| `/menu/` | The full menu as jukebox pages A–G of title strips with codes (B3), prices, combo and other starbursts, dietary tags and 86'd items. Chrome page keys, filters (vegetarian, vegan, breakfast now), and a combos/extras/allergies panel |
| `/contact/` | Birthday parties, group visits & catering: email and phone (always available) plus the hosted enquiry form when connected |
| any other URL | A friendly 404: "This record's not on the jukebox" |

## Quick start

Requires Node.js 24 or newer.

```sh
npm ci            # install exact locked dependencies
npm run dev       # http://localhost:3000 with live reload
npm test          # configuration, menu, blue plate and hours checks
npm run typecheck
npm run build     # static export to out/
npm start         # serve out/ locally at http://localhost:3000/
npm run check     # test + typecheck + build in one go
```

No account, API key or network service is needed to run or build the website. Fonts are installed from npm and bundled at build time, so the build never fetches anything from a font service.

## Make it yours

Every page reads from two content files, so there are no duplicated strings to hunt down:

| File | What to change |
| --- | --- |
| [content/menu.ts](content/menu.ts) | **Blue plate specials** (at the top), menu pages and items, prices and sizes, combo price and contents, badges, dietary tags, sold-out items, shake flavours and extras, allergy notes, currency |
| [content/diner.ts](content/diner.ts) | Name and neon sign wording, tagline, introduction, story and three promises, "breakfast all day", email, phone, address (plus a landmark/cross-streets `note`), directions, opening hours, notice, amenities, FAQs, social links |
| [app/tailwind.input.css](app/tailwind.input.css) | Colours (including the neon, chrome, tile, vinyl and title-strip bands), fonts and other customizations. Components are styled with Tailwind classes |
| `public/burger.svg`, `public/milkshake.svg` | The burger in the header and hero, and the shake in the hero and menu page header. Replace them with your own art (keep the file names) |
| `public/og.png` | 1200×630 social preview image |
| `app/icon.svg` | Browser tab icon |
| [site.config.json](site.config.json) | Site name/description, domain, your time zone and public deployment settings (see below) |

### Today's blue plate

`bluePlate` is the first thing in `content/menu.ts`, because it's the edit you'll make most:

```ts
export const bluePlate: Record<Day, BluePlate | null> = {
  Monday: { name: 'Meatloaf Monday', description: 'Two thick slices with brown gravy…', price: 14.5 },
  Tuesday: { name: 'Chicken-fried steak', description: '…', price: 15.5 },
  // …one entry for every day
  Sunday: null,   // no blue plate on Sundays
};
```

The home page shows today's plate on the letterboard and the booth panel, picked in the visitor's browser by **your** calendar day. It changes at local midnight, even when you're still open past it: at 1am on a Saturday the sign says you're open (Friday night's hours), but the board shows Saturday's plate. Without JavaScript, the board lists the whole week and makes no claim about today.

### Maintaining the menu

Each jukebox page in `sections` has a `letter`, and each item's code is the letter plus its position (`B3` is the third burger). You never type codes, and they appear on the strips, in links (`/menu/#b3`) and on the home page jukebox. Marking something sold out never changes a code. Moving an item up or down does renumber its page.

An item looks like this:

```ts
{
  id: 'green-chile-burger',           // unique; also the link /menu/#green-chile-burger
  name: 'Green chile cheeseburger',
  description: 'Roasted New Mexico green chile and melted cheddar.',  // one line on the strip
  price: [{ label: 'Single', amount: 12 }, { label: 'Double', amount: 15 }], // or one number: 12
  combo: true,                        // shows the "Combo +$4.50" starburst
  badge: 'house',                     // optional: 'house' | 'new' | 'seasonal' | 'big-appetite'
  diet: ['vegetarian'],               // optional: 'vegetarian' | 'vegan' | 'gluten-free' | 'contains-nuts'
  featured: true,                     // optional: show on the home page jukebox (keep 6–8)
  art: 'burger',                      // drawing for featured items: burger, hotdog, mug, pie, pancakes, fries, shake
}
```

- **86'd today?** Add `soldOut: true`. The strip stays in place, stamped "86'd today", with a plain "sold out today" label for screen readers. Remove the line when it's back.
- **Combos:** `menu.combo` says what a combo adds (fries and a fountain soda) and costs, once for every item. Set `combo: true` on an item; only sections listed in `combo.sections` may offer one (the tests check).
- **Seasonal specials:** add an item with `badge: 'seasonal'` (or, for shakes, `seasonal: true` on the flavour), and delete it when the season ends.
- **Shakes:** add a flavour to `menu.shakes.flavours` with a `name`, `description` and a hex `color`. It gets its own tinted glass on the home page and a strip on page E, with no image needed. Set `malt: true` to call it a malt.
- **New section:** add `{ id, letter, title, description, band, items: [...] }` to `sections`. It gets a chrome page key automatically. `band` is the strip colour: `cherry`, `mustard`, `seafoam`, `chrome`, `sky`, `plum` or `tangerine`.
- **Prices** are numbers in `menu.currency` (`5` is $5, `5.5` is $5.50). Change `currency` and `locale` for other countries.
- `gluten-free` means made with gluten-free ingredients: the menu notes that everything shares one grill and fryer. Vegan items count as vegetarian in the filters.

`npm test` checks the menu after every edit: unique, URL-safe ids, one letter per page, known bands, tags and badges, valid prices and sizes, combos only where they make sense, a blue plate (or `null`) for every open day, unique and stable codes, and 6–8 featured items with drawings. A failure names the item, section or day to fix.

### Hours, late nights and the neon OPEN sign

`hours` in `content/diner.ts` lists every day once with 24-hour `opens`/`closes` times in your local time. Leave both out for a closed day. **For late nights, write the closing time as it reads on the clock:** Friday `opens: '07:00', closes: '02:00'` means open until 2am Saturday morning. A closing time earlier than the opening time is always read as after midnight.

Your time zone is `timeZone` in [site.config.json](site.config.json), an IANA name such as `America/Denver`. If Jamstacks created this website, it's the time zone you chose in the portal. With it, the visitor's browser works out, using *your* clock and refreshing every minute:

- the neon sign's OPEN tube lights with one gentle flicker when you're open, captioned "Open till 2am" or "Back at 7am";
- the status line: "Open · till 2am tonight", "Open · till 10pm · breakfast all day", "Closing in 30 minutes" or "Closed · back at 7am";
- today's hours and today's blue plate;
- and "Times shown in Mountain Time" (or your zone) appears beside the hours.

The built files never contain a time-dependent claim. Without a time zone or without JavaScript, the OPEN tube stays unlit, the sign reads "Hours below" and the weekly hours and blue plates are shown in full. An invalid zone name fails the build with a clear message. Use `notice` for one-off messages such as holiday hours; leave it `''` to hide it.

### Location and map

The home page puts the address, landmark note, directions and hours directly under the hero on the counter, beside a Google map in a chrome-rimmed window. The map and the "Get directions" and "Open in Google Maps" buttons all come from `address` in `content/diner.ts`.

All three are free and need no Google account or API key:

- The links use Google's documented [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started).
- The map uses Google's keyless embed (the `google.com/maps/embed?pb=…` form that `google.com/maps?q=…&output=embed` redirects to). It's widely used but isn't a documented API. For Google's officially supported option, create a free [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) key restricted to your domain and change `mapEmbedUrl` in [lib/maps.ts](lib/maps.ts) to the `maps/embed/v1/place` form shown there. Embed API keys are meant to be public, so this is safe in a static site.

The map is lazy-loaded, so Google is only contacted when it scrolls into view. Google may set cookies in the embedded map, so mention it in your privacy notice if you have one. In dark mode a CSS filter (`--map-filter` in `app/tailwind.input.css`) turns it into a night map. Set it to `none` to show Google's normal colours.

Text is rendered as plain text, never HTML. Don't present invented reviews or awards as fact.

## Appearance

The header uses `DarkModeToggle` from the published `jamstacks` React package. The root layout supplies `ThemeProvider` and the early `ThemeScript`, so a saved preference applies before the first paint and stays consistent across navigation and tabs.

Everything you see is drawn with inline SVG and CSS coloured by tokens: the neon sign (tubes, mounting clips, end caps and transformer boxes), the tile wall, chrome rails and rivets, tufted booth vinyl, the felt letterboard, title strips, starbursts, the line drawings, the shake glasses (tinted by each flavour's `color`) and the checkerboard floor. The only image files are `public/burger.svg` and `public/milkshake.svg` (header, hero and menu page header); everything else needs no files to swap. Animations (the OPEN flicker-on, strips sliding in when you flip a jukebox page on a phone, and a straw that bobs when you hover a shake) stop for visitors who prefer reduced motion. The OPEN tube flickers once and then stays steady.

Styling uses [Tailwind CSS v4](https://tailwindcss.com). Components use utility classes such as `bg-surface text-ink`, built from the template's own colour tokens; Tailwind's default palette is switched off so the look stays consistent. To change a colour, edit its variable in `app/tailwind.input.css` (light `:root` and both dark blocks). To add one, such as a custom accent, add a variable there and map it in `@theme inline` (`--color-highlight: var(--highlight)` gives `bg-highlight`, `text-highlight` and so on).

Fonts are self-hosted through npm packages:

| Font | Used for | Licence |
| --- | --- | --- |
| [Yellowtail](https://fonts.google.com/specimen/Yellowtail) (`@fontsource/yellowtail`) | The neon script and a few accents | Apache License 2.0 |
| [Big Shoulders Display](https://fonts.google.com/specimen/Big+Shoulders+Display) (`@fontsource-variable/big-shoulders-display`) | Headings, signage, jukebox codes and prices | SIL Open Font License 1.1 |
| [Archivo](https://fonts.google.com/specimen/Archivo) (`@fontsource-variable/archivo`) | Body text | SIL Open Font License 1.1 |

Prices and times use tabular figures (the `tabular` utility) so columns line up.

## Footer credit

The footer ends with "with ❤️ [jamstacks.net](https://jamstacks.net)". It's an ordinary link in [components/site-footer.tsx](components/site-footer.tsx). This is your website, so you can keep, reword or remove it.

## Configuration

`site.config.json` holds public deployment settings only. Jamstacks may rewrite this file when it sets up a repository for you; it never touches `content/`.

```json
{
  "name": "Starlite Diner",
  "description": "A family-run 1950s diner on Old Town Plaza: breakfast all day, hand-pressed burgers, shakes, pie and late nights on weekends.",
  "domain": "next-burger-diner.jamstacks.net",
  "timeZone": "America/Denver",
  "jamstacks": { "siteId": "", "cdnUrl": "https://cdn.jamstacks.net" }
}
```

`domain` is the template's live demo, `next-burger-diner.jamstacks.net`. **Replace it with your own domain** (hostname only, e.g. `www.example.com`) or set it to `""` if you don't know it yet; it's used for canonical links, the social image and the sitemap. Jamstacks provisioning replaces it for you.

Build-time environment variables override the file (blank values keep the file's value). See [.env.example](.env.example).

| Purpose | Local/build variable | GitHub Actions repository variable |
| --- | --- | --- |
| Public Jamstacks website ID | `JAMSTACKS_SITE` | `JAMSTACKS_SITE` |
| Component CDN base | `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | `JAMSTACKS_CDN_URL` |
| Display/canonical domain (hostname only) | `NEXT_PUBLIC_SITE_DOMAIN` | `SITE_DOMAIN` |
| Time zone for opening hours (IANA name) | `SITE_TIME_ZONE` | not needed; set `timeZone` in the file |
| Project-path prefix, e.g. `/my-diner` | `PAGES_BASE_PATH` | set automatically from `actions/configure-pages` |
| Absolute site URL for canonical links/sitemap | `PAGES_BASE_URL` | set automatically from `actions/configure-pages` |

Every value here is **public** and ends up in the built files. Never put GitHub tokens, publishing keys or private email addresses in config or `.env` files. The public site ID identifies your website; it grants no administrative access.

Validation happens at build time ([lib/config.mjs](lib/config.mjs)): the site ID must be a single path-safe segment, the CDN must be HTTPS (path prefixes like `https://example.org/_cdn` are fine), the domain must be a bare hostname, and the base path must be a plain URL path. A `localhost` CDN is rejected unless you opt in with `JAMSTACKS_ALLOW_LOCAL_CDN=1`, and is always rejected in GitHub Actions so a public site can never depend on your machine.

GitHub may report an HTTP `PAGES_BASE_URL` while a new custom domain's HTTPS certificate is provisioning. The build accepts that URL and emits HTTPS canonical, social and sitemap URLs, so the first deployment can complete. When neither `PAGES_BASE_URL` nor a domain is known, canonical links and social images are omitted and `sitemap.xml` is empty, rather than guessing an origin.

The home page includes schema.org `Restaurant` structured data (address, `servesCuisine`, phone, menu link, `acceptsReservations: false` for walk-ins, and opening hours) built from `content/diner.ts`. Late nights are published as, for example, Friday `opens 07:00` / `closes 02:00`, which search engines read as closing after midnight.

## Contact and Jamstacks

**Without Jamstacks** (default): the Contact page shows your email with a copy button, your phone number for takeout and a "useful to include" list (date and time, number of guests, the occasion, dine-in or catering, allergies). No Jamstacks script is requested anywhere.

**With Jamstacks**: create a website in the Jamstacks portal, configure the support form's copy (for example heading "Parties, groups & catering", name/email/message labels, button text and a success message) and theme, and **publish** it. Then set `JAMSTACKS_SITE` (and `JAMSTACKS_CDN_URL` if you're not using `https://cdn.jamstacks.net`) and rebuild. The Contact page then renders:

```html
<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="site_…"></jamstacks-support-form>
<!-- plus, after hydration, one script: {cdn}/sites/{siteId}/embed.js -->
```

How it behaves:

- The hosted component renders inside the tag (in its own shadow root) and owns validation, spam protection, submission and the success/error messages. This template never submits messages, never registers the element itself and never shows a success message of its own.
- Your email stays visible next to the form at all times. If the script can't load, a short message offers the email instead; if the form is slow to appear, a gentle note does the same. With JavaScript disabled, the page points to email.
- Form text and theme changes you publish in the portal appear after a reload (allow for the CDN cache interval), with no rebuild. Changing the menu, hours or the site ID does need a rebuild.
- The form supports name, email and message today. The page copy says a message is an enquiry and nothing is booked or ordered until you reply. Don't promise booking slots, party-size fields or online ordering.
- Only the Contact page loads the Jamstacks script.

**Why Contact uses full page loads:** the current shared runtime finds the form's host when its script runs and stops watching for new hosts after ten seconds; it has no public "remount" API. Links to and from Contact therefore do an ordinary full page load (all other links use fast client-side navigation), so the form appears reliably. This is handled by [components/site-link.tsx](components/site-link.tsx).

**Styling:** the page maps its design tokens to the shared `--jamstacks-*` CSS variables in [app/tailwind.input.css](app/tailwind.input.css). In dark mode the form's primary colour stays the deep cherry, so its white button text stays readable. A theme you publish in the portal overrides these on the component itself. Don't style the component's internals; they're owned by the runtime.

**Content Security Policy:** none is set by this template. If you add one, allow scripts from your Jamstacks CDN origin, the spam-check provider used by the form (`https://challenges.cloudflare.com` for scripts and frames), `connect-src` to the API origin your published form uses, and `frame-src https://www.google.com` for the map. Inline structured data and the theme script also need a nonce or hash. Avoid wildcards and `unsafe-eval`.

## Deploy to GitHub Pages

The workflow at [.github/workflows/pages.yml](.github/workflows/pages.yml) tests, type-checks, builds and deploys on every push to `main`, validates pull requests without deploying, and can be run manually.

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Optional: **Settings → Secrets and variables → Actions → Variables**: add `JAMSTACKS_SITE`, `JAMSTACKS_CDN_URL`, `SITE_DOMAIN`. These are *variables*, not secrets: they're public.
4. Push to `main` or run the workflow from the Actions tab.

The site works at `https://<owner>.github.io/<repository>/`; the workflow reads the correct path prefix from GitHub. To preview a project-path build locally:

```sh
PAGES_BASE_PATH=/diner-preview npm run build
node scripts/serve.mjs --base /diner-preview   # http://localhost:3000/diner-preview/
```

**Custom domain:** set it in **Settings → Pages → Custom domain** and create the DNS records GitHub shows you, then put the same hostname in `site.config.json`'s `domain`. Don't add a `public/CNAME` file: deployments from GitHub Actions ignore it.

**Jamstacks provisioning:** if Jamstacks created this repository for you, it already enabled Pages, set the repository variables and started the first run. Its runs appear as `Jamstacks <operation id>` (the workflow's optional `provisioning_id` input). Keep the workflow's file path, inputs and run name if you edit it.

## Local Jamstacks development

For working against a locally running Jamstacks service (portal at `https://localhost:5001`, assets at `https://localhost:5001/_cdn`):

```sh
JAMSTACKS_SITE=site_… \
NEXT_PUBLIC_JAMSTACKS_CDN_URL=https://localhost:5001/_cdn \
JAMSTACKS_ALLOW_LOCAL_CDN=1 npm run dev
```

This website uses Next.js's default port 3000. Trust the local development certificate in your browser and register `http://localhost:3000` as an allowed origin for the website in the portal; the service refuses submissions from origins it doesn't know.

## Project structure

```
app/                    routes, metadata, sitemap/robots, global styles and tokens
components/             header, footer, neon sign, status line, blue plate board, jukebox menu,
                        title strips, line drawings, Jamstacks host/loader
content/                diner.ts and menu.ts: your content
lib/config.mjs          build-time public config resolution and validation
lib/hours.ts            opening hours, late nights, open/closed status and the blue plate of the day
lib/menu-codes.ts       jukebox codes (B3) derived from page letters
lib/menu-filter.ts      vegetarian, vegan and breakfast filters
lib/paths.ts            base-path-aware links and asset URLs
lib/structured-data.ts  schema.org Restaurant data
lib/time-zone.ts        readable time zone names for the hours
lib/maps.ts             Google Maps embed, search and directions URLs
lib/embed-status.ts     observable states of the hosted form
types/                  typed JSX for <jamstacks-support-form>, font module declarations
public/                 social preview image
scripts/serve.mjs       static preview server (with base path support)
tests/                  node:test suites
site.config.json        public deployment settings (provisioner-compatible)
jamstacks/              optional template publishing metadata and gallery captures
```

## Before publishing your website

- Replace Starlite Diner, the sign wording, story, address (and its `note`), directions, email, phone, menu, prices, blue plates, shakes, FAQs and social links with your own details.
- Set your real opening hours (late nights as `closes: '02:00'`) and `timeZone` in `site.config.json`, and check the neon sign and status line on the home page.
- Replace the demo `domain` in `site.config.json` with your own (or set the correct Pages URL), and update the site title/description, icon and social preview image.
- Run `npm run check` and a project-path build when using a repository URL.
- Check the pages on phone and desktop, in light and dark, with keyboard navigation and the Contact fallback.
- If you connect Jamstacks, publish the form in the portal and verify a real test message reaches the website inbox. A successful build does not verify message delivery.

`AGENTS.md` gives coding assistants the same architecture and editing guidance.

## Optional template publishing folder

`jamstacks/` is used only to publish this source template in the Jamstacks gallery:

```text
jamstacks/config.json       template metadata and screenshot paths
jamstacks/screenshots.json  capture viewport, hashes and sizes
jamstacks/home-light.jpg    light homepage preview
jamstacks/home-dark.jpg     dark homepage preview
jamstacks/config.test.mjs   source-template publishing checks
```

Run `node --test jamstacks/config.test.mjs` when maintaining the source template.
When creating a customer website, the whole `jamstacks/` folder can be removed.
Normal `npm test`, type checking, builds and the Pages workflow do not depend on it.
Keep `site.config.json`, the website's embed integration and `.github/workflows/pages.yml`;
these belong to the customer website and continue to work without gallery metadata.
