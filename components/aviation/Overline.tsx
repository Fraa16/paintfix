import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Overline Aviation: Linie 40×1px + Text in Geist Mono 11px, Versalien, Abstand 16px (Redesign 11/2026).
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
        "flex items-center gap-4 font-mono text-[11px] leading-[normal] tracking-[0.08em] uppercase",
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
