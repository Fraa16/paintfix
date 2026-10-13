import Image from "next/image";
import { aviation, type Locale } from "@/content/aviation";
import { altText, media } from "@/content/media";
import { ParallaxScene } from "./Scenes";

/** Anführungszeichen je Sprache: DE „…“ wie in der Referenz, EN “…”. */
const QUOTES: Record<Locale, [string, string]> = { de: ["„", "“"], en: ["“", "”"] };

/**
 * Kabinen-Zitat (README 8.4 Punkt 5, Referenz Zeilen 728–735): Höhe clamp(480px,80vh,860px),
 * Kabinenbild auf einer um 20 % überstehenden Fläche mit Parallaxe data-px 0.2 (ParallaxScene),
 * Zitat in Cinzel.
 */
export function CabinQuote({ locale }: { locale: Locale }) {
  const av = aviation[locale];
  const [open, close] = QUOTES[locale];
  return (
    <ParallaxScene className="relative h-[clamp(480px,80vh,860px)] overflow-hidden bg-av-navy text-av-cream">
      <div
        data-px="0.2"
        className="absolute inset-x-0 -top-[20%] -bottom-[20%] bg-[radial-gradient(70%_70%_at_50%_45%,var(--av-quote-glow)_0%,var(--av-quote-glow-mid)_55%,var(--av-navy-deep)_100%)]"
      >
        <Image
          src={media.avCabinQuiet.src}
          alt={altText("avCabinQuiet", locale)}
          fill
          sizes="(max-aspect-ratio: 3/2) 150vh, 100vw"
          className="object-cover"
        />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-av-navy/35" />
      <div className="absolute inset-0 flex items-center justify-center px-[clamp(20px,6vw,96px)]">
        <blockquote className="max-w-[20ch] text-center font-cinzel text-[clamp(27.2px,3.52vw,57.6px)] leading-[1.12] font-normal text-balance">
          <p>
            {open}
            {av.quote}
            {close}
          </p>
        </blockquote>
      </div>
    </ParallaxScene>
  );
}
