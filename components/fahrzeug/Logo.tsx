import { BrandLogo } from "@/components/shared/BrandLogo";

/**
 * Logo Fahrzeug: einheitliches PaintFix-Logo mit Bereich „Automotive“ (components/shared/BrandLogo).
 * Farbe über currentColor: schwarz im Header, hell im schwarzen Footer.
 */
export function CarLogo({ className }: { className?: string }) {
  return <BrandLogo division="automotive" className={className} />;
}
