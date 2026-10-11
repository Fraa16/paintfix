import type { ReactNode } from "react";
import { Action, type ActionProps } from "@/components/shared/Action";
import { cx } from "@/lib/cx";

/**
 * Buttons Aviation (README 8.0): 11px Versalien, Laufweite 0.24em, eckig.
 *
 * variant  cream        auf Navy: Fläche Creme, Text Navy, Hover Weiß (Primär)
 *          outlineCream auf Navy: 1px rgba(244,239,230,.45), Hover Rahmen Creme (Sekundär)
 *          navy         auf hell: Fläche Navy, Text Creme, Hover --av-navy-button-hover
 *          outlineNavy  auf hell: 1px Navy, transparent
 *          header       44px, 1px currentColor, transparent, Hover Deckkraft 0.7
 * size     md 56px · 0 30px (Standard) · sm 44px · 0 20px · lg 58px · 0 36px (Formular senden)
 */
type Variant = "cream" | "outlineCream" | "navy" | "outlineNavy" | "header";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  cream: "bg-av-cream text-av-navy hover:bg-white",
  outlineCream: "border border-av-cream/45 text-av-cream hover:border-av-cream",
  navy: "bg-av-navy text-av-cream hover:bg-av-navy-button-hover",
  outlineNavy: "border border-av-navy text-av-navy",
  header: "border border-current bg-transparent tracking-[0.22em] hover:opacity-70",
};

const sizes: Record<Size, string> = {
  sm: "h-11 px-5",
  md: "h-14 px-[30px]",
  lg: "h-[58px] px-9 tracking-[0.26em]",
};

export type AvButtonProps = ActionProps & { variant?: Variant; size?: Size; children: ReactNode };

export function AvButton({ variant = "cream", size, className, children, ...rest }: AvButtonProps) {
  const resolved = size ?? (variant === "header" ? "sm" : "md");
  return (
    <Action
      {...(rest as ActionProps)}
      className={cx(
        "inline-flex items-center justify-center text-[11px] tracking-[0.24em] whitespace-nowrap uppercase transition-[background-color,border-color,opacity]",
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
        "inline-flex w-fit items-center gap-3 py-1.5 text-[11px] tracking-[0.24em] uppercase transition-colors hover:text-av-gold-text",
        className,
      )}
    >
      {children}
      <span aria-hidden="true" className="block h-px w-7 bg-current" />
    </Action>
  );
}
