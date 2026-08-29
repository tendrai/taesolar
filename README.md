# TAE Solar — Website Rebuild (MVP)

Static site built against the redesign PRD. No build step and no framework — just HTML, CSS and
vanilla JS. Total weight ~300 KB (the current Wix homepage alone is ~1.2 MB across 131 requests
and 78 scripts).

One vendored dependency: **Leaflet 1.9.4** (147 KB JS + 15 KB CSS, in `assets/vendor/`), used
only by the roof measurement tool and loaded only on `roof.html`. Every other page is unchanged
and still dependency-free. It is committed to the repo rather than pulled from a CDN, so there
is still nothing to install and no third-party runtime dependency at page load.

---

## 1. What's here

```
index.html                  Homepage — trust-first, calculator, reviews, map, FAQ
residential.html            Residential journey + lead form
commercial.html             Commercial journey + lead form
roof.html                   Roof measurement tool + calculator  ← new
about.html                  Story, values, TAIS network, brand partners
contact.html                Full lead form, contact details, map, FAQ
blog/
  index.html                Blog listing
  cost-of-solar-phuket.html
  is-solar-worth-it-thailand.html
  choosing-a-solar-installer-phuket.html
assets/css/site.css         Single design system — all styling lives here
assets/js/i18n.js           EN / TH / RU / ZH translation engine + dictionaries
assets/js/site.js           Nav, scroll reveal, savings calculator, lead forms
assets/js/roof.js           Roof tracing, area maths, capacity  ← new
assets/vendor/leaflet.*     Vendored Leaflet 1.9.4 (roof.html only)  ← new
```

**To preview:** open `index.html` in any browser.
**To deploy:** upload the whole folder to any static host (Netlify, Cloudflare Pages, Vercel,
or plain shared hosting). Nothing needs compiling.

---

## 2. Before you go live — checklist

These are the things I could not do for you, in rough priority order.

### Critical

- [ ] **Real photos.** Every image on the site is currently a branded SVG placeholder.
      Real installation photos are the single biggest trust upgrade available to you —
      hero, blog thumbnails, and a projects gallery.
- [ ] **Real Google reviews.** The homepage has three clearly-marked `Sample` review cards
      and a `0.0 / 00 reviews` rating summary. Replace with real review text, update the
      score and count, and point the "Read all reviews on Google" button at your Google
      Business profile. **Then delete the `.dev-note` box and the `Sample` tags.**
      Do not launch with the placeholders showing.
- [ ] **LINE link.** Every LINE icon is `href="#" data-line`. Add your official LINE account
      URL (or a QR image). Search the codebase for `data-line`.
- [ ] **Form delivery.** Forms currently open the visitor's email client pre-filled to
      `info@taesolar.net`. That works with zero setup but loses anyone without a mail app
      configured. Wire them to a real service — Formspree, Netlify Forms, Web3Forms — by
      setting the `<form>` `action` and removing the `preventDefault()` in
      `assets/js/site.js` → `initForms()`.
- [ ] **Google Business Profile.** Verify the Kathu address, add photos, and make sure the
      map pin in the embed lands exactly on your office. The embed currently searches the
      address string; swap in a place-ID embed once verified.

### Important

- [ ] **Native review of translations.** Thai, Russian and Chinese are machine-assisted and
      cover the conversion surface (nav, headings, CTAs, calculator, forms, footer). Have a
      native speaker check them — particularly the Thai, since that's a primary market.
      Blog articles are English-only for now. **The roof tool added ~25 new strings per
      language** (`roof.*` and `calc.roof.*` in `assets/js/i18n.js`) — these are the newest and
      least reviewed, and they include the instructions people need to operate the tool, so
      they matter more than most.

- [ ] **Decide on the geocoder.** Address search currently uses OpenStreetMap's free Nominatim,
      which works and needs no account, but their policy asks commercial heavy users to move to
      a paid provider. If search volume grows, set `provider` and `key` in `GEOCODE` at the top
      of `assets/js/roof.js` — see section 4c.
- [ ] **Privacy policy and terms.** Footer links are placeholders (`href="#"`).
- [ ] **Verify the stats.** "Established 2020", "10+ years", "4 languages" all come from your
      existing site copy. Correct anything that's out of date.
- [ ] **Check the calculator assumptions** (see section 4) and adjust to match your real pricing.
- [ ] **Confirm the ground-mount cost uplift.** `SOLAR.groundCostFactor` is set to 1.15 (ground
      mounting priced 15% above the same kWp on a roof). That is an industry-shaped estimate,
      not your data — check it against jobs you have actually quoted.
- [ ] **Confirm the ≤5 kW export rule.** The 5 kW cliff warning (section 4a) assumes a system
      above the cap earns *nothing* for surplus. If PEA in fact pays on the first 5 kW, the
      cliff is a slope and that warning is too aggressive. Worth checking — a lot rests on it.

### Nice to have

- [ ] Favicon and a social share image (`assets/img/og.jpg` is referenced in the schema but
      doesn't exist yet).
- [ ] Analytics (GA4 or Plausible) — one script tag in each `<head>`.
- [ ] A projects/case-study page once you have photos and permission to use them.

---

## 3. What was fixed from the old site

| Old site | Now |
|---|---|
| ABOUT / SERVICES / TAIS / CONTACT nav links all pointed at the bare homepage | Real pages and working anchors |
| Projects page was completely empty | Blog + content structure; projects page pending photos |
| Quote form asked only name, email, subject | Captures phone/LINE, area, property type, service, bill band, and attaches calculator context |
| No Thai despite advertising Thai service | EN / TH / RU / ZH switcher |
| No pricing or savings tooling | Full savings calculator |
| Claimed Line contact, no Line link | LINE slot ready (needs your URL) |
| ~1.2 MB, 78 scripts, slow hero | ~300 KB, 2 small scripts, no framework |
| Nationwide-first positioning | Phuket-first, with nationwide as supporting proof |

Your phone numbers are unchanged and still use `+44` as you confirmed.

---

## 4. The savings calculator

All assumptions live in **one object** at the top of `assets/js/site.js` — `const SOLAR = {...}`.
Edit there and every page updates.

| Assumption | Value used | Source / reasoning |
|---|---|---|
| Residential tariff | ฿4.20 / kWh | Thai residential averages ~฿3.95/kWh (May–Aug 2026, incl. Ft, pre-VAT); ~฿4.23 blended incl. 7% VAT |
| Commercial tariff | ฿4.40 / kWh | Varies by tariff class — adjust to your typical customer |
| Export buyback | ฿2.20 / kWh, ≤5 kW AC, residential only | PEA/MEA 2026 household rooftop scheme |
| Specific yield | 1,350 kWh / kWp / year | Thailand is 1,300–1,500; southern Thailand sits at the **low** end due to rainfall, so this is deliberately conservative |
| Install cost | ฿120k @ 3 kWp → ฿310k @ 10 kWp → ฿1.15M @ 50 kWp | Interpolated from 2026 Thai market ranges |
| Battery | +฿24,000 per kWp | Storage roughly doubles a residential system cost |
| Daytime load share | 55% / 40% / 25% (day / mixed / evening) | Governs how much generation you can actually self-consume |

**The important design decision:** the calculator sizes systems against your *usable daytime
load*, not against the biggest array that fits your roof. That's why it recommends a 3.5 kWp
system for a ฿4,000 bill rather than 10 kWp. A unit you consume yourself is worth ~฿4.20; a unit
you export is worth ฿2.20 at best and nothing above 5 kW. Overselling capacity would produce
flattering numbers and unhappy customers — the model deliberately refuses to do that.

Sanity checks at current settings: ฿4,000/mo home → 3.5 kWp, ~฿134k, 6.8 yr payback.
฿40,000/mo business → 32.5 kWp, ~฿783k, 4.1 yr payback. Both sit inside the ranges quoted in
the FAQs, so the site is internally consistent.

Every result panel carries a "guidelines only" disclaimer, as the PRD requires.

### 4a. Guard rails against quoting a system you'd never sell

The maths above will happily price an array four times bigger than the customer's demand and
report a 40-year payback with a straight face. Correct, and commercially useless. Two guards now
sit on top of it, both in `render()` in `assets/js/site.js`:

**The 5 kW export cliff.** Crossing 5 kWp on a residential system doesn't taper the export
payment, it removes it — so a *bigger* array can be worth dramatically *less*. Worked example at
฿1,000/month, mostly daytime:

| Size | Cost | Year-1 saving | Payback | 25-year |
|---|---|---|---|---|
| 5.0 kWp | ฿175,000 | ฿17,993 | 9.7 yr | ฿575,398 |
| 5.5 kWp | ฿188,500 | ฿6,600 | 28.6 yr | ฿211,063 |
| 8.5 kWp | ฿269,500 | ฿6,600 | 40.8 yr | ฿211,063 |

฿13,500 more spent, ฿11,393 a year of income destroyed. When the visitor is above the cap and
has surplus, the panel now says so, prices the 5 kWp alternative against their current choice,
and offers a one-click resize.

**Oversizing generally.** If more than 25% of generation would be neither self-consumed nor paid
for, the panel says how many kWh a year would go to the grid unpaid and offers the size we'd
actually quote.

**A stale-size bug this exposed.** Nudging the size slider used to set a `sizeTouched` flag
permanently, after which the bill could change by 40× and the recommendation never returned.
That's how a ฿1,000 bill ended up paired with an 8.5 kWp system. The size now always displays
what we'd recommend, with a one-tap apply, and both resize buttons clear the flag so it tracks
again.

> **Open question worth your call.** `recommendedSize()` sizes purely to self-consumption and
> ignores export income entirely. For a low-bill residential customer that recommends ~1 kWp
> (7.1 yr payback, ฿181k over 25 years) when 5 kWp returns ฿575k for the same roof. Neither is
> wrong — one optimises payback, the other lifetime return — but the model currently only knows
> the first. If you'd rather it recommended toward the 5 kW cap where the roof and budget allow,
> that's a one-function change and a sales-policy decision.

### 4b. Currency

Phuket's expat and second-home market thinks in its own money, so the calculator converts to
THB, USD, EUR, GBP, RUB, CNY, AUD, SGD and SEK. Everything is **computed in baht** and converted
at display time only, so switching currency round-trips exactly and never accumulates error.

Live rates come from `open.er-api.com` (free, no key), cached 12 hours in `localStorage`, with a
hardcoded fallback table in `const CURRENCY` so the page still works offline or if that call
fails. Every `localStorage` access is wrapped — it throws in some privacy modes.

Two deliberate choices: the panel carries a note that quotes are issued and paid in Thai baht,
because showing "£2,989" shouldn't imply a price in pounds; and the lead-form context always
uses `fmtBaht()` so **sales always receives baht**, whatever the visitor was viewing.

---

## 4c. The roof / garden / land measurement tool (`roof.html`)

The visitor traces their **roof, garden or plot of land** on satellite imagery; the tool returns
the area, how many panels fit, and the largest system that space can physically carry. That
ceiling is then handed to the savings calculator on the same page.

Ground mounting matters commercially — plenty of Phuket villas and plots have more usable garden
than roof — so it is a first-class option, not an afterthought: it has its own packing density
and its own cost multiplier (below), because pricing a field at rooftop rates would produce
exactly the kind of flattering nonsense section 4a exists to prevent.

**Why tracing rather than a photo upload.** The obvious version of this feature is "upload a
photo of your house and we'll measure it". That cannot be made accurate: a single uncalibrated
photo has no scale reference, unknown focal length and unknown camera angle, so any area derived
from it is a guess that can be wrong by a factor of two — and it would be wrong in the direction
of quoting systems that don't fit. Tracing on satellite imagery gives a real measurement from
real coordinates, and it costs nothing per use. A photo-based *visualiser* is still a good idea,
but as a picture, not a measurement — see section 7.

**Assumptions** — all in one object at the top of `assets/js/roof.js`, `const ROOF = {...}`.

| Assumption | Value | Reasoning |
|---|---|---|
| Panel | 1.134 × 1.722 m, 550 W | Typical current mono module (~1.95 m²) |
| Usable share, pitched | 55% of footprint | At 8°N the orientation penalty is small — a low-tilt array on a north-facing pitch still returns within ~10% of a south-facing one, so unlike in Europe you don't write off half the roof on aspect. What you lose is edge setbacks, ridge and valley clearance, vents, and the water tank |
| Usable share, flat | 70% of footprint | Low tilt means less row self-shading than further north, but you still need walkway access, plant and parapet clearance |
| Usable share, ground | 45% of plot | The loosest packing of the three: rows spaced so they don't shade each other, access between them, boundary setbacks, and somewhere for inverters and switchgear. A large open field would beat this; a domestic garden — irregular, with trees and the house itself — will not |
| Ground-mount cost | ×1.15 on the rooftop price | Frames and foundations instead of using the building's structure, groundworks, longer cable runs, usually fencing. **ESTIMATE — check against your own ground-mount jobs** (`SOLAR.groundCostFactor`) |
| Minimum area | 8 m² | Below this it's a mis-tap, not a roof |

**Area maths.** `polygonAreaM2()` projects the traced ring onto a local equirectangular plane
centred on the ring, then runs the shoelace formula. Verified against the analytic area of a
known box at Phuket's latitude: **0.0006% error**, and independent of winding direction. At
building scale the curvature term is far below the error in the visitor's own tracing, so a
full geodesic area would add machinery without adding accuracy.

**How it feeds the calculator.** The bill gives one ceiling (what your usage justifies); the
roof gives another (what physically fits). `recommendedSize()` takes the smaller, and when the
roof is the binding one the results panel says so explicitly rather than quietly shrinking the
number. The traced area and roof type are also appended to the quote-form context, so sales
sees what the customer drew.

**Imagery.** Esri World Imagery, which needs no API key or billing account — that is why this
shipped without waiting on Google Cloud setup. Attribution is required by Esri's terms and is
rendered bottom-right; **do not remove it**. The tile URL is a single line in `roof.js` if you
later move to Google or Mapbox.

**Address search.** Search by address, area or Thai postcode; results drop down and clicking one
flies the map there at zoom 20. There's also a "use my location" button (browser geolocation)
for people filling this in at the property.

Settings live in `const GEOCODE = {...}` at the top of `roof.js`. Three providers are wired up
in `GEOCODERS` and switching is two fields:

| Provider | Key needed | Notes |
|---|---|---|
| `nominatim` *(default)* | No | OpenStreetMap's free geocoder. Works today, no billing account. |
| `google` | Yes | `provider:'google'` + `key:'...'`. Best Thai address coverage. |
| `mapbox` | Yes | `provider:'mapbox'` + `key:'...'`. Generous free tier. |

Results are restricted to Thailand (`countryCodes`), requested in the visitor's current site
language, and de-duplicated. Failure modes — no match, network down, misconfigured provider —
each get their own message rather than failing silently.

**On staying with Nominatim.** It's free and the result quality tested well (streets, towns,
beaches and postcodes all resolve correctly), but two things are worth knowing. Their usage
policy caps you at **one request per second** and **forbids client-side autocomplete**, which is
why search only fires on submit, never as you type — please don't "improve" it into a live
autocomplete without switching provider first. And they ask commercial heavy users to use a paid
provider or self-host. At a local installer's volume you're fine; if this page ever gets busy,
switch `provider` to `google` or `mapbox` and add a key. Attribution is shown under the results
and is required — do not remove it.

**Known limits, by design.** It measures the outline drawn and nothing else — it cannot see
shading, roof condition, structural capacity, water tanks, or which way each face points. The
panel says all of this and points at the free site survey.

---

## 5. Languages

Client-side switcher: `?lang=th`, `?lang=ru`, `?lang=zh`. The choice is written into the URL so
it's shareable and survives reloads, and it's carried across internal links automatically.

**SEO caveat you should know about:** client-side switching is the right call for an MVP, but
search engines index one URL per page, so only the English version really competes in search.
When Thai or Russian traffic justifies it, the upgrade is real per-language directories
(`/th/`, `/ru/`, `/zh/`) with `hreflang` tags. The dictionaries in `i18n.js` port straight over.

To add or edit a string: add the key to all four dictionaries in `assets/js/i18n.js`, then put
`data-i18n="your.key"` on the element.

---

## 6. SEO / AI-search foundations in place

- Semantic HTML, one `<h1>` per page, correct heading order, skip links, focus states.
- `LocalBusiness` schema with the Kathu address, geo coordinates, opening hours, areas served
  (Phuket, Phang Nga, Krabi), languages spoken and a service catalogue.
- `FAQPage` schema on the homepage, `Service` schema on the journey pages, `Article` schema on
  each blog post — these are what AI assistants and rich results read.
- Location-specific titles and descriptions targeting "solar Phuket" rather than generic terms.
- Blog structured for ongoing publishing; the three seed posts answer the questions buyers
  actually search for.

---

## 7. Deliberately not built (Phase 2 per the PRD)

- **AI garden/installation visualiser** — render panels onto a customer's own photo. Worth
  building, but as a *picture*, not a measurement: it needs an image-generation model, which
  means a serverless function, an API key, per-render cost, rate limiting, and a privacy
  disclosure (you'd be sending photos of people's homes to a third party, which matters under
  Thai PDPA). Gate it behind the lead form — that makes it a real CTA and solves abuse and cost
  control at the same time. The measurement half of this is already done, in `roof.html`.
- **Google Solar API** — returns roof segments, pitch, azimuth and a panel layout from an
  address, which would automate the tracing step. Worth ten minutes to check whether its
  coverage extends to Phuket before designing around it; coverage outside the US and Europe
  is patchy.
- Segmented landing pages per market/customer type
- Multi-brand / multi-site rollout

These need a backend and a vision model, and the PRD correctly flags them as stretch items that
shouldn't block launch. The calculator gives you most of the lead-capture value now.

The mailing-list work (list cleaning, campaign cadence) is an operational task rather than a
site feature — but every page is a valid campaign landing target, and the language parameter
means you can send Thai or Russian segments straight to a translated view.

---

*Built August 2026. Figures researched at that date — electricity tariffs and the PEA buyback
scheme change, so re-check section 4 quarterly.*
