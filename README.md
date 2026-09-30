# Paintfix: Website

Website for **Paintfix** (Fahrzeugaufbereitung, Telgte) and its aviation division **Paintfix Aviation**
(Flugzeugaufbereitung). Built by Chatifa.

Two brand worlds on one codebase, like Mercedes-Benz and Mercedes-Maybach:

|         | Paintfix (automotive)                         | Paintfix Aviation                             |
| ------- | --------------------------------------------- | --------------------------------------------- |
| Look    | Daylight, white + graphite, normal-width type | Midnight navy + champagne gold, expanded caps |
| Motion  | Subtle CSS reveals                            | Layered parallax (GSAP ScrollTrigger + Lenis) |
| Pricing | Published "ab"-prices                         | On request                                    |

See [`docs/project-plan.md`](docs/project-plan.md) for the full strategy and plan.

## Stack

- [Astro 7](https://astro.build) with static output. Only `/api/contact` runs on demand (Vercel function, `fra1`)
- Tailwind CSS 4 + CSS custom-property themes (`[data-theme="auto" | "aviation"]`)
- Mona Sans variable font (self-hosted, width axis 75–125: one family, two stances)
- Content collections (YAML) for prices, FAQs, services, airfields
- nodemailer over IONOS SMTP for the contact form
- Playwright + axe-core for tests

## Commands

```bash
npm install
npm run dev                 # http://localhost:4321
npm run build               # production build (.vercel/output)
npm run check               # astro check (types)
npm test                    # Playwright: routes, SEO, hreflang, axe, forms, API
npm run content:drafts      # list content still waiting for client confirmation
npm run assets:placeholders # regenerate placeholder imagery
```

Copy `.env.example` to `.env` for local SMTP testing. Without SMTP, dev mode logs inquiries instead of sending them.

## Routes

|                    | DE                           | EN                                |
| ------------------ | ---------------------------- | --------------------------------- |
| Home               | `/`                          | `/en`                             |
| Car detailing      | `/fahrzeugaufbereitung`      | `/en/car-detailing`               |
| Aircraft detailing | `/flugzeugaufbereitung`      | `/en/aircraft-detailing`          |
| Contact            | `/kontakt`                   | `/en/contact`                     |
| Legal              | `/impressum`, `/datenschutz` | `/en/legal-notice`, `/en/privacy` |

## Structure

```
src/content/data/*.yaml   prices, FAQs, services, airfields, stats (draft flags)
src/content/site.ts       NAP, hours, service area
src/content/media.ts      image slot registry (placeholder | ai | stock | client)
src/i18n/                 routes (localised slugs), UI strings, page copy
src/views/                page layouts (render DE + EN from one source)
src/components/           global (header/footer/logo), sections, forms, seo, ui
src/scripts/parallax.ts   aviation motion system
src/pages/api/contact.ts  form endpoint
scripts/                  placeholder generator, logo outliner, social assets, draft report
docs/                     plan, client checklist, shot list, image brief, brand guide, launch checklist
```

## Docs

- [Client checklist (DE)](docs/client-checklist.md): what we need from the client
- [Photo shot list (DE)](docs/photo-shotlist.md)
- [Image brief](docs/image-brief.md): every image slot, sizes, parallax layers, AI rules
- [Brand guide (DE)](docs/brand-guide.md)
- [Content update guide](docs/content-update-guide.md)
- [Launch checklist](docs/launch-checklist.md): Vercel, IONOS DNS/mail, GBP, directories

## Licences

Mona Sans: SIL Open Font License 1.1. GSAP: free for commercial use (standard "no charge" licence).
Lenis: MIT. Third-party product names (CARPRO, CQuartz, Aero-Sense, NUVITE, NuShine) are used
descriptively and belong to their owners.
