import Link from "next/link";

/**
 * Aviation-Band (README 8.1 Punkt 6, Referenz Zeilen 225–237): ganze Breite als Link zu /aviation,
 * Navy mit Hover --av-navy-hover (0.5s). Einzige Stelle der Fahrzeugseiten mit Navy und Cinzel
 * (CLAUDE.md, Regel 5). Der Curtain-Übergang kommt in Phase 4.
 */
export function AviationBand() {
  return (
    <section className="bg-av-navy leading-[normal] text-av-cream">
      <Link
        href="/aviation"
        className="block w-full transition-colors duration-500 ease-[ease] [--focus:var(--av-gold)] hover:bg-av-navy-hover focus-visible:-outline-offset-8"
      >
        <span className="mx-auto flex max-w-car flex-wrap items-center justify-between gap-x-14 gap-y-7 px-car-gutter py-[clamp(56px,7vw,104px)]">
          {/* Aviation-Logo in der Größe der Referenz (13.6px statt 14.4px wie im Header). */}
          <span className="flex items-center gap-3.5">
            <span className="font-cinzel text-[13.6px] font-normal tracking-[0.375em]">
              PAINTFIX
            </span>
            <span aria-hidden="true" className="block h-[18px] w-px bg-av-cream/40" />
            <span className="text-[10px] tracking-[0.38em]">AVIATION</span>
          </span>
          <span className="max-w-[640px] flex-[1_1_420px] font-cinzel text-[clamp(16.8px,1.52vw,22.4px)] leading-[1.4] font-normal text-pretty">
            Business Aviation betreuen wir in einem eigenen Bereich, mit eigenem Team und eigener
            Kalkulation.
          </span>
          <span className="inline-flex items-center gap-4 text-[12px] tracking-[0.2em] uppercase">
            Zur Flugzeugaufbereitung
            <span aria-hidden="true" className="block h-px w-11 bg-av-gold" />
          </span>
        </span>
      </Link>
    </section>
  );
}
