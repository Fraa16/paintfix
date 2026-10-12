"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LiveDot, useOpenStatus } from "@/components/shared/OpeningStatus";
import { site } from "@/content/site";

/** Seiten mit Aktionsleiste (Referenz: carSpace, nur Startseite und Leistungsseite). */
const ROUTES = new Set(["/", "/leistungen"]);

/**
 * Mobile Aktionsleiste Fahrzeug (README 9.10, Referenz Zeilen 543–548), nur unter 980px.
 * Ausgeblendet, solange das Menü offen ist (html[data-menu="open"], gesetzt vom CarHeader).
 * Dazu der 76px hohe schwarze Platzhalter am Seitenende, damit die Leiste den Footer nicht verdeckt.
 */
export function CarActionBar() {
  const pathname = usePathname();
  if (!ROUTES.has(pathname)) return null;
  return <Bar />;
}

function Bar() {
  const status = useOpenStatus();
  return (
    <>
      <div aria-hidden="true" className="h-[76px] bg-car-ink wide:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-60 grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-2.5 border-t border-car-line bg-car-bar-bg px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] leading-[normal] text-car-ink backdrop-blur-[16px] in-data-[menu=open]:hidden wide:hidden">
        <a
          href={site.phoneHref}
          className="flex h-13 items-center justify-center gap-2.5 border border-car-ink text-[15px] font-semibold"
        >
          <LiveDot open={status?.open ?? false} />
          Anrufen
        </a>
        <Link
          href="/anfrage"
          className="flex h-13 items-center justify-center gap-3 bg-car-ink text-[15px] font-semibold text-car-bg"
        >
          Termin anfragen <span aria-hidden="true">→</span>
        </Link>
      </div>
    </>
  );
}
