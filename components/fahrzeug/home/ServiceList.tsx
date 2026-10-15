import Link from "next/link";
import { CarTextLink } from "@/components/fahrzeug/Button";
import { CarOverline } from "@/components/fahrzeug/Overline";
import { focusAreas, INSPECT_PRICE, serviceById, type FocusArea } from "@/content/fahrzeug";
import { media, type MediaId } from "@/content/media";
import { eur } from "@/lib/format";
import { CarH2 } from "@/components/fahrzeug/Heading";
import { ServiceFollower } from "./ServiceFollower";

/** Bilder, die der Cursor über der Liste mitnimmt (Referenz Zeilen 154–157), je Schwerpunkt. */
const HOVER_IMAGE: Record<FocusArea["id"], MediaId> = {
  "smart-repair": "carSvcSmartRepair",
  politur: "carSvcPolitur",
  leasing: "carSvcLeasing",
  aussen: "carSvcAussen",
  innen: "carSvcInnen",
  keramik: "carHoverKeramik",
};

/**
 * Schwerpunkte (#leistungen, README 8.1 Punkt 3, Referenz Zeilen 131–162). Seit dem Kundenwunsch
 * vom 14.10.2026 die vier Schwerpunkte statt der vier Einzelleistungen.
 *
 * Hover ab 980px mit Zeiger (README 9.3, reines CSS): die übrigen Zeilen blenden auf 0.28 ab, der
 * Name der Zeile rückt 18px nach rechts. Tastaturfokus wirkt wie in der Referenz genauso.
 * Das dem Cursor folgende Bild setzt ServiceFollower (nur mit Bewegung); es kann über den Rand der
 * Liste ragen, deshalb overflow-x: clip am Abschnitt (CLAUDE.md, Regel 8).
 * Reveals wie in der Referenz: Overline 0, H2 80, Text und Link 160.
 */
export function ServiceList() {
  return (
    <section
      id="leistungen"
      className="overflow-x-clip border-t border-car-line-ui bg-car-bg pt-car-section pb-[clamp(72px,9vw,128px)] leading-[normal]"
    >
      <div className="mx-auto max-w-car px-car-gutter">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-6">
          <div>
            <CarOverline rv={0} className="leading-[normal]">
              Schwerpunkte
            </CarOverline>
            <CarH2 rv={80}>Worauf wir uns spezialisiert haben.</CarH2>
          </div>
          <div data-rv="160" className="flex flex-col items-start gap-[18px]">
            <p className="max-w-[520px] text-[17px] leading-[1.6] text-pretty text-car-text">
              Von der Reparatur kleiner Schäden bis zur Keramikversiegelung, alles in einer Halle.
              Einzeln oder kombiniert, mit Festpreis vor Beginn.
            </p>
            <CarTextLink href="/leistungen" className="leading-[normal]">
              Alle Leistungen und Preise
            </CarTextLink>
          </div>
        </div>

        <ServiceFollower
          images={focusAreas.map((f) => media[HOVER_IMAGE[f.id]].src)}
          className="relative mt-[clamp(48px,6vw,80px)] border-t border-car-ink wide:[&:has(>a:focus-visible)>a:not(:focus-visible)]:opacity-28 wide:pointer-fine:[&:has(>a:hover)>a:not(:hover)]:opacity-28"
        >
          {focusAreas.map((f, i) => (
            <Link
              key={f.id}
              data-row={i}
              href={`/leistungen#svc-${f.id}`}
              className="group/row flex w-full flex-wrap items-baseline gap-x-8 gap-y-2 border-b border-car-line py-[clamp(24px,2.8vw,40px)] text-left text-car-ink transition-opacity duration-400 ease-[ease]"
            >
              <span className="flex-[0_0_40px] text-[13px] text-car-muted tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-[1_1_360px] text-car-list leading-none font-bold tracking-[-0.0175em] font-stretch-125% transition-transform duration-600 ease-(--ease-out) wide:group-focus-visible/row:translate-x-[18px] wide:pointer-fine:group-hover/row:translate-x-[18px]">
                {f.name}
              </span>
              <span className="flex-[1_1_260px] text-[15px] leading-[1.5] text-car-text">
                {f.short}
              </span>
              {f.price ? (
                <span className="flex flex-[0_0_170px] items-baseline justify-end gap-1.5 whitespace-nowrap">
                  <span className="text-[13px] text-car-muted">ab</span>
                  <span className="text-[30px] font-medium tracking-[-0.02em] tabular-nums">
                    {eur(serviceById(f.price).p[0])}
                  </span>
                </span>
              ) : (
                <span className="flex flex-[0_0_170px] justify-end text-[15px] whitespace-nowrap text-car-muted">
                  Preis {INSPECT_PRICE}
                </span>
              )}
            </Link>
          ))}
        </ServiceFollower>
      </div>
    </section>
  );
}
