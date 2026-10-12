import type { ReactNode } from "react";
import { Action, type ActionProps } from "@/components/shared/Action";
import { cx } from "@/lib/cx";

/**
 * Buttons Aviation (README 8.0): 11px Versalien, eckig. Höhe, Innenabstand und Laufweite kommen aus
 * `size`, Farben aus `variant` (keine Utility doppelt, damit keine CSS-Reihenfolge entscheidet).
 *
 * variant  cream        auf Navy: Fläche Creme, Text Navy, Hover Weiß (Primär)
 *          outlineCream auf Navy: 1px rgba(244,239,230,.45), Hover Rahmen Creme (Sekundär)
 *          ghostCream   auf Navy: 1px rgba(244,239,230,.5), Hover Rahmen Creme (Unterlagen erneut)
 *          navy         auf hell: Fläche Navy, Text Creme, Hover --av-navy-button-hover
 *          outlineNavy  auf hell: 1px Navy, transparent (Neue Anfrage)
 *          header       1px currentColor, transparent, Hover Deckkraft 0.7
 *
 * size     md     56px · 0 30px · 0.24em (Standard)
 *          lg     58px · 0 36px · 0.26em (Formular senden)
 *          sm     44px · 0 20px · 0.22em (Header)
 *          compact 44px · 0 18px · 0.22em (Vertragsmodell anfragen, mobil)
 *          docs   48px · 0 24px · 0.22em (Unterlagen erneut)
 *          again  52px · 0 28px · 0.24em (Neue Anfrage)
 */
type Variant = "cream" | "outlineCream" | "ghostCream" | "navy" | "outlineNavy" | "header";
type Size = "sm" | "md" | "lg" | "compact" | "docs" | "again";

const variants: Record<Variant, string> = {
  cream: "bg-av-cream text-av-navy hover:bg-av-white",
  outlineCream: "border border-av-cream/45 text-av-cream hover:border-av-cream",
  ghostCream: "border border-av-cream/50 text-av-cream hover:border-av-cream",
  navy: "bg-av-navy text-av-cream hover:bg-av-navy-button-hover",
  outlineNavy: "border border-av-navy text-av-navy",
  header: "border border-current bg-transparent hover:opacity-70",
};

const sizes: Record<Size, string> = {
  sm: "h-11 px-5 tracking-[0.22em]",
  md: "h-14 px-[30px] tracking-[0.24em]",
  lg: "h-[58px] px-9 tracking-[0.26em]",
  compact: "h-11 px-[18px] tracking-[0.22em]",
  docs: "h-12 px-6 tracking-[0.22em]",
  again: "h-[52px] px-7 tracking-[0.24em]",
};

export type AvButtonProps = ActionProps & { variant?: Variant; size?: Size; children: ReactNode };

export function AvButton({ variant = "cream", size, className, children, ...rest }: AvButtonProps) {
  const resolved = size ?? (variant === "header" ? "sm" : "md");
  return (
    <Action
      {...(rest as ActionProps)}
      className={cx(
        "inline-flex items-center justify-center text-[11px] leading-[normal] whitespace-nowrap uppercase transition-[background-color,border-color,opacity]",
        sizes[resolved],
        variants[variant],
        className,
      )}
    >
      {children}
    </Action>
  );
}

/** Textlink Aviation: 11px Versalien, 0.24em + Linie 28×1px, Hover --av-gold-text. */
export function AvTextLink({
  className,
  children,
  ...rest
}: ActionProps & { children: ReactNode }) {
  return (
    <Action
      {...(rest as ActionProps)}
      className={cx(
        "inline-flex w-fit items-center gap-3 py-1.5 text-[11px] leading-[normal] tracking-[0.24em] uppercase transition-colors hover:text-av-gold-text",
        className,
      )}
    >
      {children}
      <span aria-hidden="true" className="block h-px w-7 bg-current" />
    </Action>
  );
}
