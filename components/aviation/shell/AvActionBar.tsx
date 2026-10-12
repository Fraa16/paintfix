"use client";

import Link from "next/link";
import { aviationSectionIds } from "@/content/aviation-meta";
import { useRootVar } from "@/components/shared/root-scroll";
import { useAvScroll } from "./AvScrollState";

const CONTACT = aviationSectionIds.indexOf("av-contact");

/**
 * Mobile Aktionsleiste Aviation (README 9.10, Referenz Zeilen 1079–1084): unter 980px fixed unten,
 * „Ops anrufen“ (tel:) und CTA zum Kontaktabschnitt. Ausgeblendet, solange #av-contact aktiv ist.
 */
export function AvActionBar({
  label,
  call,
  tel,
  cta,
}: {
  label: string;
  call: string;
  tel: string;
  cta: string;
}) {
  const { sec } = useAvScroll();
  if (sec === CONTACT) return null;
  return <Bar label={label} call={call} tel={tel} cta={cta} />;
}

/** Eigene Komponente, damit --pf-bar-av nur gesetzt ist, solange die Leiste zu sehen ist. */
function Bar({ label, call, tel, cta }: { label: string; call: string; tel: string; cta: string }) {
  useRootVar("--pf-bar-av", "calc(76px + env(safe-area-inset-bottom))");
  return (
    <nav
      aria-label={label}
      className="fixed inset-x-0 bottom-0 z-60 grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-2.5 border-t border-av-gold/35 bg-av-bar-bg px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] text-[11px] tracking-[0.22em] uppercase backdrop-blur-[16px] [--focus:var(--av-gold)] wide:hidden"
    >
      <a
        href={tel}
        className="flex h-13 items-center justify-center border border-av-cream/50 text-av-cream"
      >
        {call}
      </a>
      <Link
        href="#av-contact"
        className="flex h-13 items-center justify-center bg-av-cream text-av-navy"
      >
        {cta}
      </Link>
    </nav>
  );
}
