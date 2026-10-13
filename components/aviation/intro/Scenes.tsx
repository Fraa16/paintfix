"use client";

import { useEffect, useLayoutEffect, useRef, type ComponentPropsWithoutRef } from "react";
import {
  clamp,
  easeInOutCubic,
  requestFrame,
  useMotionAllowed,
  useScrollFrame,
} from "@/components/shared/motion/scroll";

/**
 * Scrollgebundene Szenen der Aviation-Seite (README 9.2, 9.6, 9.7; Referenz frame(), Zeilen 1205–1243).
 *
 * Jede Szene rendert nur ihr äußeres <section>. Das Markup darin kommt aus der Server-Komponente und
 * trägt die Attribute der Referenz (data-pxy, data-fade, data-zoom, data-expand-*, data-px,
 * data-progbar, data-step). Die Szene sucht diese Teile nur in ihrem eigenen Teilbaum, damit von
 * Next.js versteckt gehaltene Seiten (<Activity>) nie mitgerechnet werden.
 *
 * Statischer Zustand = Server-Render = reduzierte Bewegung. Erst mit useMotionAllowed() lesen die
 * Szenen pro Frame getBoundingClientRect und schreiben ausschließlich transform, opacity und
 * clip-path. Geschrieben wird gesammelt nach allen Lesevorgängen des Frames (Microtask nach dem
 * rAF-Durchlauf) und nur, wenn sich der Wert geändert hat. Wird Bewegung abgeschaltet
 * (Systemeinstellung), fallen die Inline-Werte weg und der statische Zustand gilt wieder. Versteckt
 * Next die Seite nur, bleiben sie stehen.
 */

type Prop = "transform" | "opacity" | "clipPath";
const REDUCED = "(prefers-reduced-motion: reduce)";

const written = new WeakMap<HTMLElement, Partial<Record<Prop, string>>>();
const queue: Array<[HTMLElement, Prop, string]> = [];
let queued = false;

function flush() {
  queued = false;
  for (const [el, prop, value] of queue.splice(0)) el.style[prop] = value;
}

/** Merkt einen Stilwert vor; geschrieben wird erst nach allen Lesevorgängen des Frames. */
function put(el: HTMLElement | null | undefined, prop: Prop, value: string) {
  if (!el) return;
  let last = written.get(el);
  if (!last) written.set(el, (last = {}));
  if (last[prop] === value) return;
  last[prop] = value;
  queue.push([el, prop, value]);
  if (!queued) {
    queued = true;
    queueMicrotask(flush);
  }
}

/** Zurück in den statischen Zustand, aber nur bei reduzierter Bewegung (nicht beim Verstecken). */
function resetIfReduced(els: Array<HTMLElement | null | undefined>) {
  if (!window.matchMedia(REDUCED).matches) return;
  for (const el of els) {
    if (!el) continue;
    written.delete(el);
    el.style.transform = "";
    el.style.opacity = "";
    el.style.clipPath = "";
  }
}

const q = (root: HTMLElement | null, sel: string) => root?.querySelector<HTMLElement>(sel) ?? null;

/** Räumt die Inline-Werte der Szene ab, wenn die Bewegung endet (siehe resetIfReduced). */
function useResetOnStop(motion: boolean, parts: () => Array<HTMLElement | null | undefined>) {
  const partsRef = useRef(parts);
  useEffect(() => {
    partsRef.current = parts;
  });
  useEffect(() => {
    if (!motion) return;
    return () => resetIfReduced(partsRef.current());
  }, [motion]);
}

/**
 * Hero (README 8.4 Punkt 1, Referenz 577–604, avIntro 1197, frame 1215–1216):
 * [data-pxy]  translateY = scrollY × Faktor (0.3)
 * [data-fade] opacity = 1 − scrollY / (0.6 · vh)
 * [data-zoom] Zoom 1.12 → 1 in 3.2s, 90ms nach dem Betreten der Seite (wie avIntro). Der Startwert
 *             1.12 steht als Klasse am Element (nur bei html[data-motion]), hier wird nur data-in
 *             gesetzt; die Übergangszeit kommt ebenfalls aus der Klasse.
 * Die Zeilen-Masken, Overline und untere Zeile laufen über das Reveal-System (Reveals.tsx).
 */
export function HeroScene({ children, ...props }: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotionAllowed();

  // Zeitbasis wie die Reveals: ab dem Einhängen (Hydration), nicht erst nach dem zweiten Render mit
  // useMotionAllowed(). Der Startwert gilt nur bei html[data-motion], sonst ist data-in wirkungslos.
  useEffect(() => {
    const zoom = q(ref.current, "[data-zoom]");
    if (!zoom || !document.documentElement.hasAttribute("data-motion")) return;
    const t = window.setTimeout(() => zoom.setAttribute("data-in", ""), 90);
    return () => {
      window.clearTimeout(t);
      // Beim erneuten Betreten (Next zeigt die versteckte Seite wieder) zoomt das Bild erneut.
      zoom.removeAttribute("data-in");
    };
  }, []);

  useScrollFrame(({ vh, scrollY }) => {
    const root = ref.current;
    if (!root) return;
    const sy = Math.max(0, scrollY);
    // Ab Hero-Höhe + 300px liegt der Inhaltsblock (z-index 2) vollständig darüber: nicht rechnen.
    if (sy > root.getBoundingClientRect().height + 300) return;
    const pxy = q(root, "[data-pxy]");
    const f = parseFloat(pxy?.dataset.pxy ?? "") || 0;
    // Ganz oben ohne Inline-Werte: exakt der statische Zustand (keine eigene Compositing-Ebene).
    put(pxy, "transform", sy === 0 ? "" : `translate3d(0,${(sy * f).toFixed(1)}px,0)`);
    put(
      q(root, "[data-fade]"),
      "opacity",
      sy === 0 ? "" : Math.max(0, 1 - sy / (vh * 0.6)).toFixed(3),
    );
  }, motion);

  useResetOnStop(motion, () => [q(ref.current, "[data-pxy]"), q(ref.current, "[data-fade]")]);

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}

/**
 * Expand (README 9.7, Referenz 630–646 und 1218–1229). Die Höhe 250vh und das klebende Innere kommen
 * aus CSS (html[data-motion]), damit Anker schon vor der Hydration richtig springen.
 * p = clamp(−top / (Höhe − vh)), e = easeInOutCubic(min(1, p / 0.6)), t = clamp((p − 0.5) / 0.25)
 * Rahmen inset(20%·(1−e) 26%·(1−e)), Bild scale(1.2 − 0.2e), Text und Bildzeile opacity t,
 * Text translateY(28·(1−t)px).
 */
export function ExpandScene({ children, ...props }: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotionAllowed();

  useScrollFrame(({ vh }) => {
    const sec = ref.current;
    if (!sec) return;
    // Ohne html[data-motion] (Bewegung erst nach dem Laden erlaubt oder Sicherheitsnetz in boot.ts)
    // ist der Abschnitt nur 100vh hoch: dann gilt der statische Endzustand (p = 1).
    const live = document.documentElement.hasAttribute("data-motion");
    const r = live ? sec.getBoundingClientRect() : null;
    const p = r ? clamp(-r.top / Math.max(1, r.height - vh)) : 1;
    const e = easeInOutCubic(Math.min(1, p / 0.6));
    const t = clamp((p - 0.5) / 0.25);
    const iy = (20 * (1 - e)).toFixed(2);
    const ix = (26 * (1 - e)).toFixed(2);
    const text = q(sec, "[data-expand-text]");
    // Endwerte (e = 1, t = 1) ohne Inline-Wert: exakt der statische Zustand, ohne eigene Ebene.
    put(
      q(sec, "[data-expand-frame]"),
      "clipPath",
      e < 1 ? `inset(${iy}% ${ix}% ${iy}% ${ix}%)` : "",
    );
    put(
      q(sec, "[data-expand-img]"),
      "transform",
      e < 1 ? `scale(${(1.2 - 0.2 * e).toFixed(4)})` : "",
    );
    put(text, "opacity", t < 1 ? t.toFixed(3) : "");
    put(text, "transform", t < 1 ? `translateY(${(28 * (1 - t)).toFixed(1)}px)` : "");
    put(q(sec, "[data-expand-cap]"), "opacity", t < 1 ? t.toFixed(3) : "");
  }, motion);

  useResetOnStop(motion, () =>
    ["frame", "img", "text", "cap"].map((n) => q(ref.current, `[data-expand-${n}]`)),
  );

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}

/**
 * Parallaxe (README 9.2, Referenz frame() 1209–1214): [data-px] verschiebt sich um
 * −((Mitte des Abschnitts − vh/2) × Faktor). Nur im Sichtbereich ± 300px.
 */
export function ParallaxScene({ children, ...props }: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotionAllowed();

  useScrollFrame(({ vh }) => {
    const sec = ref.current;
    const layer = q(sec, "[data-px]");
    if (!sec || !layer) return;
    const r = sec.getBoundingClientRect();
    if (r.bottom < -300 || r.top > vh + 300) return;
    const f = parseFloat(layer.dataset.px ?? "") || 0;
    const y = -(r.top + r.height / 2 - vh / 2) * f;
    put(layer, "transform", `translate3d(0,${y.toFixed(1)}px,0)`);
  }, motion);

  useResetOnStop(motion, () => [q(ref.current, "[data-px]")]);

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}

/**
 * Fortschrittslinie Ablauf (README 9.6, Referenz frame() 1237–1241):
 * p = clamp((0.78 · vh − top) / (0.55 · Höhe)), Linie [data-progbar] scaleX(p), Schritt [data-step=i]
 * opacity 1 ab p ≥ (i + 0.35) / 4, sonst 0.3 (Übergang 0.7s am Element).
 */
export function ProgressScene({ children, ...props }: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotionAllowed();
  const steps = () => Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-step]") ?? []);

  useScrollFrame(({ vh }) => {
    const sec = ref.current;
    if (!sec) return;
    // Wie die Referenz auch außerhalb des Sichtbereichs (geschrieben wird nur bei Änderung), damit
    // die Übergänge der Schritte nie beim Hereinscrollen nachlaufen.
    const r = sec.getBoundingClientRect();
    const p = clamp((vh * 0.78 - r.top) / (r.height * 0.55));
    // Voll bzw. sichtbar ohne Inline-Wert: exakt der statische Zustand.
    put(q(sec, "[data-progbar]"), "transform", p < 1 ? `scaleX(${p.toFixed(3)})` : "");
    const list = steps();
    for (const st of list) {
      const i = parseInt(st.dataset.step ?? "", 10) || 0;
      put(st, "opacity", p >= (i + 0.35) / list.length ? "" : "0.3");
    }
  }, motion);

  useResetOnStop(motion, () => [q(ref.current, "[data-progbar]"), ...steps()]);

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}

/**
 * Horizontal-Scroll der Leistungen (README 9.7, Referenz frame() 1230–1236), nur ab 980px mit Bewegung
 * gerendert (ServicesSwitch): Abschnittshöhe = (Spurbreite − Viewportbreite) + vh, das Innere klebt,
 * die Spur [data-hs-track] verschiebt sich um −p × Distanz mit p = clamp(−top / Distanz). Die Höhe
 * wird nur bei Größenänderungen gesetzt, pro Frame nur transform.
 */
export function HorizontalScene({ children, ...props }: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<HTMLElement>(null);
  const dist = useRef(0);

  // Vor dem ersten Paint messen: Die Fassung erscheint erst nach der Hydration (Wechsel von der
  // Tab-Version), ohne Zwischenframe mit falscher Höhe.
  useLayoutEffect(() => {
    const sec = ref.current;
    const track = q(sec, "[data-hs-track]");
    if (!sec || !track) return;
    const measure = () => {
      dist.current = Math.max(0, track.scrollWidth - sec.clientWidth);
      const h = `${Math.round(dist.current + window.innerHeight)}px`;
      if (sec.style.height !== h) sec.style.height = h;
      requestFrame();
    };

    // Der Wechsel von der Tab-Version verschiebt alles darunter. Steht die Seite auf ihrem Anker
    // (direkt geladen mit /aviation#av-contact), danach exakt dorthin zurück; die Scroll-Verankerung
    // des Browsers rundet sonst um bis zu 1px.
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const target = hash ? document.getElementById(hash) : null;
    const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const onAnchor =
      !!target &&
      !!(sec.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) &&
      Math.abs(target.getBoundingClientRect().top - pad) < 2;
    measure();
    if (onAnchor) target.scrollIntoView({ block: "start", behavior: "instant" });

    // Die Spurbreite hängt von der Viewportbreite und den Schriften ab.
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);

    // Bilder rechts außerhalb der klebenden Fläche würden erst beim Hereinschieben laden. Deshalb
    // laden, sobald der Abschnitt nur noch eine Viewporthöhe entfernt ist.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        track.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
          img.loading = "eager";
        });
        io.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(sec);

    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useScrollFrame(() => {
    const sec = ref.current;
    if (!sec) return;
    const p = clamp(-sec.getBoundingClientRect().top / Math.max(1, dist.current));
    put(
      q(sec, "[data-hs-track]"),
      "transform",
      `translate3d(${(-p * dist.current).toFixed(1)}px,0,0)`,
    );
  });

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
