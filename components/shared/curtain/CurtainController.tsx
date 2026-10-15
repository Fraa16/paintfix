"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Ablauf der Markenwechsel-Blende (README 9.4, Referenz go(), Zeilen 1321–1339). Markup und Zustände:
 * Curtain.tsx.
 *
 * Ein Klick-Listener in der Capture-Phase am document fängt interne Links ab, die die Marke wechseln
 * (Fahrzeug, auch Rechtliches ↔ /aviation, /en/aviation), bevor next/link sie behandelt. preventDefault
 * genügt: next/link ruft dann noch das onClick des Links auf (z. B. Menü schließen wie go() der
 * Referenz), navigiert aber nicht selbst. Keine Link-Komponente muss davon wissen. Nicht abgefangen
 * werden: Klicks mit Zusatztaste oder anderer Maustaste, target≠_self, download, externe Ziele,
 * Wechsel innerhalb einer Marke (auch DE/EN), reduzierte Bewegung.
 *
 * Zeitplan ab Klick (wie die Referenz):
 *      0ms  Blende unter dem Viewport (prep), html[data-curtain-hold]: Reveals warten
 *   +2 Frames  cover: hochfahren 0.85s, Inhalt blendet ein
 *    860ms  navigieren; Next scrollt nach oben bzw. zum #Anker (scroll-padding-top = Header-Höhe,
 *           wie _anchor der Referenz)
 *   1220ms  reveal: nach oben wegfahren, hold entfernen, „pf:curtain-release“ (Reveals starten)
 *   2200ms  Blende ausblenden
 *
 * Navigation:
 * - Im selben Root-Layout (Fahrzeug ↔ /aviation): router.push. Die Blende lebt im Root-Layout und
 *   bleibt stehen. Ist die neue Seite um 1220ms noch nicht übernommen (langsames Netz), wartet das
 *   Aufdecken darauf, damit nie die alte Seite unter der Blende hervorkommt.
 * - Über die Root-Layout-Grenze (/en/aviation ↔ Fahrzeug, Neuladen): Ziel-Marke in sessionStorage
 *   „pf-curtain“, dann location.assign. boot.ts setzt im neuen Dokument vor dem ersten Paint
 *   html[data-curtain-in] und html[data-curtain-hold]; die Blende deckt per CSS, dieser Controller
 *   übernimmt nach der Hydration und setzt den Ablauf fort (reveal nach 360ms, Ende nach 1340ms).
 *
 * Weitere Klicks auf interne Links werden ignoriert, solange eine Blende läuft (Referenz:
 * if (s.curtain) return). Zurück/Vor bleibt normal (kein Curtain). Zurück während der Blende bricht den
 * Wechsel ab und deckt auf. Kommt das alte Dokument aus dem Back-Forward-Cache zurück, wird die dort
 * stehengebliebene Blende entfernt.
 *
 * Der Ablauf liegt im Modulzustand statt im Effekt: Er übersteht den doppelten Effektlauf im
 * StrictMode und ist unabhängig vom Rendern der neuen Seite.
 */
type Brand = "av" | "car";

const STORAGE_KEY = "pf-curtain";
const T_NAVIGATE = 860;
const T_REVEAL = 1220;
const T_REMOVE = 2200;
/** Bleibt das alte Dokument nach location.assign so lange bestehen, wird wieder aufgedeckt. */
const T_ASSIGN_FALLBACK = 10000;
/** Längste Wartezeit auf die neue Seite bei router.push, danach wird trotzdem aufgedeckt. */
const T_COMMIT_MAX = 10000;
const REDUCED = "(prefers-reduced-motion: reduce)";

const brandOf = (path: string): Brand => (/^\/(?:en\/)?aviation(?:\/|$)/.test(path) ? "av" : "car");
/** Root-Layout eines Pfads: app/(en) nur für /en/…, sonst app/(de). */
const rootOf = (path: string) => (/^\/en(?:\/|$)/.test(path) ? "en" : "de");

interface Run {
  el: HTMLElement;
  timers: number[];
  frame: number;
}

let run: Run | null = null;
let router: { push: (href: string) => void; prefetch: (href: string) => void } | null = null;

const curtainEl = () => document.querySelector<HTMLElement>("[data-pf-curtain]");

function later(r: Run, fn: () => void, ms: number) {
  r.timers.push(window.setTimeout(fn, ms));
}

function stopTimers(r: Run) {
  r.timers.forEach(clearTimeout);
  r.timers = [];
  cancelAnimationFrame(r.frame);
}

/** Reveals freigeben (components/shared/motion/Reveals.tsx). */
function release() {
  document.documentElement.removeAttribute("data-curtain-hold");
  window.dispatchEvent(new Event("pf:curtain-release"));
}

/**
 * Fokus auf den Seiteninhalt, wenn er mit dem geklickten Link verschwunden ist (Next lässt den Fokus
 * bei Client-Navigation stehen, der Link liegt jetzt in der versteckten alten Seite). Sonst begänne
 * die nächste Tab-Taste irgendwo in der neuen Seite (WCAG 2.4.3).
 */
function focusMain() {
  const active = document.activeElement;
  // Versteckte Seiten (<Activity>, display: none) haben keine Boxen; feste Leisten schon.
  if (active && active !== document.body && active.getClientRects().length > 0) return;
  const main = Array.from(document.querySelectorAll<HTMLElement>("main#inhalt")).find(
    (m) => m.getClientRects().length > 0,
  );
  main?.focus({ preventScroll: true });
}

/** Blende nach oben wegfahren, nach 980ms (2200 − 1220) ausblenden. */
function reveal(r: Run) {
  r.el.dataset.ph = "reveal";
  focusMain();
  release();
  later(r, () => finish(r), T_REMOVE - T_REVEAL);
}

function finish(r: Run) {
  if (run !== r) return;
  stopTimers(r);
  delete r.el.dataset.ph;
  delete r.el.dataset.to;
  run = null;
}

/** Sofort aufräumen, z. B. wenn das alte Dokument aus dem Back-Forward-Cache zurückkommt. */
function reset() {
  const root = document.documentElement;
  root.removeAttribute("data-curtain-in");
  if (run) finish(run);
  if (root.hasAttribute("data-curtain-hold")) release();
}

/**
 * Ruft fn auf, sobald die neue Seite übernommen ist: Next setzt URL, DOM und Scroll im selben Commit,
 * der Pfad weicht dann vom alten ab (Markenwechsel wechselt immer den Pfad).
 */
function whenCommitted(r: Run, from: string, fn: () => void) {
  const start = performance.now();
  const check = () => {
    if (run !== r) return;
    if (window.location.pathname !== from || performance.now() - start > T_COMMIT_MAX) fn();
    else r.frame = requestAnimationFrame(check);
  };
  check();
}

function start(el: HTMLElement, to: Brand, url: URL) {
  const r: Run = { el, timers: [], frame: 0 };
  run = r;
  const from = window.location.pathname;
  const crossDocument = rootOf(url.pathname) !== rootOf(from);
  if (!crossDocument) router?.prefetch(url.pathname + url.search);

  document.documentElement.setAttribute("data-curtain-hold", "");
  el.dataset.to = to;
  el.dataset.ph = "prep";
  // Zwei Frames wie die Referenz: Der Startzustand (100%) muss gerendert sein, sonst kein Übergang.
  r.frame = requestAnimationFrame(() => {
    r.frame = requestAnimationFrame(() => {
      el.dataset.ph = "cover";
    });
  });

  const href = url.pathname + url.search + url.hash;
  later(
    r,
    () => {
      if (!crossDocument) {
        router?.push(href);
        return;
      }
      try {
        sessionStorage.setItem(STORAGE_KEY, to);
      } catch {
        // Ohne sessionStorage startet die neue Seite einfach ohne Blende.
      }
      window.location.assign(href);
      // Navigation abgebrochen oder fehlgeschlagen: alte Seite wieder aufdecken.
      later(
        r,
        () => {
          try {
            sessionStorage.removeItem(STORAGE_KEY);
          } catch {
            // nichts zu tun
          }
          reveal(r);
        },
        T_ASSIGN_FALLBACK,
      );
    },
    T_NAVIGATE,
  );

  if (!crossDocument) later(r, () => whenCommitted(r, from, () => reveal(r)), T_REVEAL);
}

/** Übergabe aus dem vorigen Dokument (boot.ts): verdeckt starten und ab 860ms weiterlaufen. */
function takeOver(el: HTMLElement) {
  const root = document.documentElement;
  const to = root.getAttribute("data-curtain-in");
  if (to !== "av" && to !== "car") return;
  // Ohne html[data-motion] (Sicherheitsnetz in boot.ts) hat die Blende nie gedeckt.
  if (!root.hasAttribute("data-motion")) {
    root.removeAttribute("data-curtain-in");
    release();
    return;
  }
  const r: Run = { el, timers: [], frame: 0 };
  run = r;
  // Zustand ans Element übergeben, bevor html[data-curtain-in] wegfällt: Die Blende bleibt deckend.
  el.dataset.to = to;
  el.dataset.ph = "cover";
  root.removeAttribute("data-curtain-in");
  later(r, () => reveal(r), T_REVEAL - T_NAVIGATE);
}

function onClick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
  if (!(a instanceof HTMLAnchorElement) || a.hasAttribute("download")) return;
  const target = a.getAttribute("target");
  if (target && target !== "_self") return;
  const url = new URL(a.href);
  if (url.origin !== window.location.origin) return;

  // Während eine Blende läuft, keine weitere Navigation (Referenz: if (s.curtain) return). Anker auf
  // derselben Seite (z. B. der Sprunglink, sobald die neue Seite sichtbar ist) bleiben erlaubt.
  if (run) {
    const here = window.location;
    const samePage = url.pathname === here.pathname && url.search === here.search && url.hash;
    if (!samePage) e.preventDefault();
    return;
  }
  const to = brandOf(url.pathname);
  if (to === brandOf(window.location.pathname)) return;
  const root = document.documentElement;
  if (!root.hasAttribute("data-motion") || window.matchMedia(REDUCED).matches) return;
  const el = curtainEl();
  if (!el) return;
  e.preventDefault();
  start(el, to, url);
}

/** Zurück/Vor während der Blende: geplanten Wechsel verwerfen und aufdecken. */
function onPopState() {
  const r = run;
  if (!r || r.el.dataset.ph === "reveal") return;
  stopTimers(r);
  if (r.el.dataset.ph === "prep") {
    finish(r);
    release();
  } else reveal(r);
}

function onPageShow(e: PageTransitionEvent) {
  if (e.persisted) reset();
}

export function CurtainController() {
  const nextRouter = useRouter();

  useEffect(() => {
    router = nextRouter;
  }, [nextRouter]);

  useEffect(() => {
    const el = curtainEl();
    if (el) takeOver(el);
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
