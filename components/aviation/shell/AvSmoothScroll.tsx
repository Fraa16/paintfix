"use client";

import type Lenis from "lenis";
import { useEffect } from "react";
import { useMedia, useMotionAllowed } from "@/components/shared/motion/scroll";

/**
 * Weiches Scrollen der Aviation-Seite mit Lenis (README 9.7, CLAUDE.md Regel 7; Referenz
 * smoothOn()/onWheel, Zeilen 1282–1311): nur hier, nur ab 980px, nicht bei Touch (pointer: coarse),
 * nicht bei reduzierter Bewegung. lerp 0.085 wie der Prototyp. Lenis wird erst geladen, wenn alle
 * Bedingungen gelten, und beim Verlassen der Seite oder Wegfall einer Bedingung wieder entfernt.
 *
 * - Mausrad in textarea, select und [data-native-scroll] bleibt nativ (wie die Referenz).
 * - Anker-Links (#…) auf derselben Seite laufen über lenis.scrollTo. Den Abstand von 84px liefert
 *   scroll-padding-top am <html> (--pf-header-h); derselbe Wert gilt für den Browser beim direkten
 *   Laden mit Anker und ohne Lenis.
 * - Scrollt etwas anderes die Seite (Tastatur, Fokus, Scrollleiste), während Lenis noch gleitet, gibt
 *   Lenis sofort ab (Referenz smoothLoop: Abbruch bei fremder Scrollbewegung).
 */
let current: Lenis | null = null;

/** Laufende Lenis-Instanz der Aviation-Seite, sonst null (Bedingungen nicht erfüllt). */
export function getAvLenis(): Lenis | null {
  return current;
}

const NATIVE = "textarea, select, [data-native-scroll]";

export function AvSmoothScroll() {
  const motion = useMotionAllowed();
  const wide = useMedia("(min-width: 980px)");
  const coarse = useMedia("(pointer: coarse)");
  const on = motion && wide && !coarse;

  useEffect(() => {
    if (!on) return;
    let lenis: Lenis | null = null;
    let cancelled = false;

    const handOver = () => {
      if (lenis?.isScrolling === "smooth") {
        lenis.stop();
        lenis.start();
      }
    };
    const onForeignScroll = () => {
      if (lenis?.isScrolling === "smooth" && Math.abs(window.scrollY - lenis.animatedScroll) > 3)
        handOver();
    };
    const onClick = (e: MouseEvent) => {
      if (!lenis || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(a instanceof HTMLAnchorElement) || a.hasAttribute("download")) return;
      if (a.target && a.target !== "_self") return;
      const url = new URL(a.href);
      const here = window.location;
      if (!url.hash || url.origin !== here.origin || url.pathname !== here.pathname) return;
      if (url.search !== here.search) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      // Vor next/link (Capture-Phase am window): Link sieht defaultPrevented und navigiert nicht selbst,
      // ruft aber weiterhin sein onClick auf (z. B. Modellwahl in Zusammenarbeit).
      e.preventDefault();
      // Ziel wie der Browser: Oberkante minus scroll-padding-top (84px), abgerundet, damit der Abschnitt
      // nie unter den Header rutscht (Lenis selbst rechnet mit Bruchteilen und landet ±1px daneben).
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      lenis.scrollTo(Math.floor(target.getBoundingClientRect().top + window.scrollY - pad));
      if (url.hash !== here.hash) window.history.pushState(null, "", url.hash);
      // Wie ein nativer Anker: fokussierbare Ziele (z. B. <main tabIndex={-1}> beim Sprunglink) erhalten
      // den Fokus.
      if (target.hasAttribute("tabindex")) target.focus({ preventScroll: true });
    };

    void import("lenis").then(({ default: LenisClass }) => {
      if (cancelled) return;
      lenis = new LenisClass({
        lerp: 0.085,
        autoRaf: true,
        prevent: (node) => node.matches(NATIVE),
      });
      current = lenis;
    });

    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", handOver);
    window.addEventListener("pointerdown", handOver);
    window.addEventListener("scroll", onForeignScroll, { passive: true });
    return () => {
      cancelled = true;
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", handOver);
      window.removeEventListener("pointerdown", handOver);
      window.removeEventListener("scroll", onForeignScroll);
      if (lenis) {
        if (current === lenis) current = null;
        // Erst anhalten: Lenis setzt nach nativem Scrollen per Timeout (400ms) isScrolling = false und
        // schreibt dabei die Klasse „lenis“ wieder an <html>, auch nach destroy(). Ist isScrolling
        // schon false, bleibt dieser Timeout wirkungslos.
        lenis.stop();
        lenis.destroy();
        lenis = null;
      }
    };
  }, [on]);

  return null;
}
