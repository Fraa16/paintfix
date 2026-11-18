import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CarBreadcrumb, type Crumb } from "@/components/fahrzeug/Breadcrumb";
import { focusAreas, INSPECT_PRICE, serviceById, type FocusArea } from "@/content/fahrzeug";
import { focusHref } from "@/content/leistungen";
import { altText, media, type MediaId } from "@/content/media";
import { cx } from "@/lib/cx";
import { eur } from "@/lib/format";

/*
 * KONZEPT „Licht auf Lack“ (Branch claude/concept-redesign): gemeinsame Bausteine der Fahrzeugseiten.
 * Dunkle Bühnen (Hero, Aussagen, Bilder) im Wechsel mit hellen Informationsflächen (Preise, Ablauf,
 * FAQ). Überschriften Mona Sans 600 bei Breite 100, Daten und Abschnittsnummern in Geist Mono.
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

/** Große Abschnitts-H2 (Mona Sans 600, Breite 100). */
export const conceptH2 =
  "text-car-section leading-[0.95] font-semibold tracking-[-0.035em] text-balance";

export type Tone = "ink" | "light";

/** Linie mit Nummer und Name in Mono, Anfang jedes Abschnitts. */
export function SectionRule({
  no,
  label,
  tone = "ink",
  children,
}: {
  no?: string;
  label: string;
  tone?: Tone;
  children?: ReactNode;
}) {
  return (
    <p
      className={cx(
        "flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-4",
        tone === "ink"
          ? "border-car-ink-line text-car-on-ink-muted"
          : "border-car-ink text-car-muted",
      )}
    >
      {no && <Mono>{no}</Mono>}
      <Mono>{label}</Mono>
      {children}
    </p>
  );
}

/** Abschnittskopf: SectionRule über einer großen H2. */
export function SectionHead({
  no,
  label,
  title,
  id,
  tone = "ink",
  className,
}: {
  no?: string;
  label: string;
  title: ReactNode;
  id: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div className={className}>
      <SectionRule no={no} label={label} tone={tone} />
      <h2 id={id} data-rv="0" className={cx(conceptH2, "mt-[clamp(28px,4vw,56px)] max-w-[16ch]")}>
        {title}
      </h2>
    </div>
  );
}

/** Unterstrichener Textlink in Weiß auf Schwarz (oder Schwarz auf Weiß). */
export function LineLink({
  href,
  children,
  tone = "ink",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-block border-b pb-1 text-[15px] font-semibold transition-colors",
        tone === "ink"
          ? "border-car-on-ink/40 hover:border-car-on-ink"
          : "border-car-ink/40 hover:border-car-red hover:text-car-red",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export const TILE_IMAGE: Record<FocusArea["id"], MediaId> = {
  "smart-repair": "carSvcSmartRepair",
  politur: "carSvcPolitur",
  leasing: "carSvcLeasing",
  aussen: "carSvcAussen",
  innen: "carSvcInnen",
  keramik: "carSvcKeramik",
};

/**
 * Bildkachel eines Schwerpunkts auf Schwarz: Nummer und Name, Bild 5:4 mit Lichtstreif beim Hover,
 * Kurztext und Preis in Mono. Der Linkname beginnt mit der Nummer.
 */
export function FocusTile({
  id,
  no,
  size = "lg",
}: {
  id: FocusArea["id"];
  no: string;
  /** lg: zwei Spalten (Startseite), md: drei Spalten (Seiten je Leistung). */
  size?: "lg" | "md";
}) {
  const f = focusAreas.find((x) => x.id === id);
  if (!f) return null;
  const img = TILE_IMAGE[f.id];
  const price = f.price ? `ab ${eur(serviceById(f.price).p[0])}` : `Preis ${INSPECT_PRICE}`;
  return (
    <Link href={focusHref(f.id)} className="group block">
      <span className="flex items-baseline gap-4">
        <Mono className="text-car-on-ink-muted">{no}</Mono>
        <span
          className={cx(
            "leading-none font-semibold tracking-[-0.03em]",
            size === "lg" ? "text-car-tile" : "text-[clamp(24px,2vw,32px)]",
          )}
        >
          {f.name}
        </span>
      </span>
      <span className="relative mt-5 block aspect-[5/4] overflow-hidden bg-car-ba-bg">
        <Image
          src={media[img].src}
          alt={altText(img)}
          fill
          sizes="(min-width: 980px) min(46vw, 660px), 92vw"
          className="object-cover transition-[scale] duration-[1.4s] ease-(--ease-out) group-hover:scale-[1.035] motion-reduce:transition-none"
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
  );
}

/** Ablauf als große Zeilen, die beim Scrollen aufleuchten (Startseite und Seiten je Leistung). */
export function ProcessRows({ steps }: { steps: ReadonlyArray<{ title: string; text: string }> }) {
  return (
    <ol className="mt-[clamp(48px,6vw,96px)] border-t border-car-ink">
      {steps.map((s, i) => (
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
  );
}

/**
 * Seitenkopf der Unterseiten auf Schwarz: Brotkrumen, große H1, rechts eine Spalte (Einleitung,
 * Eckdaten, Anfrage). Mit `image` als Bild über die ganze Breite hinter dem Text.
 */
export function PageStage({
  trail,
  current,
  title,
  aside,
  image,
  caption,
}: {
  trail?: ReadonlyArray<Crumb>;
  current: string;
  title: ReactNode;
  aside: ReactNode;
  image?: MediaId;
  caption?: string;
}) {
  return (
    <section
      aria-labelledby="page-title"
      className="relative overflow-hidden bg-car-ink text-car-on-ink [--focus:var(--car-on-ink)]"
    >
      {image && (
        <>
          <Image
            src={media[image].src}
            alt={altText(image)}
            fill
            preload
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--car-ink)_55%,transparent)_0%,color-mix(in_srgb,var(--car-ink)_45%,transparent)_35%,color-mix(in_srgb,var(--car-ink)_88%,transparent)_62%,var(--car-ink)_85%)]"
          />
        </>
      )}
      <div
        className={cx(
          "relative mx-auto flex max-w-car flex-col justify-end px-car-gutter pt-[clamp(40px,5vw,72px)] pb-[clamp(48px,6vw,88px)]",
          image && "min-h-[min(92svh,960px)]",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CarBreadcrumb tone="onInk" trail={trail} current={current} />
          {caption && <Mono className="text-car-on-ink-muted">{caption}</Mono>}
        </div>
        <div className="@container mt-[clamp(48px,8vw,140px)]">
          <h1
            id="page-title"
            data-rv="60"
            className="max-w-[14ch] text-[clamp(44px,9.4cqi,148px)] leading-[0.9] font-semibold tracking-[-0.045em] text-balance"
          >
            {title}
          </h1>
        </div>
        <div className="mt-[clamp(32px,4vw,56px)] border-t border-car-on-ink/20 pt-7">{aside}</div>
      </div>
    </section>
  );
}
