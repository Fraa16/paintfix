import type { Ref } from "react";
import { CarButton } from "@/components/fahrzeug/Button";
import { eur, fromPrice } from "@/lib/format";
import type { PriceEstimate } from "@/lib/pricing";

/**
 * Danke-Zustand (README 8.3 Punkt 4, Referenz Zeilen 476–493). Ersetzt Formular und
 * Zusammenfassung; „Anfrage bearbeiten“ führt zurück zum ausgefüllten Formular.
 */
export function RequestThanks({
  firstName,
  estimate,
  classLabel,
  onEdit,
  headingRef,
}: {
  firstName: string;
  estimate: PriceEstimate;
  classLabel: string;
  onEdit: () => void;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  return (
    <div className="mt-[clamp(48px,6vw,72px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-x-16 gap-y-10 border border-car-line bg-car-bg p-[clamp(32px,5vw,72px)]">
      <div>
        <div
          aria-hidden="true"
          className="flex size-14 items-center justify-center bg-car-ink text-[22px] text-car-bg"
        >
          ✓
        </div>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-7 text-car-h2-success leading-[1.02] font-bold tracking-[-0.015em] font-stretch-125% focus:outline-none"
        >
          Danke{firstName ? `, ${firstName}` : ""}.
        </h2>
        <p className="mt-[18px] max-w-[460px] text-[17px] leading-[1.6] text-car-text">
          Ihre Anfrage ist bei uns. Wir melden uns innerhalb eines Werktags mit Festpreis und
          Terminvorschlägen.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <CarButton href="/" size="combo" className="leading-[normal]">
            Zur Startseite
          </CarButton>
          <CarButton variant="secondary" size="combo" onClick={onEdit} className="leading-[normal]">
            Anfrage bearbeiten
          </CarButton>
        </div>
      </div>
      <div className="border-t-2 border-car-ink">
        <ul>
          {estimate.lines.map((line) => (
            <li
              key={line.name}
              className="flex justify-between gap-4 border-b border-car-line py-4 text-[15px]"
            >
              <span>{line.name}</span>
              <span className="tabular-nums">{eur(line.price)}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between gap-4 py-5 text-[17px] font-semibold">
          <span>Richtpreis · {classLabel}</span>
          <span>{fromPrice(estimate.sum)}</span>
        </p>
      </div>
    </div>
  );
}
