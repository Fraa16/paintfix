"use client";

import { useState, type CSSProperties } from "react";
import type { AviationCopy } from "@/content/aviation";
import { baseMap, seatOnMap } from "@/content/aviation-meta";
import { cx } from "@/lib/cx";

/** Darstellung der Ortsnamen auf der Karte wie in der Referenz (Abstand zum Punkt, Laufweite). */
const LABEL_STYLE: Record<string, { gap: string; track: string }> = {
  EDDG: { gap: "18px", track: "tracking-[0.14em]" },
  EDLP: { gap: "14px", track: "tracking-[0.12em]" },
};
const DEFAULT_LABEL_STYLE = { gap: "14px", track: "tracking-[0.14em]" };
const RINGS = [
  { size: "w-[38.46%]", color: "border-av-gold-line/55" },
  { size: "w-[76.92%]", color: "border-av-gold-line/45" },
  { size: "w-[115.38%]", color: "border-av-gold-line/35" },
];
const RING_LABELS = [
  { text: "50 KM", left: 60.4, top: 48.9 },
  { text: "100 KM", left: 70, top: 67.2 },
  { text: "150 KM", left: 79.6, top: 85.6 },
];
const EDDG = baseMap[0].pos;
const EDDG_POS = { left: `${EDDG[0]}%`, top: `${EDDG[1]}%` } satisfies CSSProperties;
const FADE = "transition-opacity duration-300 ease-[ease]";

const at = ([left, top]: readonly [number, number]): CSSProperties => ({
  left: `${left}%`,
  top: `${top}%`,
});

/**
 * Einsatzradius-Karte und Standortliste (Referenz Zeilen 834–881, Logik 1455–1460 und 1518–1521).
 * Hover auf einer Zeile hebt den Punkt hervor (7 → 12px, EDDG 10 → 12px, Goldring 26px), zeichnet die
 * Linie ab EDDG mit Entfernung und blendet die übrigen Zeilen auf 40 % ab. Das ist eine rein visuelle
 * Ergänzung: Entfernung und Status stehen als Text in jeder Zeile, deshalb keine Tab-Stopps.
 */
export function FleetBases({
  copy: t,
}: {
  copy: Pick<AviationCopy, "bases" | "chartLabel" | "chartSeat">;
}) {
  const [active, setActive] = useState(-1);
  const kmPos = active > 0 ? baseMap[active].pos : baseMap[1].pos;

  return (
    <>
      <div
        role="img"
        aria-label={t.chartLabel}
        className="relative mt-7 aspect-[260/236] overflow-hidden border border-av-navy/12 bg-av-cream text-av-navy"
      >
        <div
          style={{ top: EDDG_POS.top }}
          className="absolute inset-x-0 border-t border-dashed border-av-line"
        />
        <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-av-line" />
        {RINGS.map((r) => (
          <div
            key={r.size}
            style={EDDG_POS}
            className={cx(
              "absolute aspect-square -translate-1/2 rounded-full border",
              r.size,
              r.color,
            )}
          />
        ))}
        {RING_LABELS.map((l) => (
          <span
            key={l.text}
            style={at([l.left, l.top])}
            className="absolute text-[10px] tracking-[0.14em] text-av-gold-text"
          >
            {l.text}
          </span>
        ))}

        {baseMap.map(({ line }, i) =>
          line ? (
            <div
              key={i}
              style={{ ...EDDG_POS, width: `${line[0]}%`, transform: `rotate(${line[1]}deg)` }}
              className={cx(
                "absolute origin-top-left border-t border-dashed border-av-navy",
                FADE,
                active === i ? "opacity-100" : "opacity-0",
              )}
            />
          ) : null,
        )}
        <span
          style={{
            left: `${((EDDG[0] + kmPos[0]) / 2).toFixed(2)}%`,
            top: `${((EDDG[1] + kmPos[1]) / 2).toFixed(2)}%`,
          }}
          className={cx(
            "absolute translate-x-2.5 -translate-y-1/2 bg-av-navy px-[7px] py-[3px] text-[11px] font-medium whitespace-nowrap text-av-cream",
            FADE,
            active > 0 ? "opacity-100" : "opacity-0",
          )}
        >
          {active > 0 ? baseMap[active].km : ""}
        </span>

        {/* Firmensitz Telgte */}
        <div
          style={at(seatOnMap.pos)}
          className="absolute size-[7px] -translate-1/2 border border-av-navy bg-av-cream"
        />
        <span
          style={at(seatOnMap.pos)}
          className="absolute translate-x-2.5 -translate-y-1/2 text-[9px] tracking-[0.16em] whitespace-nowrap text-av-muted uppercase"
        >
          Telgte · {t.chartSeat}
        </span>

        {baseMap.map(({ icao, pos, mapLabel, labelSide }, i) => {
          const on = active === i;
          const style = LABEL_STYLE[icao] ?? DEFAULT_LABEL_STYLE;
          return (
            <div key={icao}>
              <div
                style={at(pos)}
                className={cx(
                  "absolute -mt-[13px] -ml-[13px] size-[26px] rounded-full border border-av-gold",
                  FADE,
                  on || (i === 0 && active < 0) ? "opacity-100" : "opacity-0",
                )}
              />
              <div
                style={at(pos)}
                className={cx(
                  "absolute -translate-1/2 rounded-full bg-av-navy transition-[width,height] duration-300 ease-[ease]",
                  on ? "size-3" : i === 0 ? "size-2.5" : "size-[7px]",
                )}
              />
              <div
                style={{
                  ...at(pos),
                  transform:
                    labelSide === "left"
                      ? `translate(calc(-100% - ${style.gap}), -62%)`
                      : `translate(${style.gap}, -62%)`,
                }}
                className={cx(
                  "absolute flex flex-col gap-[3px] whitespace-nowrap",
                  labelSide === "left" && "items-end",
                )}
              >
                <span className="font-cinzel text-[clamp(12px,1.12vw,16px)] leading-none font-normal">
                  {icao}
                </span>
                <span className={cx("text-[9px] text-av-muted uppercase", style.track)}>
                  {mapLabel}
                </span>
              </div>
            </div>
          );
        })}

        <span className="absolute top-3.5 left-4 text-[10px] tracking-[0.28em] text-av-muted uppercase">
          {t.chartLabel}
        </span>
        <span className="absolute top-3 right-[18px] font-cinzel text-[12px] font-normal">N ↑</span>
      </div>

      <ul className="mt-2">
        {t.bases.map((b, i) => (
          <li
            key={b.i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(-1)}
            className={cx(
              "flex items-baseline justify-between gap-6 border-b border-av-line-strong py-[18px]",
              FADE,
              active < 0 || active === i ? "opacity-100" : "opacity-40",
            )}
          >
            <span className="flex flex-wrap items-baseline gap-5">
              <span className="font-cinzel text-[clamp(24px,2.24vw,33.6px)] leading-none font-normal tracking-[0.055em]">
                {b.i}
              </span>
              <span className="text-[15px] text-av-muted">{b.n}</span>
            </span>
            <span className="flex items-baseline gap-4 whitespace-nowrap">
              {/* Auch leer (EDDG) vorhanden wie in der Referenz: der Abstand bestimmt den Umbruch. */}
              <span className="text-[13px] text-av-muted tabular-nums">{baseMap[i]?.km}</span>
              <span className="text-[10px] tracking-[0.26em] uppercase">{b.s}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
