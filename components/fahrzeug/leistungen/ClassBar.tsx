"use client";

import { useLayoutEffect, useRef } from "react";
import { rescrollToHash } from "@/components/shared/root-scroll";
import { vehicleClasses, type VehicleClassIndex } from "@/content/fahrzeug";
import { cx } from "@/lib/cx";
import { usePriceClass } from "./PriceClass";

/**
 * Klassenleiste #preise (README 8.2 Punkt 2, Referenz Zeilen 282–292): sticky unter dem Header,
 * „Preise für“, Segment-Steuerung als Radiogruppe und das Beispiel der gewählten Klasse.
 *
 * Abweichung von der Referenz: Die Segmente verkleinern ihren Innenabstand unter ca. 440px
 * (18px → min. 4px), damit die Gruppe bei 360–402px nicht seitlich übersteht (CLAUDE.md, Regel 8).
 *
 * Die Leiste meldet ihre Höhe als --pf-sticky-h ans <html> (scroll-padding, globals.css), damit
 * Anker wie #svc-politur und der Tastaturfokus unter Header und Leiste landen. Gemessen im
 * Layout-Effekt, also vor dem Hash-Sprung von Next bei Client-Navigation; beim ersten Laden springt
 * der Browser vor der Hydration, deshalb einmal neu zum Anker.
 */
export function ClassBar() {
  const { cls, setCls } = usePriceClass();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement.style;
    const measure = () =>
      root.setProperty("--pf-sticky-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    measure();
    rescrollToHash("svc-");
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.removeProperty("--pf-sticky-h");
    };
  }, []);

  return (
    <div
      id="preise"
      ref={ref}
      className="sticky top-car-header z-30 scroll-mt-[calc(var(--pf-sticky-h,0px)*-1)] border-b border-car-line-ui bg-car-header-bg backdrop-blur-[14px]"
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
