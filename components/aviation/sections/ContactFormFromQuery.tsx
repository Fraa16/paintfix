"use client";

import { useSearchParams } from "next/navigation";
import type { Locale } from "@/content/aviation";
import { aircraftFactor } from "@/lib/estimate";
import {
  ContactForm,
  defaultContactPrefill,
  type ContactCopy,
  type ContactPrefill,
} from "./ContactForm";

/**
 * Vorbelegung wie in der Referenz (Zeile 1137): ?type=<Muster> wählt das Muster, ?svc=ec wählt
 * Außen + Kabine, sonst gilt `services`. Muss in <Suspense> stehen; der Fallback zeigt das Formular im Standardzustand.
 */
export function ContactFormFromQuery({
  locale,
  copy,
  services,
}: {
  locale: Locale;
  copy: ContactCopy;
  /** Vorauswahl der Seite je Bereich, wenn ?svc= fehlt. */
  services?: ContactPrefill["services"];
}) {
  const params = useSearchParams();
  const type = params.get("type") ?? "";
  const svc = params.get("svc") ?? "";
  const prefill: ContactPrefill = {
    type: aircraftFactor(type, copy.types) > 0 ? type : defaultContactPrefill.type,
    services: svc === "ec" ? [0, 1] : (services ?? defaultContactPrefill.services),
  };
  return <ContactForm key={`${type}|${svc}`} locale={locale} copy={copy} prefill={prefill} />;
}
