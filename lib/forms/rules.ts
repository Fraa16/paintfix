import type { InspectId, ServiceId, VehicleClassIndex } from "@/content/fahrzeug";
import type { Locale } from "@/content/aviation-meta";
import type { AvService } from "@/lib/estimate";

/**
 * Formularregeln für Browser und Server (README 10.1–10.3). Der Browser prüft vor dem Senden und
 * zeigt die Fehler sofort, der Server prüft dieselben Regeln noch einmal (lib/forms/actions.ts).
 * Bewusst ohne Zod: die Datei landet im Client-Bundle. Form und Längen prüft Zod nur auf dem Server
 * (lib/forms/schemas.ts).
 */

/** Fehlercodes je Feld. Die Texte stehen im jeweiligen Formular bzw. in aviation.json (`fErr`). */
export type ErrorCode =
  "required" | "email" | "contact" | "past" | "consent" | "services" | "icao" | "invalid";

export type FieldErrors<K extends string = string> = Partial<Record<K, ErrorCode>>;

/** Ergebnis einer Server Action. Ohne `errors` ist der Versand gescheitert (Hinweis mit Telefon). */
export type FormResult = { ok: true } | { ok: false; errors?: FieldErrors };

/** Spam-Schutz (CLAUDE.md): Honeypot-Feld und Ausfüllzeit in ms, siehe components/shared/FormGuard. */
export interface SpamFields {
  website: string;
  elapsed: number;
}

/** E-Mail-Prüfung der Referenz (README 10.3). */
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Heutiges Datum in Europe/Berlin als JJJJ-MM-TT (CLAUDE.md, Regel 10). */
export function berlinToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

const blank = (s: string) => s.trim() === "";
const badEmail = (s: string) => !EMAIL.test(s.trim());

/* Fahrzeug: Termin anfragen ---------------------------------------------------------------------- */

/** Abgabe-Zeitfenster (Referenz `times`), Standard: Flexibel. */
export const REQUEST_TIMES = ["Vormittag", "Nachmittag", "Flexibel"] as const;
export type TimeIndex = 0 | 1 | 2;

export interface CarRequest {
  services: ServiceId[];
  inspect: InspectId[];
  vehicleClass: VehicleClassIndex;
  car: string;
  /** JJJJ-MM-TT oder leer */
  date: string;
  time: TimeIndex;
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
}

export type CarRequestField = "services" | "date" | "name" | "phone" | "email" | "consent";

/**
 * README 10.1: mindestens eine Leistung, Datum nicht in der Vergangenheit, Name Pflicht, Telefon oder
 * E-Mail Pflicht, E-Mail-Format, Einwilligung Pflicht.
 */
export function carRequestErrors(d: CarRequest, today = berlinToday()) {
  const e: FieldErrors<CarRequestField> = {};
  if (d.services.length + d.inspect.length === 0) e.services = "services";
  if (d.date && d.date < today) e.date = "past";
  if (blank(d.name)) e.name = "required";
  if (blank(d.phone) && blank(d.email)) e.phone = "contact";
  if (!blank(d.email) && badEmail(d.email)) e.email = "email";
  if (!d.consent) e.consent = "consent";
  return e;
}

/* Aviation: Angebot anfordern -------------------------------------------------------------------- */

/** Wert im Muster-Auswahlfeld für „Anderes Muster“. */
export const OTHER_TYPE = "other";

export interface AviationQuote {
  locale: Locale;
  company: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  typeOther: string;
  reg: string;
  apt: string;
  window: string;
  services: AvService[];
  /** Index in `models`, −1 = keine Angabe */
  model: number;
  notes: string;
}

export type AviationQuoteField =
  "company" | "name" | "email" | "type" | "typeOther" | "apt" | "services";

/** README 10.2: Unternehmen, Ansprechpartner, E-Mail, Muster und Flughafen (ICAO) Pflicht, eine Leistung. */
export function aviationQuoteErrors(d: AviationQuote) {
  const e: FieldErrors<AviationQuoteField> = {};
  if (blank(d.company)) e.company = "required";
  if (blank(d.name)) e.name = "required";
  if (blank(d.email)) e.email = "required";
  else if (badEmail(d.email)) e.email = "email";
  if (blank(d.type)) e.type = "required";
  else if (d.type === OTHER_TYPE && blank(d.typeOther)) e.typeOther = "required";
  if (blank(d.apt)) e.apt = "required";
  else if (!/^[A-Za-z]{4}$/.test(d.apt.trim())) e.apt = "icao";
  if (d.services.length === 0) e.services = "services";
  return e;
}

/* Aviation: Lieferantenunterlagen ---------------------------------------------------------------- */

export interface DocsRequest {
  locale: Locale;
  company: string;
  email: string;
}

/** README 10.3: gültige E-Mail-Adresse. */
export function docsRequestErrors(d: DocsRequest) {
  const e: FieldErrors<"email"> = {};
  if (badEmail(d.email)) e.email = "email";
  return e;
}

export function hasErrors(e: FieldErrors): boolean {
  return Object.keys(e).length > 0;
}
