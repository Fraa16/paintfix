"use client";

import { useState } from "react";
import { faq } from "@/content/fahrzeug";

/**
 * FAQ-Akkordeon (README 8.2 Punkt 6, Referenz Zeilen 352–362): erster Eintrag offen, immer nur
 * einer offen, erneuter Klick schließt. Geschlossene Antworten bleiben im HTML (hidden), damit
 * aria-controls immer auf ein Element zeigt.
 */
export function FaqAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="border-t border-car-ink">
      {faq.map((entry, i) => {
        const isOpen = open === i;
        return (
          <div key={entry.q} className="border-b border-car-line">
            <h3>
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-[19px] font-semibold font-stretch-[106%] hover:text-car-red"
              >
                <span>{entry.q}</span>
                <span
                  aria-hidden="true"
                  className="w-6 flex-none text-center text-[24px] font-light"
                >
                  {isOpen ? "–" : "+"}
                </span>
              </button>
            </h3>
            <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!isOpen}>
              <p className="pr-12 pb-7 text-[16px] leading-[1.65] text-pretty text-car-text">
                {entry.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
