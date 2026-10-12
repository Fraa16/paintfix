import type { Metadata } from "next";
import { CtaBand } from "@/components/fahrzeug/CtaBand";
import { ClassBar } from "@/components/fahrzeug/leistungen/ClassBar";
import { ComboBand } from "@/components/fahrzeug/leistungen/ComboBand";
import { Extras } from "@/components/fahrzeug/leistungen/Extras";
import { Faq } from "@/components/fahrzeug/leistungen/Faq";
import { PageHead } from "@/components/fahrzeug/leistungen/PageHead";
import { PriceClassProvider } from "@/components/fahrzeug/leistungen/PriceClass";
import { Services } from "@/components/fahrzeug/leistungen/Services";
import { services } from "@/content/fahrzeug";

const names = services.map((s) => s.name);

export const metadata: Metadata = {
  title: "Leistungen und Preise",
  description: `${names.slice(0, -1).join(", ")} und ${names.at(-1)} in Telgte bei Münster. Alle Preise inklusive Mehrwertsteuer, je nach Fahrzeugklasse. Nach einer kurzen Sichtung nennen wir Ihnen den Festpreis.`,
};

/**
 * Leistungen & Preise (README 8.2). Die Klassenleiste klebt bis zum Ende der FAQ (wie <main> in der
 * Referenz), die CTA liegt außerhalb dieses Blocks. Header, Footer und Aktionsleiste kommen aus dem
 * Layout.
 */
export default function LeistungenPage() {
  return (
    <main>
      <PriceClassProvider className="leading-[normal]">
        <PageHead />
        <ClassBar />
        <Services />
        <ComboBand />
        <Extras />
        <Faq />
      </PriceClassProvider>
      <CtaBand />
    </main>
  );
}
