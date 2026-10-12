import Image from "next/image";
import { AvOverline } from "@/components/aviation/Overline";
import { aviation, sampleReport, type Locale } from "@/content/aviation";
import { altText, media, type MediaId } from "@/content/media";

/** Berichtsfotos in der Reihenfolge der Referenz (Zeile 793–796). */
const reportPhotos: MediaId[] = ["avExterior", "avProtection", "avCabin", "avDetail"];

/**
 * Standards (README 8.4 Punkt 7, Referenz Zeilen 757–818): links vier Nachweise, rechts sticky der
 * Arbeitsbericht mit Stempel im Endzustand (README 9.8: scale 1, rotate −8°, ohne Animation).
 */
export function Standards({ locale }: { locale: Locale }) {
  const t = aviation[locale];
  const rep = t.rep;

  return (
    <section
      id="av-standards"
      aria-labelledby="av-standards-title"
      className="overflow-x-clip py-av-section"
    >
      <div className="mx-auto grid max-w-av grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] items-start gap-x-[clamp(40px,6vw,120px)] gap-y-16 px-av-gutter">
        <div>
          <AvOverline>{t.stdLabel}</AvOverline>
          <h2
            id="av-standards-title"
            className="mt-7 max-w-[15ch] font-cinzel text-av-h2 leading-[1.04] font-normal tracking-[0.02em] text-balance"
          >
            {t.stdTitle}
          </h2>
          <ul className="mt-[clamp(48px,6vw,72px)]">
            {t.std.map((d) => (
              <li key={d.t} className="border-t border-av-line-strong py-[26px]">
                <h3 className="font-cinzel text-[19.2px] leading-[1.2] font-normal">{d.t}</h3>
                <p className="mt-2.5 max-w-[500px] text-[15px] leading-[1.7] text-av-muted">
                  {d.d}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <figure className="sticky top-[124px]">
          <div className="relative border border-av-navy/12 bg-av-paper p-[clamp(24px,3vw,40px)] shadow-(--shadow-report)">
            <div className="flex items-start justify-between gap-4 border-b border-av-navy pb-5">
              <div>
                <p className="font-cinzel text-[9.6px] font-normal tracking-[0.335em]">
                  PAINTFIX <span className="font-sans text-[9px] tracking-[0.34em]">AVIATION</span>
                </p>
                <p className="mt-3.5 font-cinzel text-[22.4px] font-normal">{rep.title}</p>
              </div>
              <span className="text-[12px] tracking-[0.08em] text-av-muted tabular-nums">
                {rep.no}
              </span>
            </div>

            <dl className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6">
              {rep.rows.map((r) => (
                <div key={r.k} className="border-b border-av-navy/12 py-3.5">
                  <dt className="text-[10px] tracking-[0.24em] text-av-muted uppercase">{r.k}</dt>
                  <dd className="mt-1.5 text-[15px] font-medium tabular-nums">{r.v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-7 text-[10px] tracking-[0.24em] text-av-muted uppercase">
              {rep.checksLabel}
            </p>
            <ul className="mt-2">
              {rep.checks.map((c) => (
                <li
                  key={c.k}
                  className="flex items-center gap-3.5 border-b border-dotted border-av-navy/25 py-[11px] text-[14px]"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-[18px] flex-none items-center justify-center bg-av-navy text-[10px] leading-none text-av-cream"
                  >
                    ✓
                  </span>
                  <span className="flex-1">{c.k}</span>
                  <span className="text-av-muted tabular-nums">{c.v}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-4 gap-2">
              {reportPhotos.map((id) => (
                <div key={id} className="relative aspect-square bg-av-image-bg">
                  <Image
                    src={media[id].src}
                    alt={altText(id, locale)}
                    fill
                    sizes="(min-width: 1100px) 140px, 22vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-[12px] text-av-muted">{rep.photos}</p>

            <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-t border-av-navy pt-5">
              <div>
                <p className="text-[10px] tracking-[0.24em] text-av-muted uppercase">{rep.sign}</p>
                <p className="mt-1.5 font-cinzel text-[17.6px] font-normal">
                  {sampleReport.signer}
                </p>
              </div>
              <span className="text-[12px] text-av-muted">{rep.notified}</span>
            </div>

            {/* Stempel (README 9.8) im Endzustand. Animation folgt in Phase 4. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-[clamp(14px,2.2vw,30px)] bottom-[clamp(76px,7vw,104px)] flex size-[124px] -rotate-8 items-center justify-center rounded-full border-[1.5px] border-av-stamp text-av-stamp mix-blend-multiply"
            >
              <span className="absolute inset-[7px] rounded-full border-[0.75px] border-av-stamp" />
              <span className="flex flex-col items-center gap-[5px] text-center">
                <span className="text-[7px] tracking-[0.3em]">PAINTFIX AVIATION</span>
                <span className="font-cinzel text-[15.2px] leading-none font-normal">
                  {rep.sign}
                </span>
                <span className="text-[7.5px] tracking-[0.18em] tabular-nums">
                  {sampleReport.date}
                </span>
              </span>
            </div>
          </div>
          <figcaption className="mt-4 text-[13px] text-av-muted">{t.repCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
