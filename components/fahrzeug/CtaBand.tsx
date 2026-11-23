import { CarButton } from "@/components/fahrzeug/Button";
import { Mono, SectionRule } from "@/components/fahrzeug/design/ui";
import { site } from "@/content/site";

/**
 * CTA Fahrzeug (README 8.5), auf der Leistungsseite und den Seiten je Leistung. Schwarze Fläche über
 * die volle Breite, direkt darunter der Footer. `href` belegt die Anfrage mit der Leistung vor.
 * H2 als große Typografie über die Breite, Daten in Mono.
 */
export function CtaBand({ href = "/anfrage" }: { href?: string }) {
  return (
    <div className="bg-car-ink text-car-on-ink [--focus:var(--car-on-ink)]">
      <section
        aria-labelledby="cta-title"
        className="mx-auto max-w-car px-car-gutter py-[clamp(88px,11vw,176px)]"
      >
        <SectionRule label="Termin anfragen" />
        <div className="@container">
          <h2
            id="cta-title"
            data-rv="0"
            className="mt-[clamp(32px,5vw,72px)] max-w-[15ch] text-[clamp(40px,9cqi,140px)] leading-[0.9] font-semibold tracking-[-0.045em] text-balance"
          >
            Sagen Sie uns, was Ihr Auto braucht.
          </h2>
        </div>
        <div className="mt-[clamp(40px,5vw,72px)] flex flex-wrap items-end justify-between gap-10 border-t border-car-ink-line pt-8">
          <p className="max-w-[480px] text-[17px] leading-[1.6] text-car-on-ink-soft">
            Sie erhalten innerhalb eines Werktags Terminvorschläge und nach einer kostenlosen
            Begutachtung einen Festpreis.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 leading-[normal]">
            <CarButton href={href} variant="light" size="cta" arrow>
              Termin anfragen
            </CarButton>
            <p className="flex flex-col gap-1.5">
              <Mono className="text-car-on-ink-muted">Oder anrufen</Mono>
              <a
                href={site.phoneHref}
                className="text-[18px] font-semibold decoration-1 underline-offset-4 hover:underline"
              >
                {site.phoneDisplay}
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
