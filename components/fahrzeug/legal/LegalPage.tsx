import { CarBreadcrumb } from "@/components/fahrzeug/Breadcrumb";
import type { ReactNode } from "react";
import { CarOverline } from "@/components/fahrzeug/Overline";
import { CarFacts, carContactRows } from "@/components/fahrzeug/Facts";
import { site } from "@/content/site";

/**
 * Rechtliche Seiten im Fahrzeug-Stil. Kopf wie auf der Leistungsseite (Referenz Zeilen 265–274):
 * Fläche --car-surface, Brotkrumen „Start / Titel“, H1 und Einleitung zweispaltig.
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
      <section className="bg-car-surface">
        <div className="mx-auto max-w-car px-car-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(56px,7vw,96px)]">
          <CarBreadcrumb current={title} />
          <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-x-16 gap-y-7">
            <h1 className="text-car-h1 leading-[0.94] font-bold tracking-[-0.0175em] text-balance font-stretch-125%">
              {title}
            </h1>
            <p className="max-w-[520px] text-lg leading-[1.6] text-pretty text-car-text">{lead}</p>
          </div>
        </div>
      </section>
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
      <CarOverline>{title}</CarOverline>
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
        <CarOverline>Kontakt</CarOverline>
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
