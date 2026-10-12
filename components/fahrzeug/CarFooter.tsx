import Link from "next/link";
import type { ReactNode } from "react";
import { CarLogo } from "@/components/fahrzeug/Logo";
import { services } from "@/content/fahrzeug";
import { site } from "@/content/site";

const COLUMNS: ReadonlyArray<{
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}> = [
  {
    title: "Leistungen",
    links: services.map((s) => ({ href: `/leistungen#svc-${s.id}`, label: s.name })),
  },
  {
    title: "Paintfix",
    links: [
      { href: "/#ablauf", label: "Ablauf" },
      { href: "/#standort", label: "Standort" },
      { href: "/anfrage", label: "Termin anfragen" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
      { href: "/agb", label: "AGB" },
    ],
  },
];

/**
 * Footer Fahrzeug (README 8.5, Referenz Zeilen 511–540): schwarz, Logo mit hellem Quadrat und
 * Adresse, drei Linkspalten, unten Inhaberzeile und „Paintfix Aviation ↗“.
 */
export function CarFooter() {
  return (
    <footer className="bg-car-ink leading-[normal] text-car-on-ink [--focus:var(--car-on-ink)]">
      <div className="mx-auto max-w-car px-car-gutter pt-[clamp(56px,6vw,80px)] pb-10">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-x-8 gap-y-10">
          <div className="flex flex-col items-start gap-5">
            <Link href="/" aria-label="Paintfix Startseite">
              <CarLogo tone="light" />
            </Link>
            <p className="text-[14px] leading-[1.7] text-car-on-ink-muted">
              {site.street}
              <br />
              {site.postalCode} {site.city}
            </p>
          </div>
          {COLUMNS.map((col) => (
            <FooterColumn key={col.title} title={col.title}>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-car-on-ink-soft transition-colors hover:text-car-bg"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-car-ink-line pt-6 text-[13px] text-car-input-placeholder">
          {/* Jahr wie in der Referenz fest, damit beim Rendern kein Datum gelesen wird. */}
          <p>© 2026 Paintfix · Inh. {site.owner}</p>
          <Link
            href="/aviation"
            className="flex items-baseline gap-2 text-car-footer-av-link transition-colors hover:text-car-bg"
          >
            <span className="font-cinzel text-[12.8px] font-normal">Paintfix Aviation</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="text-[14px]">
      <h2 className="mb-[18px] text-[12px] tracking-[0.16em] text-car-input-placeholder uppercase">
        {title}
      </h2>
      <ul className="flex flex-col items-start gap-3">{children}</ul>
    </div>
  );
}
