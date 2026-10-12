import { AvOverline } from "@/components/aviation/Overline";
import { aviation, type Locale } from "@/content/aviation";

/**
 * Ablauf (#av-process, README 8.4 Punkt 6, Referenz Zeilen 736–756) im Endzustand: Goldlinie
 * voll, alle Schritte sichtbar. Die scrollgebundene Linie (9.6) folgt in Phase 4.
 */
export function Process({ locale }: { locale: Locale }) {
  const av = aviation[locale];
  return (
    <section id="av-process" className="bg-av-navy py-av-section text-av-cream">
      <div className="mx-auto max-w-av px-av-gutter">
        <AvOverline tone="navy">{av.procLabel}</AvOverline>
        <h2 className="mt-7 max-w-[18ch] font-cinzel text-av-h2 leading-[1.04] font-normal tracking-[0.02em] text-balance">
          {av.procTitle}
        </h2>
        <div className="relative mt-[clamp(64px,8vw,112px)]">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-av-gold/28" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left bg-av-gold"
          />
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-x-[clamp(24px,3vw,48px)] gap-y-12">
            {av.proc.map((p) => (
              <li key={p.n} className="relative pt-9">
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
    </section>
  );
}
