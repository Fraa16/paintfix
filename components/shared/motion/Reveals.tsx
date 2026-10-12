"use client";

import { useEffect } from "react";

/**
 * Reveal-System (README 9.1, Referenz reveal()/prep()/show(), Zeilen 1251–1279).
 *
 * Markierung im Markup (Server-Komponenten genügen), Wert = Verzögerung in ms:
 *   data-rv="360"     Fade-up: opacity 0 → 1 (1.1s), translate 0 32px → 0 (1.2s), --ease-out
 *   data-rvs="90"     Staffel: jedes Kind wie Fade-up mit 28px (1s / 1.1s), Verzögerung Index × Wert
 *   data-rvm="80"     Maske: translate 0 110% → 0 (1.25s, --ease-mask); Elternelement overflow: hidden
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
 * Achtung: Reveals setzen `translate`, `opacity`, `clip-path`, `scale`, `rotate`. Elemente mit eigenen
 * Tailwind-Utilities für dieselben Eigenschaften (z. B. -translate-y-1/2) nicht direkt markieren,
 * sondern einen Wrapper verwenden.
 */
const SELECTOR = "[data-rv],[data-rvs],[data-rvm],[data-rvc],[data-stamp]";
const ATTRS = ["data-rv", "data-rvm", "data-rvc", "data-stamp"] as const;

declare global {
  interface Window {
    __pfMotion?: boolean;
  }
}

export function Reveals() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-motion")) return;
    window.__pfMotion = true;

    const seen = new WeakSet<Element>();
    const pending = new Set<Element>();
    const held = () => root.hasAttribute("data-curtain-hold");

    const show = (el: Element) => {
      el.setAttribute("data-in", "");
      io.unobserve(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (held()) pending.add(e.target);
          else show(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    const prepare = (el: HTMLElement) => {
      if (seen.has(el) || el.hasAttribute("data-in")) return;
      seen.add(el);
      if (el.hasAttribute("data-rvs")) {
        el.style.setProperty("--rv-step", `${parseInt(el.dataset.rvs ?? "", 10) || 100}ms`);
        Array.from(el.children).forEach((child, i) =>
          (child as HTMLElement).style.setProperty("--rv-i", String(i)),
        );
      } else {
        const attr = ATTRS.find((a) => el.hasAttribute(a));
        const delay = attr ? parseInt(el.getAttribute(attr) ?? "", 10) || 0 : 0;
        el.style.setProperty("--rv-d", `${delay}ms`);
      }
      io.observe(el);
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

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(queued);
      window.removeEventListener("pf:curtain-release", release);
    };
  }, []);

  return null;
}
