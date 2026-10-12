"use client";

import { CarAviationLink } from "@/components/fahrzeug/AviationLink";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CarButton } from "@/components/fahrzeug/Button";
import { CarLogo } from "@/components/fahrzeug/Logo";
import { cx } from "@/lib/cx";

const MENU_ID = "car-menu";

const NAV = [
  { href: "/leistungen", label: "Leistungen & Preise" },
  { href: "/#ablauf", label: "Ablauf" },
  { href: "/#standort", label: "Standort" },
] as const;

/**
 * Header Fahrzeug (README 8.1 Punkt 1, Referenz Zeilen 56–91): sticky, 76px.
 * Ab 980px Navigation, „Paintfix Aviation ↗“ und „Termin anfragen“. Darunter Textbutton „Menü“,
 * der ein Panel unter dem Header öffnet. Offenes Menü setzt html[data-menu="open"], damit die
 * mobile Aktionsleiste ausblendet.
 */
export function CarHeader() {
  const pathname = usePathname();
  // Das Menü gilt nur für die Seite, auf der es geöffnet wurde: ein Seitenwechsel schließt es.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const close = () => setOpenOn(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.menu = "open";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenOn(null);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      delete root.dataset.menu;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-car-line-ui bg-car-header-bg backdrop-blur-[16px] backdrop-saturate-160">
      <div className="mx-auto flex h-car-header max-w-car items-center justify-between gap-6 px-car-gutter">
        <Link
          href="/"
          aria-label="Paintfix Startseite"
          onClick={close}
          className="leading-[normal]"
        >
          <CarLogo />
        </Link>

        <nav
          aria-label="Hauptnavigation"
          className="flex items-center gap-9 text-sm leading-[normal] font-medium max-wide:hidden"
        >
          {NAV.map((item) => {
            const active = item.href === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "border-b-[1.5px] py-1.5 transition-colors hover:text-car-red",
                  active ? "border-car-ink" : "border-transparent",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-7">
          <CarAviationLink arrowClassName="text-[12px]" className="max-wide:hidden" />
          <CarButton href="/anfrage" size="header" className="leading-[normal] max-wide:hidden">
            Termin anfragen
          </CarButton>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={MENU_ID}
            onClick={() => setOpenOn(open ? null : pathname)}
            className="h-11 px-1 text-sm leading-[normal] font-semibold wide:hidden"
          >
            {open ? "Schließen" : "Menü"}
          </button>
        </div>
      </div>

      <nav
        id={MENU_ID}
        aria-label="Hauptnavigation"
        hidden={!open}
        className="flex flex-col border-t border-car-line-ui bg-car-bg px-car-gutter pt-2 pb-6 leading-[normal] wide:hidden"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.href === pathname ? "page" : undefined}
            onClick={close}
            className="border-b border-car-line-soft py-[18px] text-[20px] font-semibold font-stretch-110%"
          >
            {item.label}
          </Link>
        ))}
        <CarAviationLink
          size="md"
          onClick={close}
          arrowClassName="text-[16px]"
          className="gap-1 py-[18px]"
        />
      </nav>
    </header>
  );
}
