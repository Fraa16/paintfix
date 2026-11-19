"use client";

import Image from "next/image";
import { useEffect, useRef, type ChangeEvent, type CSSProperties } from "react";
import { altText, media } from "@/content/media";
import { useMotionAllowed } from "@/components/shared/motion/scroll";

const START = 50;
const valueText = (n: number) => `Nachher ${n} %, Vorher ${100 - n} %`;

type Sweep = { x: number; y: number; tx: number; ty: number; touched: boolean; raf: number };

/** Schreibt die Position der Kante (CSS-Variablen). */
function paint(el: HTMLElement | null, s: Sweep) {
  if (!el) return;
  el.style.setProperty("--x", `${s.x.toFixed(2)}%`);
  el.style.setProperty("--y", `${s.y.toFixed(2)}%`);
}

/**
 * Reglerwert nach einer Eingabe (Zeiger oder Tastatur). Das Schwenken ohne Eingabe ändert ihn nicht,
 * damit Screenreader nur echte Änderungen hören.
 */
function sync(range: HTMLInputElement | null, value: number) {
  if (!range) return;
  const n = Math.round(value / 5) * 5;
  range.value = String(n);
  range.setAttribute("aria-valuetext", valueText(n));
}

/**
 * KONZEPT „Licht auf Lack“: Vorher/Nachher als Hero über die ganze Fläche. Eine Lichtkante (wie eine
 * LED-Prüflampe) trennt links den polierten Lack (Nachher) von rechts dem Lack mit Waschkratzern
 * (Vorher).
 *
 * Steuerung:
 *   Maus (pointer: fine)  die Kante folgt dem Zeiger über den ganzen Abschnitt, weich nachgezogen
 *   Touch                 waagerecht ziehen (senkrechtes Scrollen bleibt frei, touch-action: pan-y)
 *   Tastatur              natives <input type="range"> (←/→, Bild auf/ab, Pos1/Ende), Fokus sichtbar
 *   ohne Eingabe          langsames Hin- und Herschwenken, nur mit erlaubter Bewegung
 *   reduzierte Bewegung   steht bei 50 %, folgt Eingaben ohne Nachziehen (Regel 7)
 * Geschrieben werden nur CSS-Variablen am Wurzelelement (--x, --y) und der Wert des Reglers.
 * Platzhalter: KI-Bildpaar (media.ts), vor dem Launch durch ein echtes Fotopaar ersetzen (UWG § 5).
 */
export function LightSweep() {
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const motion = useMotionAllowed();
  const state = useRef<Sweep>({ x: START, y: 40, tx: START, ty: 40, touched: false, raf: 0 });

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest("section");
    if (!el || !host) return;
    const s = state.current;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let dragging = false;

    const target = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      s.tx = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
      s.ty = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100));
      s.touched = true;
      sync(input.current, s.tx);
      if (!motion) {
        s.x = s.tx;
        s.y = s.ty;
        paint(el, s);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" ? fine : dragging) target(e);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      dragging = true;
      target(e);
    };
    const onUp = () => {
      dragging = false;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // Mit Bewegung: weich nachziehen; ohne Eingabe langsam schwenken (35–65 %).
    if (motion) {
      const t0 = performance.now();
      const frame = (now: number) => {
        if (!s.touched) {
          s.tx = START + 15 * Math.sin((now - t0) / 2600);
          s.ty = 40;
        }
        s.x += (s.tx - s.x) * 0.09;
        s.y += (s.ty - s.y) * 0.09;
        paint(el, s);
        s.raf = requestAnimationFrame(frame);
      };
      s.raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(s.raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [motion]);

  // Tastatur: Ziel setzen; mit Bewegung gleitet die Kante dorthin, sonst springt sie.
  const onRange = (e: ChangeEvent<HTMLInputElement>) => {
    const s = state.current;
    s.touched = true;
    s.tx = Number(e.target.value);
    if (!motion) s.x = s.tx;
    e.target.setAttribute("aria-valuetext", valueText(s.tx));
    paint(ref.current, s);
  };

  return (
    <div
      ref={ref}
      style={{ "--x": `${START}%`, "--y": "40%" } as CSSProperties}
      className="group/sweep absolute inset-0 touch-pan-y select-none"
    >
      <Image
        src={media.carPaintBefore.src}
        alt={altText("carPaintBefore")}
        fill
        preload
        sizes="100vw"
        className="object-cover object-[50%_35%]"
      />
      <div className="absolute inset-0 [clip-path:inset(0_calc(100%-var(--x))_0_0)]">
        <Image
          src={media.carPaintAfter.src}
          alt={altText("carPaintAfter")}
          fill
          preload
          sizes="100vw"
          className="object-cover object-[50%_35%]"
        />
      </div>
      {/* Lichtkegel der Lampe: weiches Licht am Zeiger, nur auf der Bildfläche. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_circle_at_var(--x)_var(--y),color-mix(in_srgb,var(--car-on-ink)_16%,transparent),transparent_65%)] mix-blend-soft-light"
      />
      {/* Lichtkante mit Griff; der Fokus des Reglers zeigt sich am Griff (Regel 9). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-(--x) w-px -translate-x-1/2 bg-car-on-ink shadow-(--shadow-light)"
      >
        <span className="absolute top-[28%] left-1/2 block size-3 -translate-x-1/2 bg-car-on-ink outline-offset-4 group-has-[input:focus-visible]/sweep:outline-2 group-has-[input:focus-visible]/sweep:outline-car-on-ink wide:top-[42%]" />
        <span className="absolute top-[calc(28%-28px)] right-3 font-mono text-[11px] leading-none tracking-[0.06em] whitespace-nowrap text-car-on-ink uppercase wide:top-[calc(42%-28px)]">
          Nachher
        </span>
        <span className="absolute top-[calc(28%-28px)] left-3 font-mono text-[11px] leading-none tracking-[0.06em] whitespace-nowrap text-car-on-ink uppercase wide:top-[calc(42%-28px)]">
          Vorher
        </span>
      </div>
      <input
        ref={input}
        type="range"
        min={0}
        max={100}
        step={5}
        defaultValue={START}
        onChange={onRange}
        aria-label="Lack vorher und nachher vergleichen"
        aria-valuetext={valueText(START)}
        className="sr-only"
      />
    </div>
  );
}
