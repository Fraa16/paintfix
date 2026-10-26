import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestForm } from "@/components/fahrzeug/anfrage/RequestForm";
import { RequestFormFromQuery } from "@/components/fahrzeug/anfrage/RequestFormFromQuery";
import { RequestHead } from "@/components/fahrzeug/anfrage/RequestHead";

export const metadata: Metadata = {
  title: "Termin anfragen",
  description:
    "Fahrzeugaufbereitung in Telgte anfragen: Leistungen und Fahrzeugklasse wählen, Richtpreis sehen. Sie erhalten innerhalb eines Werktags Terminvorschläge und nach einer kostenlosen Begutachtung einen Festpreis. Die Anfrage ist unverbindlich.",
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
      <div className="mx-auto max-w-car px-car-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(88px,10vw,144px)]">
        <RequestHead />
        <Suspense fallback={<RequestForm pending />}>
          <RequestFormFromQuery />
        </Suspense>
      </div>
    </main>
  );
}
