"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { clamp, useMedia, useMotionAllowed } from "@/components/shared/motion/scroll";
import { cx } from "@/lib/cx";

/** Ab 980px, mit Maus o. Ä. (hover-fähiger, feiner Zeiger), README 9.3. */
const POINTER_QUERY = "(min-width: 980px) and (hover: hover) and (pointer: fine)";
const LERP = 0.16;
const GAP = 36;

/**
 * Liste der Leistungen mit dem Bild, das dem Cursor folgt (README 9.3, Referenz Zeilen 143–160,
 * onListMove/floatLoop/onListLeave Zeilen 1367–1380, floatOp/fo0–fo3 Zeile 1468–1469).
 *
 * Die Zeilen kommen als children von der Server-Komponente und tragen data-row="{Index}". Das Bild
 * (4:5, Breite clamp(220px,19vw,290px), Schatten Float) gibt es nur im Browser ab 980px mit
 * hover-fähigem Zeiger und ohne reduzierte Bewegung; es ist dekorativ (aria-hidden), Tastatur und
 * Screenreader nutzen die Links. Position und Neigung schreibt eine rAF-Schleife direkt ans Element:
 * Lerp 0.16 pro Frame, mittig zur Cursorhöhe, 36px neben dem Cursor, ab 62 % der Listenbreite links
 * davon, Neigung (Ziel − Ist) × 0.05 bis ±5°. Bilder und Ein-/Ausblenden 0.35s.
 * Abblenden der übrigen Zeilen und Versatz des Namens bleiben reines CSS (ServiceList).
 */
export function ServiceFollower({
  images,
  className,
  children,
}: {
  images: StaticImageData[];
  className?: string;
  children: ReactNode;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const motion = useMotionAllowed();
  const pointer = useMedia(POINTER_QUERY);
  const enabled = motion && pointer;

  useEffect(() => {
    const list = listRef.current;
    const float = floatRef.current;
    if (!enabled || !list || !float) return;
    const imgs = Array.from(float.querySelectorAll<HTMLElement>("img"));

    let target: { x: number; y: number; w: number } | null = null;
    let current: { x: number; y: number } | null = null;
    let size = { w: 0, h: 0 };
    let hover = -1;
    let raf = 0;

    const loop = () => {
      raf = 0;
      const t = target;
      const c = current;
      if (!t || !c) return;
      c.x += (t.x - c.x) * LERP;
      c.y += (t.y - c.y) * LERP;
      const x = c.x > t.w * 0.62 ? c.x - size.w - GAP : c.x + GAP;
      const tilt = clamp((t.x - c.x) * 0.05, -5, 5);
      float.style.transform = `translate3d(${x.toFixed(1)}px,${(c.y - size.h / 2).toFixed(1)}px,0) rotate(${tilt.toFixed(2)}deg)`;
      if (Math.abs(t.x - c.x) > 0.4 || Math.abs(t.y - c.y) > 0.4) raf = requestAnimationFrame(loop);
    };

    const setHover = (i: number) => {
      if (i === hover) return;
      hover = i;
      float.style.opacity = i >= 0 ? "1" : "0";
      // Beim Verlassen bleibt das zuletzt gezeigte Bild stehen und blendet mit dem Rahmen aus.
      if (i >= 0) imgs.forEach((img, k) => (img.style.opacity = k === i ? "1" : "0"));
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = list.getBoundingClientRect();
      size = { w: float.offsetWidth, h: float.offsetHeight };
      target = { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width };
      if (!current) current = { x: target.x, y: target.y };
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const row = (e.target as Element).closest<HTMLElement>("[data-row]");
      if (row && list.contains(row)) setHover(Number(row.dataset.row));
    };
    const onLeave = () => {
      current = null;
      setHover(-1);
    };

    list.addEventListener("pointermove", onMove, { passive: true });
    list.addEventListener("pointerover", onOver, { passive: true });
    list.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerover", onOver);
      list.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return (
    <div ref={listRef} className={className}>
      {children}
      {enabled && (
        <div
          ref={floatRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-3 aspect-[4/5] w-[clamp(220px,19vw,290px)] overflow-hidden bg-car-image-bg opacity-0 shadow-(--shadow-float) transition-opacity duration-350 ease-[ease]"
        >
          {images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt=""
              fill
              sizes="290px"
              draggable={false}
              className={cx(
                "object-cover transition-opacity duration-350 ease-[ease]",
                // Wie die Referenz (lastHover 0): vor dem ersten Hover liegt das erste Bild oben.
                i === 0 ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
