import { INSPECT_PRICE } from "@/content/fahrzeug";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import { eur } from "@/lib/format";
import type { PriceEstimate } from "@/lib/pricing";

/**
 * Zusammenfassung neben dem Formular (README 8.3 Punkt 3, Referenz Zeilen 446–472): schwarze Karte
 * mit Positionen und Richtpreis, darunter die Telefonbox. Ab der Zeile neben dem Formular sticky
 * bei 100px (Header 76px + 24px). `pending`: Klasse, Positionen und Richtpreis unsichtbar, solange
 * die Vorbelegung aus der URL noch nicht gelesen ist (siehe RequestForm).
 */
export function RequestSummary({
  estimate,
  inspect,
  classLabel,
  pending = false,
}: {
  estimate: PriceEstimate;
  /** Gewählte Leistungen mit Preis nach Begutachtung. */
  inspect: string[];
  classLabel: string;
  pending?: boolean;
}) {
  const hide = pending ? "invisible" : undefined;
  const onlyInspect = estimate.lines.length === 0 && inspect.length > 0;
  return (
    <aside
      aria-labelledby="anfrage-auswahl"
      className="sticky top-[100px] max-w-[440px] flex-[1_1_320px]"
    >
      <div className="bg-car-ink p-8 text-car-on-ink">
        <h2
          id="anfrage-auswahl"
          className="text-[12px] font-semibold tracking-[0.16em] text-car-on-ink-muted uppercase"
        >
          Ihre Auswahl <span className={hide}>für {classLabel}</span>
        </h2>
        <ul className="mt-5">
          {estimate.lines.map((line) => (
            <li
              key={line.name}
              className="flex justify-between gap-4 border-b border-car-ink-line py-3.5 text-[15px]"
            >
              <span className={hide}>{line.name}</span>
              <span className={cx("whitespace-nowrap tabular-nums", hide)}>{eur(line.price)}</span>
            </li>
          ))}
          {inspect.map((name) => (
            <li
              key={name}
              className="flex justify-between gap-4 border-b border-car-ink-line py-3.5 text-[15px]"
            >
              <span>{name}</span>
              <span className="whitespace-nowrap text-car-on-ink-muted">{INSPECT_PRICE}</span>
            </li>
          ))}
          {estimate.lines.length === 0 && inspect.length === 0 && (
            <li className="border-b border-car-ink-line py-3.5 text-[15px] text-car-on-ink-muted">
              Noch keine Leistung gewählt.
            </li>
          )}
        </ul>
        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-7 flex items-baseline justify-between gap-4"
        >
          <span className="text-[14px] text-car-on-ink-muted">Richtpreis</span>
          {onlyInspect ? (
            <span className="text-[20px] font-medium">{INSPECT_PRICE}</span>
          ) : (
            <span className="flex items-baseline gap-2">
              <span className="text-[15px] text-car-on-ink-muted">ab</span>
              <span
                className={cx(
                  "text-[48px] leading-none font-medium tracking-[-0.03em] tabular-nums",
                  hide,
                )}
              >
                {eur(estimate.sum)}
              </span>
            </span>
          )}
        </div>
        {inspect.length > 0 && !onlyInspect && (
          <p className="mt-4 text-[13px]">Zuzüglich {inspect.join(" und ")} nach Begutachtung.</p>
        )}
        {estimate.combo && (
          <p className="mt-4 text-[13px]">Kombipreis für außen + innen berücksichtigt.</p>
        )}
        <p className="mt-4 text-[13px] leading-[1.55] text-car-on-ink-muted">
          Endpreis. {site.vatNote} Den Festpreis nennen wir nach kurzer Sichtung, bevor wir
          beginnen.
        </p>
      </div>
      <div className="flex flex-col gap-1.5 border border-t-0 border-car-line bg-car-bg px-8 py-6 text-[14px]">
        <span className="text-car-muted">Lieber telefonieren?</span>
        <a
          href={site.phoneHref}
          className="w-fit text-[18px] font-semibold transition-colors hover:text-car-red"
        >
          {site.phoneDisplay}
        </a>
        <span className="text-car-muted">{site.hoursText}</span>
      </div>
    </aside>
  );
}
