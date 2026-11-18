import type { Metadata } from "next";
import { CarButton } from "@/components/fahrzeug/Button";
import { CtaBand } from "@/components/fahrzeug/CtaBand";
import {
  FocusTile,
  LineLink,
  Mono,
  PageStage,
  ProcessRows,
  SectionHead,
} from "@/components/fahrzeug/concept/ui";
import { ClassBar } from "@/components/fahrzeug/leistungen/ClassBar";
import { ComboBand } from "@/components/fahrzeug/leistungen/ComboBand";
import { Extras } from "@/components/fahrzeug/leistungen/Extras";
import { Faq } from "@/components/fahrzeug/leistungen/Faq";
import { PriceClassProvider } from "@/components/fahrzeug/leistungen/PriceClass";
import {
  ServiceEntry,
  serviceEntry,
  type ServiceEntryData,
} from "@/components/fahrzeug/leistungen/Services";
import { JsonLd } from "@/components/shared/JsonLd";
import { INSPECT_PRICE, serviceById, type ServiceId } from "@/content/fahrzeug";
import { focusHref, type CarServicePage } from "@/content/leistungen";
import { media, type MediaId } from "@/content/media";
import { site } from "@/content/site";
import { eur } from "@/lib/format";
import { carServiceLd } from "@/lib/structured-data";

/** Bildunterschrift für Platzhalterbilder (UWG § 5, KI-Verordnung Art. 50; siehe media.ts). */
function captionFor(img: MediaId): string | undefined {
  const source = media[img].source;
  if (source === "ai") return "Symbolbild, KI-generiert";
  if (source === "stock") return "Symbolbild";
  return undefined;
}

/** „ab 249 €“ der günstigsten Leistung (Kleinwagen) oder „nach Begutachtung“. */
function priceFact(entries: ServiceEntryData[]): string {
  const priced = entries.filter((e) => e.priced);
  if (priced.length === 0) return `Preis ${INSPECT_PRICE}`;
  const min = Math.min(...priced.map((e) => serviceById(e.id as ServiceId).p[0]));
  return `ab ${eur(min)}, Endpreis`;
}

/** Metadaten einer Seite je Schwerpunkt (Titel, Beschreibung, Canonical). */
export function carServiceMetadata(page: CarServicePage): Metadata {
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/leistungen/${page.slug}` },
  };
}

/**
 * Seite je Schwerpunkt (/leistungen/{slug}, Auftrag 04.11.2026). Texte aus content/leistungen.ts.
 * KONZEPT „Licht auf Lack“: Seitenkopf mit Bild über die ganze Breite und großer H1, Leistung(en)
 * als editoriale Zeilen mit Klassenleiste, Anlässe auf Schwarz, Ablauf als große Zeilen, FAQ,
 * weitere Schwerpunkte als Bildkacheln und die CTA mit vorbelegter Anfrage.
 */
export function CarServicePageView({ page }: { page: CarServicePage }) {
  const entries = page.offers.map(serviceEntry);
  const priced = entries.some((e) => e.priced);
  const request = `/anfrage?leistungen=${page.offers.join(",")}`;
  const single = entries.length === 1;

  const offers = (
    <section aria-label="Umfang und Preis" className="bg-car-bg">
      <div className="mx-auto max-w-car px-car-gutter pb-[clamp(48px,6vw,96px)]">
        {entries.map((e, i) => (
          <ServiceEntry
            key={e.id}
            entry={e}
            anchor={`svc-${e.id}`}
            title={single ? page.offerTitle : undefined}
            eager={i === 0}
            caption={captionFor(e.img)}
            flip={i % 2 === 1}
          />
        ))}
      </div>
    </section>
  );

  return (
    <main id="inhalt" tabIndex={-1} className="focus:outline-none">
      <Stage page={page} entries={entries} request={request} />
      {priced ? (
        <PriceClassProvider className="leading-[normal]">
          <ClassBar />
          {offers}
          {page.extras && (
            <>
              <ComboBand />
              <Extras />
            </>
          )}
        </PriceClassProvider>
      ) : (
        offers
      )}
      <Reasons page={page} />
      <section aria-labelledby="ablauf-title" className="bg-car-bg py-car-section">
        <div className="mx-auto max-w-car px-car-gutter">
          <SectionHead tone="light" label="Ablauf" id="ablauf-title" title={page.steps.title} />
          <ProcessRows steps={page.steps.items} />
        </div>
      </section>
      <Faq title={page.faq.title} entries={page.faq.items} />
      <Related page={page} />
      <CtaBand href={request} />
      <JsonLd data={carServiceLd(page)} />
    </main>
  );
}

/** Seitenkopf: Bild der Leistung über die ganze Breite, H1, Einleitung, Eckdaten in Mono, Anfrage. */
function Stage({
  page,
  entries,
  request,
}: {
  page: CarServicePage;
  entries: ServiceEntryData[];
  request: string;
}) {
  const facts: Array<[string, string]> = [
    ["Dauer", page.dur ?? entries[0].dur],
    ["Preis", priceFact(entries)],
    ["Begutachtung", "Kostenlos, Festpreis vor Beginn"],
  ];
  return (
    <PageStage
      trail={[{ href: "/leistungen", label: "Leistungen" }]}
      current={page.name}
      title={page.h1}
      image={page.media}
      caption={captionFor(page.media)}
      aside={
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-end gap-x-[clamp(40px,6vw,120px)] gap-y-10">
          <p className="max-w-[560px] text-[17px] leading-[1.6] text-pretty text-car-on-ink-soft">
            {page.intro}
          </p>
          <div>
            <dl className="border-t border-car-on-ink/20">
              {facts.map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[130px_1fr] gap-4 border-b border-car-on-ink/20 py-3.5"
                >
                  <dt>
                    <Mono className="text-car-on-ink-muted">{k}</Mono>
                  </dt>
                  <dd className="text-[15px] text-car-on-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
              <CarButton href={request} variant="light" size="cta" arrow>
                Termin anfragen
              </CarButton>
              <a
                href={site.phoneHref}
                className="text-[15px] font-semibold decoration-1 underline-offset-4 hover:underline"
              >
                {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      }
    />
  );
}

/** Wann sich die Leistung lohnt, auf Schwarz; dazu ihre Grenze mit Verweis. */
function Reasons({ page }: { page: CarServicePage }) {
  return (
    <section
      aria-labelledby="anlaesse-title"
      className="bg-car-ink py-car-section text-car-on-ink [--focus:var(--car-on-ink)]"
    >
      <div className="mx-auto max-w-car px-car-gutter">
        <SectionHead label="Anlässe" id="anlaesse-title" title={page.reasons.title} />
        <ol className="mt-[clamp(48px,6vw,96px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-8 gap-y-12">
          {page.reasons.items.map((r, i) => (
            <li key={r.t} className="pf-lit border-t border-car-ink-line pt-6">
              <Mono className="text-car-on-ink-muted">{String(i + 1).padStart(2, "0")}</Mono>
              <h3 className="mt-5 text-[clamp(22px,1.9vw,28px)] leading-[1.1] font-semibold tracking-[-0.02em]">
                {r.t}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-car-on-ink-muted">{r.d}</p>
            </li>
          ))}
        </ol>
        {page.limit && (
          <div className="mt-[clamp(56px,7vw,112px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-5 border border-car-ink-line px-[clamp(24px,3vw,40px)] py-7">
            <p className="max-w-[640px] text-[17px] leading-[1.6] text-pretty text-car-on-ink-soft">
              {page.limit.text}
            </p>
            <LineLink href={focusHref(page.limit.link.focus)}>{page.limit.link.label} →</LineLink>
          </div>
        )}
      </div>
    </section>
  );
}

/** Weitere Schwerpunkte als Bildkacheln auf Schwarz. */
function Related({ page }: { page: CarServicePage }) {
  return (
    <section
      aria-labelledby="weitere-title"
      className="border-t border-car-ink-line bg-car-ink py-car-section text-car-on-ink [--focus:var(--car-on-ink)]"
    >
      <div className="mx-auto max-w-car px-car-gutter">
        <SectionHead label="Weitere Schwerpunkte" id="weitere-title" title="Was oft dazu passt." />
        <ul className="mt-[clamp(48px,6vw,96px)] grid gap-x-[clamp(16px,2vw,32px)] gap-y-14 wide:grid-cols-3">
          {page.related.map((id, i) => (
            <li key={id} data-rv={i * 90}>
              <FocusTile id={id} no={String(i + 1).padStart(2, "0")} size="md" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
