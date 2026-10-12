import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Overline Fahrzeug (README 8.0): rotes Quadrat 7×7 + Text 12px, 500, 0.18em, Versalien.
 * `tone="onInk"` auf schwarzen Flächen (Text --car-on-ink-muted). `as="h2"`, wenn die Overline selbst
 * die Überschrift eines Abschnitts ist (z. B. „Zusatzleistungen“). `rv` = Fade-up-Reveal mit dieser
 * Verzögerung in ms (data-rv, README 9.1).
 */
export function CarOverline({
  children,
  tone = "default",
  as: Tag = "p",
  id,
  rv,
  className,
}: {
  children: ReactNode;
  tone?: "default" | "onInk";
  as?: "p" | "h2";
  id?: string;
  rv?: number;
  className?: string;
}) {
  return (
    <Tag
      id={id}
      data-rv={rv}
      className={cx(
        "flex items-center gap-3 text-xs leading-[normal] font-medium tracking-[0.18em] uppercase",
        tone === "onInk" ? "text-car-on-ink-muted" : "text-car-muted",
        className,
      )}
    >
      <span aria-hidden="true" className="block size-[7px] flex-none bg-car-red" />
      {children}
    </Tag>
  );
}
