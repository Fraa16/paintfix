import type { Metadata } from "next";
import { CarOverline } from "@/components/fahrzeug/Overline";
import {
  contactRows,
  LegalFacts,
  LegalGrid,
  LegalNote,
  LegalPage,
} from "@/components/fahrzeug/legal/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
};

/**
 * Impressum: bekannte Angaben aus content/site.ts. Die übrigen Pflichtangaben fehlen noch (README 3)
 * und kommen vor dem Launch dazu.
 */
export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum" lead="Angaben zum Anbieter dieser Website.">
      <LegalGrid>
        <div>
          <CarOverline>Anbieter</CarOverline>
          <LegalFacts
            className="mt-8"
            rows={[
              { label: "Name", value: site.name },
              { label: "Inhaber", value: site.owner },
              { label: "Anschrift", value: `${site.street}, ${site.postalCode}\u00A0${site.city}` },
              ...contactRows,
            ]}
          />
        </div>
        <LegalNote title="Noch nicht vollständig">
          <p>
            Die weiteren Pflichtangaben nach §&nbsp;5 DDG, etwa die
            Umsatzsteuer-Identifikationsnummer, und die Angaben zur Verbraucherstreitbeilegung
            ergänzen wir vor dem Start der Website.
          </p>
          <p>Telefonnummer, E-Mail-Adresse und Inhaberangabe werden bis dahin noch bestätigt.</p>
        </LegalNote>
      </LegalGrid>
    </LegalPage>
  );
}
