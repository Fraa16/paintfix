import { cx } from "@/lib/cx";

/**
 * „Zum Inhalt springen“: erster Tab-Stopp jeder Seite, nur bei Tastaturfokus sichtbar. Ziel ist das
 * <main id="inhalt"> der Seite (WCAG 2.4.1). Farben je Marke über className.
 */
export function SkipLink({ label, className }: { label: string; className?: string }) {
  return (
    <a
      href="#inhalt"
      className={cx(
        "sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-70 focus:px-5 focus:py-3 focus:text-[14px] focus:font-semibold",
        className,
      )}
    >
      {label}
    </a>
  );
}
