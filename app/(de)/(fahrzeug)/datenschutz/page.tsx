import type { Metadata } from "next";
import { LegalContact, LegalPage } from "@/components/fahrzeug/legal/LegalPage";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: false, follow: true },
};

/** Platzhalter: Die Datenschutzerklärung fehlt noch (README 3, 13) und kommt vor dem Launch. */
export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutz" lead="Die Datenschutzerklärung folgt vor dem Start der Website.">
      <LegalContact title="In Vorbereitung">
        <p>
          Wir stellen die Datenschutzerklärung gerade fertig und veröffentlichen sie hier, bevor die
          Website startet. Fragen zum Umgang mit Ihren Daten beantworten wir Ihnen bis dahin gern
          persönlich.
        </p>
      </LegalContact>
    </LegalPage>
  );
}
