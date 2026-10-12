import { cx } from "@/lib/cx";

/**
 * Logo Aviation (README 8.0): „PAINTFIX“ in Cinzel 14.4px / 0.375em, 1×18px Trennlinie
 * (currentColor, 40 %), „AVIATION“ in Mona Sans 10px / 0.38em, Abstand 14px. Farbe über currentColor.
 * `size="sm"` setzt „PAINTFIX“ in 13.6px wie im Aviation-Band der Startseite (Referenz Zeile 228).
 */
export function AvLogo({ size = "md", className }: { size?: "md" | "sm"; className?: string }) {
  return (
    <span className={cx("flex items-center gap-3.5 leading-[normal]", className)}>
      <span
        className={cx(
          "font-cinzel font-normal tracking-[0.375em]",
          size === "sm" ? "text-[13.6px]" : "text-[14.4px]",
        )}
      >
        PAINTFIX
      </span>
      <span aria-hidden="true" className="block h-[18px] w-px bg-current opacity-40" />
      <span className="text-[10px] tracking-[0.38em]">AVIATION</span>
    </span>
  );
}
