"use client";

import { CarButton } from "@/components/fahrzeug/Button";
import { comboPrice, serviceById, vehicleClasses } from "@/content/fahrzeug";
import { eur } from "@/lib/format";
import { usePriceClass } from "./PriceClass";

/**
 * Preis und Button im Kombi-Band (Referenz Zeilen 334–340). Ersparnis = Außen + Innen − Kombi
 * in der gewählten Klasse. „Komplett anfragen →“ wählt Außen und Innen vor.
 */
export function ComboOffer() {
  const { cls } = usePriceClass();
  const save = serviceById("aussen").p[cls] + serviceById("innen").p[cls] - comboPrice[cls];

  return (
    <div className="flex flex-wrap items-end justify-between gap-7">
      <div>
        <p className="flex items-baseline gap-2.5">
          <span className="font-mono text-[11px] text-[12px] tracking-[0.06em] text-car-on-ink-muted uppercase">
            ab
          </span>
          <span className="text-[clamp(56px,6vw,96px)] leading-none font-semibold tracking-[-0.045em] tabular-nums">
            {eur(comboPrice[cls])}
          </span>
        </p>
        <p className="mt-3 text-[14px] text-car-on-ink-muted">
          Für {vehicleClasses[cls].label} sparen Sie {eur(save)} gegenüber der Einzelbuchung.
        </p>
      </div>
      <CarButton
        href={`/anfrage?leistungen=aussen,innen&klasse=${cls}`}
        variant="light"
        size="combo"
        arrow
        className="leading-[normal]"
      >
        Komplett anfragen
      </CarButton>
    </div>
  );
}
