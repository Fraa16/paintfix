import { extras } from "@/content/fahrzeug";

/**
 * Zusatzleistungen (README 8.2 Punkt 5, Referenz Zeilen 345–355): Überschrift als Overline
 * (h2, damit der Abschnitt benannt ist) und vier Zeilen Name / Preis.
 */
export function Extras() {
  return (
    <section aria-labelledby="extras-title" className="bg-car-bg pt-[clamp(72px,9vw,128px)]">
      <div className="mx-auto max-w-car px-car-gutter">
        <h2
          id="extras-title"
          className="border-t border-car-ink pt-4 font-mono text-[11px] tracking-[0.06em] text-car-muted uppercase"
        >
          Zusatzleistungen
        </h2>
        <ul className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-6">
          {extras.map((x) => (
            <li
              key={x.name}
              className="flex items-baseline justify-between gap-4 border-b border-car-line py-[22px] text-[17px]"
            >
              <span className="font-semibold tracking-[-0.01em]">{x.name}</span>
              <span className="font-mono text-[11px] tracking-[0.06em] whitespace-nowrap text-car-text uppercase">
                {x.price}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
