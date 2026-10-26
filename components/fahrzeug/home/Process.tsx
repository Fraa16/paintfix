import { CarOverline } from "@/components/fahrzeug/Overline";
import { cx } from "@/lib/cx";
import { CarH2 } from "@/components/fahrzeug/Heading";
import { ProgressSection } from "./ProgressSection";

/** Texte wörtlich aus README 8.1 Punkt 5 (stehen nicht in content/). */
const STEPS = [
  {
    title: "Anfrage",
    text: "Online, telefonisch oder direkt bei uns. Sie nennen Fahrzeug und gewünschte Leistung.",
  },
  {
    title: "Festpreis",
    text: "Nach einer kostenlosen Begutachtung erhalten Sie einen verbindlichen Festpreis. Ohne Ihre Zustimmung beginnen wir nicht.",
  },
  {
    title: "Aufbereitung",
    text: "In unserer Halle in Telgte, mit Produkten, die wir für jedes Material passend auswählen.",
  },
  {
    title: "Übergabe",
    text: "Sie bekommen Ihr Fahrzeug mit Fotoprotokoll zurück und sehen genau, was gemacht wurde.",
  },
] as const;

/**
 * Ablauf (#ablauf, README 8.1 Punkt 5, Referenz Zeilen 188–224).
 * Statischer Zustand = Endzustand der Fortschrittslinie (README 9.6, p = 1): Linie voll, alle
 * Schritte deckend, letzter Marker rot. Mit Bewegung steuert ProgressSection data-progbar (scaleX)
 * und data-step (opacity, Übergang 0.6s) per Scroll; bis dahin steht die Linie bei scaleX(0) wie in
 * der Referenz. Reveals: Overline 0, H2 80.
 */
export function Process() {
  return (
    <ProgressSection id="ablauf" className="bg-car-surface py-car-section leading-[normal]">
      <div className="mx-auto max-w-car px-car-gutter">
        <CarOverline rv={0} className="leading-[normal]">
          Ablauf
        </CarOverline>
        <CarH2 rv={80} className="max-w-[14ch]">
          So läuft Ihr Termin ab.
        </CarH2>
        <div className="relative mt-[clamp(48px,6vw,80px)]">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-car-track" />
          <div
            aria-hidden="true"
            data-progbar=""
            className="absolute inset-x-0 top-0 h-0.5 origin-left bg-car-ink motion-safe:[html[data-motion]_&]:[transform:scaleX(0)]"
          />
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-8 gap-y-10">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                data-step={i}
                className="relative pt-8 transition-opacity duration-600 ease-[ease]"
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute -top-[5px] left-0 size-3",
                    i === STEPS.length - 1 ? "bg-car-red" : "bg-car-ink",
                  )}
                />
                <div
                  aria-hidden="true"
                  className="text-[64px] leading-none font-light tracking-[-0.04em] tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-7 text-[20px] font-semibold font-stretch-108%">{step.title}</h3>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-car-text">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ProgressSection>
  );
}
