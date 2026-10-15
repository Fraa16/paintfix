"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { VehicleClassIndex } from "@/content/fahrzeug";

interface PriceClassValue {
  /** Gewählte Fahrzeugklasse, Standard 0 = Kleinwagen (README 8.2 Punkt 2). */
  cls: VehicleClassIndex;
  setCls: (cls: VehicleClassIndex) => void;
}

const PriceClassContext = createContext<PriceClassValue | null>(null);

/**
 * Hält die gewählte Fahrzeugklasse für alle Preise der Leistungsseite. Rendert den Block, in dem die
 * Klassenleiste klebt (Referenz: <main> ohne CTA).
 * Alles, was als children hineinkommt, bleibt Server-Komponente.
 */
export function PriceClassProvider({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [cls, setCls] = useState<VehicleClassIndex>(0);
  const value = useMemo(() => ({ cls, setCls }), [cls]);

  return (
    <PriceClassContext value={value}>
      <div className={className}>{children}</div>
    </PriceClassContext>
  );
}

export function usePriceClass(): PriceClassValue {
  const ctx = useContext(PriceClassContext);
  if (!ctx) throw new Error("usePriceClass braucht <PriceClassProvider>");
  return ctx;
}
