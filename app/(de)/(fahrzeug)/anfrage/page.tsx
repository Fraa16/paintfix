import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestForm } from "@/components/fahrzeug/anfrage/RequestForm";
import { RequestFormFromQuery } from "@/components/fahrzeug/anfrage/RequestFormFromQuery";
import { RequestHead } from "@/components/fahrzeug/anfrage/RequestHead";

export const metadata: Metadata = {
  title: "Termin anfragen",
  description:
    "Unverbindlich anfragen: Autoaufbereitung, Smart Repair oder Lackkorrektur in Telgte. Richtpreis sofort, Terminvorschläge innerhalb eines Werktags.",
  alternates: { canonical: "/anfrage" },
};

/**
 * Termin anfragen (README 8.3). Kein CTA-Band und keine mobile Aktionsleiste; Header und Footer
 * kommen aus dem Layout. Die Vorbelegung per Query wird erst im Browser gelesen; bis dahin zeigt der
 * Suspense-Fallback das Formular ohne Auswahl und mit unsichtbaren Preisen (RequestForm pending).
 */
export default function RequestPage() {
  return (
    <main id="inhalt" tabIndex={-1} className="bg-car-surface leading-[normal] focus:outline-none">
      <RequestHead />
      <div className="mx-auto max-w-car px-car-gutter pb-[clamp(88px,10vw,144px)]">
        <Suspense fallback={<RequestForm pending />}>
          <RequestFormFromQuery />
        </Suspense>
      </div>
    </main>
  );
}
