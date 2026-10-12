import { CarOverline } from "@/components/fahrzeug/Overline";
import { FaqAccordion } from "./FaqAccordion";
import { CarH2 } from "@/components/fahrzeug/Heading";

/** Häufige Fragen (README 8.2 Punkt 6, Referenz Zeilen 357–366). */
export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="bg-car-bg py-car-section">
      <div className="mx-auto grid max-w-car grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-x-[clamp(40px,6vw,96px)] gap-y-10 px-car-gutter">
        <div>
          <CarOverline className="leading-[normal]">Häufige Fragen</CarOverline>
          <CarH2 id="faq-title" rv={0} className="max-w-[12ch]">
            Fragen zu Preis und Ablauf.
          </CarH2>
        </div>
        <FaqAccordion />
      </div>
    </section>
  );
}
