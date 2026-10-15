// v3 additions: contract models, supplier documents, aircraft-type estimate. Mockup content: verify with the client.
import { AV as B } from './paintfix-data-v2.js';
const TYPES = [
  { g: 'Turboprop', items: [['Pilatus PC-12', 0.8], ['King Air 360', 0.9]] },
  { g: 'Light Jet', items: [['Citation CJ3+', 1], ['Citation CJ4', 1.05], ['Phenom 300E', 1.05], ['Pilatus PC-24', 1.1]] },
  { g: 'Midsize', items: [['Citation Latitude', 1.25], ['Praetor 600', 1.35], ['Challenger 350', 1.4]] },
  { g: 'Large Cabin', items: [['Falcon 8X', 1.8], ['Gulfstream G650', 2], ['Global 6500', 2], ['Global 7500', 2.2]] }
];
const X = {
  de: {
    nav: ['Leistungen', 'Ablauf', 'Standards', 'Flotte', 'Zusammenarbeit'],
    secs: ['Leistungen', 'Ablauf', 'Standards', 'Flotte', 'Zusammenarbeit', 'Kontakt'],
    barCall: 'Ops anrufen',
    termsLabel: 'Zusammenarbeit', termsTitle: 'Drei Wege, mit uns zu arbeiten.',
    termsIntro: 'Vom einzelnen Einsatz bis zur Betreuung ganzer Flotten. Konditionen nennen wir auf Anfrage, abgestimmt auf Muster, Standort und Häufigkeit.',
    models: [
      { n: 'I', t: 'Einzelauftrag', d: 'Für einzelne Einsätze, Charter-Turnarounds und Übergaben vor Verkauf oder Auslieferung.' },
      { n: 'II', t: 'Rahmenvertrag', d: 'Für Operator mit regelmäßigem Bedarf an einem oder mehreren Plätzen.' },
      { n: 'III', t: 'Flottenbetreuung', d: 'Für Management-Gesellschaften mit mehreren Flugzeugen und Standorten.' }
    ],
    rows: [
      { k: 'Ansprechpartner', v: ['Ops-Desk', 'Feste Ansprechperson', 'Festes Team je Flotte'] },
      { k: 'Planung', v: ['Nach Verfügbarkeit', 'Reservierte Slot-Kontingente', 'Pflegeplan je Kennzeichen'] },
      { k: 'Preisbasis', v: ['Angebot je Einsatz', 'Feste Sätze je Muster', 'Jahresvereinbarung je Flotte'] },
      { k: 'Abrechnung', v: ['Je Einsatz', 'Monatliche Sammelrechnung', 'Monatlich, je Kennzeichen und Kostenstelle'] },
      { k: 'Dokumentation', v: ['Arbeitsbericht je Einsatz', 'Arbeitsbericht je Einsatz', 'Arbeitsberichte und Quartalsauswertung'] }
    ],
    termsPrice: 'Konditionen auf Anfrage', termsCta: 'Anfragen',
    docsLabel: 'Lieferanten-Onboarding', docsTitle: 'Alle Unterlagen für Ihren Einkauf.',
    docsIntro: 'Was Einkauf und Qualitätssicherung vor der ersten Beauftragung anfordern, erhalten Sie gesammelt in einer Datei.',
    docs: [
      { t: 'Versicherungsnachweis', d: 'Betriebs- und Obhutshaftpflicht für Arbeiten an Luftfahrzeugen' },
      { t: 'Zuverlässigkeitsüberprüfung', d: 'Nachweise nach § 7 LuftSiG für das Vorfeld-Personal' },
      { t: 'Produktfreigaben', d: 'Datenblätter und Freigaben der eingesetzten Mittel' },
      { t: 'Muster-Arbeitsbericht', d: 'Aufbau und Inhalt unserer Dokumentation' },
      { t: 'Vertraulichkeit', d: 'NDA-Vorlage und Datenschutzinformation' },
      { t: 'Firmendaten', d: 'Handelsregister, USt-IdNr., Bankverbindung' }
    ],
    docsCover: 'Lieferanten­unterlagen', docsCoverMeta: '2026 · 6 Dokumente',
    docsEmail: 'Geschäftliche E-Mail', docsCompany: 'Unternehmen', docsBtn: 'Unterlagen herunterladen',
    docsNote: 'Wir verwenden Ihre Adresse nur für diese Unterlagen und Rückfragen dazu.',
    docsErr: 'Bitte eine gültige E-Mail-Adresse eingeben.',
    docsFile: 'Paintfix-Aviation_Lieferantenunterlagen.pdf', docsMeta: 'PDF · 6 Dokumente · 4,8 MB',
    docsDone: 'Der Download hat begonnen.', docsDoneSub: 'Eine Kopie geht zusätzlich an', docsAgain: 'Erneut herunterladen',
    est: { label: 'Richtwerte', ground: 'Bodenzeit', crew: 'Techniker', approx: 'ca.', h: 'Std.', d: 'Arbeitstage',
      parallel: 'Außen und Kabine laufen parallel.', hangar: 'Für Schutzleistungen wird ein Hangarplatz benötigt.',
      note: 'Richtwerte bei üblichem Verschmutzungsgrad. Verbindlich mit dem schriftlichen Angebot.',
      empty: 'Wählen Sie ein Muster und mindestens eine Leistung, um Richtwerte für Dauer und Team zu sehen.' },
    types: TYPES
  },
  en: {
    nav: ['Services', 'Process', 'Standards', 'Fleet', 'Partnership'],
    secs: ['Services', 'Process', 'Standards', 'Fleet', 'Partnership', 'Contact'],
    barCall: 'Call ops',
    termsLabel: 'Partnership', termsTitle: 'Three ways to work with us.',
    termsIntro: 'From a single job to care for entire fleets. Terms are quoted on request, based on type, location and frequency.',
    models: [
      { n: 'I', t: 'Single job', d: 'For individual jobs, charter turnarounds and handovers before sale or delivery.' },
      { n: 'II', t: 'Framework agreement', d: 'For operators with recurring work at one or more airports.' },
      { n: 'III', t: 'Fleet care', d: 'For management companies with several aircraft and bases.' }
    ],
    rows: [
      { k: 'Point of contact', v: ['Ops desk', 'Named contact', 'Dedicated fleet team'] },
      { k: 'Planning', v: ['Subject to availability', 'Reserved slot allocation', 'Care plan per tail'] },
      { k: 'Pricing basis', v: ['Quote per job', 'Fixed rates per type', 'Annual fleet agreement'] },
      { k: 'Invoicing', v: ['Per job', 'Consolidated monthly', 'Monthly, per tail and cost centre'] },
      { k: 'Documentation', v: ['Work report per job', 'Work report per job', 'Work reports and quarterly review'] }
    ],
    termsPrice: 'Terms on request', termsCta: 'Enquire',
    docsLabel: 'Vendor onboarding', docsTitle: 'Everything your procurement team needs.',
    docsIntro: 'The documents procurement and quality assurance ask for before the first order, collected in one file.',
    docs: [
      { t: 'Insurance certificate', d: 'Liability and bailee cover for work on aircraft' },
      { t: 'Background checks', d: 'Clearance under § 7 LuftSiG for apron staff' },
      { t: 'Product approvals', d: 'Data sheets and approvals for all materials used' },
      { t: 'Sample work report', d: 'Structure and content of our documentation' },
      { t: 'Confidentiality', d: 'NDA template and privacy information' },
      { t: 'Company details', d: 'Trade register, VAT ID, bank details' }
    ],
    docsCover: 'Vendor documents', docsCoverMeta: '2026 · 6 documents',
    docsEmail: 'Business email', docsCompany: 'Company', docsBtn: 'Download documents',
    docsNote: 'We only use your address for these documents and related questions.',
    docsErr: 'Please enter a valid email address.',
    docsFile: 'Paintfix-Aviation_Vendor-Documents.pdf', docsMeta: 'PDF · 6 documents · 4.8 MB',
    docsDone: 'Your download has started.', docsDoneSub: 'A copy is also on its way to', docsAgain: 'Download again',
    est: { label: 'Estimate', ground: 'Ground time', crew: 'technicians', approx: 'approx.', h: 'h', d: 'working days',
      parallel: 'Exterior and cabin run in parallel.', hangar: 'Protection services require a hangar slot.',
      note: 'Estimates for typical soiling. Confirmed with the written quote.',
      empty: 'Select a type and at least one service to see estimated duration and team size.' },
    types: TYPES
  }
};
const fx = { de: { model: 'Zusammenarbeit', typePick: 'Muster wählen', typeOther: 'Anderes Muster' }, en: { model: 'Partnership', typePick: 'Select type', typeOther: 'Other type' } };
export const AV = {
  de: { ...B.de, ...X.de, f: { ...B.de.f, ...fx.de } },
  en: { ...B.en, ...X.en, f: { ...B.en.f, ...fx.en } }
};
