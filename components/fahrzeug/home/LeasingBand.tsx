import Link from "next/link";
import { CarButton } from "@/components/fahrzeug/Button";
import { CarOverline } from "@/components/fahrzeug/Overline";
import { leasingBand as t } from "@/content/fahrzeug";

/**
 * Leasingrückgabe (Kundenwunsch 14.10.2026): schwarzes Band über die volle Breite nach den
 * Schwerpunkten. Große Aussage links, Text und Anfrage rechts, darunter drei Schritte. Die Anfrage
 * öffnet das Formular mit „Leasingrückgabe“ vorgewählt.
 * Reveals wie die übrigen Abschnitte: Overline 0, H2 80, Text 160, Schritte gestaffelt 110.
 */
export function LeasingBand() {
  return (
    <section
      aria-labelledby="leasing-title"
      className="bg-car-ink py-car-section leading-[normal] text-car-on-ink [--focus:var(--car-on-ink)]"
    >
      <div className="mx-auto max-w-car px-car-gutter">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-8">
          <div>
            <CarOverline rv={0} tone="onInk" className="leading-[normal]">
              {t.label}
            </CarOverline>
            <h2
              id="leasing-title"
              data-rv="80"
              className="mt-5 max-w-[11ch] text-car-h1 leading-[0.94] font-bold tracking-[-0.0175em] text-balance font-stretch-125%"
            >
              {t.title}
            </h2>
          </div>
          <div data-rv="160" className="flex flex-col items-start gap-8">
            <p className="max-w-[520px] text-[17px] leading-[1.6] text-pretty text-car-on-ink-muted">
              {t.text}
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <CarButton href="/anfrage?leistungen=leasing" variant="light" size="cta" arrow>
                {t.cta}
              </CarButton>
              <Link
                href="/leistungen#svc-leasing"
                className="text-[15px] font-semibold decoration-1 underline-offset-4 hover:underline"
              >
                {t.more}
              </Link>
            </div>
          </div>
        </div>

        <ol
          data-rvs="110"
          className="mt-[clamp(56px,7vw,96px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-8 gap-y-10"
        >
          {t.steps.map((step, i) => (
            <li key={step.t} className="border-t border-car-ink-line pt-7">
              <span className="block text-[clamp(40px,4vw,64px)] leading-none font-light tracking-[-0.04em] text-car-on-ink-muted tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-[20px] font-semibold font-stretch-108%">{step.t}</h3>
              <p className="mt-2.5 max-w-[360px] text-[15px] leading-[1.6] text-car-on-ink-muted">
                {step.d}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
