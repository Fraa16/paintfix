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
 * Buttons 650; der Untertitel ist sofort sichtbar (LCP, siehe unten). Die Masken clippen nur vertikal (overflow-y: clip), damit lange Zeilen bei 360px
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
            className="object-cover object-[78%_15%]"
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--av-navy)_60%,transparent)_0%,transparent_24%,transparent_40%,color-mix(in_srgb,var(--av-navy)_90%,transparent)_100%)]"
      />
      {/* Schatten hinter dem Text: hält die goldene Overline auch vor hellem Himmel lesbar (Regel 9). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,color-mix(in_srgb,var(--av-navy)_78%,transparent)_0%,color-mix(in_srgb,var(--av-navy)_74%,transparent)_45%,transparent_80%)] wide:bg-[radial-gradient(ellipse_75%_85%_at_0%_100%,color-mix(in_srgb,var(--av-navy)_86%,transparent)_0%,color-mix(in_srgb,var(--av-navy)_70%,transparent)_50%,transparent_100%)]"
      />

      <div
        data-fade=""
        className="pointer-events-none absolute inset-x-0 bottom-0 pb-[132px] wide:pb-[clamp(48px,8vh,104px)]"
      >
        <div className="mx-auto flex max-w-av flex-wrap items-end justify-between gap-x-16 gap-y-10 px-av-gutter">
          <div className="min-w-0 flex-[1_1_560px]">
            <div data-rv="200">
              <AvOverline tone="navy">{av.heroLabel}</AvOverline>
            </div>
            {/* KONZEPT: Instrument Serif statt Cinzel, zweite Zeile kursiv als Akzent. */}
            <h1 className="mt-7 font-cinzel text-av-hero-serif leading-[0.9] font-normal tracking-[-0.02em]">
              <span className="-mb-[0.12em] block overflow-y-clip pb-[0.12em]">
                <span data-rvm="300" className="block">
                  {av.aT1}
                </span>
              </span>
              <span className="-mb-[0.12em] block overflow-y-clip pb-[0.12em]">
                <span data-rvm="430" className="block italic">
                  {av.aT2}
                </span>
              </span>
            </h1>
            {/* Untertitel ohne Reveal (LCP, siehe Kommentar im Verlauf von main). */}
            <p className="mt-8 max-w-[520px] text-[clamp(15px,1.2vw,17px)] leading-[1.7] text-pretty text-av-on-navy-hero">
              {av.sub}
            </p>
            <div
              data-rv="650"
              className="pointer-events-auto mt-9 flex flex-wrap gap-3 max-wide:hidden"
            >
              <AvButton href="#av-contact">{av.cta}</AvButton>
              <AvButton href="#av-services" variant="outlineCream">
                {av.cta2}
              </AvButton>
            </div>
          </div>
          <ReportTicker locale={locale} />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-av-gutter flex -translate-y-1/2 flex-col items-center gap-4 text-av-gold sec:hidden"
      >
        <span className="text-[10px] tracking-[0.34em] uppercase [writing-mode:vertical-rl]">
          {av.scroll}
        </span>
        <span className="block h-14 w-px bg-current motion-safe:animate-[pf-cue_2.6s_var(--ease-cue)_infinite]" />
      </div>
    </HeroScene>
  );
}

/** Beschriftung „Beispiel“ am Bericht im Hero (der Bericht ist ein Muster, aviation-meta.ts). */
const SAMPLE: Record<Locale, string> = { de: "Beispiel", en: "Sample" };

/**
 * KONZEPT „Protokoll“: der Musterbericht als laufendes Protokoll im Hero (ab 980px). Die Punkte der
 * Checkliste erscheinen nacheinander wie Zeitstempel (pf-tick); bei reduzierter Bewegung stehen alle
 * sofort da (globale Regel in tokens.css). Daten aus aviation.json (rep), als Beispiel beschriftet.
 */
function ReportTicker({ locale }: { locale: Locale }) {
  const rep = aviation[locale].rep;
  return (
    <div
      aria-label={`${rep.title}, ${SAMPLE[locale]}`}
      role="group"
      className="w-[min(100%,360px)] border border-av-cream/18 bg-av-navy/55 p-5 backdrop-blur-[10px] max-sec:hidden"
    >
      <p className="flex justify-between gap-4 font-mono text-[10.5px] tracking-[0.08em] text-av-on-navy-muted uppercase">
        <span>
          {rep.title} · {SAMPLE[locale]}
        </span>
        <span>{rep.no}</span>
      </p>
      <p className="mt-2 font-mono text-[11px] tracking-[0.04em] text-av-on-navy uppercase">
        {rep.rows[0].v} · {rep.rows[2].v}
      </p>
      <ol className="mt-4 border-t border-av-cream/14">
        {rep.checks.map((c, i) => (
          <li
            key={c.k}
            style={{ animationDelay: `${1400 + i * 650}ms` }}
            className="flex items-center gap-3 border-b border-av-cream/10 py-2.5 font-mono text-[11px] tracking-[0.02em] text-av-cream motion-safe:animate-[pf-tick_0.7s_var(--ease-out)_both]"
          >
            <span aria-hidden="true" className="block size-1.5 flex-none bg-av-gold" />
            <span className="min-w-0 flex-1 truncate">{c.k}</span>
            <span className="text-av-on-navy-muted">{c.v} UTC</span>
          </li>
        ))}
      </ol>
      <p
        style={{ animationDelay: `${1400 + rep.checks.length * 650}ms` }}
        className="mt-3 font-mono text-[10.5px] tracking-[0.06em] text-av-gold uppercase motion-safe:animate-[pf-tick_0.7s_var(--ease-out)_both]"
      >
        {rep.notified}
      </p>
    </div>
  );
}
