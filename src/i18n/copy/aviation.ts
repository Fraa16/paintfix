import type { Locale } from '../routes';

export const aviationCopy = {
  de: {
    seo: {
      title: 'Flugzeugaufbereitung in NRW | Paintfix Aviation',
      description:
        'Exterior-Wäsche, Brightwork-Politur mit NUVITE und Kabinenaufbereitung mit Aero-Sense. Für Halter, Operator und Management-Firmen, geplant um Ihre Bodenzeit.',
    },
    anchors: {
      services: 'leistungen',
      standards: 'standards',
      process: 'ablauf',
      coverage: 'einsatzgebiet',
      request: 'anfrage',
    },
    hero: {
      kicker: 'Paintfix Aviation',
      h1: 'Flugzeug­aufbereitung',
      text: 'Exterior, Brightwork und Kabine. Nach Herstellervorgaben, dokumentiert und geplant um Ihre Bodenzeit.',
    },
    about: {
      kicker: 'Wer wir sind',
      title: ['Die Luftfahrt-Division', 'von Paintfix'],
      text: 'Paintfix Aviation pflegt Flugzeuge der General und Business Aviation, vom Kolbenmotor-Flugzeug bis zum Business Jet. Die Division arbeitet getrennt vom Fahrzeuggeschäft, mit luftfahrtspezifischer Chemie und eigenen Arbeitsanweisungen.',
      emphasis: 'Eigene Produkte. Eigene Verfahren. Eigener Ansprechpartner.',
    },
    services: {
      kicker: 'Leistungen',
      title: ['Unsere', 'Kernleistungen'],
      lead: 'Vom schnellen Service im Turnaround bis zur vollständigen Aufbereitung vor dem Verkauf.',
    },
    areas: [
      {
        id: 'exterior',
        word: 'Exterior',
        lead: 'Außenhaut, Brightwork und Fahrwerk. Gereinigt, poliert und geschützt, nach den Vorgaben des Herstellers.',
        cards: [
          {
            media: 'av-ext-wash',
            title: 'Hybrid- & Dry-Wash',
            text: 'Nass, wo es erlaubt ist, trocken, wo es sein muss. Mit Schutz korrosionsgefährdeter Bereiche.',
          },
          {
            media: 'av-ext-brightwork',
            title: 'Brightwork',
            text: 'Aluminium, das wieder spiegelt. NuShine II G6 für den Schliff, Grade S für das Finish.',
          },
        ],
      },
      {
        id: 'interior',
        word: 'Interior',
        lead: 'Die Kabine ist die Visitenkarte des Flugzeugs. Wir pflegen jede Oberfläche mit materialverträglichen Produkten.',
        cards: [
          {
            media: 'av-int-leather',
            title: 'Leder & Furnier',
            text: 'Reinigung und Pflege von Sitzen, Seitenwänden und Holzoberflächen.',
          },
          {
            media: 'av-int-carpet',
            title: 'Teppich & Galley',
            text: 'Tiefenreinigung von Teppichen, Galley und Waschraum. Geruchsneutral, schonend.',
          },
        ],
      },
    ],
    statement: {
      soft: 'Präzision',
      strong: 'im Detail',
      sub: 'Oberflächen pflegen. Werte erhalten.',
    },
    standards: {
      kicker: 'Standards',
      title: ['Eigene Produkte.', 'Eigene Verfahren.'],
      lead: 'In der Luftfahrt gelten andere Regeln als in der Autowerkstatt. Deshalb setzen wir hier ausschließlich luftfahrtspezifische Produkte ein.',
      plates: [
        {
          label: 'Reinigung Exterior & Kabine',
          name: 'Aero-Sense',
          text: 'Luftfahrtchemie aus Belgien. Die eingesetzten Reiniger erfüllen je nach Anwendung Spezifikationen wie AMS 1526C, Airbus AIMS 09-00-002 und Boeing BSS 7432.',
          draft: true,
        },
        {
          label: 'Brightwork · Schliff',
          name: 'NUVITE NuShine II · Grade G6',
          text: 'Für starke Oxidation, leichte Korrosion und das Ausblenden von Kratzern auf blankem Aluminium.',
        },
        {
          label: 'Brightwork · Finish',
          name: 'NUVITE NuShine II · Grade S',
          text: 'Der letzte Schritt: tiefer, klarer Spiegelglanz auf vorbereitetem, oxidfreiem Aluminium.',
        },
        {
          label: 'Arbeitsweise',
          name: 'Nach Wartungshandbuch',
          text: 'Abkleben von Sensoren, Pitot- und Statikanschlüssen nach AMM. Fotodokumentation zu jedem Auftrag.',
          draft: true,
        },
        {
          label: 'Absicherung',
          name: 'Versichert',
          text: 'Betriebshaftpflicht mit Deckung für Arbeiten an Luftfahrzeugen. Nachweis auf Anfrage.',
          draft: true,
        },
      ],
    },
    process: {
      kicker: 'Ablauf',
      title: ['So läuft', 'ein Auftrag'],
      steps: [
        {
          title: 'Bodenzeit & Standort senden',
          text: 'Muster, Kennzeichen (optional), Flugplatz und Zeitfenster.',
        },
        {
          title: 'Umfang & Angebot',
          text: 'Sie erhalten Umfang, Zeitbedarf und Preis schriftlich, in der Regel innerhalb von 24 Stunden.',
        },
        {
          title: 'Aufbereitung vor Ort',
          text: 'Im Hangar oder auf dem Vorfeld, abgestimmt mit FBO, Flugplatz oder Halter.',
        },
        {
          title: 'Dokumentierte Übergabe',
          text: 'Fotobericht und gemeinsame Abnahme. Bereit für den nächsten Flug.',
        },
      ],
    },
    coverage: {
      kicker: 'Einsatzgebiet',
      title: ['Von Telgte aus', 'an Ihr Flugzeug'],
      lead: 'Unsere Basis ist der Flugplatz Münster-Telgte (EDLT). Wir kommen dorthin, wo Ihr Flugzeug steht, an diese Plätze und nach Absprache weitere.',
      base: 'Basis',
      km: 'km',
    },
    audience: {
      kicker: 'Für wen wir arbeiten',
      items: [
        'Management-Firmen',
        'Operator & Charter',
        'FBO & MRO',
        'Private Halter',
        'Flugschulen & Vereine',
      ],
    },
    faq: { kicker: 'FAQ', title: ['Fragen von', 'Haltern und Operatoren'] },
    request: {
      kicker: 'Anfrage',
      title: ['Aufbereitung,', 'geplant um Ihren nächsten Abflug'],
      text: 'Nennen Sie uns Muster, Standort und Zeitfenster. Sie erhalten Umfang und Angebot schriftlich.',
      direct: 'Direkt',
    },
  },
  en: {
    seo: {
      title: 'Aircraft Detailing in Germany (NRW) | Paintfix Aviation',
      description:
        'Exterior wash, brightwork polishing with NUVITE and cabin detailing with Aero-Sense. For owners, operators and management companies, timed to your ground time.',
    },
    anchors: {
      services: 'services',
      standards: 'standards',
      process: 'process',
      coverage: 'coverage',
      request: 'request',
    },
    hero: {
      kicker: 'Paintfix Aviation',
      h1: 'Aircraft detailing',
      text: 'Exterior, brightwork and cabin. To manufacturer guidance, documented, and scheduled around your ground time.',
    },
    about: {
      kicker: 'Who we are',
      title: ['The aviation division', 'of Paintfix'],
      text: 'Paintfix Aviation cares for general and business aviation aircraft, from piston singles to business jets. The division operates separately from the car business, with aviation-specific chemistry and its own work instructions.',
      emphasis: 'Our own products. Our own processes. Your own contact.',
    },
    services: {
      kicker: 'Services',
      title: ['Our core', 'services'],
      lead: 'From a quick turnaround service to a full detail before a sale.',
    },
    areas: [
      {
        id: 'exterior',
        word: 'Exterior',
        lead: 'Skin, brightwork and landing gear. Cleaned, polished and protected to manufacturer guidance.',
        cards: [
          {
            media: 'av-ext-wash',
            title: 'Hybrid & dry wash',
            text: 'Wet where permitted, dry where required. With protection for corrosion-prone areas.',
          },
          {
            media: 'av-ext-brightwork',
            title: 'Brightwork',
            text: 'Aluminium that reflects again. NuShine II G6 for the cut, Grade S for the finish.',
          },
        ],
      },
      {
        id: 'interior',
        word: 'Interior',
        lead: 'The cabin is the aircraft’s calling card. We care for every surface with material-compatible products.',
        cards: [
          {
            media: 'av-int-leather',
            title: 'Leather & veneer',
            text: 'Cleaning and conditioning of seats, sidewalls and wood surfaces.',
          },
          {
            media: 'av-int-carpet',
            title: 'Carpet & galley',
            text: 'Deep cleaning of carpets, galley and lavatory. Odour-neutral and gentle.',
          },
        ],
      },
    ],
    statement: {
      soft: 'Precision',
      strong: 'in every detail',
      sub: 'Caring for surfaces. Protecting value.',
    },
    standards: {
      kicker: 'Standards',
      title: ['Our own products.', 'Our own processes.'],
      lead: 'Aviation follows different rules from a car workshop. That is why we use aviation-specific products only.',
      plates: [
        {
          label: 'Exterior & cabin cleaning',
          name: 'Aero-Sense',
          text: 'Aviation chemicals made in Belgium. Depending on the application, the cleaners we use meet specifications such as AMS 1526C, Airbus AIMS 09-00-002 and Boeing BSS 7432.',
          draft: true,
        },
        {
          label: 'Brightwork · cut',
          name: 'NUVITE NuShine II · Grade G6',
          text: 'For heavy oxidation, light corrosion and blending out scratches on bare aluminium.',
        },
        {
          label: 'Brightwork · finish',
          name: 'NUVITE NuShine II · Grade S',
          text: 'The final step: a deep, clear mirror finish on prepared, oxidation-free aluminium.',
        },
        {
          label: 'Method',
          name: 'To the maintenance manual',
          text: 'Sensors, pitot and static ports masked per the AMM. Photo documentation with every job.',
          draft: true,
        },
        {
          label: 'Cover',
          name: 'Insured',
          text: 'Business liability insurance covering work on aircraft. Certificate on request.',
          draft: true,
        },
      ],
    },
    process: {
      kicker: 'Process',
      title: ['How a job', 'works'],
      steps: [
        {
          title: 'Send ground time & location',
          text: 'Type, registration (optional), airfield and time window.',
        },
        {
          title: 'Scope & quote',
          text: 'You receive scope, time required and price in writing, usually within 24 hours.',
        },
        {
          title: 'Detailing on site',
          text: 'In the hangar or on the ramp, coordinated with the FBO, airfield or owner.',
        },
        {
          title: 'Documented handover',
          text: 'Photo report and joint sign-off. Ready for the next flight.',
        },
      ],
    },
    coverage: {
      kicker: 'Coverage',
      title: ['From Telgte', 'to your aircraft'],
      lead: 'Our base is Münster-Telgte airfield (EDLT). We come to wherever your aircraft is parked: these airfields and others by arrangement.',
      base: 'Base',
      km: 'km',
    },
    audience: {
      kicker: 'Who we work for',
      items: [
        'Management companies',
        'Operators & charter',
        'FBOs & MROs',
        'Private owners',
        'Flight schools & clubs',
      ],
    },
    faq: { kicker: 'FAQ', title: ['Questions from', 'owners and operators'] },
    request: {
      kicker: 'Request',
      title: ['Detailing,', 'timed to your next departure'],
      text: 'Tell us the type, location and time window. You receive scope and quote in writing.',
      direct: 'Direct',
    },
  },
} satisfies Record<Locale, unknown>;
