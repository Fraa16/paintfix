// Paintfix Aviation copy, DE + EN. Mockup content: verify credentials, airports and contact details with the client.
export const AV = {
  de: {
    nav: ['Leistungen', 'Ablauf', 'Standards', 'Flotte', 'Kontakt'],
    cta: 'Angebot anfordern', cta2: 'Leistungen ansehen', scroll: 'Scrollen',
    heroLabel: 'Paintfix Aviation · Münster/Osnabrück',
    aT1: 'Jede Oberfläche,', aT2: 'dokumentiert.',
    bT1: 'Die Kabine,', bT2: 'wie am ersten Tag.',
    cT1: 'Zwischen zwei Flügen.', cT2: 'Spurlos.',
    sub: 'Außen-, Kabinen- und Schutzleistungen für Operator, Management-Gesellschaften und Halter. Stationiert am Flughafen Münster/Osnabrück, mobil in ganz Nordwestdeutschland.',
    meta: [{ k: 'Heimatbasis', v: 'EDDG Münster/Osnabrück' }, { k: 'Einsatzgebiet', v: 'Nordwestdeutschland, mobil' }, { k: 'Angebot', v: 'Schriftlich, je Muster und Umfang' }],
    imgHero: 'Foto: Business Jet in der Dämmerung, Vorfeld, Seitenlicht',
    imgCabin: 'Foto: Kabine, Ledersitze, Tageslicht',
    imgRamp: 'Foto: Jet auf dem Vorfeld, Morgenlicht, Breitformat',
    imgTabs: ['Foto: Rumpf und Eintrittskante, Detail', 'Foto: Kabinensitz, Leder, Nahaufnahme', 'Foto: Lackoberfläche mit Abperleffekt'],
    rampCaption: 'Vorfeld EDDG, 06:40 Uhr',
    audLabel: 'Für wen wir arbeiten',
    audTitle: 'Für alle, die Flugzeuge betreiben, verwalten oder besitzen.',
    audIntro: 'Die meisten Aufträge erhalten wir nicht von Haltern, sondern von den Teams, die deren Flugzeuge führen. Deshalb planen wir in Slots, rechnen je Kennzeichen ab und dokumentieren jeden Einsatz.',
    aud: [
      { t: 'Operator', d: 'Einsätze nach Ihren Slots. Zeitfenster vorab abgestimmt, Fertigmeldung direkt an Ops.' },
      { t: 'Management-Gesellschaften', d: 'Ein Ansprechpartner für die ganze Flotte. Feste Leistungsumfänge je Kennzeichen, monatliche Sammelrechnung.' },
      { t: 'Halter & Flugabteilungen', d: 'Diskretion als Standard. Vertraulichkeitsvereinbarung auf Wunsch, Kabinenfotos nur für das Protokoll.' }
    ],
    svcLabel: 'Leistungen', svcTitle: 'Außen. Kabine. Schutz.',
    tabs: ['Außen', 'Kabine', 'Schutz'],
    svc: [
      [
        { t: 'Trockenwäsche', d: 'Wasserlose Wäsche direkt auf dem Vorfeld, schonend für Lack und Brightwork. Kein Wasseranschluss nötig.' },
        { t: 'Nasswäsche', d: 'Komplettwäsche im Hangar oder auf dem Waschplatz, inklusive Fahrwerk und Fahrwerksschächte.' },
        { t: 'Brightwork-Politur', d: 'Eintrittskanten, Triebwerkseinläufe und blanke Metallteile, poliert und versiegelt.' },
        { t: 'Lackkorrektur', d: 'Maschinelle Politur gegen Oxidation, Schleier und feine Kratzer.' }
      ],
      [
        { t: 'Kabinen-Grundreinigung', d: 'Jede Fläche, jeder Sitz, jedes Staufach, nach unterschriebener Checkliste.' },
        { t: 'Lederpflege', d: 'Reinigung und Pflege nach den Vorgaben des Lederherstellers.' },
        { t: 'Teppich-Tiefenreinigung', d: 'Feuchtigkeitsarme Extraktion, innerhalb des Turnarounds wieder trocken.' },
        { t: 'Galley & Waschraum', d: 'Hygienische Reinigung mit freigegebenen Desinfektionsmitteln, je Zone dokumentiert.' }
      ],
      [
        { t: 'Keramikversiegelung', d: 'Langzeitschutz für den Lack. Verlängert die Waschintervalle und erleichtert die Reinigung.' },
        { t: 'Oberflächenschutz Kabine', d: 'Schutzbehandlung für Leder, Stoffe und Furniere.' },
        { t: 'Pflegeintervalle', d: 'Feste Intervalle je Kennzeichen, abgestimmt mit Ihrer Wartungsplanung.' }
      ]
    ],
    svcNote: 'Alle Leistungen bieten wir je Muster und Umfang zum Festpreis an.',
    quote: 'Gemessen werden wir an dem, was der Passagier nie bemerkt.',
    procLabel: 'Ablauf', procTitle: 'Von der Anfrage bis zur Fertigmeldung.',
    proc: [
      { n: 'I', t: 'Anfrage', d: 'Muster, Kennzeichen, Standort und Zeitfenster. Per Formular, E-Mail oder Telefon.' },
      { n: 'II', t: 'Umfang & Festpreis', d: 'Schriftlicher Leistungsumfang mit Festpreis je Position, bevor die Arbeit beginnt.' },
      { n: 'III', t: 'Durchführung', d: 'Auf dem Vorfeld oder im Hangar, abgestimmt mit FBO und Bodenabfertigung.' },
      { n: 'IV', t: 'Übergabe', d: 'Fotoprotokoll und unterschriebene Checkliste, am selben Tag an Ops.' }
    ],
    stdLabel: 'Standards', stdTitle: 'Was Ihr Compliance-Team wissen möchte.',
    std: [
      { t: 'ZÜP-geprüftes Personal', d: 'Zuverlässigkeitsüberprüfung nach § 7 LuftSiG, geschult für den Vorfeldbetrieb.' },
      { t: 'Freigegebene Mittel', d: 'Reinigungs- und Pflegemittel nach Boeing D6-17487 und AMS 1526, eingesetzt gemäß Herstellervorgaben.' },
      { t: 'Luftfahrt-Haftpflicht', d: 'Eigene Deckung für Arbeiten an Luftfahrzeugen. Versicherungsnachweis auf Anfrage.' },
      { t: 'Dokumentation als Standard', d: 'Jeder Auftrag endet mit Fotos, unterschriebener Checkliste und Zeitstempeln.' }
    ],
    rep: {
      title: 'Arbeitsbericht', no: 'Nr. PA-26-0412',
      rows: [{ k: 'Muster', v: 'Challenger 350' }, { k: 'Kennzeichen', v: 'D-BPFX' }, { k: 'Ort', v: 'EDDG, Vorfeld 2' }, { k: 'Datum', v: '14.10.2026' }, { k: 'Zeitfenster', v: '06:10–08:40 UTC' }],
      checks: [{ k: 'Trockenwäsche außen', v: '06:10' }, { k: 'Brightwork, Eintrittskanten', v: '06:55' }, { k: 'Kabinen-Grundreinigung, 8 Sitze', v: '07:20' }, { k: 'Galley & Waschraum', v: '08:05' }, { k: 'Teppich-Tiefenreinigung', v: '08:15' }],
      checksLabel: 'Checkliste', photos: 'Fotodokumentation · 24 Aufnahmen',
      sign: 'Freigegeben', notified: 'Fertigmeldung an Ops · 08:42 UTC'
    },
    repCaption: 'Beispiel eines Arbeitsberichts. So endet jeder Auftrag.',
    fleetLabel: 'Flugzeugmuster', fleetTitle: 'Vom Turboprop bis zur Langstrecke.',
    fleet: [
      { c: 'Turboprop', m: 'King Air 260 / 360 · Pilatus PC-12' },
      { c: 'Light Jet', m: 'Citation CJ3+ / CJ4 · Phenom 300E · Pilatus PC-24' },
      { c: 'Midsize', m: 'Challenger 350 · Praetor 600 · Citation Latitude' },
      { c: 'Large Cabin', m: 'Global 6500 / 7500 · Gulfstream G650 · Falcon 8X' }
    ],
    fleetNote: 'Weitere Muster und Standorte auf Anfrage.',
    baseLabel: 'Standorte',
    bases: [
      { i: 'EDDG', n: 'Münster/Osnabrück', s: 'Heimatbasis' },
      { i: 'EDLP', n: 'Paderborn/Lippstadt', s: 'Mobil' },
      { i: 'EDLW', n: 'Dortmund', s: 'Mobil' },
      { i: 'EDDL', n: 'Düsseldorf', s: 'Mobil' },
      { i: 'EDDK', n: 'Köln/Bonn', s: 'Auf Anfrage' }
    ],
    formLabel: 'Kontakt', formTitle: 'Angebot anfordern',
    formIntro: 'Nennen Sie uns Muster, Kennzeichen, Standort und Zeitfenster. Sie erhalten einen schriftlichen Leistungsumfang mit Festpreis.',
    direct: 'Direkter Kontakt', opsPhone: '+49 2504 000 00 00', opsMail: 'ops@paintfix-aviation.de',
    f: { company: 'Unternehmen', name: 'Ansprechpartner', email: 'E-Mail', phone: 'Telefon', type: 'Muster', reg: 'Kennzeichen', apt: 'Flughafen (ICAO)', window: 'Gewünschtes Zeitfenster', services: 'Leistungen', notes: 'Anmerkungen', send: 'Anfrage senden', privacy: 'Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zur Bearbeitung der Anfrage zu.' },
    sentTitle: 'Vielen Dank.', sentText: 'Ihre Anfrage ist eingegangen. Wir melden uns mit Leistungsumfang und Festpreis.', again: 'Neue Anfrage',
    footDiv: 'Paintfix Aviation ist der Geschäftsbereich Luftfahrt der Paintfix, Telgte.',
    footCar: 'Fahrzeugaufbereitung', legal: ['Impressum', 'Datenschutz', 'AGB']
  },
  en: {
    nav: ['Services', 'Process', 'Standards', 'Fleet', 'Contact'],
    cta: 'Request a quote', cta2: 'View services', scroll: 'Scroll',
    heroLabel: 'Paintfix Aviation · Münster Osnabrück',
    aT1: 'Every surface,', aT2: 'accounted for.',
    bT1: 'The cabin,', bT2: 'as delivered.',
    cT1: 'Between two legs.', cT2: 'Without a trace.',
    sub: 'Exterior, cabin and protection services for operators, management companies and owners. Based at Münster Osnabrück Airport, mobile across north-west Germany.',
    meta: [{ k: 'Home base', v: 'EDDG Münster Osnabrück' }, { k: 'Coverage', v: 'North-west Germany, mobile' }, { k: 'Quotation', v: 'In writing, per type and scope' }],
    imgHero: 'Photo: business jet at dusk, apron, side light',
    imgCabin: 'Photo: cabin, leather seats, daylight',
    imgRamp: 'Photo: jet on the apron, morning light, wide format',
    imgTabs: ['Photo: fuselage and leading edge, detail', 'Photo: cabin seat, leather, close-up', 'Photo: paint surface with water beading'],
    rampCaption: 'Apron EDDG, 06:40 local',
    audLabel: 'Who we work for',
    audTitle: 'For the people who operate, manage and own aircraft.',
    audIntro: 'Most of our work comes not from owners but from the teams who run their aircraft. So we plan in slots, invoice per tail and document every job.',
    aud: [
      { t: 'Operators', d: 'Work planned around your slots. Windows agreed in advance, completion reported straight to ops.' },
      { t: 'Management companies', d: 'One point of contact for the entire fleet. Fixed scopes per tail, consolidated monthly invoicing.' },
      { t: 'Owners & flight departments', d: 'Discretion by default. NDA on request, cabin photos for the report only.' }
    ],
    svcLabel: 'Services', svcTitle: 'Exterior. Cabin. Protection.',
    tabs: ['Exterior', 'Cabin', 'Protection'],
    svc: [
      [
        { t: 'Dry wash', d: 'Waterless wash on the ramp, safe for paint and brightwork. No water supply required.' },
        { t: 'Wet wash', d: 'Full wash in the hangar or wash bay, including landing gear and wheel wells.' },
        { t: 'Brightwork polishing', d: 'Leading edges, engine inlets and bare metal, polished and sealed.' },
        { t: 'Paint correction', d: 'Machine polishing to remove oxidation, haze and fine scratches.' }
      ],
      [
        { t: 'Deep cabin clean', d: 'Every surface, seat and stowage, to a signed checklist.' },
        { t: 'Leather care', d: "Cleaning and conditioning to the hide manufacturer's guidance." },
        { t: 'Carpet extraction', d: 'Low-moisture extraction, dry again within the turnaround.' },
        { t: 'Galley & lavatory', d: 'Sanitation with approved disinfectants, documented by zone.' }
      ],
      [
        { t: 'Ceramic coating', d: 'Long-term paint protection. Extends wash intervals and eases cleaning.' },
        { t: 'Cabin surface protection', d: 'Protective treatment for leather, fabrics and veneers.' },
        { t: 'Care programmes', d: 'Fixed intervals per tail, scheduled around your maintenance planning.' }
      ]
    ],
    svcNote: 'Every service is quoted at a fixed price, per type and scope.',
    quote: 'We are measured by what the passenger never notices.',
    procLabel: 'Process', procTitle: 'From request to release.',
    proc: [
      { n: 'I', t: 'Request', d: 'Type, registration, location and window. Via form, email or phone.' },
      { n: 'II', t: 'Scope & fixed price', d: 'A written scope with a fixed price per item, agreed before work begins.' },
      { n: 'III', t: 'Execution', d: 'On the ramp or in the hangar, coordinated with the FBO and ground handling.' },
      { n: 'IV', t: 'Handover', d: 'Photo report and signed checklist, sent to ops the same day.' }
    ],
    stdLabel: 'Standards', stdTitle: 'What your compliance team will ask.',
    std: [
      { t: 'Airside-cleared staff', d: 'Background-checked under § 7 LuftSiG (German Aviation Security Act), trained for apron operations.' },
      { t: 'Approved materials', d: 'Cleaning and care products to Boeing D6-17487 and AMS 1526, applied to manufacturer guidance.' },
      { t: 'Aviation liability cover', d: 'Dedicated insurance for work on aircraft. Certificate available on request.' },
      { t: 'Documented by default', d: 'Every job closes with photos, a signed checklist and timestamps.' }
    ],
    rep: {
      title: 'Work report', no: 'No. PA-26-0412',
      rows: [{ k: 'Type', v: 'Challenger 350' }, { k: 'Registration', v: 'D-BPFX' }, { k: 'Location', v: 'EDDG, Apron 2' }, { k: 'Date', v: '14 Oct 2026' }, { k: 'Window', v: '06:10–08:40 UTC' }],
      checks: [{ k: 'Exterior dry wash', v: '06:10' }, { k: 'Brightwork, leading edges', v: '06:55' }, { k: 'Deep cabin clean, 8 seats', v: '07:20' }, { k: 'Galley & lavatory', v: '08:05' }, { k: 'Carpet extraction', v: '08:15' }],
      checksLabel: 'Checklist', photos: 'Photo record · 24 images',
      sign: 'Released', notified: 'Completion sent to ops · 08:42 UTC'
    },
    repCaption: 'A sample work report. Every job ends with one.',
    fleetLabel: 'Aircraft types', fleetTitle: 'From turboprop to long range.',
    fleet: [
      { c: 'Turboprop', m: 'King Air 260 / 360 · Pilatus PC-12' },
      { c: 'Light jet', m: 'Citation CJ3+ / CJ4 · Phenom 300E · Pilatus PC-24' },
      { c: 'Midsize', m: 'Challenger 350 · Praetor 600 · Citation Latitude' },
      { c: 'Large cabin', m: 'Global 6500 / 7500 · Gulfstream G650 · Falcon 8X' }
    ],
    fleetNote: 'Other types and locations on request.',
    baseLabel: 'Locations',
    bases: [
      { i: 'EDDG', n: 'Münster Osnabrück', s: 'Home base' },
      { i: 'EDLP', n: 'Paderborn Lippstadt', s: 'Mobile' },
      { i: 'EDLW', n: 'Dortmund', s: 'Mobile' },
      { i: 'EDDL', n: 'Düsseldorf', s: 'Mobile' },
      { i: 'EDDK', n: 'Cologne Bonn', s: 'On request' }
    ],
    formLabel: 'Contact', formTitle: 'Request a quote',
    formIntro: 'Tell us type, registration, location and window. You will receive a written scope with a fixed price.',
    direct: 'Direct contact', opsPhone: '+49 2504 000 00 00', opsMail: 'ops@paintfix-aviation.de',
    f: { company: 'Company', name: 'Contact person', email: 'Email', phone: 'Phone', type: 'Aircraft type', reg: 'Registration', apt: 'Airport (ICAO)', window: 'Preferred window', services: 'Services', notes: 'Notes', send: 'Send request', privacy: 'By sending, you agree that we process your details to handle this request.' },
    sentTitle: 'Thank you.', sentText: 'Your request has been received. We will reply with a written scope and fixed price.', again: 'New request',
    footDiv: 'Paintfix Aviation is the aviation division of Paintfix, Telgte.',
    footCar: 'Car detailing', legal: ['Imprint', 'Privacy', 'Terms']
  }
};
