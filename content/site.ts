/**
 * Stammdaten Fahrzeug (Adresse, Kontakt, Öffnungszeiten). Alle Werte aus der Referenz, Platzhalter
 * bis zur Bestätigung durch Paintfix (README 3). Aviation-Kontaktdaten stehen in aviation.json
 * (opsPhone, opsMail).
 */
export const site = {
  name: "Paintfix",
  owner: "Arian Hassanzadeh",
  street: "Marshallstraße 34",
  postalCode: "48291",
  city: "Telgte",
  phoneDisplay: "02504 000 00 00",
  phoneHref: "tel:+4925040000000",
  email: "hallo@paintfix.de",
  hoursText: "Mo–Fr 8–18 Uhr, Sa 9–14 Uhr",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Marshallstra%C3%9Fe+34+48291+Telgte",
  /** Bis zur Bestätigung durch Paintfix offen. */
  unconfirmed: ["phone", "email", "hours", "owner"] as const,
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
