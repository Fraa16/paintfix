"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";

/**
 * Menü als Disclosure (Button mit aria-expanded + Panel, kein ARIA-Menü), für das Mega-Menü und die
 * mobilen Menüs beider Marken.
 *
 * - Klick, Enter oder Leertaste öffnen und schließen.
 * - `hover`: Mit der Maus öffnet es nach kurzem Verweilen (120 ms) und schließt nach dem Verlassen
 *   (220 ms Toleranz für den Weg vom Auslöser zum Panel). Ein Klick hält ein so geöffnetes Menü offen,
 *   erst der nächste schließt es. Touch und Stift öffnen nur per Tippen.
 * - Escape schließt und gibt den Fokus an den Auslöser zurück. Ein Klick außerhalb und Fokus, der per
 *   Tab das Menü verlässt, schließen ebenfalls.
 * - Das Menü gilt nur für die Seite, auf der es geöffnet wurde: Ein Seitenwechsel schließt es.
 * - `flagRoot`: setzt html[data-menu="open"], solange es offen ist (blendet die mobilen
 *   Aktionsleisten aus).
 *
 * Gibt nur einfache Werte zurück (keine Refs): `rootProps` gehört an das Element, das Auslöser und
 * Panel umschließt, `triggerId` an den Auslöser. Gefunden werden beide über ihre id.
 */
export function useDisclosure(
  pathname: string,
  { hover = false, flagRoot = false }: { hover?: boolean; flagRoot?: boolean } = {},
) {
  const [state, setState] = useState<{ on: string; via: "hover" | "click" } | null>(null);
  const open = state?.on === pathname;
  const via = open ? state.via : null;
  const uid = useId();
  const rootId = `${uid}root`;
  const triggerId = `${uid}trigger`;
  const timer = useRef<number | undefined>(undefined);

  const clearTimer = () => window.clearTimeout(timer.current);
  const close = useCallback(() => {
    window.clearTimeout(timer.current);
    setState(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const inside = (node: Node | null) =>
      !!node && !!document.getElementById(rootId)?.contains(node);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      document.getElementById(triggerId)?.focus();
    };
    const onDown = (e: globalThis.PointerEvent) => {
      if (!inside(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    const root = document.documentElement;
    if (flagRoot) root.dataset.menu = "open";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      if (flagRoot) delete root.dataset.menu;
    };
  }, [open, close, flagRoot, rootId, triggerId]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const toggle = () => {
    clearTimer();
    // Per Maus geöffnet: der Klick hält das Menü offen, statt es gleich wieder zu schließen.
    if (via === "hover") setState({ on: pathname, via: "click" });
    else setState(open ? null : { on: pathname, via: "click" });
  };

  const rootProps = {
    id: rootId,
    onPointerEnter: (e: PointerEvent) => {
      if (!hover || e.pointerType !== "mouse") return;
      clearTimer();
      if (open) return;
      timer.current = window.setTimeout(() => setState({ on: pathname, via: "hover" }), 120);
    },
    onPointerLeave: (e: PointerEvent) => {
      if (!hover || e.pointerType !== "mouse") return;
      clearTimer();
      if (via === "hover") timer.current = window.setTimeout(close, 220);
    },
    onBlur: (e: FocusEvent) => {
      // Nur wenn der Fokus auf ein anderes Element außerhalb wandert (Tab); Klicks ins Leere
      // (relatedTarget null) behandelt der pointerdown-Listener.
      const next = e.relatedTarget as Node | null;
      if (open && next && !e.currentTarget.contains(next)) close();
    },
  };

  return { open, close, toggle, rootProps, triggerId };
}
