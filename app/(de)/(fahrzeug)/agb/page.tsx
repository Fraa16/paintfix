import type { Metadata } from "next";
import { LegalContact, LegalPage } from "@/components/fahrzeug/legal/LegalPage";

export const metadata: Metadata = {
  title: "AGB",
  robots: { index: false, follow: true },
};

/** Platzhalter: Die AGB fehlen noch (README 3) und kommen vor dem Launch. */
export default function AgbPage() {
  return (
    <LegalPage
      title="AGB"
      lead="Die Allgemeinen Geschäftsbedingungen folgen vor dem Start der Website."
    >
      <LegalContact title="In Vorbereitung">
        <p>
          Wir stellen die Allgemeinen Geschäftsbedingungen gerade fertig und veröffentlichen sie
          hier, bevor die Website startet. Fragen dazu beantworten wir Ihnen bis dahin gern
          persönlich.
        </p>
      </LegalContact>
    </LegalPage>
  );
}
