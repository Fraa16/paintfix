import Image from "next/image";
import { aviation, rampCoordinates, type Locale } from "@/content/aviation";
import { altText, media } from "@/content/media";

/**
 * Expand (README 8.4 Punkt 3, Referenz Zeilen 630–646) im Endzustand: Vorfeld-Bild auf voller
 * Fläche, Text und Bildzeile sichtbar. Die Scrollszene (250vh, wachsender Rahmen) folgt in Phase 4.
 */
export function Expand({ locale }: { locale: Locale }) {
  const av = aviation[locale];
  return (
    <section className="relative h-screen overflow-hidden bg-av-cream">
      <div className="absolute inset-0 bg-av-navy-deep">
        <Image
          src={media.avRamp.src}
          alt={altText("avRamp", locale)}
          fill
          sizes="(max-aspect-ratio: 4/5) 80vh, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--av-navy-deep)_72%,transparent)_0%,color-mix(in_srgb,var(--av-navy-deep)_15%,transparent)_42%,transparent_62%,color-mix(in_srgb,var(--av-navy-deep)_55%,transparent)_100%)]"
        />
      </div>
      <div className="absolute inset-x-0 top-[calc(var(--av-header-h)+7vh)] flex flex-col items-center gap-[22px] px-6 text-center text-av-cream">
        <p className="text-[11px] tracking-[0.34em] text-av-gold uppercase">{av.expLabel}</p>
        <p className="font-cinzel text-av-expand leading-[1.04] font-normal tracking-[0.02em]">
          {av.expT1}
          <br />
          {av.expT2}
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-between gap-4 px-av-gutter py-6 text-[10px] tracking-[0.3em] text-av-on-navy-hero uppercase">
        <span>{av.rampCaption}</span>
        <span>{rampCoordinates}</span>
      </div>
    </section>
  );
}
