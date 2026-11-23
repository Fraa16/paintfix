import type { ReactNode } from "react";
import { PageStage, SectionRule } from "@/components/fahrzeug/design/ui";
import { CarFacts, carContactRows } from "@/components/fahrzeug/Facts";
import { site } from "@/content/site";

/**
 * Rechtliche Seiten im Fahrzeug-Stil: Seitenkopf auf Schwarz wie die übrigen Seiten (PageStage),
 * darunter der Inhalt auf Weiß.
 */
export function LegalPage({
  title,
  lead,
  children,
}: {
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <main id="inhalt" tabIndex={-1} className="focus:outline-none">
      <PageStage
        current={title}
        title={title}
        aside={
          <p className="max-w-[520px] text-[17px] leading-[1.6] text-pretty text-car-on-ink-soft">
            {lead}
          </p>
        }
      />
      <section className="bg-car-bg">
        <div className="mx-auto max-w-car px-car-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(64px,8vw,112px)]">
          {children}
        </div>
      </section>
    </main>
  );
}

/** Hinweis auf noch fehlende Inhalte (README 3: Impressum, Datenschutz, AGB fehlen noch). */
export function LegalNote({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="border border-car-line p-[clamp(24px,3vw,40px)]">
      <p className="font-mono text-[11px] tracking-[0.06em] text-car-muted uppercase">{title}</p>
      <div className="mt-5 flex max-w-[560px] flex-col gap-4 text-base leading-[1.6] text-car-text">
        {children}
      </div>
    </aside>
  );
}

/** Zweispaltiges Raster des Seiteninhalts, unter 980px einspaltig. */
export function LegalGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-start gap-x-[clamp(40px,6vw,96px)] gap-y-12">
      {children}
    </div>
  );
}

/** Platzhalter-Hinweis mit Kontaktmöglichkeiten daneben (Datenschutz, AGB). */
export function LegalContact({ title, children }: { title: string; children: ReactNode }) {
  return (
    <LegalGrid>
      <LegalNote title={title}>{children}</LegalNote>
      <div>
        <SectionRule tone="light" label="Kontakt" />
        <CarFacts
          className="mt-8"
          rows={[
            ...carContactRows,
            { label: "Anschrift", value: `${site.street}, ${site.postalCode}\u00A0${site.city}` },
          ]}
        />
      </div>
    </LegalGrid>
  );
}
