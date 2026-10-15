import Image from "next/image";
import Link from "next/link";
import { CarButton } from "@/components/fahrzeug/Button";
import { CarOverline } from "@/components/fahrzeug/Overline";
import { focusAreas, INSPECT_PRICE, serviceById } from "@/content/fahrzeug";
import { altText, media } from "@/content/media";
import { site } from "@/content/site";
import { eur, fromPrice } from "@/lib/format";
import { OpeningStatus } from "@/components/shared/OpeningStatus";
import { ParallaxLayer } from "./ParallaxLayer";

/**
 * Hero Startseite (README 8.1 Punkt 2, Referenz Zeilen 96–130): Text links, Bild 4:5 rechts,
 * darunter die vier Schwerpunkte (Kundenwunsch 14.10.2026, statt der vier Einzelleistungen) mit
 * Kleinwagenpreis bzw. „nach Begutachtung“.
 *
 * Bewegung (README 9.1/9.2, nur ohne reduzierte Bewegung): Reveals mit den Verzögerungen der Referenz
 * (Overline 0, H1-Zeilen als Masken 80/190, Text 360, Buttons 460, Status 560, Preisleiste gestaffelt
 * 90), Clip-Reveal des Bildrahmens (120) und Parallaxe der inneren Bildebene (Faktor 0.07; die Ebene
 * ist dafür oben und unten 8 % größer als der Rahmen).
 */
export function Hero() {
  return (
    <section className="relative overflow-x-clip bg-car-bg leading-[normal]">
      <div className="mx-auto grid max-w-car grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-[clamp(40px,5vw,88px)] px-car-gutter pt-[clamp(36px,5vw,72px)]">
        {/* Container für die H1: 13.4cqi hält „bis ins Detail.“ bei jeder Breite in einer Zeile. */}
        <div className="@container pb-[clamp(0px,1.5vw,24px)]">
          <CarOverline rv={0} className="leading-[normal]">
            Fahrzeugaufbereitung in Telgte bei Münster
          </CarOverline>
          <h1 className="mt-7 text-car-hero leading-[0.92] font-bold tracking-[-0.02em] font-stretch-125%">
            <span className="block overflow-hidden pb-[0.07em]">
              <span data-rvm="80" className="block">
                Makellos
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.07em]">
              <span data-rvm="190" className="block">
                bis ins Detail.
              </span>
            </span>
          </h1>
          <p
            data-rv="360"
            className="mt-7 max-w-[480px] text-[clamp(16px,1.3vw,19px)] leading-[1.6] text-pretty text-car-text"
          >
            Smart Repair, Lackkorrektur, Vorbereitung auf die Leasingrückgabe und hochwertige
            Aufbereitung, in unserer Halle in Telgte. Den Festpreis kennen Sie, bevor wir beginnen.
          </p>
          <div data-rv="460" className="mt-9 flex flex-wrap gap-3">
            <CarButton className="leading-[normal]" href="/anfrage" arrow>
              Termin anfragen
            </CarButton>
            <CarButton className="leading-[normal]" href="/leistungen" variant="secondary">
              Alle Preise
            </CarButton>
          </div>
          <div
            data-rv="560"
            className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-car-text"
          >
            <span className="flex items-center gap-2.5">
              <OpeningStatus />
            </span>
            <span>
              {site.street}, {site.city}
            </span>
          </div>
        </div>

        <div
          data-rvc="120"
          className="relative aspect-[4/5] max-h-[calc(100vh-140px)] min-h-[420px] overflow-hidden bg-car-image-bg"
        >
          <ParallaxLayer factor={0.07} className="absolute inset-x-0 -top-[8%] -bottom-[8%]">
            <Image
              src={media.carHero.src}
              alt={altText("carHero")}
              fill
              preload
              sizes="(min-width: 1060px) min(45vw, 600px), 100vw"
              className="object-cover"
            />
          </ParallaxLayer>
          {/* Bildunterschrift nennt nur die Leistung, keinen Auftrag: Das Bild ist ein KI-Platzhalter (media.ts). */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between gap-3 bg-linear-to-b from-car-ink/0 to-car-ink/55 px-5 pt-11 pb-[18px] text-[11px] font-medium tracking-[0.16em] text-car-bg uppercase">
            <span>{serviceById("keramik").name}</span>
            <span>{fromPrice(serviceById("keramik").p[0])}</span>
          </div>
        </div>
      </div>

      <PriceBar />
    </section>
  );
}

/** Schwerpunkte: vier Spalten (minmax 230px), 2px Linie oben, Hover rot, Klick zur Leistung. */
function PriceBar() {
  return (
    <div className="mx-auto max-w-car px-car-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(64px,8vw,112px)]">
      <ul
        data-rvs="90"
        className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-x-6"
      >
        {focusAreas.map((f, i) => (
          <li key={f.id} className="flex">
            <Link
              href={`/leistungen#svc-${f.id}`}
              className="flex w-full flex-col gap-[22px] border-t-2 border-car-ink pt-[22px] pb-2 hover:border-t-car-red"
            >
              <span className="text-[13px] text-car-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[20px] font-semibold tracking-[-0.01em] font-stretch-108%">
                {f.name}
              </span>
              <span className="text-[15px] leading-[1.5] text-car-text">{f.short}</span>
              {f.price ? (
                <span className="mt-auto flex items-baseline gap-2">
                  <span className="text-[14px] text-car-muted">ab</span>
                  <span className="text-car-price-xl leading-none font-medium tracking-[-0.035em] tabular-nums">
                    {eur(serviceById(f.price).p[0])}
                  </span>
                </span>
              ) : (
                <span className="mt-auto flex min-h-(--car-fs-price-xl) items-end text-[17px] font-medium">
                  Preis {INSPECT_PRICE}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[13px] text-car-muted">
        Preise für Kleinwagen. Alle Fahrzeugklassen auf der Leistungsseite.
      </p>
    </div>
  );
}
