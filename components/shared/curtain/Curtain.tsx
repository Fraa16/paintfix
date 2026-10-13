import { baseMap } from "@/content/aviation-meta";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import { CurtainController } from "./CurtainController";

/**
 * Markenwechsel-Blende (README 9.4, Referenz Zeilen 31–54, go() 1321–1339, Werte 1508–1511).
 *
 * Steht in beiden Root-Layouts als erstes Element im <body>, damit sie beim Laden vor dem Seiteninhalt
 * geparst wird. Ohne Lauf ist sie ausgeblendet (display: none); bei reduzierter Bewegung läuft sie nie,
 * der statische Zustand bleibt also unverändert.
 *
 * Zustände (setzt CurtainController direkt am Element, kein React-State):
 *   data-to="av|car"   Ziel-Marke: Navy mit Aviation-Logo bzw. Weiß mit Fahrzeug-Logo
 *   data-ph="prep"     unter dem Viewport (translate3d(0,100%,0)), ohne Übergang, Inhalt unsichtbar
 *   data-ph="cover"    translate3d(0,0,0) in 0.85s --ease-curtain, Inhalt blendet ein
 *                      (Aviation 0.6s ab 0.2s, Fahrzeug 0.5s ab 0.15s)
 *   data-ph="reveal"   translate3d(0,−100%,0) in 0.85s --ease-curtain
 *
 * Übergabe über eine Root-Layout-Grenze (Neuladen): boot.ts setzt html[data-curtain-in="av|car"] vor
 * dem ersten Paint. Die [html[data-motion][data-curtain-in…]_&]-Varianten decken dann sofort per CSS
 * ab (kein Aufblitzen der Seite), bis der Controller den Ablauf übernimmt. Sie gelten nur mit
 * html[data-motion]: Entfernt das Sicherheitsnetz in boot.ts das Attribut, bleibt die Seite nicht
 * dauerhaft verdeckt.
 *
 * Rein dekorativ: aria-hidden, nichts Fokussierbares. Solange sie deckt, fängt sie Klicks ab wie die
 * Referenz. Logo-Größen weichen von CarLogo/AvLogo ab (Referenz: 30px-Quadrat bzw. Cinzel
 * clamp(19.2px,2.08vw,30.4px)), deshalb eigenes Markup mit denselben Tokens.
 *
 * Texte wie README 9.4. Heimatflughafen (EDDG, Mittelpunkt der Einsatzradius-Karte) und Ort (Telgte)
 * kommen aus content/, dort als Platzhalter geführt (CLAUDE.md Regel 11).
 *
 * Klassen stehen bewusst vollständig ausgeschrieben, damit Tailwind sie im Quelltext findet.
 */
export function Curtain() {
  return (
    <>
      <div
        data-pf-curtain=""
        aria-hidden="true"
        className={cx(
          "group/curtain fixed inset-0 z-[200] hidden [transform:translate3d(0,100%,0)] items-center justify-center font-sans leading-[normal] font-normal",
          // Lauf im selben Dokument
          "data-ph:flex",
          "data-[ph=cover]:[transform:translate3d(0,0,0)] data-[ph=cover]:[transition:transform_var(--dur-curtain)_var(--ease-curtain)]",
          "data-[ph=reveal]:[transform:translate3d(0,-100%,0)] data-[ph=reveal]:[transition:transform_var(--dur-curtain)_var(--ease-curtain)]",
          "data-[to=av]:bg-av-navy data-[to=av]:text-av-cream data-[to=car]:bg-car-bg data-[to=car]:text-car-ink",
          // Übergabe aus dem vorigen Dokument: sofort deckend
          "[html[data-motion][data-curtain-in]_&]:flex [html[data-motion][data-curtain-in]_&]:[transform:translate3d(0,0,0)]",
          "[html[data-motion][data-curtain-in=av]_&]:bg-av-navy [html[data-motion][data-curtain-in=av]_&]:text-av-cream",
          "[html[data-motion][data-curtain-in=car]_&]:bg-car-bg [html[data-motion][data-curtain-in=car]_&]:text-car-ink",
        )}
      >
        {/* Richtung Aviation (Referenz Zeilen 33–42) */}
        <div
          className={cx(
            "hidden flex-col items-center gap-6 opacity-0 [transition:opacity_0.6s_ease_0.2s]",
            "group-data-[to=av]/curtain:flex [html[data-motion][data-curtain-in=av]_&]:flex",
            "group-data-[ph=cover]/curtain:opacity-100 group-data-[ph=reveal]/curtain:opacity-100 [html[data-motion][data-curtain-in]_&]:opacity-100",
          )}
        >
          <div className="flex items-center gap-5">
            <span className="font-cinzel text-[clamp(19.2px,2.08vw,30.4px)] tracking-[0.375em]">
              PAINTFIX
            </span>
            <span className="block h-[30px] w-px bg-av-cream/40" />
            <span className="text-[clamp(11px,0.95vw,14px)] tracking-[0.44em]">AVIATION</span>
          </div>
          <span className="block h-px w-14 bg-av-gold" />
          <span className="text-[10px] tracking-[0.34em] text-av-gold uppercase">
            Business Aviation · {baseMap[0].icao}
          </span>
        </div>

        {/* Richtung Fahrzeug (Referenz Zeilen 44–52) */}
        <div
          className={cx(
            "hidden flex-col items-center gap-5 opacity-0 [transition:opacity_0.5s_ease_0.15s]",
            "group-data-[to=car]/curtain:flex [html[data-motion][data-curtain-in=car]_&]:flex",
            "group-data-[ph=cover]/curtain:opacity-100 group-data-[ph=reveal]/curtain:opacity-100 [html[data-motion][data-curtain-in]_&]:opacity-100",
          )}
        >
          <div className="flex items-center gap-3.5">
            <span className="relative block size-[30px] bg-car-ink">
              <span className="absolute right-0 bottom-0 size-3 bg-car-red" />
            </span>
            <span className="text-[24px] font-bold tracking-[0.07em] font-stretch-125%">
              PAINTFIX
            </span>
          </div>
          <span className="text-[11px] font-medium tracking-[0.2em] text-car-muted uppercase">
            Fahrzeugaufbereitung · {site.city}
          </span>
        </div>
      </div>
      <CurtainController />
    </>
  );
}
