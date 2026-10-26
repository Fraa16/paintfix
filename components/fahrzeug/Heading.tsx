import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * H2 Fahrzeug (Referenz: calc(0.86 * clamp(36px,4.4vw,64px)) = Token --car-fs-h2): Mona Sans 700,
 * Breite 125 %, Zeilenhöhe 1.02, Laufweite -0.015em, 20px unter der Overline. `rv` = Fade-up-Reveal
 * mit dieser Verzögerung in ms (data-rv, README 9.1: gilt für alle H2).
 */
export function CarH2({
  id,
  rv,
  className,
  children,
}: {
  id?: string;
  rv?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      data-rv={rv}
      className={cx(
        "mt-5 text-car-h2 leading-[1.02] font-bold tracking-[-0.015em] text-balance font-stretch-125%",
        className,
      )}
    >
      {children}
    </h2>
  );
}
