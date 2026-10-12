import { AvOverline } from "@/components/aviation/Overline";
import { aviation, type Locale } from "@/content/aviation";
import { DocsForm } from "./DocsForm";
import { TermsCta } from "./TermsCta";

const cellX = "px-[clamp(20px,2vw,36px)]";

/**
 * Zusammenarbeit (README 8.4 Punkt 9, Referenz Zeilen 885–974): ab 980px Vergleichstabelle
 * (Spalten minmax(150px,.7fr) + 3 × 1fr), darunter Karten. Danach das Lieferanten-Onboarding (Navy).
 */
export function Terms({ locale }: { locale: Locale }) {
  const t = aviation[locale];
  const models = t.models;

  return (
    <section id="av-terms" aria-labelledby="av-terms-title" className="bg-av-cream pt-av-section">
      <div className="mx-auto max-w-av px-av-gutter">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] items-end gap-x-[clamp(40px,6vw,120px)] gap-y-7">
          <div>
            <AvOverline>{t.termsLabel}</AvOverline>
            <h2
              id="av-terms-title"
              className="mt-7 max-w-[14ch] font-cinzel text-av-h2 leading-[1.04] font-normal tracking-[0.02em] text-balance"
            >
              {t.termsTitle}
            </h2>
          </div>
          <p className="max-w-[480px] text-[16px] leading-[1.7] text-pretty text-av-muted">
            {t.termsIntro}
          </p>
        </div>

        {/* Ab 980px: Vergleichstabelle */}
        <table className="mt-[clamp(64px,7vw,104px)] hidden w-full table-fixed border-separate border-spacing-0 border-t border-av-navy wide:table">
          <colgroup>
            {/* minmax(150px, .7fr) + 3 × 1fr: ab 980px ist .7fr immer breiter als 150px */}
            <col className="w-[18.92%]" />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <td />
              {models.map((m, i) => (
                <th
                  key={m.n}
                  id={`av-model-${i}`}
                  scope="col"
                  className={`border-l border-av-line pt-8 pb-9 text-left align-top [font-weight:inherit] ${cellX}`}
                >
                  <span className="block font-cinzel text-[17.6px] font-normal text-av-gold-text">
                    {m.n}
                  </span>
                  <span className="mt-5 block font-cinzel text-[clamp(20.8px,1.76vw,27.2px)] leading-[1.1] font-normal">
                    {m.t}
                  </span>
                  <span className="mt-3.5 block max-w-[300px] text-[14px] leading-[1.6] text-av-muted">
                    {m.d}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r) => (
              <tr key={r.k}>
                <th
                  scope="row"
                  className="border-t border-av-line py-5 pr-4 text-left align-top text-[10px] [font-weight:inherit] tracking-[0.26em] text-av-muted uppercase"
                >
                  {r.k}
                </th>
                {r.v.map((v, i) => (
                  <td
                    key={i}
                    className={`border-t border-l border-av-line py-5 align-top text-[15px] leading-[1.5] ${cellX}`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="border-t border-av-navy" />
              {models.map((m, i) => (
                <td
                  key={m.n}
                  className={`border-t border-l border-av-navy border-l-av-line py-6 align-middle ${cellX}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-cinzel text-[12.8px] font-normal">{t.termsPrice}</span>
                    <TermsCta index={i} label={t.termsCta} modelTitle={m.t} variant="link" />
                  </div>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>

        {/* Unter 980px: Karten */}
        <ul className="mt-12 flex flex-col gap-5 wide:hidden">
          {models.map((m, i) => (
            <li key={m.n} className="border border-av-navy/12 bg-av-paper px-[22px] py-7">
              <h3 className="flex items-baseline gap-3.5 font-cinzel font-normal">
                <span className="text-[14.4px] text-av-gold-text">{m.n}</span>
                <span className="text-[22.4px] leading-[1.1]">{m.t}</span>
              </h3>
              <p className="mt-3 text-[14px] leading-[1.6] text-av-muted">{m.d}</p>
              <dl className="mt-4">
                {t.rows.map((r) => (
                  <div
                    key={r.k}
                    className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 border-t border-av-navy/12 py-3"
                  >
                    <dt className="pt-[3px] text-[10px] tracking-[0.2em] text-av-muted uppercase">
                      {r.k}
                    </dt>
                    <dd className="text-[14px] leading-[1.5]">{r.v[i]}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-1 flex items-center justify-between gap-3 border-t border-av-navy pt-4">
                <span className="font-cinzel text-[12px] font-normal">{t.termsPrice}</span>
                <TermsCta index={i} label={t.termsCta} modelTitle={m.t} variant="button" />
              </div>
            </li>
          ))}
        </ul>

        {/* Lieferanten-Onboarding */}
        <div className="mt-[clamp(80px,10vw,144px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] bg-av-navy text-av-cream [--focus:var(--av-gold)]">
          <div className="p-[clamp(32px,5vw,72px)]">
            <AvOverline tone="navy">{t.docsLabel}</AvOverline>
            <h3 className="mt-6 max-w-[16ch] font-cinzel text-av-h3-docs leading-[1.08] font-normal">
              {t.docsTitle}
            </h3>
            <p className="mt-5 max-w-[460px] text-[15px] leading-[1.7] text-av-on-navy">
              {t.docsIntro}
            </p>
            <ul className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-x-8">
              {t.docs.map((d) => (
                <li
                  key={d.t}
                  className="grid grid-cols-[30px_minmax(0,1fr)] gap-2.5 border-t border-av-line-on-navy py-4"
                >
                  <span
                    aria-hidden="true"
                    className="pt-[3px] font-cinzel text-[10.4px] font-normal text-av-gold"
                  >
                    —
                  </span>
                  <div>
                    <p className="text-[15px] font-medium">{d.t}</p>
                    <p className="mt-1 text-[13px] leading-[1.5] text-av-on-navy-muted">{d.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center border-l border-av-line-on-navy bg-av-navy-deep p-[clamp(32px,5vw,72px)]">
            <DocCover locale={locale} />
            <DocsForm locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Gestapeltes Dokument-Cover (dekorativ): zwei Blätter dahinter, vorne Creme mit Schatten Dokument. */
function DocCover({ locale }: { locale: Locale }) {
  const t = aviation[locale];
  return (
    <div aria-hidden="true" className="relative mx-auto mt-3 mb-11 aspect-[3/4] w-[min(200px,56%)]">
      <div className="absolute inset-0 [transform:translate(18px,-14px)_rotate(5deg)] bg-av-gold opacity-30" />
      <div className="absolute inset-0 [transform:translate(9px,-7px)_rotate(2.5deg)] bg-av-doc-back" />
      <div className="absolute inset-0 flex flex-col justify-between bg-av-cream p-5 text-av-navy shadow-(--shadow-doc)">
        <p className="font-cinzel text-[8px] font-normal tracking-[0.335em]">
          PAINTFIX <span className="font-sans text-[7px] tracking-[0.34em]">AVIATION</span>
        </p>
        <div>
          <p className="font-cinzel text-[16.8px] leading-[1.1] font-normal">{t.docsCover}</p>
          <p className="mt-2.5 text-[8px] tracking-[0.24em] text-av-muted uppercase">
            {t.docsCoverMeta}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="block h-px bg-av-navy/25" />
          <span className="block h-px w-[70%] bg-av-navy/25" />
          <span className="block h-px w-[40%] bg-av-navy/25" />
        </div>
      </div>
    </div>
  );
}
