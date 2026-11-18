import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AvLogo } from "@/components/aviation/Logo";
import { CarButton } from "@/components/fahrzeug/Button";
import { STEPS } from "@/components/fahrzeug/home/Process";
import { OpeningStatus } from "@/components/shared/OpeningStatus";
import { focusAreas, INSPECT_PRICE, leasingBand, serviceById } from "@/content/fahrzeug";
import { focusHref } from "@/content/leistungen";
import { altText, media, type MediaId } from "@/content/media";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import { eur } from "@/lib/format";
import { LightSweep } from "./LightSweep";

/*
 * KONZEPT „Licht auf Lack“ (Branch claude/concept-redesign): Startseite Fahrzeug.
 * Dunkel und bildgeführt, große Größenkontraste (Mona Sans 600, Breite 100), Daten in Geist Mono.
 * Wiederkehrendes Motiv: Licht auf schwarzem Lack (Lichtkante im Hero, Text leuchtet beim Scrollen auf).
 * Texte aus content/ und README wie bisher; neu sind nur Etiketten (Vorher/Nachher, Abschnittsnummern).
 */

/** Etikett in Geist Mono: Abschnittsnummern, Daten, Bildhinweise. */
export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx("font-mono text-[11px] leading-[1.4] tracking-[0.06em] uppercase", className)}
    >
      {children}
    </span>
  );
}

const h2 = "text-car-section leading-[0.95] font-semibold tracking-[-0.035em] text-balance";

/** Abschnittskopf: Nummer und Name in Mono über einer großen H2 (kein Overline-Quadrat mehr). */
function SectionHead({
  no,
  label,
  title,
  id,
  tone = "ink",
}: {
  no: string;
  label: string;
  title: ReactNode;
  id: string;
  tone?: "ink" | "light";
}) {
  return (
    <div>
      <p
        className={cx(
          "flex gap-6 border-t pt-4",
          tone === "ink"
            ? "border-car-ink-line text-car-on-ink-muted"
            : "border-car-ink text-car-muted",
        )}
      >
        <Mono>{no}</Mono>
        <Mono>{label}</Mono>
      </p>
      <h2 id={id} data-rv="0" className={cx(h2, "mt-[clamp(28px,4vw,56px)] max-w-[16ch]")}>
        {title}
      </h2>
    </div>
  );
}

/** Hero: Lichtkante über das ganze Bild, H1 unten über die volle Breite. */
export function ConceptHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative h-svh max-h-[1080px] min-h-[640px] overflow-hidden bg-car-ink text-car-on-ink [--focus:var(--car-on-ink)]"
    >
      <LightSweep />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--car-ink)_72%,transparent)_0%,transparent_24%,transparent_42%,color-mix(in_srgb,var(--car-ink)_92%,transparent)_100%)]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-car px-car-gutter pb-[clamp(24px,4.5vh,56px)]">
          <p className="flex flex-wrap justify-between gap-x-6 gap-y-2 text-car-on-ink-muted">
            <Mono>Fahrzeugaufbereitung in Telgte bei Münster</Mono>
            {/* KI-Bildpaar (media.ts): als Symbolbild gekennzeichnet (UWG § 5, KI-VO Art. 50). */}
            <Mono>Symbolbild, KI-generiert</Mono>
          </p>
          <div className="@container mt-5">
            <h1
              id="hero-title"
              className="text-car-display leading-[0.86] font-semibold tracking-[-0.045em]"
            >
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-rvm="80" className="block">
                  Makellos
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-rvm="190" className="block">
                  bis ins Detail.
                </span>
              </span>
            </h1>
          </div>
          <div
            data-rv="360"
            className="mt-[clamp(20px,3vh,36px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t border-car-on-ink/20 pt-6"
          >
            <p className="max-w-[520px] text-[clamp(15px,1.15vw,17px)] leading-[1.6] text-pretty text-car-on-ink-soft">
              Smart Repair, Lackkorrektur, Vorbereitung auf die Leasingrückgabe und hochwertige
              Aufbereitung, in unserer Halle in Telgte. Nach einer kostenlosen Begutachtung kennen
              Sie den Festpreis, bevor wir beginnen.
            </p>
            <div className="pointer-events-auto flex flex-wrap items-center gap-x-8 gap-y-4">
              <CarButton href="/anfrage" variant="light" size="cta" arrow>
                Termin anfragen
              </CarButton>
              <Link
                href="/leistungen"
                className="border-b border-car-on-ink/40 pb-1 text-[15px] font-semibold transition-colors hover:border-car-on-ink"
              >
                Leistungen und Preise
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Haltung: großer Satz, der beim Scrollen Zeile für Zeile aufleuchtet, daneben Eckdaten. */
export function Statement() {
  const lines = [
    "Von der Reparatur kleiner Schäden",
    "bis zur Keramikversiegelung,",
    "alles in einer Halle.",
    "Einzeln oder kombiniert,",
    "mit Festpreis vor Beginn.",
  ];
  const facts: Array<[string, ReactNode]> = [
    ["Halle", `${site.street}, ${site.postalCode} ${site.city}`],
    ["Produkte", "CarPro, von der Vorwäsche bis zur Keramik"],
    ["Begutachtung", "Kostenlos, Festpreis vor Beginn"],
    [
      "Heute",
      <span key="status" className="inline-flex items-center gap-2.5">
        <OpeningStatus />
      </span>,
    ],
  ];
  return (
    <section
      aria-label="Über PaintFix"
      className="bg-car-ink py-car-section text-car-on-ink [--focus:var(--car-on-ink)]"
    >
      <div className="mx-auto grid max-w-car grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-[clamp(40px,6vw,120px)] gap-y-14 px-car-gutter wide:grid-cols-[1fr_minmax(280px,360px)]">
        <p className="text-car-statement leading-[1.08] font-medium tracking-[-0.025em]">
          {lines.map((l) => (
            // Unter 980px fließt der Satz frei, darüber mit den gesetzten Zeilenumbrüchen.
            <span key={l} className="pf-lit wide:block">
              {l}{" "}
            </span>
          ))}
        </p>
        <dl className="self-end border-t border-car-ink-line">
          {facts.map(([k, v]) => (
            <div
              key={k}
              className="grid grid-cols-[110px_1fr] gap-4 border-b border-car-ink-line py-4"
            >
              <dt>
                <Mono className="text-car-on-ink-muted">{k}</Mono>
              </dt>
              <dd className="text-[14px] leading-[1.5] text-car-on-ink-soft">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const TILE_IMAGE: Record<string, MediaId> = {
  "smart-repair": "carSvcSmartRepair",
  politur: "carSvcPolitur",
  leasing: "carSvcLeasing",
  aussen: "carSvcAussen",
};

/**
 * Schwerpunkte (#leistungen) als große Bildkacheln, zweite Spalte versetzt (editorial). Die Kachel
 * ist ein Link auf die Seite der Leistung; ihr Name beginnt mit der Nummer (Test „focus areas link“).
 * Der Versatz ist ein transform am <li> (Reveals sitzen deshalb am inneren Element).
 */
export function FocusTiles() {
  return (
    <section
      id="leistungen"
      aria-labelledby="leistungen-title"
      className="overflow-x-clip bg-car-ink pb-[calc(var(--car-section)+clamp(0px,8vw,140px))] text-car-on-ink [--focus:var(--car-on-ink)]"
    >
      <div className="mx-auto max-w-car px-car-gutter">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-8">
          <SectionHead
            no="01"
            label="Schwerpunkte"
            id="leistungen-title"
            title="Worauf wir uns spezialisiert haben."
          />
          <Link
            href="/leistungen"
            className="justify-self-start border-b border-car-on-ink/40 pb-1 text-[15px] font-semibold transition-colors hover:border-car-on-ink wide:justify-self-end"
          >
            Alle Leistungen und Preise
          </Link>
        </div>
        <ul className="mt-[clamp(48px,6vw,96px)] grid gap-x-[clamp(16px,2vw,32px)] gap-y-[clamp(40px,5vw,72px)] wide:grid-cols-2">
          {focusAreas.map((f, i) => {
            const img = TILE_IMAGE[f.id];
            const price = f.price
              ? `ab ${eur(serviceById(f.price).p[0])}`
              : `Preis ${INSPECT_PRICE}`;
            return (
              <li key={f.id} className="wide:even:translate-y-[clamp(0px,8vw,140px)]">
                <div data-rv={i % 2 ? 120 : 0}>
                  <Link href={focusHref(f.id)} className="group block">
                    <span className="flex items-baseline gap-4">
                      <Mono className="text-car-on-ink-muted">
                        {String(i + 1).padStart(2, "0")}
                      </Mono>
                      <span className="text-car-tile leading-none font-semibold tracking-[-0.03em]">
                        {f.name}
                      </span>
                    </span>
                    <span className="relative mt-5 block aspect-[5/4] overflow-hidden bg-car-ba-bg">
                      <Image
                        src={media[img].src}
                        alt={altText(img)}
                        fill
                        sizes="(min-width: 980px) min(46vw, 660px), 92vw"
                        className="object-cover transition-[scale,filter] duration-[1.4s] ease-(--ease-out) group-hover:scale-[1.035] motion-reduce:transition-none"
                      />
                      {/* Lichtstreif beim Hover: wandert einmal über das Bild (nur mit Bewegung). */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--car-on-ink)_22%,transparent),transparent)] opacity-0 transition-[translate,opacity] duration-[1.2s] ease-(--ease-out) group-hover:translate-x-[420%] group-hover:opacity-100 motion-reduce:hidden"
                      />
                    </span>
                    <span className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-car-ink-line pt-4">
                      <span className="max-w-[420px] text-[15px] leading-[1.5] text-car-on-ink-soft">
                        {f.short}
                      </span>
                      <Mono className="text-car-on-ink">{price}</Mono>
                    </span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-[clamp(40px,5vw,64px)] text-car-on-ink-muted">
          <Mono>Bilder: Symbolbilder, KI-generiert</Mono>
        </p>
      </div>
    </section>
  );
}

/** Ablauf (#ablauf) auf Weiß: vier große Zeilen, die beim Scrollen aufleuchten. */
export function ProcessLines() {
  return (
    <section id="ablauf" aria-labelledby="ablauf-title" className="bg-car-bg py-car-section">
      <div className="mx-auto max-w-car px-car-gutter">
        <SectionHead
          no="02"
          label="Ablauf"
          id="ablauf-title"
          title="So läuft Ihr Termin ab."
          tone="light"
        />
        <ol className="mt-[clamp(48px,6vw,96px)] border-t border-car-ink">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="pf-lit grid grid-cols-[48px_1fr] gap-x-6 gap-y-3 border-b border-car-line py-[clamp(24px,3.2vw,44px)] wide:grid-cols-[120px_minmax(0,1.1fr)_minmax(0,1fr)] wide:items-baseline"
            >
              <Mono className="pt-2 text-car-muted">{String(i + 1).padStart(2, "0")}</Mono>
              <h3 className="text-car-step leading-none font-semibold tracking-[-0.035em]">
                {s.title}
              </h3>
              <p className="col-start-2 max-w-[460px] text-[16px] leading-[1.6] text-car-text wide:col-start-3">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Leasingrückgabe: Bild der Prüflampe über die halbe Breite, daneben Aussage und drei Schritte. */
export function LeasingStatement() {
  const t = leasingBand;
  return (
    <section
      aria-labelledby="leasing-title"
      className="grid bg-car-ink text-car-on-ink [--focus:var(--car-on-ink)] wide:grid-cols-2"
    >
      <div className="relative min-h-[60vw] overflow-hidden wide:min-h-[min(100vh,880px)]">
        <Image
          src={media.carSvcLeasing.src}
          alt={altText("carSvcLeasing")}
          fill
          sizes="(min-width: 980px) 50vw, 100vw"
          className="object-cover"
        />
        <p className="absolute bottom-5 left-car-gutter text-car-on-ink-muted">
          <Mono>Symbolbild, KI-generiert</Mono>
        </p>
      </div>
      <div className="flex flex-col justify-between gap-14 px-car-gutter py-car-section wide:pl-[clamp(40px,5vw,96px)]">
        <div>
          <p className="flex gap-6 border-t border-car-ink-line pt-4 text-car-on-ink-muted">
            <Mono>03</Mono>
            <Mono>{t.label}</Mono>
          </p>
          <h2 id="leasing-title" data-rv="0" className={cx(h2, "mt-[clamp(28px,4vw,56px)]")}>
            {t.title}
          </h2>
          <p className="mt-7 max-w-[480px] text-[17px] leading-[1.6] text-pretty text-car-on-ink-soft">
            {t.text}
          </p>
        </div>
        <div>
          <ol className="border-t border-car-ink-line">
            {t.steps.map((s, i) => (
              <li
                key={s.t}
                className="grid grid-cols-[40px_1fr] gap-x-4 border-b border-car-ink-line py-5"
              >
                <Mono className="pt-1 text-car-on-ink-muted">{String(i + 1).padStart(2, "0")}</Mono>
                <span>
                  <span className="block text-[18px] font-semibold">{s.t}</span>
                  <span className="mt-1.5 block text-[14px] leading-[1.55] text-car-on-ink-muted">
                    {s.d}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <CarButton href="/anfrage?leistungen=leasing" variant="light" size="cta" arrow>
              {t.cta}
            </CarButton>
            <Link
              href={focusHref("leasing")}
              className="border-b border-car-on-ink/40 pb-1 text-[15px] font-semibold transition-colors hover:border-car-on-ink"
            >
              {t.more}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Aviation: Vorfeld bei Nacht über die ganze Breite, als ein Link (Regel 5: Navy und Aviation-Schrift
 * nur hier und im Curtain).
 */
export function AviationTeaser() {
  return (
    <section className="bg-av-navy text-av-cream">
      <Link
        href="/aviation"
        className="group relative block min-h-[min(88vh,820px)] overflow-hidden [--focus:var(--av-gold)] focus-visible:-outline-offset-8"
      >
        <Image
          src={media.avRamp.src}
          alt={altText("avRamp")}
          fill
          sizes="100vw"
          className="object-cover object-[60%_50%] opacity-80 transition-[scale] duration-[1.6s] ease-(--ease-out) group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--av-navy)_80%,transparent)_0%,transparent_45%,color-mix(in_srgb,var(--av-navy)_90%,transparent)_100%)]"
        />
        <span className="relative mx-auto flex min-h-[min(88vh,820px)] max-w-car flex-col justify-between gap-10 px-car-gutter py-[clamp(40px,6vw,88px)]">
          <span className="flex flex-wrap items-center justify-between gap-6">
            <AvLogo />
            <Mono className="text-av-on-navy-muted">04 · Business Aviation</Mono>
          </span>
          <span className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
            <span className="max-w-[22ch] font-cinzel text-[clamp(32px,4.4vw,72px)] leading-[1.04] font-normal tracking-[-0.01em] text-balance">
              Business Aviation betreuen wir in einem eigenen Bereich, mit eigenem Team und eigener
              Kalkulation.
            </span>
            <span className="inline-flex items-center gap-4 text-[12px] tracking-[0.2em] uppercase">
              Zur Flugzeugaufbereitung
              <span
                aria-hidden="true"
                className="block h-px w-11 bg-av-gold transition-[width] duration-500 group-hover:w-20"
              />
            </span>
          </span>
        </span>
      </Link>
    </section>
  );
}

/** Standort und Anfrage (#standort): die Adresse als große Typografie, Daten in Mono. */
export function Visit() {
  const rows: Array<[string, ReactNode]> = [
    ["Öffnungszeiten", site.hoursText],
    [
      "Telefon",
      <a key="tel" href={site.phoneHref} className="hover:text-car-red">
        {site.phoneDisplay}
      </a>,
    ],
    [
      "E-Mail",
      <a key="mail" href={`mailto:${site.email}`} className="hover:text-car-red">
        {site.email}
      </a>,
    ],
    ["Anfahrt", "Zwischen Münster und Warendorf, mit Parkplätzen direkt an der Halle."],
  ];
  return (
    <section id="standort" aria-labelledby="standort-title" className="bg-car-bg py-car-section">
      <div className="mx-auto max-w-car px-car-gutter">
        <p className="flex gap-6 border-t border-car-ink pt-4 text-car-muted">
          <Mono>05</Mono>
          <Mono>Standort</Mono>
          <span className="ml-auto inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.06em] text-car-text uppercase">
            <OpeningStatus />
          </span>
        </p>
        <h2
          id="standort-title"
          data-rv="0"
          className="mt-[clamp(32px,5vw,72px)] text-car-address leading-[0.9] font-semibold tracking-[-0.045em]"
        >
          {site.street}
          <span className="block text-car-muted">
            {site.postalCode} {site.city}
          </span>
        </h2>
        <div className="mt-[clamp(48px,6vw,88px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-12">
          <dl className="border-t border-car-line">
            {rows.map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[130px_1fr] gap-4 border-b border-car-line py-4"
              >
                <dt>
                  <Mono className="text-car-muted">{k}</Mono>
                </dt>
                <dd className="text-[15px] leading-[1.5]">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-3 wide:justify-end">
            <CarButton href="/anfrage" size="cta" arrow>
              Termin anfragen
            </CarButton>
            <CarButton href={site.mapsUrl} size="cta" variant="secondary">
              Route planen
            </CarButton>
          </div>
        </div>
      </div>
    </section>
  );
}
