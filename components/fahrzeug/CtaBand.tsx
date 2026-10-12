import { CarButton } from "@/components/fahrzeug/Button";
import { site } from "@/content/site";

/**
 * CTA Fahrzeug (README 8.5, Referenz Zeilen 497–510), nur auf Startseite und Leistungsseite.
 * Schwarze Fläche über die volle Breite, die Linie unten nur so breit wie der Inhalt (max. 1360px).
 * Direkt darunter folgt der Footer aus dem Layout.
 */
export function CtaBand() {
  return (
    <div className="bg-car-ink text-car-on-ink [--focus:var(--car-on-ink)]">
      <section
        aria-labelledby="cta-title"
        className="mx-auto flex max-w-car flex-wrap items-end justify-between gap-10 border-b border-car-ink-line px-car-gutter py-[clamp(80px,10vw,144px)]"
      >
        <div>
          <h2
            id="cta-title"
            className="max-w-[15ch] text-car-h2-cta leading-none font-bold tracking-[-0.0175em] text-balance font-stretch-125%"
          >
            Sagen Sie uns, was Ihr Auto braucht.
          </h2>
          <p className="mt-6 max-w-[480px] text-[17px] leading-[1.6] text-car-on-ink-muted">
            Sie erhalten innerhalb eines Werktags einen Festpreis und Terminvorschläge.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-7 leading-[normal]">
          <CarButton href="/anfrage" variant="light" size="cta" arrow>
            Termin anfragen
          </CarButton>
          <p className="flex flex-col gap-1">
            <span className="text-[13px] text-car-input-placeholder">Oder anrufen</span>
            <a
              href={site.phoneHref}
              className="text-[18px] font-semibold decoration-1 underline-offset-4 hover:underline"
            >
              {site.phoneDisplay}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
