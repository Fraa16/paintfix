"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Gemeinsamer Scroll-Takt für alle scrollgebundenen Effekte (Parallaxe, Fortschrittslinien,
 * Scroll-Szenen): ein passiver scroll-/resize-Listener, gebündelt per requestAnimationFrame, wie
 * frame() der Referenz (Zeilen 1201–1250). Lenis scrollt das Fenster selbst, löst also dieselben
 * scroll-Events aus.
 *
 * Effekte lesen Layout nur (getBoundingClientRect) und schreiben nur transform/opacity/clip-path.
 */
export interface Frame {
  vw: number;
  vh: number;
  scrollY: number;
}

type FrameCallback = (f: Frame) => void;

const callbacks = new Set<FrameCallback>();
let raf = 0;
/** Verschiebt sich Layout ohne Scrollen (Schriften, Hydration, Tabs), wird ebenfalls neu gerechnet. */
let bodyObserver: ResizeObserver | null = null;

function run() {
  raf = 0;
  const f: Frame = { vw: window.innerWidth, vh: window.innerHeight, scrollY: window.scrollY };
  callbacks.forEach((cb) => cb(f));
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(run);
}

function subscribe(cb: FrameCallback) {
  if (callbacks.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    bodyObserver = new ResizeObserver(schedule);
    bodyObserver.observe(document.body);
  }
  callbacks.add(cb);
  schedule();
  return () => {
    callbacks.delete(cb);
    if (callbacks.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      bodyObserver?.disconnect();
      bodyObserver = null;
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

/** Ruft `cb` bei jedem Scroll-/Resize-Frame auf, solange `enabled`. Immer die aktuelle `cb`. */
export function useScrollFrame(cb: FrameCallback, enabled = true) {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  });
  useEffect(() => {
    if (!enabled) return;
    return subscribe((f) => ref.current(f));
  }, [enabled]);
}

/** Erneut rechnen, z. B. nachdem sich die Höhe eines Abschnitts geändert hat. */
export function requestFrame() {
  if (typeof window !== "undefined") schedule();
}

const REDUCED = "(prefers-reduced-motion: reduce)";

const mediaSubscribers = new Map<string, (onChange: () => void) => () => void>();

/** Stabile subscribe-Funktion je Query, damit useSyncExternalStore nicht bei jedem Render neu abonniert. */
function subscribeMedia(query: string) {
  let sub = mediaSubscribers.get(query);
  if (!sub) {
    sub = (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    };
    mediaSubscribers.set(query, sub);
  }
  return sub;
}

/**
 * true, wenn Bewegung erlaubt ist (keine reduzierte Bewegung). Auf dem Server und vor der Hydration
 * false: Effekte starten erst im Browser, der statische Zustand ist immer der reduzierte.
 */
export function useMotionAllowed(): boolean {
  return useSyncExternalStore(
    subscribeMedia(REDUCED),
    () => !window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/** Media Query als Hook, z. B. useMedia("(min-width: 980px)"). Auf dem Server false. */
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** easeInOutCubic (README 9.6/9.7). */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v));
}
