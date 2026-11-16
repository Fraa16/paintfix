"use client";

import { useEffect } from "react";

/**
 * Schaltet weiches Scrollen (globals.css, html[data-smooth]) erst nach dem Laden ein. Beim ersten
 * Laden mit Anker (/leistungen#svc-politur) springt der Browser so sofort an die richtige Stelle,
 * statt animiert, und die Korrektur nach der Hydration (root-scroll.ts) greift exakt.
 */
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.smooth = "";
    return () => {
      delete root.dataset.smooth;
    };
  }, []);
  return null;
}
