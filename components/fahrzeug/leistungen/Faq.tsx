import type { FaqEntry } from "@/content/fahrzeug";
import { SectionHead } from "@/components/fahrzeug/concept/ui";
import { FaqAccordion } from "./FaqAccordion";

/**
 * Häufige Fragen (README 8.2 Punkt 6, Referenz Zeilen 357–366). Die Leistungsseiten geben eigene
 * Überschrift und Fragen mit.
 */
export function Faq({
  title = "Fragen zu Preis und Ablauf.",
  entries,
}: {
  title?: string;
  entries?: ReadonlyArray<FaqEntry>;
}) {
  return (
    <section aria-labelledby="faq-title" className="bg-car-bg py-car-section">
      <div className="mx-auto grid max-w-car grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-x-[clamp(40px,6vw,96px)] gap-y-10 px-car-gutter">
        <SectionHead tone="light" label="Häufige Fragen" id="faq-title" title={title} />
        <FaqAccordion entries={entries} />
      </div>
    </section>
  );
}
