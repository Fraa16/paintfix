"use client";

import { useSyncExternalStore } from "react";

/**
 * Gewähltes Modell der Zusammenarbeit (`avModel`, README 10.4): −1 = keins, sonst Index in `models`.
 * Geteilt zwischen dem Button „Anfragen“ in der Vergleichstabelle (Terms) und den Chips im Formular
 * (Contact), die in getrennten Client-Inseln liegen.
 */
let model = -1;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setAvModel(next: number) {
  if (next === model) return;
  model = next;
  listeners.forEach((l) => l());
}

export function useAvModel(): number {
  return useSyncExternalStore(
    subscribe,
    () => model,
    () => -1,
  );
}
