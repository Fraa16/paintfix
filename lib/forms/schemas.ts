import { z } from "zod";
import type { FieldErrors } from "./rules";

/**
 * Form und Längen der Formulardaten, nur auf dem Server (Zod bleibt aus dem Client-Bundle). Die
 * inhaltlichen Regeln stehen in rules.ts. Grenzen großzügig, die Felder haben passende maxLength.
 */
const text = (max: number) => z.string().trim().max(max);
const locale = z.enum(["de", "en"]);

export const carRequestSchema = z.object({
  services: z.array(z.enum(["aussen", "innen", "politur", "keramik"])).max(4),
  inspect: z.array(z.enum(["smart-repair", "leasing"])).max(2),
  vehicleClass: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  car: text(120),
  date: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/),
  time: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  name: text(100),
  phone: text(40),
  email: text(200),
  message: text(3000),
  consent: z.boolean(),
});

export const aviationQuoteSchema = z.object({
  locale,
  company: text(120),
  name: text(100),
  email: text(200),
  phone: text(40),
  type: text(80),
  typeOther: text(80),
  reg: text(20),
  apt: text(4).transform((s) => s.toUpperCase()),
  window: text(120),
  services: z.array(z.union([z.literal(0), z.literal(1), z.literal(2)])).max(3),
  model: z.number().int().min(-1).max(9),
  notes: text(3000),
});

export const docsRequestSchema = z.object({
  locale,
  company: text(120),
  email: text(200),
});

export const spamSchema = z.object({
  website: z.string().max(500),
  elapsed: z.number().finite(),
});

/** Formfehler (z. B. zu lang) als „invalid“ am ersten Pfadelement. */
export function invalidFields(error: z.ZodError): FieldErrors {
  const e: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key) e[key] = "invalid";
  }
  return e;
}
