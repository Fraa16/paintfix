import type { Metadata } from "next";
import {
  AviationTeaser,
  ConceptHero,
  FocusTiles,
  LeasingStatement,
  ProcessLines,
  Statement,
  Visit,
} from "@/components/fahrzeug/design/Home";
import { JsonLd } from "@/components/shared/JsonLd";
import { serviceById } from "@/content/fahrzeug";
import { eur } from "@/lib/format";
import { carBusiness } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: "PaintFix | Fahrzeugaufbereitung in Telgte bei Münster" },
  description: `Autoaufbereitung, Smart Repair, Lackkorrektur und Leasingrückgabe in Telgte bei Münster. Kostenlose Begutachtung, Festpreis vor Beginn, Endpreise ab ${eur(serviceById("aussen").p[0])}.`,
  alternates: { canonical: "/" },
};

/**
 * Startseite Fahrzeug im Design „Licht auf Lack“ (Redesign 11/2026). Die vorherige
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
