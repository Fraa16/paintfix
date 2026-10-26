import { AvOverline } from "@/components/aviation/Overline";
import { aviation, type Locale } from "@/content/aviation";

/**
 * Für wen wir arbeiten (README 8.4 Punkt 2, Referenz Zeilen 612–628): Overline, Titel und Intro
 * nebeneinander, darunter drei Spalten mit Goldlinie oben. Reveals: H2 0ms, Spalten gestaffelt 140ms.
 */
export function Audience({ locale }: { locale: Locale }) {
  const av = aviation[locale];
  return (
    <section className="py-av-section">
      <div className="mx-auto max-w-av px-av-gutter">
        <AvOverline>{av.audLabel}</AvOverline>
        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] items-end gap-x-[clamp(40px,6vw,120px)] gap-y-8">
          <h2
            data-rv="0"
            className="max-w-[16ch] font-cinzel text-av-h2 leading-[1.04] font-normal tracking-[0.02em] text-balance"
          >
            {av.audTitle}
          </h2>
          <p className="max-w-[520px] text-[17px] leading-[1.75] text-pretty text-av-muted">
            {av.audIntro}
          </p>
        </div>
        <ul
          data-rvs="140"
          className="mt-[clamp(64px,8vw,112px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-[clamp(32px,4vw,64px)] gap-y-12"
        >
          {av.aud.map((a) => (
            <li key={a.t} className="border-t border-av-gold-line pt-7">
              <h3 className="font-cinzel text-2xl leading-[1.15] font-normal">{a.t}</h3>
              <p className="mt-4 max-w-[380px] text-base leading-[1.7] text-av-muted">{a.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
