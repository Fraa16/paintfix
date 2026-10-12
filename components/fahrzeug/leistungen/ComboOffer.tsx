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
          <span className="text-[16px] text-car-on-ink-muted">ab</span>
          <span className="text-[clamp(56px,5.6vw,84px)] leading-none font-medium tracking-[-0.04em] tabular-nums">
            {eur(comboPrice[cls])}
          </span>
        </p>
        <p className="mt-3 text-[14px] text-car-on-ink-muted">
          {vehicleClasses[cls].label} · Sie sparen {eur(save)} gegenüber der Einzelbuchung.
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
