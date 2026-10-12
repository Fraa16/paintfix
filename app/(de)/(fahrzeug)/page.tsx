import type { Metadata } from "next";
import { CtaBand } from "@/components/fahrzeug/CtaBand";
import { AviationBand } from "@/components/fahrzeug/home/AviationBand";
import { BeforeAfter } from "@/components/fahrzeug/home/BeforeAfter";
import { Hero } from "@/components/fahrzeug/home/Hero";
import { Location } from "@/components/fahrzeug/home/Location";
import { Process } from "@/components/fahrzeug/home/Process";
import { ServiceList } from "@/components/fahrzeug/home/ServiceList";

export const metadata: Metadata = {
  title: { absolute: "Paintfix · Fahrzeugaufbereitung in Telgte bei Münster" },
  description:
    "Außen, innen, Politur und Keramikversiegelung für Ihr Alltagsauto, in unserer Halle in Telgte bei Münster. Den Festpreis kennen Sie, bevor wir beginnen.",
};

/** Startseite Fahrzeug (README 8.1). Header, Footer und Aktionsleiste kommen aus dem Layout. */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <ServiceList />
      <BeforeAfter />
      <Process />
      <AviationBand />
      <Location />
      <CtaBand />
    </main>
  );
}
