"use client";

import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { altText, media } from "@/content/media";
import {
  clamp,
  easeInOutCubic,
  useMotionAllowed,
  useScrollFrame,
} from "@/components/shared/motion/scroll";

const STEP = 5;
const START = 50;

/** Intro (README 9.5, Referenz baIntro Zeilen 1395–1405): [von, nach, Dauer in ms]. */
const INTRO = [
  [50, 24, 750],
  [24, 76, 1000],
  [76, 50, 750],
] as const;
/** Startet, sobald die Oberkante über 72 % der Viewport-Höhe liegt, nach 450ms (Zeilen 1242–1243). */
const INTRO_AT = 0.72;
const INTRO_DELAY = 450;

type IntroPhase = "idle" | "waiting" | "running" | "done";

/** Bildausschnitt beider Ebenen: Kratzer auf der Motorhaube und Kante des Kotflügels. */
const FOCUS = "object-cover object-[50%_30%]";

const valueText = (n: number) => `Vorher ${n} %, Nachher ${100 - n} %`;

/**
 * Vorher/Nachher-Regler (README 9.5, Referenz Zeilen 172–186 und 1381–1405).
 * Nachher und Vorher sind zwei Fotos (content/media.ts), die Vorher-Ebene ist per clip-path auf den
 * Reglerwert beschnitten. Die Referenz simuliert Vorher mit Filter und Schleier; das entfällt.
 * Zeiger mit setPointerCapture, touch-action: pan-y, Tastatur ← / → (auch ↑ / ↓) ± 5 %, Bild auf/ab,
 * Pos1 / Ende.
 *
 * Der Wert lebt in einem Ref und wird wie in der Referenz (baSet) direkt geschrieben: clip-path der
 * Vorher-Ebene, Position des Griffs, aria-valuenow/-valuetext. Das Markup des Servers zeigt 50 %.
 * Intro nur mit Bewegung und einmal pro Seitenaufruf: 50 → 24 (750ms) → 76 (1000ms) → 50 (750ms),
 * easeInOutCubic. Jede Zeiger- oder Tasteneingabe am Regler bricht es ab.
 * Fade-up-Reveal mit 120ms Verzögerung wie in der Referenz (data-rv).
 * Platzhalter: vor dem Launch durch ein echtes Fotopaar ersetzen (media.ts, UWG § 5).
 */
export function BeforeAfterSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const value = useRef(START);
  const dragging = useRef(false);
  const intro = useRef<{ phase: IntroPhase; timer: number; raf: number }>({
    phase: "idle",
    timer: 0,
    raf: 0,
  });
  const motion = useMotionAllowed();

  const show = (v: number) => {
    value.current = v;
    const el = ref.current;
    const clip = clipRef.current;
    const handle = handleRef.current;
    if (clip) clip.style.clipPath = `inset(0 ${(100 - v).toFixed(2)}% 0 0)`;
    if (handle) handle.style.left = `${v.toFixed(2)}%`;
    if (el) {
      const n = Math.round(v);
      el.setAttribute("aria-valuenow", String(n));
      el.setAttribute("aria-valuetext", valueText(n));
    }
  };

  const stopIntro = () => {
    const s = intro.current;
    window.clearTimeout(s.timer);
    cancelAnimationFrame(s.raf);
    s.timer = 0;
    s.raf = 0;
    s.phase = "done";
  };

  const playIntro = () => {
    const s = intro.current;
    s.phase = "running";
    let i = 0;
    let t0 = performance.now();
    const step = (now: number) => {
      const [from, to, duration] = INTRO[i];
      const t = Math.min(1, (now - t0) / duration);
      show(from + (to - from) * easeInOutCubic(t));
      if (t >= 1) {
        i++;
        t0 = now;
        if (i >= INTRO.length) {
          s.raf = 0;
          s.phase = "done";
          return;
        }
      }
      s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
  };

  useScrollFrame(({ vh }) => {
    const s = intro.current;
    const el = ref.current;
    if (s.phase !== "idle" || !el) return;
    const r = el.getBoundingClientRect();
    if (r.top < vh * INTRO_AT && r.bottom > 0) {
      s.phase = "waiting";
      s.timer = window.setTimeout(playIntro, INTRO_DELAY);
    }
  }, motion);

  // Abbau (Seite versteckt, Bewegung abgeschaltet): ein laufendes Intro endet auf seinem Endwert,
  // ein noch wartendes startet beim nächsten Mal neu.
  useEffect(() => {
    if (!motion) return;
    const s = intro.current;
    return () => {
      const { phase } = s;
      if (phase !== "waiting" && phase !== "running") return;
      stopIntro();
      if (phase === "running") show(START);
      else s.phase = "idle";
    };
  }, [motion]);

  const setFromPointer = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width > 0) show(clamp(((clientX - r.left) / r.width) * 100, 0, 100));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    stopIntro();
    dragging.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ohne Capture funktioniert das Ziehen innerhalb der Fläche trotzdem.
    }
    setFromPointer(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) setFromPointer(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    stopIntro();
    const v = value.current;
    // Wie das WAI-ARIA-Slider-Muster: Pfeile ± 5 %, Bild auf/ab ± 20 %, Pos1/Ende 0/100 %.
    const keys: Record<string, number> = {
      ArrowLeft: v - STEP,
      ArrowDown: v - STEP,
      ArrowRight: v + STEP,
      ArrowUp: v + STEP,
      PageDown: v - 4 * STEP,
      PageUp: v + 4 * STEP,
      Home: 0,
      End: 100,
    };
    const next = keys[e.key];
    if (next === undefined) return;
    e.preventDefault();
    show(clamp(next, 0, 100));
  };

  return (
    <div
      ref={ref}
      data-rv="120"
      role="slider"
      tabIndex={0}
      aria-label="Vorher-Nachher-Vergleich"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={START}
      aria-valuetext={valueText(START)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className="relative mt-[clamp(40px,5vw,64px)] aspect-[21/9] min-h-[300px] w-full cursor-ew-resize touch-pan-y overflow-hidden bg-car-ba-bg select-none"
    >
      <Image
        src={media.carPaintAfter.src}
        alt={altText("carPaintAfter")}
        fill
        draggable={false}
        sizes="(min-width: 1400px) 1248px, 100vw"
        className={`pointer-events-none ${FOCUS}`}
      />
      <div
        ref={clipRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 ${(100 - START).toFixed(2)}% 0 0)` }}
      >
        <Image
          src={media.carPaintBefore.src}
          alt=""
          fill
          draggable={false}
          sizes="(min-width: 1400px) 1248px, 100vw"
          className={FOCUS}
        />
        <span className="absolute top-5 left-5 bg-car-ink/78 px-3 py-2 text-[11px] font-semibold tracking-[0.16em] text-car-bg uppercase">
          Vorher
        </span>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-5 right-5 bg-car-bg px-3 py-2 text-[11px] font-semibold tracking-[0.16em] text-car-ink uppercase"
      >
        Nachher
      </span>
      <div
        ref={handleRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0"
        style={{ left: `${START.toFixed(2)}%` }}
      >
        <span className="absolute inset-y-0 -left-px w-0.5 bg-car-bg" />
        <span className="absolute top-1/2 -left-[30px] -mt-[30px] flex size-[60px] items-center justify-center gap-3 rounded-full bg-car-bg text-[16px] font-semibold text-car-ink shadow-(--shadow-handle)">
          <span>‹</span>
          <span>›</span>
        </span>
      </div>
    </div>
  );
}
