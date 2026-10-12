import { AvOverline } from "@/components/aviation/Overline";
import { aviation, type Locale } from "@/content/aviation";
import { FleetBases } from "./FleetBases";

/**
 * Flotte (README 8.4 Punkt 8, Referenz Zeilen 819–884): links Flugzeugmuster je Klasse, rechts
 * Einsatzradius-Karte und Standortliste (Client-Insel für den Hover-/Fokus-Zustand).
 */
export function Fleet({ locale }: { locale: Locale }) {
  const t = aviation[locale];

  return (
    <section id="av-fleet" aria-labelledby="av-fleet-title" className="bg-av-sand py-av-section">
      <div className="mx-auto grid max-w-av grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] items-start gap-x-[clamp(40px,6vw,120px)] gap-y-[72px] px-av-gutter">
        <div>
          <AvOverline>{t.fleetLabel}</AvOverline>
          <h2
            id="av-fleet-title"
            className="mt-7 max-w-[14ch] font-cinzel text-av-h2-fleet leading-[1.04] font-normal tracking-[0.02em] text-balance"
          >
            {t.fleetTitle}
          </h2>
          <dl className="mt-12">
            {t.fleet.map((m) => (
              <div
                key={m.c}
                className="grid grid-cols-[minmax(120px,0.4fr)_1fr] gap-x-6 gap-y-2 border-t border-av-line-strong py-[22px]"
              >
                <dt className="pt-1 text-[11px] tracking-[0.24em] uppercase">{m.c}</dt>
                <dd className="font-cinzel text-[15.2px] leading-[1.45] font-normal">{m.m}</dd>
              </div>
            ))}
          </dl>
          <p className="border-t border-av-line-strong pt-[22px] text-[13px] text-av-muted">
            {t.fleetNote}
          </p>
        </div>

        <div>
          <AvOverline>{t.baseLabel}</AvOverline>
          <FleetBases locale={locale} />
        </div>
      </div>
    </section>
  );
}
