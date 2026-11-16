import { CarOverline } from "@/components/fahrzeug/Overline";
import { extras } from "@/content/fahrzeug";

/**
 * Zusatzleistungen (README 8.2 Punkt 5, Referenz Zeilen 345–355): Überschrift als Overline
 * (h2, damit der Abschnitt benannt ist) und vier Zeilen Name / Preis.
 */
export function Extras() {
  return (
    <section aria-labelledby="extras-title" className="bg-car-bg pt-[clamp(72px,9vw,128px)]">
      <div className="mx-auto max-w-car px-car-gutter">
        <CarOverline as="h2" id="extras-title">
          Zusatzleistungen
        </CarOverline>
        <ul className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-6">
          {extras.map((x) => (
            <li
              key={x.name}
              className="flex items-baseline justify-between gap-4 border-t border-car-ink py-[22px] text-[16px]"
            >
              <span className="font-medium">{x.name}</span>
              <span className="whitespace-nowrap text-car-text tabular-nums">{x.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
