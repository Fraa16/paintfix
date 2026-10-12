"use client";

import { useEffect, useRef } from "react";
import { vehicleClasses, type VehicleClassIndex } from "@/content/fahrzeug";
import { cx } from "@/lib/cx";
import { usePriceClass } from "./PriceClass";

/**
 * Klassenleiste #preise (README 8.2 Punkt 2, Referenz Zeilen 282–292): sticky unter dem Header,
 * „Preise für“, Segment-Steuerung als Radiogruppe und das Beispiel der gewählten Klasse.
 *
 * Abweichung von der Referenz: Die Segmente verkleinern ihren Innenabstand unter ca. 440px
 * (18px → min. 4px), damit die Gruppe bei 360–402px nicht seitlich übersteht (CLAUDE.md, Regel 8).
 */
export function ClassBar() {
  const { cls, setCls, setBarHeight } = usePriceClass();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setBarHeight(Math.round(el.getBoundingClientRect().height));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [setBarHeight]);

  return (
    <div
      id="preise"
      ref={ref}
      className="sticky top-car-header z-30 border-b border-car-line-ui bg-car-header-bg backdrop-blur-[14px]"
    >
      <div className="mx-auto flex max-w-car flex-wrap items-center gap-x-6 gap-y-3 px-car-gutter py-3.5">
        <span id="preise-label" className="text-[13px] font-semibold tracking-[0.14em] uppercase">
          Preise für
        </span>
        <div
          role="radiogroup"
          aria-labelledby="preise-label"
          className="flex max-w-full border border-car-border"
        >
          {vehicleClasses.map((c, i) => {
            const on = cls === i;
            return (
              <label
                key={c.label}
                className={cx(
                  "relative flex h-11 cursor-pointer items-center justify-center px-[clamp(4px,calc((100vw-330px)/6),18px)] text-center text-[14px] font-semibold",
                  "has-focus-visible:z-10 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-car-ink",
                  on ? "bg-car-ink text-car-bg" : "text-car-ink",
                )}
              >
                <input
                  type="radio"
                  name="preisklasse"
                  value={i}
                  checked={on}
                  onChange={() => setCls(i as VehicleClassIndex)}
                  className="sr-only"
                />
                {c.label}
              </label>
            );
          })}
        </div>
        <span className="text-[13px] text-car-muted">{vehicleClasses[cls].ex}</span>
      </div>
    </div>
  );
}
