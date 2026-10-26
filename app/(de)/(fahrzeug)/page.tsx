import type { Metadata } from "next";
import { CtaBand } from "@/components/fahrzeug/CtaBand";
import { AviationBand } from "@/components/fahrzeug/home/AviationBand";
import { BeforeAfter } from "@/components/fahrzeug/home/BeforeAfter";
import { Hero } from "@/components/fahrzeug/home/Hero";
import { LeasingBand } from "@/components/fahrzeug/home/LeasingBand";
import { Location } from "@/components/fahrzeug/home/Location";
import { Process } from "@/components/fahrzeug/home/Process";
import { ServiceList } from "@/components/fahrzeug/home/ServiceList";
import { JsonLd } from "@/components/shared/JsonLd";
import { carBusiness } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: "PaintFix | Fahrzeugaufbereitung in Telgte bei Münster" },
  description:
    "Smart Repair, Lackkorrektur, Vorbereitung auf die Leasingrückgabe und hochwertige Fahrzeugaufbereitung in Telgte bei Münster. Nach einer kostenlosen Begutachtung kennen Sie den Festpreis, bevor wir beginnen.",
  alternates: { canonical: "/" },
};

/** Startseite Fahrzeug (README 8.1). Header, Footer und Aktionsleiste kommen aus dem Layout. */
export default function HomePage() {
  return (
    <main id="inhalt" tabIndex={-1} className="focus:outline-none">
      <Hero />
      <ServiceList />
      <LeasingBand />
      <BeforeAfter />
      <Process />
      <AviationBand />
      <Location />
      <CtaBand />
      <JsonLd data={carBusiness()} />
    </main>
  );
}
