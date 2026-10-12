"use client";

import { useEffect } from "react";

/**
 * Reveal-System (README 9.1, Referenz reveal()/prep()/show(), Zeilen 1251–1279).
 *
 * Markierung im Markup (Server-Komponenten genügen), Wert = Verzögerung in ms:
 *   data-rv="360"     Fade-up: opacity 0 → 1 (1.1s), translate 0 32px → 0 (1.2s), --ease-out
 *   data-rvs="90"     Staffel: jedes Kind wie Fade-up mit 28px (1s / 1.1s), Verzögerung Index × Wert
 *   data-rvm="80"     Maske: translate 0 110% → 0 (1.25s, --ease-mask); Elternelement clippt vertikal
 *   data-rvc="120"    Clip: clip-path inset(100% 0 0 0) → inset(0) (1.6s, --ease-clip)
 *   data-stamp="1500" Stempel: opacity 0, scale 1.7, rotate −20deg → Endzustand des Elements
 *                     (opacity .3s, Bewegung .6s --ease-stamp)
 *
 * Die Startzustände stehen in globals.css und gelten nur bei html[data-motion] (boot.ts setzt es vor
 * dem ersten Paint, nie bei reduzierter Bewegung). Ausgelöst wird einmalig, sobald die Oberkante unter
 * 92 % der Viewport-Höhe liegt (IntersectionObserver, rootMargin −8 % unten); dann bekommt das Element
 * data-in. Solange der Curtain die Seite bedeckt (html[data-curtain-hold]), warten Reveals und starten
 * beim Event „pf:curtain-release“.
 *
 * Masken beobachten das clippende Elternelement: Der IntersectionObserver berücksichtigt den Clip der
 * Vorfahren, eine um 110 % verschobene Zeile wäre also nie sichtbar.
 *
 * Hydration: Verzögerungen kommen aus einem eigenen Stylesheet (keine Inline-Styles), und data-in wird
 * erst gesetzt, wenn React das Element hydriert hat. Sonst meldet React Abweichungen zwischen Server-
 * und Client-Markup, weil das Root-Layout vor den Seitensegmenten hydriert.
 *
 * Achtung: Reveals setzen `translate`, `opacity`, `clip-path`, `scale`, `rotate`. Elemente mit eigenen
 * Tailwind-Utilities für dieselben Eigenschaften (z. B. -translate-y-1/2) nicht direkt markieren,
 * sondern einen Wrapper verwenden.
 */
const SELECTOR = "[data-rv],[data-rvs],[data-rvm],[data-rvc],[data-stamp]";
const DELAY_ATTRS = ["data-rv", "data-rvm", "data-rvc", "data-stamp"] as const;
/** Längste Wartezeit auf die Hydration, danach wird trotzdem eingeblendet. */
const HYDRATION_TIMEOUT = 5000;

declare global {
  interface Window {
    __pfMotion?: boolean;
  }
}

/** React hinterlegt beim Hydrieren die Fiber als eigene Eigenschaft `__reactFiber$…` am Knoten. */
function isHydrated(el: Element) {
  return Object.keys(el).some((k) => k.startsWith("__reactFiber$"));
}

/** Regeln für Verzögerungen und Staffel-Indizes, erzeugt aus den Werten im Markup. */
function createDelaySheet() {
  const sheet = new CSSStyleSheet();
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  const delays = new Set<string>();
  const steps = new Set<string>();
  let children = 0;

  return {
    sheet,
    add(el: Element) {
      const step = el.getAttribute("data-rvs");
      if (step !== null) {
        if (!steps.has(step)) {
          steps.add(step);
          const ms = parseInt(step, 10) || 100;
          sheet.insertRule(`[data-rvs="${CSS.escape(step)}"]{--rv-step:${ms}ms}`);
        }
        for (; children < el.children.length; children++) {
          sheet.insertRule(`[data-rvs]>:nth-child(${children + 1}){--rv-i:${children}}`);
        }
        return;
      }
      for (const attr of DELAY_ATTRS) {
        const value = el.getAttribute(attr);
        if (value === null || delays.has(`${attr}=${value}`)) continue;
        delays.add(`${attr}=${value}`);
        const ms = parseInt(value, 10) || 0;
        sheet.insertRule(`[${attr}="${CSS.escape(value)}"]{--rv-d:${ms}ms}`);
      }
    },
    remove() {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s !== sheet);
    },
  };
}

export function Reveals() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-motion")) return;
    window.__pfMotion = true;

    const delays = createDelaySheet();
    const seen = new WeakSet<Element>();
    /** Beobachtetes Element → Reveal-Elemente (bei Masken das Elternelement). */
    const targets = new Map<Element, Element[]>();
    const pending = new Set<Element>();
    const waiting = new Set<Element>();
    const start = performance.now();
    let waitFrame = 0;
    const held = () => root.hasAttribute("data-curtain-hold");

    const flushWaiting = () => {
      waitFrame = 0;
      const late = performance.now() - start > HYDRATION_TIMEOUT;
      waiting.forEach((el) => {
        if (!late && !isHydrated(el)) return;
        el.setAttribute("data-in", "");
        waiting.delete(el);
      });
      if (waiting.size) waitFrame = requestAnimationFrame(flushWaiting);
    };

    const show = (el: Element) => {
      if (!isHydrated(el) && performance.now() - start <= HYDRATION_TIMEOUT) {
        waiting.add(el);
        if (!waitFrame) waitFrame = requestAnimationFrame(flushWaiting);
        return;
      }
      el.setAttribute("data-in", "");
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const els = targets.get(e.target) ?? [];
          targets.delete(e.target);
          io.unobserve(e.target);
          for (const el of els) {
            if (held()) pending.add(el);
            else show(el);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    const prepare = (el: HTMLElement) => {
      if (seen.has(el) || el.hasAttribute("data-in")) return;
      seen.add(el);
      delays.add(el);
      const target = (el.hasAttribute("data-rvm") && el.parentElement) || el;
      const els = targets.get(target);
      if (els) els.push(el);
      else {
        targets.set(target, [el]);
        io.observe(target);
      }
    };

    const scan = () => document.querySelectorAll<HTMLElement>(SELECTOR).forEach(prepare);
    scan();

    // Neue Seiten (Client-Navigation), Tabs und Suspense-Inhalte bringen neue Elemente mit.
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (!queued) queued = requestAnimationFrame(() => ((queued = 0), scan()));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const release = () => {
      pending.forEach(show);
      pending.clear();
    };
    window.addEventListener("pf:curtain-release", release);

    // Wechsel zu reduzierter Bewegung bei offener Seite: alles sofort sichtbar.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduced = () => {
      if (reduced.matches) root.removeAttribute("data-motion");
    };
    reduced.addEventListener("change", onReduced);

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(queued);
      cancelAnimationFrame(waitFrame);
      window.removeEventListener("pf:curtain-release", release);
      reduced.removeEventListener("change", onReduced);
      delays.remove();
    };
  }, []);

  return null;
}
