import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Overline Fahrzeug (README 8.0): rotes Quadrat 7×7 + Text 12px, 500, 0.18em, Versalien.
 * `tone="onInk"` auf schwarzen Flächen (Text --car-on-ink-muted).
 */
export function CarOverline({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "onInk";
  className?: string;
}) {
  return (
    <p
      className={cx(
        "flex items-center gap-3 text-xs font-medium tracking-[0.18em] uppercase",
        tone === "onInk" ? "text-car-on-ink-muted" : "text-car-muted",
        className,
      )}
    >
      <span aria-hidden="true" className="block size-[7px] flex-none bg-car-red" />
      {children}
    </p>
  );
}
