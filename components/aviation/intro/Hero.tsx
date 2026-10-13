import Image from "next/image";
import { AvButton } from "@/components/aviation/Button";
import { AvOverline } from "@/components/aviation/Overline";
import { aviation, type Locale } from "@/content/aviation";
import { altText, media } from "@/content/media";
import { HeroScene } from "./Scenes";

/**
 * Hero Aviation (README 8.4 Punkt 1, Referenz Zeilen 577–604): sticky, 100vh, min. 640px, Navy.
 * Bildfläche ab −30 % oben, Verlauf, unten Overline, H1, Untertitel und ab 980px zwei Buttons. Rechts
 * mittig der vertikale Scroll-Hinweis. Die Abschnitte im Inhaltsblock schieben sich darüber.
 *
 * Bewegung (README 9.7, HeroScene): Bildfläche data-pxy 0.3, Zoom 1.12 → 1 (3.2s, --ease-out),
 * Textblock blendet beim Scrollen aus (data-fade), Reveals: Overline 200, Zeilen-Masken 300 / 430,
 * untere Zeile 650. Die Masken clippen nur vertikal (overflow-y: clip), damit lange Zeilen bei 360px
 * nicht seitlich abgeschnitten werden.
 */
export function Hero({ locale }: { locale: Locale }) {
  const av = aviation[locale];
  return (
    <HeroScene className="sticky top-0 z-1 h-screen min-h-[640px] overflow-hidden bg-av-navy text-av-cream [--focus:var(--av-gold)]">
      <div data-pxy="0.3" className="absolute inset-x-0 top-[-30%] bottom-0 bg-av-navy-deep">
        <div
          data-zoom=""
          className="absolute inset-0 transition-[scale] duration-(--dur-hero-zoom) ease-(--ease-out) motion-safe:[html[data-motion]_&:not([data-in])]:scale-[1.12]"
        >
          <Image
            src={media.avHero.src}
            alt={altText("avHero", locale)}
            fill
            preload
            sizes="(max-aspect-ratio: 39/20) 195vh, 100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--av-navy)_60%,transparent)_0%,transparent_24%,transparent_40%,color-mix(in_srgb,var(--av-navy)_90%,transparent)_100%)]"
      />

      <div
        data-fade=""
        className="pointer-events-none absolute inset-x-0 bottom-0 pb-[132px] wide:pb-[clamp(48px,8vh,104px)]"
      >
        <div className="mx-auto max-w-av px-av-gutter">
          <div data-rv="200">
            <AvOverline tone="navy">{av.heroLabel}</AvOverline>
          </div>
          <h1 className="mt-7 font-cinzel text-av-hero leading-none font-normal tracking-[0.02em]">
            <span className="-mb-[0.1em] block overflow-y-clip pb-[0.1em]">
              <span data-rvm="300" className="block">
                {av.aT1}
              </span>
            </span>
            <span className="-mb-[0.1em] block overflow-y-clip pb-[0.1em]">
              <span data-rvm="430" className="block">
                {av.aT2}
              </span>
            </span>
          </h1>
          <div data-rv="650" className="mt-10 flex flex-wrap items-end justify-between gap-8">
            <p className="max-w-[520px] text-[clamp(15px,1.2vw,17px)] leading-[1.7] text-pretty text-av-on-navy-hero">
              {av.sub}
            </p>
            <div className="pointer-events-auto flex flex-wrap gap-3 max-wide:hidden">
              <AvButton href="#av-contact">{av.cta}</AvButton>
              <AvButton href="#av-services" variant="outlineCream">
                {av.cta2}
              </AvButton>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-av-gutter flex -translate-y-1/2 flex-col items-center gap-4 text-av-gold"
      >
        <span className="text-[10px] tracking-[0.34em] uppercase [writing-mode:vertical-rl]">
          {av.scroll}
        </span>
        <span className="block h-14 w-px bg-current motion-safe:animate-[pf-cue_2.6s_var(--ease-cue)_infinite]" />
      </div>
    </HeroScene>
  );
}
