"use client";

import type { ReactNode } from "react";
import { useMedia, useMotionAllowed } from "@/components/shared/motion/scroll";

/**
 * Leistungen (README 8.4 Punkt 4, Referenz hsOn, Zeile 1458): ab 980px und mit Bewegung der
 * Horizontal-Scroll, sonst die Tab-Version. Der Server rendert immer die Tab-Version (statischer
 * Zustand = reduzierte Bewegung); im Browser wird nach der Hydration umgeschaltet. Beide Fassungen
 * tragen id="av-services".
 */
export function ServicesSwitch({ horizontal, tabs }: { horizontal: ReactNode; tabs: ReactNode }) {
  const motion = useMotionAllowed();
  const wide = useMedia("(min-width: 980px)");
  return motion && wide ? horizontal : tabs;
}
