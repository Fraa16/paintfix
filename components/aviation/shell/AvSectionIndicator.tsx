"use client";

import { useAvScroll } from "./AvScrollState";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

/**
 * Abschnittsanzeige (README 8.4 Punkt 12, Referenz Zeilen 605–610): ab 1200px, erst nach dem Hero.
 * Fixed links unten, vertikal, mix-blend-mode difference. Rein dekorativ.
 */
export function AvSectionIndicator({ secs }: { secs: string[] }) {
  const { over, sec } = useAvScroll();
  if (!over || sec < 0) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-9 left-[22px] z-45 flex flex-col items-center gap-3.5 text-av-cream mix-blend-difference max-sec:hidden"
    >
      <span className="block h-12 w-px bg-current opacity-60" />
      <span className="rotate-180 text-[10px] tracking-[0.32em] whitespace-nowrap uppercase [writing-mode:vertical-rl]">
        {ROMAN[sec]} — {secs[sec]}
      </span>
    </div>
  );
}
