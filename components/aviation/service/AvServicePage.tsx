import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AvButton, AvTextLink } from "@/components/aviation/Button";
import { AvOverline } from "@/components/aviation/Overline";
import { Process } from "@/components/aviation/intro/Process";
import { Contact } from "@/components/aviation/sections/Contact";
import { JsonLd } from "@/components/shared/JsonLd";
import { aviation, type Locale } from "@/content/aviation";
import {
  aviationPageMeta,
  aviationPagePath,
  aviationPath,
  type AvPageId,
  type AvPageMeta,
} from "@/content/aviation-meta";
import {
  aviationPageCopy,
  avPageUi,
  requireAviationPageCopy,
  type AvServicePageCopy,
} from "@/content/aviation-pages";
import { altText, media } from "@/content/media";
import { aviationServiceLd } from "@/lib/structured-data";
import { AvFaqAccordion } from "./AvFaqAccordion";

const h2 = "mt-7 font-cinzel text-av-h2 leading-[1.04] font-normal tracking-[0.02em] text-balance";

/**
 * Route einer Seite je Aviation-Bereich: Metadaten mit hreflang und die Seite. Jede Seite hat einen
 * eigenen Ordner (app/(de)/aviation/{slug}, app/(en)/en/aviation/{slug}), damit unbekannte Pfade
 * ein echtes 404 liefern (ein [slug]-Segment antwortet mit Cache Components beim ersten Aufruf 200).
 */
export function avServiceRoute(id: AvPageId, locale: Locale) {
  const meta = aviationPageMeta.find((p) => p.id === id)!;
  const copy = requireAviationPageCopy(id, locale);
  const de = aviationPagePath(id, "de");
  const metadata: Metadata = {
    title: { absolute: copy.metaTitle },
    description: copy.metaDescription,
    alternates: {
      canonical: aviationPagePath(id, locale),
      languages: { de, en: aviationPagePath(id, "en"), "x-default": de },
    },
  };
  function Page() {
    return <AvServicePage locale={locale} meta={meta} copy={copy} />;
  }
  return { metadata, Page };
}

/**
 * Seite je Aviation-Bereich (/aviation/{slug}, /en/aviation/{slug}; Auftrag 04.11.2026). Bausteine der
 * Aviation-Seite: Seitenkopf auf Navy (der Header bleibt darüber transparent), danach der Inhaltsblock
 * (data-av-content) mit Leistungen des Bereichs, Standards, Ablauf, FAQ, weiteren Bereichen und dem
 * Angebotsformular mit diesem Bereich vorgewählt. Keine Preise (Regel 6), kein Signalrot (Regel 5).
 */
export function AvServicePage({
  locale,
  meta,
  copy,
}: {
  locale: Locale;
  meta: AvPageMeta;
  copy: AvServicePageCopy;
}) {
  const av = aviation[locale];
  const ui = avPageUi[locale];
  const caption = ui.caption[media[copy.media].source];

  return (
    <main id="inhalt" tabIndex={-1} className="focus:outline-none">
      <section
        aria-labelledby="page-title"
        className="bg-av-navy text-av-cream [--focus:var(--av-gold)]"
      >
        <div className="mx-auto grid max-w-av grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-end gap-x-[clamp(40px,6vw,112px)] gap-y-12 px-av-gutter pt-[calc(var(--av-header-h)+clamp(40px,5vw,72px))] pb-[clamp(64px,8vw,112px)]">
          <div>
            <nav aria-label={locale === "de" ? "Brotkrümelnavigation" : "Breadcrumb"}>
              <ol className="flex flex-wrap gap-2.5 text-[12px] tracking-[0.12em] text-av-on-navy uppercase">
                <li className="flex gap-2.5">
                  <Link
                    href={aviationPath[locale]}
                    className="transition-colors hover:text-av-cream"
                  >
                    {ui.home}
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
                <li aria-current="page" className="text-av-cream">
                  {copy.name}
                </li>
              </ol>
            </nav>
            <div data-rv="0" className="mt-[clamp(40px,5vw,64px)]">
              <AvOverline tone="navy">
                {ui.overline} 0{meta.tab + 1} · {av.tabs[meta.tab]}
              </AvOverline>
            </div>
            <h1
              id="page-title"
              className="mt-7 font-cinzel text-av-h2 leading-[1.04] font-normal tracking-[0.02em] text-balance"
            >
              {copy.h1}
            </h1>
            <p className="mt-8 max-w-[520px] text-[17px] leading-[1.7] text-pretty text-av-on-navy-hero">
              {copy.intro}
            </p>
            {/* Unter 980px übernimmt die Aktionsleiste die Anfrage, wie beim Hero der Aviation-Seite. */}
            <div className="mt-10 flex flex-wrap gap-3 max-wide:hidden">
              <AvButton href="#av-contact">{av.cta}</AvButton>
              <AvButton href="#leistungen" variant="outlineCream">
                {ui.toServices}
              </AvButton>
            </div>
          </div>
          <figure className="flex flex-col gap-3">
            <div className="relative aspect-[4/3] overflow-hidden bg-av-navy-deep wide:aspect-[4/5]">
              <Image
                src={media[copy.media].src}
                alt={altText(copy.media, locale)}
                fill
                preload
                sizes="(min-width: 1030px) min(44vw, 600px), 92vw"
                className="object-cover"
              />
            </div>
            {caption && (
              <figcaption className="text-[12px] tracking-[0.04em] text-av-on-navy-muted">
                {caption}
              </figcaption>
            )}
          </figure>
        </div>
      </section>

      <div data-av-content="" className="relative z-2 bg-av-cream">
        <Services locale={locale} meta={meta} copy={copy} />
        <Standards locale={locale} />
        <Process locale={locale} />
        <section aria-labelledby="faq-title" className="py-av-section">
          <div className="mx-auto grid max-w-av grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-x-[clamp(40px,6vw,112px)] gap-y-10 px-av-gutter">
            <div>
              <AvOverline>{ui.faqLabel}</AvOverline>
              <h2 id="faq-title" data-rv="0" className={`${h2} max-w-[14ch]`}>
                {copy.faqTitle}
              </h2>
            </div>
            <AvFaqAccordion entries={copy.faq} />
          </div>
        </section>
        <Related locale={locale} meta={meta} />
        <Contact locale={locale} services={[meta.tab]} />
      </div>
      <JsonLd data={aviationServiceLd(locale, meta, copy)} />
    </main>
  );
}

/** Leistungen des Bereichs (#leistungen), Liste wie in den Tabs der Aviation-Seite. */
function Services({
  locale,
  meta,
  copy,
}: {
  locale: Locale;
  meta: AvPageMeta;
  copy: AvServicePageCopy;
}) {
  const av = aviation[locale];
  return (
    <section
      id="leistungen"
      aria-labelledby="leistungen-title"
      className="bg-av-sand py-av-section"
    >
      <div className="mx-auto grid max-w-av grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-x-[clamp(40px,6vw,112px)] gap-y-12 px-av-gutter">
        <div>
          <AvOverline>{avPageUi[locale].services}</AvOverline>
          <h2 id="leistungen-title" data-rv="0" className={`${h2} max-w-[14ch]`}>
            {copy.servicesTitle}
          </h2>
        </div>
        <div>
          <ul>
            {av.svc[meta.tab].map((x, i) => (
              <li
                key={x.t}
                className="grid grid-cols-[56px_1fr] gap-x-4 gap-y-2 border-t border-av-line-strong py-8"
              >
                <span className="pt-2 font-cinzel text-[12.8px] font-normal text-av-gold-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-cinzel text-[clamp(20.8px,1.92vw,27.2px)] leading-[1.15] font-normal">
                    {x.t}
                  </h3>
                  <p className="mt-3 max-w-[480px] text-base leading-[1.7] text-av-muted">{x.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-av-line-strong pt-7 text-[13px] tracking-[0.04em] text-av-muted">
            {av.svcNote}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Standards der Aviation-Seite, dazu der Weg zum Musterbericht. */
function Standards({ locale }: { locale: Locale }) {
  const av = aviation[locale];
  return (
    <section aria-labelledby="standards-title" className="py-av-section">
      <div className="mx-auto max-w-av px-av-gutter">
        <AvOverline>{av.stdLabel}</AvOverline>
        <h2 id="standards-title" data-rv="0" className={`${h2} max-w-[18ch]`}>
          {av.stdTitle}
        </h2>
        <ul className="mt-[clamp(48px,6vw,80px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-[clamp(24px,3vw,48px)] gap-y-10">
          {av.std.map((s) => (
            <li key={s.t} className="border-t border-av-navy pt-7">
              <h3 className="font-cinzel text-[20.8px] leading-[1.2] font-normal">{s.t}</h3>
              <p className="mt-3.5 text-[15px] leading-[1.7] text-av-muted">{s.d}</p>
            </li>
          ))}
        </ul>
        <AvTextLink href={`${aviationPath[locale]}#av-standards`} className="mt-12">
          {avPageUi[locale].report}
        </AvTextLink>
      </div>
    </section>
  );
}

/** Die anderen Bereiche: eigene Seite, sobald es sie gibt, sonst die Leistungen der Aviation-Seite. */
function Related({ locale, meta }: { locale: Locale; meta: AvPageMeta }) {
  const av = aviation[locale];
  const ui = avPageUi[locale];
  const others = aviationPageMeta.filter((p) => p.id !== meta.id);
  return (
    <section aria-labelledby="related-title" className="bg-av-sand py-av-section">
      <div className="mx-auto max-w-av px-av-gutter">
        <AvOverline>{ui.relatedLabel}</AvOverline>
        <h2 id="related-title" data-rv="0" className={`${h2} max-w-[16ch]`}>
          {ui.relatedTitle}
        </h2>
        <ul className="mt-[clamp(48px,6vw,80px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-[clamp(24px,3vw,48px)] gap-y-10">
          {others.map((p) => {
            const href = aviationPageCopy(p.id, locale)
              ? aviationPagePath(p.id, locale)
              : `${aviationPath[locale]}#av-services`;
            return (
              <li key={p.id} className="flex flex-col border-t border-av-navy pt-7">
                <p className="font-cinzel text-[12.8px] text-av-gold-text">0{p.tab + 1}</p>
                <h3 className="mt-3 font-cinzel text-[clamp(24px,2.4vw,32px)] leading-[1.15] font-normal">
                  {av.tabs[p.tab]}
                </h3>
                <p className="mt-3.5 max-w-[440px] text-[15px] leading-[1.7] text-av-muted">
                  {av.svc[p.tab].map((x) => x.t).join(" · ")}
                </p>
                <AvTextLink href={href} className="mt-6">
                  {ui.more}
                  <span className="sr-only">: {av.tabs[p.tab]}</span>
                </AvTextLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
