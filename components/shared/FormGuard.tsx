"use client";

import { useEffect, useRef } from "react";
import type { SpamFields } from "@/lib/forms/rules";

/**
 * Spam-Schutz ohne Drittanbieter (CLAUDE.md): Honeypot und Mindest-Ausfüllzeit.
 *
 * Das Honeypot-Feld ist für Menschen unsichtbar, für Screenreader verborgen und nicht per Tab
 * erreichbar. Bots füllen es aus, die Server Action verwirft solche Anfragen dann still.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="sr-only">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

/** Liefert beim Absenden Honeypot-Wert und Zeit seit dem Laden des Formulars (ms). */
export function useSpamFields() {
  const start = useRef(0);
  useEffect(() => {
    start.current = performance.now();
  }, []);
  return (form: HTMLFormElement): SpamFields => ({
    website: String(new FormData(form).get("website") ?? ""),
    elapsed: Math.round(performance.now() - start.current),
  });
}

/** Fokus auf das erste Feld mit Fehler in Dokumentreihenfolge (README 10.1). */
export function focusFirstError(form: HTMLFormElement, names: Iterable<string>) {
  const wanted = new Set(names);
  const first = Array.from(form.querySelectorAll<HTMLElement>("[data-field]")).find((el) =>
    wanted.has(el.dataset.field ?? ""),
  );
  first?.focus();
}
