import type { Metadata } from "next";
import { CtaBand } from "@/components/fahrzeug/CtaBand";
import { ClassBar } from "@/components/fahrzeug/leistungen/ClassBar";
import { ComboBand } from "@/components/fahrzeug/leistungen/ComboBand";
import { Extras } from "@/components/fahrzeug/leistungen/Extras";
import { Faq } from "@/components/fahrzeug/leistungen/Faq";
import { LeistungenStage } from "@/components/fahrzeug/design/LeistungenStage";
import { PriceClassProvider } from "@/components/fahrzeug/leistungen/PriceClass";
import { Services } from "@/components/fahrzeug/leistungen/Services";
import { serviceById } from "@/content/fahrzeug";
import { eur } from "@/lib/format";

export const metadata: Metadata = {
  title: "Preise für Autoaufbereitung in Telgte bei Münster",
  description: `Was Autoaufbereitung, Innenreinigung und Keramikversiegelung in Telgte bei Münster kosten: Endpreise ab ${eur(serviceById("aussen").p[0])}, Festpreis nach kostenloser Begutachtung.`,
  alternates: { canonical: "/leistungen" },
};

/**
 * Leistungen & Preise (README 8.2). Die Klassenleiste klebt bis zum Ende der FAQ (wie <main> in der
 * Referenz), die CTA liegt außerhalb dieses Blocks. Dunkler Seitenkopf mit Verzeichnis
 * (LeistungenStage) statt PageHead; die Klassenleiste beginnt darunter. Header, Footer und Aktionsleiste kommen aus dem
 * Layout.
 */
export default function LeistungenPage() {
  return (
    <main id="inhalt" tabIndex={-1} className="focus:outline-none">
      <LeistungenStage />
      <PriceClassProvider className="leading-[normal]">
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
