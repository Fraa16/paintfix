"use client";

import { CarButton } from "@/components/fahrzeug/Button";
import { serviceById, vehicleClasses, type ServiceId } from "@/content/fahrzeug";
import { eur } from "@/lib/format";
import { usePriceClass } from "./PriceClass";

/**
 * Preiszeile einer Leistung (Referenz Zeilen 316–322): „ab {Preis der Klasse}“, „{Klasse} · inkl. MwSt.“
 * und „Anfragen →“ mit dieser Leistung und Klasse vorbelegt.
 */
export function ServicePrice({ id }: { id: ServiceId }) {
  const { cls } = usePriceClass();
  const service = serviceById(id);

  return (
    <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-9">
      <div>
        <p className="flex items-baseline gap-2.5">
          <span className="text-[15px] text-car-muted">ab</span>
          <span className="text-[clamp(44px,4vw,60px)] leading-none font-medium tracking-[-0.035em] tabular-nums">
            {eur(service.p[cls])}
          </span>
        </p>
        <p className="mt-2 text-[13px] text-car-muted">{vehicleClasses[cls].label} · inkl. MwSt.</p>
      </div>
      <CarButton
        href={`/anfrage?leistungen=${id}&klasse=${cls}`}
        size="combo"
        arrow
        className="leading-[normal]"
      >
        Anfragen<span className="sr-only">: {service.name}</span>
      </CarButton>
    </div>
  );
}
