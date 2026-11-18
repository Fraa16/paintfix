"use client";

import { useState } from "react";
import { faq as defaultFaq, type FaqEntry } from "@/content/fahrzeug";

/**
 * FAQ-Akkordeon (README 8.2 Punkt 6, Referenz Zeilen 352–362): erster Eintrag offen, immer nur
 * einer offen, erneuter Klick schließt. Geschlossene Antworten bleiben im HTML (hidden), damit
 * aria-controls immer auf ein Element zeigt. `entries` für die Leistungsseiten, sonst die
 * allgemeinen Fragen aus fahrzeug.json.
 */
export function FaqAccordion({ entries = defaultFaq }: { entries?: ReadonlyArray<FaqEntry> }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="border-t border-car-ink">
      {entries.map((entry, i) => {
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
                className="flex w-full items-baseline gap-5 py-6 text-left text-[clamp(18px,1.6vw,22px)] leading-[1.25] font-semibold tracking-[-0.015em] transition-colors hover:text-car-red"
              >
                <span className="w-7 flex-none font-mono text-[11px] font-normal tracking-[0.06em] text-car-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{entry.q}</span>
                <span
                  aria-hidden="true"
                  className="w-6 flex-none text-center text-[24px] font-light"
                >
                  {isOpen ? "–" : "+"}
                </span>
              </button>
            </h3>
            <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!isOpen}>
              <p className="pr-12 pb-7 pl-12 text-[16px] leading-[1.65] text-pretty text-car-text">
                {entry.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
