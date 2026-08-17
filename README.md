# TAE Solar — Website Rebuild (MVP)

Static site built against the redesign PRD. No build step, no framework, no dependencies —
just HTML, CSS and vanilla JS. Total weight ~300 KB (the current Wix homepage alone is ~1.2 MB
across 131 requests and 78 scripts).

---

## 1. What's here

```
index.html                  Homepage — trust-first, calculator, reviews, map, FAQ
residential.html            Residential journey + lead form
commercial.html             Commercial journey + lead form
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
      Blog articles are English-only for now.
- [ ] **Privacy policy and terms.** Footer links are placeholders (`href="#"`).
- [ ] **Verify the stats.** "Established 2020", "10+ years", "4 languages" all come from your
      existing site copy. Correct anything that's out of date.
- [ ] **Check the calculator assumptions** (see section 4) and adjust to match your real pricing.

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

- **AI roof measurement** (photo → roof area → indicative price)
- **AI garden/installation visualiser**
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
