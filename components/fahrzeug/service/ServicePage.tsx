import type { Metadata } from "next";
import Link from "next/link";
import { CarButton, CarTextLink } from "@/components/fahrzeug/Button";
import { CarBreadcrumb } from "@/components/fahrzeug/Breadcrumb";
import { CtaBand } from "@/components/fahrzeug/CtaBand";
import { CarFacts } from "@/components/fahrzeug/Facts";
import { CarH2 } from "@/components/fahrzeug/Heading";
import { CarOverline } from "@/components/fahrzeug/Overline";
import { Process } from "@/components/fahrzeug/home/Process";
import { ClassBar } from "@/components/fahrzeug/leistungen/ClassBar";
import { Faq } from "@/components/fahrzeug/leistungen/Faq";
import { PriceClassProvider } from "@/components/fahrzeug/leistungen/PriceClass";
import {
  ServiceEntry,
  serviceEntry,
  type ServiceEntryData,
} from "@/components/fahrzeug/leistungen/Services";
import { JsonLd } from "@/components/shared/JsonLd";
import { INSPECT_PRICE, serviceById, type ServiceId } from "@/content/fahrzeug";
import { focusHref, focusTeaser, type CarServicePage } from "@/content/leistungen";
import { media } from "@/content/media";
import { site } from "@/content/site";
import { eur } from "@/lib/format";
import { carServiceLd } from "@/lib/structured-data";

/** Bildunterschrift für Platzhalterbilder (UWG § 5, KI-Verordnung Art. 50; siehe media.ts). */
function caption(entry: ServiceEntryData): string | undefined {
  const source = media[entry.img].source;
  if (source === "ai") return "Symbolbild, KI-generiert.";
  if (source === "stock") return "Symbolbild.";
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
 * Seite je Schwerpunkt (/leistungen/{slug}, Auftrag 04.11.2026). Nur Bausteine der Fahrzeugseiten:
 * Seitenkopf wie /leistungen, Leistung(en) mit Klassenleiste, Anlässe, Ablauf, FAQ, weitere
 * Schwerpunkte und die CTA mit vorbelegter Anfrage. Texte aus content/leistungen.ts.
 */
export function CarServicePageView({ page }: { page: CarServicePage }) {
  const entries = page.offers.map(serviceEntry);
  const priced = entries.some((e) => e.priced);
  const request = `/anfrage?leistungen=${page.offers.join(",")}`;
  const single = entries.length === 1;

  const offers = (
    <section aria-label="Umfang und Preis" className="bg-car-bg">
      <div className="mx-auto max-w-car px-car-gutter">
        {entries.map((e, i) => (
          <ServiceEntry
            key={e.id}
            entry={e}
            anchor={`svc-${e.id}`}
            title={single ? page.offerTitle : undefined}
            eager={i === 0}
            caption={caption(e)}
          />
        ))}
      </div>
    </section>
  );

  return (
    <main id="inhalt" tabIndex={-1} className="focus:outline-none">
      <Head page={page} entries={entries} request={request} />
      {priced ? (
        <PriceClassProvider className="leading-[normal]">
          <ClassBar />
          {offers}
        </PriceClassProvider>
      ) : (
        offers
      )}
      <Reasons page={page} />
      <Process title={page.steps.title} steps={page.steps.items} />
      <Faq title={page.faq.title} entries={page.faq.items} />
      <Related page={page} />
      <CtaBand href={request} />
      <JsonLd data={carServiceLd(page)} />
    </main>
  );
}

/** Seitenkopf: Brotkrumen, H1 (Reveal 60), Einleitung, Eckdaten und Anfrage. */
function Head({
  page,
  entries,
  request,
}: {
  page: CarServicePage;
  entries: ServiceEntryData[];
  request: string;
}) {
  const dur = page.dur ?? entries[0].dur;
  return (
    <section aria-labelledby="page-title" className="bg-car-surface">
      <div className="mx-auto max-w-car px-car-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(56px,7vw,96px)]">
        <CarBreadcrumb trail={[{ href: "/leistungen", label: "Leistungen" }]} current={page.name} />
        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-x-16 gap-y-10">
          <h1
            id="page-title"
            data-rv="60"
            className="text-car-h1 leading-[0.94] font-bold tracking-[-0.0175em] text-balance font-stretch-125%"
          >
            {page.h1}
          </h1>
          <div className="max-w-[560px]">
            <p className="text-[18px] leading-[1.6] text-pretty text-car-text">{page.intro}</p>
            <CarFacts
              className="mt-8"
              rows={[
                { label: "Dauer", value: dur },
                { label: "Preis", value: priceFact(entries) },
                { label: "Begutachtung", value: "Kostenlos, Festpreis vor Beginn" },
              ]}
            />
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <CarButton href={request} arrow>
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
      </div>
    </section>
  );
}

/** Wann sich die Leistung lohnt, dazu ihre Grenze mit Verweis (Reveals: Overline 0, H2 80). */
function Reasons({ page }: { page: CarServicePage }) {
  return (
    <section aria-labelledby="anlaesse-title" className="bg-car-bg py-car-section leading-[normal]">
      <div className="mx-auto max-w-car px-car-gutter">
        <CarOverline rv={0}>Anlässe</CarOverline>
        <CarH2 id="anlaesse-title" rv={80} className="max-w-[16ch]">
          {page.reasons.title}
        </CarH2>
        <ul className="mt-[clamp(40px,5vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-8 gap-y-10">
          {page.reasons.items.map((r) => (
            <li key={r.t} data-rv="0" className="border-t border-car-ink pt-6">
              <h3 className="text-[20px] font-semibold font-stretch-108%">{r.t}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-car-text">{r.d}</p>
            </li>
          ))}
        </ul>
        {page.limit && (
          <div className="mt-[clamp(40px,5vw,64px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-5 bg-car-surface px-[clamp(24px,3vw,40px)] py-7">
            <p className="max-w-[640px] text-[16px] leading-[1.6] text-pretty text-car-text">
              {page.limit.text}
            </p>
            <CarTextLink href={focusHref(page.limit.link.focus)}>
              {page.limit.link.label}
            </CarTextLink>
          </div>
        )}
      </div>
    </section>
  );
}

/** Weitere Schwerpunkte als Zeilen wie auf der Startseite (ohne Hover-Bild). */
function Related({ page }: { page: CarServicePage }) {
  const items = page.related.map(focusTeaser);
  return (
    <section
      aria-labelledby="weitere-title"
      className="border-t border-car-line-ui bg-car-bg py-car-section leading-[normal]"
    >
      <div className="mx-auto max-w-car px-car-gutter">
        <CarOverline rv={0}>Weitere Schwerpunkte</CarOverline>
        <CarH2 id="weitere-title" rv={80} className="max-w-[16ch]">
          Was oft dazu passt.
        </CarH2>
        <ul className="mt-[clamp(40px,5vw,64px)] border-t border-car-ink">
          {items.map((f) => (
            <li key={f.id}>
              <Link
                href={f.href}
                className="group flex flex-wrap items-baseline gap-x-8 gap-y-2 border-b border-car-line py-[clamp(20px,2.4vw,32px)]"
              >
                <span className="flex-[1_1_320px] text-[clamp(28px,3vw,40px)] leading-none font-bold tracking-[-0.0175em] font-stretch-125% transition-colors group-hover:text-car-red">
                  {f.name}
                </span>
                <span className="flex-[1_1_260px] text-[15px] leading-[1.5] text-car-text">
                  {f.short}
                </span>
                <span className="flex flex-[0_0_170px] justify-end text-[15px] whitespace-nowrap text-car-muted">
                  {f.price}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
