import type { Locale } from "./aviation-meta";

/**
 * Texte der Bestätigungs-Mails an Absender (README 2: „Mail an PaintFix + Bestätigung an Absender“).
 * Die Zusagen entsprechen den Danke-Zuständen der Formulare. Bewusst ohne Freitext aus dem Formular
 * (Name, Nachricht): Die Bestätigung geht an eine beliebig eingetragene Adresse und darf deshalb nur
 * feste Texte und Auswahlwerte enthalten.
 */
export const carConfirmation = {
  subject: "Ihre Anfrage bei PaintFix",
  greeting: "Guten Tag,",
  intro:
    "vielen Dank für Ihre Anfrage. Wir melden uns innerhalb eines Werktags mit Festpreis und Terminvorschlägen.",
  selection: "Ihre Auswahl",
  vehicleClass: "Fahrzeugklasse",
  estimate: "Richtpreis",
  questions: "Bei Fragen erreichen Sie uns unter",
  signature: "PaintFix",
};

export const aviationConfirmation: Record<
  Locale,
  {
    subject: string;
    greeting: string;
    intro: string;
    details: string;
    questions: string;
  }
> = {
  de: {
    subject: "Ihre Anfrage bei PaintFix Aviation",
    greeting: "Guten Tag,",
    intro: "vielen Dank für Ihre Anfrage. Wir melden uns mit Leistungsumfang und Festpreis.",
    details: "Ihre Angaben",
    questions: "Bei Rückfragen erreichen Sie uns unter",
  },
  en: {
    subject: "Your request to PaintFix Aviation",
    greeting: "Hello,",
    intro: "Thank you for your request. We will reply with a written scope and fixed price.",
    details: "Your details",
    questions: "For questions, call us on",
  },
};
