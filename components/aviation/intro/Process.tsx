import { AvOverline } from "@/components/aviation/Overline";
import { aviation, type Locale } from "@/content/aviation";
import { ProgressScene } from "./Scenes";

/**
 * Ablauf (#av-process, README 8.4 Punkt 6, Referenz Zeilen 736–756). Statisch im Endzustand: Goldlinie
 * voll, alle Schritte sichtbar. Mit Bewegung (ProgressScene, README 9.6) wächst die Linie mit dem
 * Scrollen, Schritte stehen auf 0.3 bis zu ihrem Abschnitt der Linie (Übergang 0.7s).
 * Reveals: Overline 0ms, H2 80ms.
 */
export function Process({ locale }: { locale: Locale }) {
  const av = aviation[locale];
  return (
    <ProgressScene id="av-process" className="bg-av-navy py-av-section text-av-cream">
      <div className="mx-auto max-w-av px-av-gutter">
        <div data-rv="0">
          <AvOverline tone="navy">{av.procLabel}</AvOverline>
        </div>
        <h2
          data-rv="80"
          className="mt-7 max-w-[18ch] font-cinzel text-av-h2 leading-[1.04] font-normal tracking-[0.02em] text-balance"
        >
          {av.procTitle}
        </h2>
        <div className="relative mt-[clamp(64px,8vw,112px)]">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-av-gold/28" />
          <div
            data-progbar=""
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left bg-av-gold"
          />
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-x-[clamp(24px,3vw,48px)] gap-y-12">
            {av.proc.map((p, i) => (
              <li
                key={p.n}
                data-step={i}
                className="relative pt-9 motion-safe:transition-opacity motion-safe:duration-700 motion-safe:ease-[ease]"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-1 left-0 size-2 rotate-45 bg-av-gold"
                />
                <span className="block font-cinzel text-[44.8px] leading-none font-normal text-av-gold">
                  {p.n}
                </span>
                <h3 className="mt-8 font-cinzel text-[20.8px] leading-[1.2] font-normal">{p.t}</h3>
                <p className="mt-3.5 text-[15px] leading-[1.7] text-av-on-navy">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ProgressScene>
  );
}
