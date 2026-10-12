"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionAllowed, useScrollFrame } from "@/components/shared/motion/scroll";

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Parallaxe einer inneren Bildebene (README 9.2, Referenz data-px, frame() Zeilen 1209–1214):
 * translateY = −((Mitte des Elternelements − vh/2) × Faktor), nur solange das Elternelement im
 * Sichtbereich ± 300px liegt. Die Ebene ist größer als ihr Rahmen (z. B. 8 % oben und unten).
 *
 * Ohne Bewegung (Server, reduzierte Bewegung) bleibt sie unverschoben: der statische Zustand.
 * Layoutverschiebungen ohne Scrollen (z. B. zweite Zeile im Öffnungsstatus nach der Hydration)
 * fängt useScrollFrame selbst ab.
 */
export function ParallaxLayer({
  factor,
  className,
  children,
}: {
  factor: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotionAllowed();

  useScrollFrame(({ vh }) => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const r = parent.getBoundingClientRect();
    if (r.bottom < -300 || r.top > vh + 300) return;
    const y = -(r.top + r.height / 2 - vh / 2) * factor;
    el.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
  }, motion);

  // Wird Bewegung abgeschaltet (Systemeinstellung), zurück in den statischen Zustand. Versteckt Next
  // die Seite nur (<Activity>), bleibt die Ebene, wo sie ist.
  useEffect(() => {
    const el = ref.current;
    if (!motion || !el) return;
    return () => {
      if (window.matchMedia(REDUCED).matches) el.style.transform = "";
    };
  }, [motion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
