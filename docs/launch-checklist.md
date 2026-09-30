# Launch checklist

## Before go-live

- [ ] `STRICT=1 npm run content:drafts` passes (every draft confirmed or removed)
- [ ] Placeholder images replaced (`source: 'placeholder'` no longer in `media.ts`)
- [ ] Impressum and Datenschutz reviewed (eRecht24 or a lawyer), then the draft marks removed
- [ ] Trademark check "Paintfix" done (DPMA / EUIPO). Logo approved by the client
- [ ] Owner portrait and at least one real aviation job photographed
- [ ] `npm run check` and `npm test` green

## Vercel

- [ ] Project on a **Pro** team (Hobby is non-commercial only). This is a running cost outside the offer
- [ ] Settings → Functions → **Region: Frankfurt (fra1)** (also set in `vercel.json`)
- [ ] Environment variables (Production + Preview), see `.env.example`:
      `SITE_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO_AUTO`,
      `MAIL_TO_AVIATION`, `MAIL_FROM`; optional `ENABLE_ANALYTICS=1` after the privacy text is approved
- [ ] Domains: apex + www added; one of them set as primary (redirect the other)
- [ ] After the first deploy, check the headers: `curl -sI https://<domain>/ | grep -i -E "x-content-type|referrer"`

## IONOS (domain & mail)

- [ ] DNS: apex `A` record and `www` `CNAME` exactly as shown in Vercel → Domains
- [ ] Keep the IONOS `MX` records
- [ ] SPF: `v=spf1 include:_spf-eu.ionos.com ~all`
- [ ] DKIM activated in IONOS
- [ ] DMARC: `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:<address>`. After 2–4 weeks → `p=quarantine`
- [ ] Mailboxes/aliases: `info@`, `aviation@`, owner
- [ ] mail-tester.com score ≥ 9/10
- [ ] Test submission of both forms arrives, auto-reply received

## Search & local

- [ ] Google Search Console + Bing Webmaster Tools verified, `sitemap-index.xml` submitted
- [ ] Google Business Profile ("Paintfix", **one** profile only): category Autoaufbereitung, services
      with prices, aviation listed as a service, website link → `/fahrzeugaufbereitung?utm_source=gbp`,
      service-area business if there's no customer-facing address
- [ ] Directories with identical NAP: Bing Places, Apple Business Connect, Gelbe Seiten /
      Das Örtliche / Das Telefonbuch, 11880, Cylex, Yelp, meinestadt.de, werkenntdenBESTEN,
      Facebook/Instagram
- [ ] Aviation: LinkedIn page "Paintfix Aviation", globalair.com service directory
- [ ] Review QR card / link for the client

## Quality gates (preview URL)

- [ ] Lighthouse mobile: car pages ≥ 95 performance, aviation ≥ 90, all others ≥ 95
- [ ] Real iOS Safari: parallax smooth, no horizontal scroll
- [ ] 5-second test with 2–3 people per persona (car owner / aviation manager)
