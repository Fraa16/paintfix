import { cx } from "@/lib/cx";

/**
 * Logo Fahrzeug (README 8.0): Quadrat mit rotem Eck + „PAINTFIX“ in Mona Sans 700, Breite 125 %.
 * `tone="light"` für schwarze Flächen (Footer): Quadrat in --car-on-ink.
 */
export function CarLogo({
  tone = "ink",
  className,
}: {
  tone?: "ink" | "light";
  className?: string;
}) {
  return (
    <span className={cx("flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className={cx(
          "relative block size-[22px]",
          tone === "light" ? "bg-car-on-ink" : "bg-car-ink",
        )}
      >
        <span className="absolute right-0 bottom-0 size-[9px] bg-car-red" />
      </span>
      <span className="text-[17px] font-bold tracking-[0.07em] font-stretch-125%">PAINTFIX</span>
    </span>
  );
}
