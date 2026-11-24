/**
 * Stammdaten Fahrzeug (Adresse, Kontakt, Öffnungszeiten). Adresse und Telefon hat PaintFix am
 * 14.10.2026 bestätigt. Kleinunternehmer (§ 19 UStG, bestätigt 14.10.2026): Preise sind Endpreise;
 * auf der Website steht dazu kein Hinweis (Entscheidung 24.11.2026), Pflicht ist er nur auf
 * Rechnungen. Die übrigen Werte sind Platzhalter aus der Referenz (README 3), siehe
 * `unconfirmed`. Aviation-Kontaktdaten stehen in aviation.json (opsPhone, opsMail).
 */
export const site = {
  name: "PaintFix",
  owner: "Arian Hassanzadeh",
  street: "Orkotten 43",
  postalCode: "48291",
  city: "Telgte",
  phoneDisplay: "+49 176 60025533",
  phoneHref: "tel:+4917660025533",
  email: "hallo@paintfix.de",
  hoursText: "Mo–Fr 8–18 Uhr, Sa 9–14 Uhr",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Orkotten+43+48291+Telgte",
  /** Bis zur Bestätigung durch PaintFix offen. */
  unconfirmed: ["email", "hours", "owner"] as const,
} as const;

/**
 * Öffnungszeiten je Wochentag (0 = Sonntag) als [öffnet, schließt] in vollen Stunden,
 * Zeitzone Europe/Berlin. Grundlage für den Live-Status (README 9.9).
 */
export const openingHours: ReadonlyArray<readonly [number, number] | null> = [
  null,
  [8, 18],
  [8, 18],
  [8, 18],
  [8, 18],
  [8, 18],
  [9, 14],
];
