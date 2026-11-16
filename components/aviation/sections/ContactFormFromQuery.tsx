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
 * Außen + Kabine. Muss in <Suspense> stehen; der Fallback zeigt das Formular im Standardzustand.
 */
export function ContactFormFromQuery({ locale, copy }: { locale: Locale; copy: ContactCopy }) {
  const params = useSearchParams();
  const type = params.get("type") ?? "";
  const svc = params.get("svc") ?? "";
  const prefill: ContactPrefill = {
    type: aircraftFactor(type, copy.types) > 0 ? type : defaultContactPrefill.type,
    services: svc === "ec" ? [0, 1] : defaultContactPrefill.services,
  };
  return <ContactForm key={`${type}|${svc}`} locale={locale} copy={copy} prefill={prefill} />;
}
