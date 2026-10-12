import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Overline Aviation (README 8.0): Linie 40×1px + Text 11px, 0.34em, Versalien, Abstand 16px.
 * tone="light" auf Creme/Sand: Linie --av-gold-line, Text --av-muted.
 * tone="navy"  auf Navy:       Linie und Text --av-gold.
 */
export function AvOverline({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "navy";
  className?: string;
}) {
  return (
    <p
      className={cx(
        "flex items-center gap-4 text-[11px] leading-[normal] tracking-[0.34em] uppercase",
        tone === "navy" ? "text-av-gold" : "text-av-muted",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          "block h-px w-10 flex-none",
          tone === "navy" ? "bg-av-gold" : "bg-av-gold-line",
        )}
      />
      {children}
    </p>
  );
}
