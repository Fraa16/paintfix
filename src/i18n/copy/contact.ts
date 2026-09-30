import type { Locale } from '../routes';

export const contactCopy = {
  de: {
    seo: {
      title: 'Kontakt & Anfrage | Paintfix, Telgte',
      description:
        'Termin für die Fahrzeugaufbereitung anfragen oder ein Angebot für Ihr Flugzeug einholen. Paintfix, Marshallstraße 34, 48291 Telgte.',
    },
    kicker: 'Kontakt',
    title: ['Sprechen wir über', 'Ihr Fahrzeug.'],
    titleAviation: ['Sprechen wir über', 'Ihr Flugzeug.'],
    lead: 'Wählen Sie, worum es geht. Wir melden uns innerhalb eines Werktags.',
    direct: 'Direkter Kontakt',
    address: 'Anschrift',
    route: 'Route planen',
    hours: 'Öffnungszeiten',
    byAppointment: 'Termine nach Vereinbarung',
  },
  en: {
    seo: {
      title: 'Contact & Enquiries | Paintfix, Telgte',
      description:
        'Book car detailing or request a quote for your aircraft. Paintfix, Marshallstraße 34, 48291 Telgte, Germany.',
    },
    kicker: 'Contact',
    title: ["Let's talk about", 'your car.'],
    titleAviation: ["Let's talk about", 'your aircraft.'],
    lead: 'Choose what it is about. We reply within one working day.',
    direct: 'Direct contact',
    address: 'Address',
    route: 'Get directions',
    hours: 'Opening hours',
    byAppointment: 'By appointment',
  },
} satisfies Record<Locale, unknown>;
