/**
 * Business facts (NAP etc.). Everything in `drafts` still needs client confirmation
 * (see docs/client-checklist.md). Keep NAP identical to Google Business Profile and directories.
 */
export const site = {
  brand: 'Paintfix',
  aviationBrand: 'Paintfix Aviation',
  owner: 'Arian Hassanzadeh',
  street: 'Marshallstraße 34',
  postalCode: '48291',
  city: 'Telgte',
  region: 'Nordrhein-Westfalen',
  country: 'DE',
  geo: { lat: 51.9819, lng: 7.7859 },
  phone: '+49 2504 0000000',
  phoneDisplay: '02504 000 0000',
  email: 'info@paintfix.de',
  aviationEmail: 'aviation@paintfix.de',
  whatsapp: null as string | null,
  hours: {
    de: [
      ['Mo – Fr', '08:00 – 18:00'],
      ['Sa', '09:00 – 14:00'],
    ],
    en: [
      ['Mon – Fri', '08:00 – 18:00'],
      ['Sat', '09:00 – 14:00'],
    ],
  },
  openingHoursSpec: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    { days: ['Saturday'], opens: '09:00', closes: '14:00' },
  ],
  serviceArea: [
    'Telgte',
    'Münster',
    'Warendorf',
    'Ostbevern',
    'Everswinkel',
    'Sendenhorst',
    'Greven',
    'Drensteinfurt',
  ],
  social: {
    instagram: null as string | null,
    linkedinAviation: null as string | null,
  },
  /** Not yet confirmed by the client. Rendered with an "Entwurf" marker on previews. */
  drafts: ['phone', 'hours', 'serviceArea', 'email', 'aviationEmail', 'geo'] as const,
} as const;

export type SiteDraftKey = (typeof site.drafts)[number];

/**
 * Draft markers are visible everywhere except Vercel production.
 * Set HIDE_DRAFTS=1 to preview a build without them.
 */
export const showDrafts =
  process.env.VERCEL_ENV !== 'production' && process.env.HIDE_DRAFTS !== '1';

export const isDraft = (key: SiteDraftKey) => (site.drafts as readonly string[]).includes(key);

/** Vercel Web Analytics (cookieless). Mirrors the adapter setting in astro.config.mjs. */
export const analyticsEnabled = process.env.ENABLE_ANALYTICS === '1';
