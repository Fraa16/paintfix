"use client";

import { CarButton } from "@/components/fahrzeug/Button";
import { serviceById, vehicleClasses, type ServiceId } from "@/content/fahrzeug";
import { eur } from "@/lib/format";
import { usePriceClass } from "./PriceClass";

/**
 * Preiszeile einer Leistung (Referenz Zeilen 316–322): „ab {Preis der Klasse}“, „{Klasse}, Endpreis“
 * und „Anfragen →“ mit dieser Leistung und Klasse vorbelegt.
 */
export function ServicePrice({ id }: { id: ServiceId }) {
  const { cls } = usePriceClass();
  const service = serviceById(id);

  return (
    <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-10">
      <div>
        <p className="flex items-baseline gap-3">
          <span className="font-mono text-[12px] tracking-[0.06em] text-car-muted uppercase">
            ab
          </span>
          <span className="text-[clamp(48px,4.6vw,72px)] leading-none font-semibold tracking-[-0.045em] tabular-nums">
            {eur(service.p[cls])}
          </span>
        </p>
        <p className="mt-3 font-mono text-[11px] tracking-[0.06em] text-car-muted uppercase">
          {vehicleClasses[cls].label}, Endpreis
        </p>
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
