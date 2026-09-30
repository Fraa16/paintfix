# Content update guide

For Chatifa. The most common changes and where they live. After any change: `npm run build`,
then push. Vercel deploys automatically.

| Change                                     | File                                                                         |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| Car package prices, durations, contents    | `src/content/data/packages.yaml`                                             |
| Extras (add-ons) and prices                | `src/content/data/addons.yaml`                                               |
| FAQ questions and answers                  | `src/content/data/faqs.yaml` (`{price:<package-id>}` inserts the live price) |
| Aviation services                          | `src/content/data/aviation-services.yaml`                                    |
| Airfields (coverage radar + list)          | `src/content/data/airfields.yaml` (lat/lng decide the radar position)        |
| Aviation stats strip                       | `src/content/data/aviation-stats.yaml`                                       |
| Phone, email, address, hours, service area | `src/content/site.ts`                                                        |
| Page copy (headlines, texts)               | `src/i18n/copy/{home,car,aviation,contact}.ts`                               |
| Navigation, buttons, form labels           | `src/i18n/ui.ts`                                                             |
| Images                                     | `src/content/media.ts` (see `docs/image-brief.md`)                           |
| Legal texts                                | `src/views/ImprintView.astro`, `src/views/PrivacyView.astro`                 |

## Drafts

Anything the client hasn't confirmed has `draft: true` (or is listed in `site.drafts`). On preview
deployments it shows an orange "Entwurf" marker; production shows nothing.

```bash
npm run content:drafts            # list everything still open
STRICT=1 npm run content:drafts   # exits 1 if anything is open (use before go-live)
```

When the client confirms an item: correct the value and remove `draft: true`.

## Prices appear in several places automatically

The lowest package price feeds the home diptych ("Pakete ab …"), the car hero, the page titles and
meta descriptions, the FAQ answers, llms.txt and the JSON-LD `PriceSpecification`. Change it
**only** in `packages.yaml`.

## Logos and OG images

```bash
pip install fonttools brotli
python3 scripts/build-logo.py      # outlines logos from Mona Sans → src/components/global/logo-paths.ts + public/brand/
node scripts/build-social.mjs      # OG cards + favicons
```

## Tests

```bash
npm run check     # TypeScript/Astro diagnostics
npm test          # Playwright: routes, SEO, hreflang, axe, forms, API (desktop + mobile)
```
