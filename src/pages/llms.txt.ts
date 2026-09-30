import type { APIRoute } from 'astro';
import { getPackages, getAviationServices, getAirfields } from '@/lib/content';
import { path } from '@/i18n/routes';
import { site as biz } from '@/content/site';

/** llms.txt: a plain summary for AI search engines (GEO). Generated from the same content as the site. */
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://www.paintfix.de');
  const url = (p: string) => new URL(p, base).toString();
  const [packages, services, airfields] = await Promise.all([
    getPackages(),
    getAviationServices(),
    getAirfields(),
  ]);

  const body = `# Paintfix

> Paintfix is a car detailing business (Fahrzeugaufbereitung) in ${biz.city} near Münster, Germany, owned by ${biz.owner}. Its aviation division, Paintfix Aviation, provides aircraft detailing (Flugzeugaufbereitung) for business and general aviation in North Rhine-Westphalia. The two divisions use separate product lines: CarPro for cars; Aero-Sense and NUVITE for aircraft.

## Car detailing (Paintfix)
- Page: ${url(path('car', 'de'))} (English: ${url(path('car', 'en'))})
- Products: exclusively CarPro, including the CQuartz ceramic coating.
- Packages ("ab" = starting prices for a small car, EUR):
${packages.map((p) => `  - ${p.data.name.en} (${p.data.name.de}): from €${p.data.priceFrom}, ${p.data.duration.en}`).join('\n')}
- Service area: ${biz.serviceArea.join(', ')}.

## Aircraft detailing (Paintfix Aviation)
- Page: ${url(path('aviation', 'en'))} (German: ${url(path('aviation', 'de'))})
- Services:
${services.map((s) => `  - ${s.data.name.en}: ${s.data.desc.en}`).join('\n')}
- Products: Aero-Sense aviation cleaners; NUVITE NuShine II metal polish (Grade G6 for heavy oxidation, Grade S for the final finish).
- Base: Münster-Telgte airfield (EDLT). Coverage: ${airfields.map((a) => a.data.icao).join(', ')}.
- Pricing: per aircraft type and scope, on request.

## Contact
- ${biz.street}, ${biz.postalCode} ${biz.city}, Germany
- Email: ${biz.email} (cars), ${biz.aviationEmail} (aircraft)
- Contact page: ${url(path('contact', 'de'))}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
