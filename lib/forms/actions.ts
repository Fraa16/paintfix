"use server";

import { aviation } from "@/content/aviation";
import { inspectServices, serviceById, vehicleClasses } from "@/content/fahrzeug";
import { aviationConfirmation, carConfirmation } from "@/content/mail";
import { site } from "@/content/site";
import { aircraftFactor, estimate } from "@/lib/estimate";
import { eur, fromPrice } from "@/lib/format";
import { estimatePrice } from "@/lib/pricing";
import { sendMail } from "./mail";
import {
  OTHER_TYPE,
  REQUEST_TIMES,
  aviationQuoteErrors,
  carRequestErrors,
  docsRequestErrors,
  hasErrors,
  type AviationQuote,
  type CarRequest,
  type DocsRequest,
  type FormResult,
} from "./rules";
import {
  aviationQuoteSchema,
  carRequestSchema,
  docsRequestSchema,
  invalidFields,
  spamSchema,
} from "./schemas";

/**
 * Server Actions der drei Formulare (README 10.1–10.3): Spam-Schutz, Prüfung mit Zod und den Regeln
 * aus rules.ts, Mail an PaintFix (Antworten gehen an den Absender), danach Bestätigung an den Absender.
 * Scheitert nur die Bestätigung, gilt die Anfrage trotzdem als gesendet.
 */

/** Mindest-Ausfüllzeit (CLAUDE.md). Wer schneller sendet, bekommt den Fehlerhinweis und kann erneut senden. */
const MIN_FILL_MS = 3000;

/** "trap": Honeypot ausgefüllt, still verwerfen. "fast": zu schnell, Fehler melden. */
function spamCheck(spam: unknown): "ok" | "trap" | "fast" {
  const s = spamSchema.safeParse(spam);
  if (!s.success || s.data.website !== "") return "trap";
  return s.data.elapsed < MIN_FILL_MS ? "fast" : "ok";
}

/** Einzeiliger Wert für Mailzeilen; leere Angaben als „keine Angabe“. */
const one = (s: string, empty = "keine Angabe") => s.replace(/\s+/g, " ").trim() || empty;

const berlinNow = () =>
  new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

const deDate = (iso: string) => iso.split("-").reverse().join(".");

const signature = (name: string) => [name, site.street, `${site.postalCode} ${site.city}`];

/* Fahrzeug -------------------------------------------------------------------------------------- */

export async function sendCarRequest(input: unknown, spam: unknown): Promise<FormResult> {
  const check = spamCheck(spam);
  if (check === "trap") return { ok: true };
  if (check === "fast") return { ok: false };

  const parsed = carRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: invalidFields(parsed.error) };
  const d: CarRequest = parsed.data;
  const errors = carRequestErrors(d);
  if (hasErrors(errors)) return { ok: false, errors };

  const selection = Object.fromEntries(d.services.map((id) => [id, true]));
  const price = estimatePrice(selection, d.vehicleClass);
  const inspect = inspectServices.filter((s) => d.inspect.includes(s.id)).map((s) => s.name);
  const classLabel = vehicleClasses[d.vehicleClass].label;

  const lead = [
    "Neue Terminanfrage über die Website",
    "",
    "Leistungen:",
    ...price.lines.map((l) => `  ${l.name}: ${eur(l.price)}`),
    ...inspect.map((name) => `  ${name}: nach Begutachtung`),
    ...(price.lines.length ? [`Richtpreis: ${fromPrice(price.sum)}`] : []),
    `Fahrzeugklasse: ${classLabel}`,
    `Fahrzeug: ${one(d.car)}`,
    `Wunschtermin: ${d.date ? deDate(d.date) : "keine Angabe"}, ${REQUEST_TIMES[d.time]}`,
    "",
    `Name: ${one(d.name)}`,
    `Telefon: ${one(d.phone)}`,
    `E-Mail: ${one(d.email)}`,
    "",
    "Nachricht:",
    d.message || "keine Angabe",
    "",
    `Einwilligung zur Verarbeitung erteilt: ${berlinNow()} Uhr`,
  ];

  const sent = await sendMail({
    area: "car",
    replyTo: d.email || undefined,
    subject: `Terminanfrage von ${one(d.name)}`,
    text: lead.join("\n"),
  });
  if (!sent) return { ok: false };

  if (d.email) {
    const t = carConfirmation;
    const names = [...d.services.map((id) => serviceById(id).name), ...inspect];
    await sendMail({
      area: "car",
      to: d.email,
      subject: t.subject,
      text: [
        t.greeting,
        "",
        t.intro,
        "",
        `${t.selection}:`,
        ...names.map((n) => `- ${n}`),
        `${t.vehicleClass}: ${classLabel}`,
        ...(price.lines.length ? [`${t.estimate}: ${fromPrice(price.sum)}. ${site.vatNote}`] : []),
        "",
        `${t.questions} ${site.phoneDisplay}.`,
        "",
        ...signature(t.signature),
      ].join("\n"),
    });
  }
  return { ok: true };
}

/* Aviation -------------------------------------------------------------------------------------- */

export async function sendAviationQuote(input: unknown, spam: unknown): Promise<FormResult> {
  const check = spamCheck(spam);
  if (check === "trap") return { ok: true };
  if (check === "fast") return { ok: false };

  const parsed = aviationQuoteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: invalidFields(parsed.error) };
  const d: AviationQuote = parsed.data;
  const errors = aviationQuoteErrors(d);
  if (hasErrors(errors)) return { ok: false, errors };

  // Mail an PaintFix immer auf Deutsch, Beschriftungen aus den Formulartexten.
  const de = aviation.de;
  const f = de.f;
  const other = d.type === OTHER_TYPE;
  const type = other ? `${f.typeOther}: ${one(d.typeOther)}` : d.type;
  const services = d.services.map((i) => de.tabs[i]).join(", ");
  // Nur Muster aus der Liste gelten als bekannt (der Wert kommt aus dem Browser).
  const known = !other && aircraftFactor(d.type, de.types) > 0;
  const est = known
    ? estimate({ locale: "de", copy: de, type: d.type, services: d.services })
    : null;

  const lead = [
    `Angebotsanfrage Aviation (Seite ${d.locale === "de" ? "deutsch" : "englisch"})`,
    "",
    `${f.company}: ${one(d.company)}`,
    `${f.name}: ${one(d.name)}`,
    `${f.email}: ${one(d.email)}`,
    `${f.phone}: ${one(d.phone)}`,
    "",
    `${f.type}: ${type}`,
    `${f.reg}: ${one(d.reg)}`,
    `${f.apt}: ${d.apt}`,
    `${f.window}: ${one(d.window)}`,
    `${f.services}: ${services}`,
    `${f.model}: ${d.model >= 0 ? (de.models[d.model]?.t ?? "keine Angabe") : "keine Angabe"}`,
    ...(est ? [`${de.est.ground}: ${est.ground}`] : []),
    "",
    `${f.notes}:`,
    d.notes || "keine Angabe",
    "",
    `Zustimmung zur Verarbeitung mit dem Absenden: ${berlinNow()} Uhr`,
  ];

  const sent = await sendMail({
    area: "aviation",
    replyTo: d.email,
    subject: `Angebotsanfrage Aviation: ${one(d.company)}`,
    text: lead.join("\n"),
  });
  if (!sent) return { ok: false };

  const t = aviationConfirmation[d.locale];
  const c = aviation[d.locale];
  await sendMail({
    area: "aviation",
    to: d.email,
    subject: t.subject,
    text: [
      t.greeting,
      "",
      t.intro,
      "",
      `${t.details}:`,
      // Nur Auswahlwerte, kein Freitext (content/mail.ts).
      ...(known ? [`${c.f.type}: ${d.type}`] : []),
      `${c.f.apt}: ${d.apt}`,
      `${c.f.services}: ${d.services.map((i) => c.tabs[i]).join(", ")}`,
      "",
      `${t.questions} ${c.opsPhone}.`,
      "",
      ...c.footAddr,
    ].join("\n"),
  });
  return { ok: true };
}

export async function sendDocsRequest(input: unknown, spam: unknown): Promise<FormResult> {
  const check = spamCheck(spam);
  if (check === "trap") return { ok: true };
  if (check === "fast") return { ok: false };

  const parsed = docsRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: invalidFields(parsed.error) };
  const d: DocsRequest = parsed.data;
  const errors = docsRequestErrors(d);
  if (hasErrors(errors)) return { ok: false, errors };

  const sent = await sendMail({
    area: "aviation",
    replyTo: d.email,
    subject: `Lieferantenunterlagen angefordert: ${one(d.company, d.email)}`,
    text: [
      `Lieferantenunterlagen angefordert (Seite ${d.locale === "de" ? "deutsch" : "englisch"})`,
      "",
      `Unternehmen: ${one(d.company)}`,
      `E-Mail: ${d.email}`,
      "",
      "Bitte die Unterlagen per E-Mail an diese Adresse senden.",
      `Angefordert: ${berlinNow()} Uhr`,
    ].join("\n"),
  });
  return sent ? { ok: true } : { ok: false };
}
