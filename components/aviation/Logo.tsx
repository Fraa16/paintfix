import { BrandLogo } from "@/components/shared/BrandLogo";

/**
 * Logo Aviation: einheitliches PaintFix-Logo mit Bereich „Aviation“ und goldenem Eck
 * (components/shared/BrandLogo). Farbe über currentColor: Navy auf Creme, Creme auf Navy.
 */
export function AvLogo({ className }: { className?: string }) {
  return <BrandLogo division="aviation" className={className} />;
}
