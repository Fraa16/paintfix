import type { ReactNode } from "react";
import { Action, type ActionProps } from "@/components/shared/Action";
import { cx } from "@/lib/cx";

/**
 * Buttons Fahrzeug (README 8.0). Mit `href` ein Link, sonst ein <button>.
 *
 * variant  primary   Schwarz, weißer Text, Hover --car-ink-hover
 *          secondary 1px Rahmen --car-ink, transparent, Hover --car-surface
 *          light     auf Schwarz: Fläche --car-on-ink, Text --car-ink, Hover Weiß (CTA, Kombi-Band)
 * size     header 44px · md 56px (Standard) · combo 54px · cta 58px · submit 60px volle Breite
 * arrow    hängt „→“ mit 14px Abstand an
 */
type Variant = "primary" | "secondary" | "light";
type Size = "header" | "md" | "combo" | "cta" | "submit";

const variants: Record<Variant, string> = {
  primary: "bg-car-ink text-car-bg hover:bg-car-ink-hover",
  secondary: "border border-car-ink bg-transparent text-car-ink hover:bg-car-surface",
  light: "bg-car-on-ink text-car-ink hover:bg-car-bg",
};

const sizes: Record<Size, string> = {
  header: "h-11 px-5 text-sm",
  md: "h-14 px-7 text-sm",
  combo: "h-[54px] px-[26px] text-sm",
  cta: "h-[58px] px-[30px] text-[15px]",
  submit: "h-[60px] w-full justify-center px-7 text-[15px]",
};

export type CarButtonProps = ActionProps & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
};

export function CarButton({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...rest
}: CarButtonProps) {
  return (
    <Action
      {...(rest as ActionProps)}
      className={cx(
        "inline-flex items-center gap-3.5 font-semibold whitespace-nowrap transition-colors",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
      {arrow && <span aria-hidden="true">→</span>}
    </Action>
  );
}

/**
 * Textlink Fahrzeug: 14px 600 mit 1.5px Unterstreichung (4px Abstand), Hover Text und Linie rot.
 */
export function CarTextLink({
  className,
  children,
  arrow = true,
  ...rest
}: ActionProps & { arrow?: boolean; children: ReactNode }) {
  return (
    <Action
      {...(rest as ActionProps)}
      className={cx(
        "inline-flex w-fit items-center gap-2.5 border-b-[1.5px] border-car-ink pb-1 text-sm font-semibold transition-colors hover:border-car-red hover:text-car-red",
        className,
      )}
    >
      {children}
      {arrow && <span aria-hidden="true">→</span>}
    </Action>
  );
}
