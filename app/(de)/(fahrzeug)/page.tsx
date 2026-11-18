import type { Metadata } from "next";
import {
  AviationTeaser,
  ConceptHero,
  FocusTiles,
  LeasingStatement,
  ProcessLines,
  Statement,
  Visit,
} from "@/components/fahrzeug/concept/Home";
import { JsonLd } from "@/components/shared/JsonLd";
import { carBusiness } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: "PaintFix | Fahrzeugaufbereitung in Telgte bei Münster" },
  description:
    "Smart Repair, Lackkorrektur, Vorbereitung auf die Leasingrückgabe und hochwertige Fahrzeugaufbereitung in Telgte bei Münster. Nach einer kostenlosen Begutachtung kennen Sie den Festpreis, bevor wir beginnen.",
  alternates: { canonical: "/" },
};

/**
 * Startseite Fahrzeug, KONZEPT „Licht auf Lack“ (Branch claude/concept-redesign). Die bisherige
 * Startseite (README 8.1) liegt unverändert auf main; ihre Bausteine in components/fahrzeug/home/.
 * Header, Footer und Aktionsleiste kommen aus dem Layout; der Header liegt hier transparent über dem
 * Hero (CarHeader).
 */
export default function HomePage() {
  return (
    <main id="inhalt" tabIndex={-1} className="focus:outline-none">
      <ConceptHero />
      <Statement />
      <FocusTiles />
      <ProcessLines />
      <LeasingStatement />
      <AviationTeaser />
      <Visit />
      <JsonLd data={carBusiness()} />
    </main>
  );
}
