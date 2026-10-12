"use client";

import Image, { type StaticImageData } from "next/image";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "@/lib/cx";

export type ServiceTab = {
  label: string;
  items: { t: string; d: string }[];
  image: { src: StaticImageData; alt: string };
};

/**
 * Leistungen als Tabs (README 8.4 Punkt 4, Tab-Version der Referenz Zeilen 689–726).
 * Tabs nach WAI-ARIA: Pfeiltasten, Pos1 und Ende wechseln den Bereich.
 * Inaktive Tabs in --av-muted statt --av-tab-inactive (#6A7280 auf Sand 3,9:1), damit der
 * Kontrast 4,5:1 erreicht (CLAUDE.md 9).
 */
export function ServiceTabs({
  heading,
  tabs,
  note,
  tabsLabel,
}: {
  heading: ReactNode;
  tabs: ServiceTab[];
  note: string;
  tabsLabel: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const tabId = (i: number) => `${id}-tab-${i}`;
  const panelId = `${id}-panel`;
  const current = tabs[active];

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight"
        ? active === last
          ? 0
          : active + 1
        : e.key === "ArrowLeft"
          ? active === 0
            ? last
            : active - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-8">
        {heading}
        {/* flex-wrap: in EN passt „03 Protection“ bei 360px nicht in die Zeile (Referenz läuft
            dort 32px über, CLAUDE.md Regel 8). Wo die Tabs passen, ändert sich nichts. */}
        <div role="tablist" aria-label={tabsLabel} className="flex flex-wrap gap-x-8 gap-y-4">
          {tabs.map((t, i) => {
            const on = i === active;
            return (
              <button
                key={t.label}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={tabId(i)}
                aria-selected={on}
                aria-controls={panelId}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
                className={cx(
                  "flex items-baseline gap-2.5 border-b pb-2.5 hover:text-av-navy",
                  on ? "border-av-navy text-av-navy" : "border-transparent text-av-muted",
                )}
              >
                <span className="font-cinzel text-[11.2px] font-normal">0{i + 1}</span>
                <span className="text-[12px] tracking-[0.24em] uppercase">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId(active)}
        tabIndex={0}
        className="mt-[clamp(56px,7vw,96px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-start gap-x-[clamp(40px,6vw,112px)] gap-y-12"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-av-image-bg">
          <Image
            key={active}
            src={current.image.src}
            alt={current.image.alt}
            fill
            sizes="(min-width: 1030px) min(86vw, 1240px), 184vw"
            className="object-cover"
          />
        </div>
        <div>
          <ul>
            {current.items.map((x, i) => (
              <li
                key={x.t}
                className="grid grid-cols-[56px_1fr] gap-x-4 gap-y-2 border-t border-av-line-strong py-8"
              >
                <span className="pt-2 font-cinzel text-[12.8px] font-normal text-av-gold-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-cinzel text-[clamp(20.8px,1.92vw,27.2px)] leading-[1.15] font-normal">
                    {x.t}
                  </h3>
                  <p className="mt-3 max-w-[480px] text-base leading-[1.7] text-av-muted">{x.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-av-line-strong pt-7 text-[13px] tracking-[0.04em] text-av-muted">
            {note}
          </p>
        </div>
      </div>
    </>
  );
}
