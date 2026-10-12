import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Link „Paintfix Aviation ↗“ auf Fahrzeugseiten. Neben dem Aviation-Band und dem Curtain die einzige
 * Stelle, an der Navy und Cinzel auf Fahrzeugseiten erscheinen dürfen (CLAUDE.md Regel 5).
 *
 * tone   navy  auf Weiß: Text --av-navy, Hover rot (Header, Anfrage, 404, Menü)
 *        onInk im schwarzen Footer: Text --car-footer-av-link, Hover Weiß
 * size   sm 12.8px (Header, Footer, Anfrage) · md 16px (Menü, 404)
 */
export function CarAviationLink({
  tone = "navy",
  size = "sm",
  label = "Paintfix Aviation",
  prefix,
  arrowClassName,
  className,
  onClick,
}: {
  tone?: "navy" | "onInk";
  size?: "sm" | "md";
  label?: string;
  /** Text in Mona Sans vor dem Cinzel-Teil, z. B. „Anfrage für ein Flugzeug?“ */
  prefix?: ReactNode;
  arrowClassName?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/aviation"
      onClick={onClick}
      className={cx(
        "flex w-fit items-baseline gap-2 leading-[normal] transition-colors",
        tone === "navy"
          ? "text-av-navy hover:text-car-red"
          : "text-car-footer-av-link hover:text-car-bg",
        className,
      )}
    >
      {prefix}
      <span
        className={cx("font-cinzel font-normal", size === "md" ? "text-[16px]" : "text-[12.8px]")}
      >
        {label}
      </span>
      <span aria-hidden="true" className={arrowClassName}>
        ↗
      </span>
    </Link>
  );
}
