"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { altText, media } from "@/content/media";

const STEP = 5;
const clamp = (v: number) => Math.max(0, Math.min(100, v));

/**
 * Schleier über dem Vorher-Bild (Referenz Zeile 177): feine Kreise + heller Verlauf, Mischmodus
 * screen. Farben aus den Tokens (--car-bg, --car-ba-haze).
 */
const HAZE =
  "repeating-radial-gradient(circle at 46% 40%, color-mix(in srgb, var(--car-bg) 8%, transparent) 0px, color-mix(in srgb, var(--car-bg) 8%, transparent) 1px, transparent 1px, transparent 6px), " +
  "linear-gradient(180deg, color-mix(in srgb, var(--car-ba-haze) 18%, transparent), color-mix(in srgb, var(--car-ba-haze) 10%, transparent))";

/**
 * Vorher/Nachher-Regler (README 9.5, Referenz Zeilen 172–186 und 1381–1394).
 * Nachher = Foto, Vorher = dasselbe Foto mit Filter, per clip-path auf den Reglerwert beschnitten.
 * Zeiger mit setPointerCapture, touch-action: pan-y, Tastatur ← / → ± 5 %, Pos1 / Ende.
 * Platzhalter: vor dem Launch durch ein echtes Fotopaar ersetzen (media.ts, UWG § 5).
 * Das Intro (50 → 24 → 76 → 50 %) kommt in Phase 4.
 */
export function BeforeAfterSlider() {
  const [value, setValue] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromPointer = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width > 0) setValue(clamp(((clientX - r.left) / r.width) * 100));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
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
    const next =
      e.key === "ArrowLeft"
        ? value - STEP
        : e.key === "ArrowRight"
          ? value + STEP
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? 100
              : null;
    if (next === null) return;
    e.preventDefault();
    setValue(clamp(next));
  };

  const rounded = Math.round(value);
  const pos = value.toFixed(2);

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Vorher-Nachher-Vergleich"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
      aria-valuetext={`Vorher ${rounded} %, Nachher ${100 - rounded} %`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className="relative mt-[clamp(40px,5vw,64px)] aspect-[21/9] min-h-[300px] w-full cursor-ew-resize touch-pan-y overflow-hidden bg-car-ba-bg select-none"
    >
      <Image
        src={media.carBeforeAfter.src}
        alt={altText("carBeforeAfter")}
        fill
        draggable={false}
        sizes="(min-width: 1400px) 1248px, 100vw"
        className="pointer-events-none object-cover object-[50%_58%]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 ${(100 - value).toFixed(2)}% 0 0)` }}
      >
        <Image
          src={media.carBeforeAfter.src}
          alt=""
          fill
          draggable={false}
          sizes="(min-width: 1400px) 1248px, 100vw"
          className="object-cover object-[50%_58%] [filter:saturate(0.45)_contrast(0.78)_brightness(0.88)_blur(0.5px)]"
        />
        <div className="absolute inset-0 mix-blend-screen" style={{ backgroundImage: HAZE }} />
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
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0"
        style={{ left: `${pos}%` }}
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
