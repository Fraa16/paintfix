import Image from "next/image";
import { aviation, type Locale } from "@/content/aviation";
import { altText, media } from "@/content/media";
import { ExpandScene } from "./Scenes";

/**
 * Expand (README 8.4 Punkt 3 und 9.7, Referenz Zeilen 630–646): Vorfeld-Bild, Text oben mittig,
 * Bildzeile unten. Statisch (reduzierte Bewegung) 100vh im Endzustand. Mit Bewegung 250vh hoch, das
 * Innere klebt, der Rahmen wächst von inset(20% 26%) auf volle Fläche (ExpandScene).
 */
export function Expand({ locale }: { locale: Locale }) {
  const av = aviation[locale];
  return (
    <ExpandScene className="relative h-screen bg-av-cream motion-safe:[html[data-motion]_&]:h-[250vh]">
      <div className="relative top-0 h-screen overflow-hidden motion-safe:[html[data-motion]_&]:sticky">
        <div data-expand-frame="" className="absolute inset-0 bg-av-navy-deep">
          <div data-expand-img="" className="absolute inset-0">
            <Image
              src={media.avRamp.src}
              alt={altText("avRamp", locale)}
              fill
              sizes="(max-aspect-ratio: 4/5) 80vh, 100vw"
              className="object-cover"
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--av-navy-deep)_72%,transparent)_0%,color-mix(in_srgb,var(--av-navy-deep)_15%,transparent)_42%,transparent_62%,color-mix(in_srgb,var(--av-navy-deep)_55%,transparent)_100%)]"
          />
        </div>
        <div
          data-expand-text=""
          className="absolute inset-x-0 top-[calc(var(--av-header-h)+7vh)] flex flex-col items-center gap-[22px] px-6 text-center text-av-cream"
        >
          <p className="text-[11px] tracking-[0.34em] text-av-gold uppercase">{av.expLabel}</p>
          <p className="font-cinzel text-av-expand leading-[1.04] font-normal tracking-[0.02em]">
            {av.expT1}
            <br />
            {av.expT2}
          </p>
        </div>
        <div
          data-expand-cap=""
          className="absolute inset-x-0 bottom-0 flex flex-wrap justify-between gap-4 px-av-gutter py-6 text-[10px] tracking-[0.3em] text-av-on-navy-hero uppercase"
        >
          {/* Ohne Ort und Uhrzeit: das Foto zeigt nicht EDDG. Mit eigenem Foto wieder Ort und Koordinaten. */}
          <span>{av.rampCaption}</span>
        </div>
      </div>
    </ExpandScene>
  );
}
