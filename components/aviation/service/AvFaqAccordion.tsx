"use client";

import { useId, useState } from "react";
import type { FaqEntry } from "@/content/fahrzeug";

/**
 * FAQ-Akkordeon Aviation, Verhalten wie das der Fahrzeugseiten (erster Eintrag offen, immer nur einer
 * offen). Fragen in Cinzel, Hover --av-gold-text. Texte kommen als Props (nur die aktuelle Sprache).
 */
export function AvFaqAccordion({ entries }: { entries: ReadonlyArray<FaqEntry> }) {
  const [open, setOpen] = useState(0);
  const id = useId();

  return (
    <div className="border-t border-av-navy">
      {entries.map((entry, i) => {
        const isOpen = open === i;
        return (
          <div key={entry.q} className="border-b border-av-line-strong">
            <h3>
              <button
                type="button"
                id={`${id}-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left font-cinzel text-[clamp(18px,1.6vw,21px)] leading-[1.3] font-normal transition-colors hover:text-av-gold-text"
              >
                <span>{entry.q}</span>
                <span
                  aria-hidden="true"
                  className="w-6 flex-none text-center font-sans text-[22px]"
                >
                  {isOpen ? "–" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={`${id}-a-${i}`}
              role="region"
              aria-labelledby={`${id}-q-${i}`}
              hidden={!isOpen}
            >
              <p className="pr-12 pb-7 text-base leading-[1.7] text-pretty text-av-muted">
                {entry.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
