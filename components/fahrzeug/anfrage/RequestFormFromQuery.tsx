"use client";

import { useSearchParams } from "next/navigation";
import { parseRequestQuery } from "./query";
import { RequestForm } from "./RequestForm";

/**
 * Liest die Vorbelegung aus ?leistungen=…&klasse=… (README 10.1). Muss in <Suspense> stehen; der
 * Fallback zeigt das Formular im Standardzustand. Ändert sich die Adresse (z. B. ein neuer Link von
 * der Leistungsseite), beginnt das Formular neu.
 */
export function RequestFormFromQuery() {
  const params = useSearchParams();
  const leistungen = params.get("leistungen") ?? "";
  const klasse = params.get("klasse") ?? "";
  return <RequestForm key={`${leistungen}|${klasse}`} prefill={parseRequestQuery(params)} />;
}
