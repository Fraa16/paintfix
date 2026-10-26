"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp, useMotionAllowed, useScrollFrame } from "@/components/shared/motion/scroll";

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Fortschrittslinie (README 9.6, Referenz data-prog, frame() Zeilen 1237–1241):
 * p = clamp((0.78 · vh − rect.top) / (0.55 · rect.height)) des Abschnitts. Die Linie [data-progbar]
 * bekommt scaleX(p) (Ursprung links), Schritt [data-step="i"] opacity 1 ab p ≥ (i + 0.35) / 4, sonst
 * 0.3; den Übergang (0.6s) setzt das Markup.
 *
 * Abschnitt als Client-Hülle, der Inhalt bleibt Server-Markup. Ohne Bewegung schreibt sie nichts:
 * Der statische Zustand (p = 1, alles deckend) ist der Endzustand. Mit Bewegung startet die Linie
 * per CSS bei scaleX(0) (Process), bis der erste Frame den richtigen Wert setzt.
 */
export function ProgressSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotionAllowed();
  /** Linie und Schritte (einmal gesucht) und die zuletzt geschriebenen Werte. */
  const state = useRef<{
    bar: HTMLElement | null;
    steps: { el: HTMLElement; at: number; op: string }[];
    p: string;
  } | null>(null);

  useScrollFrame(({ vh }) => {
    const sec = ref.current;
    if (!sec) return;
    const s = (state.current ??= {
      bar: sec.querySelector<HTMLElement>("[data-progbar]"),
      steps: Array.from(sec.querySelectorAll<HTMLElement>("[data-step]"), (el) => ({
        el,
        at: ((Number(el.dataset.step) || 0) + 0.35) / 4,
        op: "",
      })),
      p: "",
    });
    const r = sec.getBoundingClientRect();
    const p = clamp((vh * 0.78 - r.top) / (r.height * 0.55));
    const ps = p.toFixed(3);
    if (ps !== s.p) {
      s.p = ps;
      if (s.bar) s.bar.style.transform = `scaleX(${ps})`;
    }
    for (const step of s.steps) {
      const op = p >= step.at ? "1" : "0.3";
      if (op !== step.op) {
        step.op = op;
        step.el.style.opacity = op;
      }
    }
  }, motion);

  // Wird Bewegung abgeschaltet (Systemeinstellung), zurück zum statischen Endzustand. Versteckt Next
  // die Seite nur (<Activity>), bleibt der Zustand stehen.
  useEffect(() => {
    if (!motion) return;
    return () => {
      const s = state.current;
      if (!s || !window.matchMedia(REDUCED).matches) return;
      state.current = null;
      if (s.bar) s.bar.style.transform = "";
      s.steps.forEach((step) => (step.el.style.opacity = ""));
    };
  }, [motion]);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
