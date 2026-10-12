"use client";

import { useLayoutEffect } from "react";

/**
 * Setzt eine CSS-Variable am <html>, solange die aufrufende Komponente sichtbar ist.
 *
 * Grundlage für scroll-padding (globals.css): Header, Klassenleiste und mobile Aktionsleisten melden
 * ihre Höhe, damit Anker und Tastaturfokus nicht unter festen Leisten landen (WCAG 2.4.11).
 * Bewusst per Effekt statt html:has(…): Mit Cache Components hält Next.js besuchte Seiten versteckt
 * (<Activity>, display: none) im DOM. :has() würde sie mitzählen, Effekte versteckter Seiten räumt
 * React dagegen auf.
 */
export function useRootVar(name: string, value: string | null) {
  useLayoutEffect(() => {
    if (value === null) return;
    const style = document.documentElement.style;
    style.setProperty(name, value);
    return () => {
      style.removeProperty(name);
    };
  }, [name, value]);
}

/**
 * Springt erneut zum Anker der URL, wenn er mit `prefix` beginnt. Der Browser springt beim ersten
 * Laden vor der Hydration, also bevor die gemessenen Abstände gesetzt sind. Nach dem Laden der
 * Schriften (die Höhe klebender Leisten kann sich dadurch ändern) noch einmal, außer der Besucher hat
 * inzwischen selbst gescrollt.
 */
export function rescrollToHash(prefix: string) {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id.startsWith(prefix)) return;
  const jump = () =>
    document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
  jump();
  const y = window.scrollY;
  void document.fonts.ready.then(() =>
    // Zwei Frames warten, damit ResizeObserver die neue Leistenhöhe schon gemeldet hat.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (Math.abs(window.scrollY - y) < 2) jump();
      }),
    ),
  );
}
