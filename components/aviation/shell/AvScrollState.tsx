"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { aviationSectionIds } from "@/content/aviation";

/**
 * Scrollzustand der Aviation-Seite (Referenz frame(), Zeilen 1244–1249):
 * over  Oberkante des Inhalts ([data-av-content]) liegt ≤ 90px unter dem Viewport-Rand,
 *       der Header wechselt auf Creme (README 8.4 Punkt 0).
 * sec   Index des letzten Abschnitts aus aviationSectionIds, dessen Oberkante ≤ 45 % vh liegt,
 *       sonst −1 (README 9.7). Grundlage für Abschnittsanzeige und mobile Aktionsleiste.
 */
export type AvScroll = { over: boolean; sec: number };

const initial: AvScroll = { over: false, sec: -1 };
const AvScrollContext = createContext<AvScroll>(initial);

export function useAvScroll(): AvScroll {
  return useContext(AvScrollContext);
}

function measure(): AvScroll {
  const content = document.querySelector("[data-av-content]");
  const over = content ? content.getBoundingClientRect().top <= 90 : false;
  const line = window.innerHeight * 0.45;
  let sec = -1;
  aviationSectionIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) sec = i;
  });
  return { over, sec };
}

export function AvScrollState({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AvScroll>(initial);

  useEffect(() => {
    let raf = 0;
    const frame = () => {
      raf = 0;
      const next = measure();
      setState((s) => (s.over === next.over && s.sec === next.sec ? s : next));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return <AvScrollContext value={state}>{children}</AvScrollContext>;
}
