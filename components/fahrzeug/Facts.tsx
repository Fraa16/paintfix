import type { ReactNode } from "react";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";

export type FactRow = { label: string; value: ReactNode };

/**
 * Datentabelle im Raster 150px / 1fr mit Linien --car-border (Standort-Tabelle der Startseite,
 * README 8.1 Punkt 7, Referenz Zeilen 245–250). Auch für die rechtlichen Seiten.
 */
export function CarFacts({
  rows,
  className,
}: {
  rows: ReadonlyArray<FactRow>;
  className?: string;
}) {
  return (
    <dl
      className={cx(
        "flex flex-col border-b border-car-border text-[15px] leading-[normal]",
        className,
      )}
    >
      {rows.map((r) => (
        <div
          key={r.label}
          className="grid grid-cols-[150px_1fr] gap-4 border-t border-car-border py-4"
        >
          <dt className="text-car-muted">{r.label}</dt>
          <dd className="min-w-0 break-words">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const link = "transition-colors hover:text-car-red";

/** Telefon und E-Mail als Links, Hover rot. */
export const carContactRows: ReadonlyArray<FactRow> = [
  {
    label: "Telefon",
    value: (
      <a href={site.phoneHref} className={link}>
        {site.phoneDisplay}
      </a>
    ),
  },
  {
    label: "E-Mail",
    value: (
      <a href={`mailto:${site.email}`} className={link}>
        {site.email}
      </a>
    ),
  },
];
