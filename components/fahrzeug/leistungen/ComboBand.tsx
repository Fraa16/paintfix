import { conceptH2, SectionRule } from "@/components/fahrzeug/concept/ui";
import { ComboOffer } from "./ComboOffer";

/** Kombi-Band (README 8.2 Punkt 4): schwarze Fläche, Komplettpreis. KONZEPT: Kopf wie die Abschnitte. */
export function ComboBand() {
  return (
    <section
      aria-labelledby="kombi-title"
      className="bg-car-ink text-car-on-ink [--focus:var(--car-on-ink)]"
    >
      <div className="mx-auto grid max-w-car grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-end gap-x-16 gap-y-10 px-car-gutter py-[clamp(64px,8vw,112px)]">
        <div>
          <SectionRule label="Komplettaufbereitung" />
          <h2
            id="kombi-title"
            data-rv="0"
            className={`${conceptH2} mt-[clamp(28px,4vw,56px)] max-w-[14ch]`}
          >
            Außen und innen an einem Termin.
          </h2>
        </div>
        <ComboOffer />
      </div>
    </section>
  );
}
