"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CarAviationLink } from "@/components/fahrzeug/AviationLink";
import { CarButton } from "@/components/fahrzeug/Button";
import { CarLogo } from "@/components/fahrzeug/Logo";
import type { CarMenu } from "@/components/fahrzeug/car-menu";
import { OpeningStatus } from "@/components/shared/OpeningStatus";
import { useDisclosure } from "@/components/shared/useDisclosure";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";

const MENU_ID = "car-menu";
const MEGA_ID = "car-mega";
const mono = "font-mono text-[11px] leading-[1.4] tracking-[0.06em] uppercase";

const NAV = [
  { href: "/#ablauf", label: "Ablauf" },
  { href: "/#standort", label: "Standort" },
] as const;

/**
 * Header Fahrzeug (README 8.1 Punkt 1): sticky, 76px, dunkles Glas mit hellem Text. Hover und aktive
 * Seite unterstreichen (Signalrot erreicht auf Schwarz nur 3,65:1, Regel 9). Auf der
 * Startseite liegt er fest und transparent über dem Hero und wird nach dem ersten Scrollen dunkel.
 *
 * Ab 980px: „Leistungen & Preise“ öffnet das Mega-Menü (alle Leistungen in zwei Gruppen mit Preis,
 * Vorschaubild, Telefon und Öffnungsstatus), dazu Ablauf, Standort, „PaintFix Aviation ↗“ und
 * „Termin anfragen“. Darunter öffnet „Menü“ ein Panel mit denselben Leistungen und allen Links.
 * Verhalten beider Menüs in useDisclosure (Hover-Absicht, Escape, Klick außerhalb, Seitenwechsel).
 * Die Menüdaten baut das Layout auf dem Server (car-menu.ts).
 */
export function CarHeader({ menu }: { menu: CarMenu }) {
  const pathname = usePathname();
  const mobile = useDisclosure(pathname, { flagRoot: true });
  const mega = useDisclosure(pathname, { hover: true });
  const home = pathname === "/";
  const services = pathname === "/leistungen" || pathname.startsWith("/leistungen/");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!home) return;
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [home]);

  const look = mega.open
    ? "border-car-ink-line bg-car-ink"
    : home && !scrolled && !mobile.open
      ? "border-transparent bg-transparent"
      : cx("border-car-ink-line backdrop-blur-[16px]", home ? "bg-car-ink/85" : "bg-car-ink/92");

  return (
    <header
      {...mobile.rootProps}
      className={cx(
        "top-0 z-40 border-b text-car-on-ink [--focus:var(--car-on-ink)]",
        home ? "fixed inset-x-0 transition-[background-color,border-color] duration-500" : "sticky",
        look,
      )}
    >
      <div className="mx-auto flex h-car-header max-w-car items-center justify-between gap-6 px-car-gutter">
        <Link
          href="/"
          aria-label="PaintFix Startseite"
          onClick={mobile.close}
          className="leading-[normal]"
        >
          <CarLogo />
        </Link>

        <nav aria-label="Hauptnavigation" className="max-wide:hidden">
          <ul className="flex items-center gap-9 text-sm leading-[normal] font-medium">
            <li {...mega.rootProps}>
              <button
                id={mega.triggerId}
                type="button"
                aria-expanded={mega.open}
                aria-controls={MEGA_ID}
                onClick={mega.toggle}
                className={cx(
                  "flex items-center gap-2 border-b-[1.5px] py-1.5 transition-colors hover:border-current",
                  services || mega.open ? "border-current" : "border-transparent",
                )}
              >
                Leistungen &amp; Preise
                <Chevron open={mega.open} />
              </button>
              <MegaPanel menu={menu} open={mega.open} pathname={pathname} onNavigate={mega.close} />
            </li>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block border-b-[1.5px] border-transparent py-1.5 transition-colors hover:border-current"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-7">
          <CarAviationLink tone="onInk" arrowClassName="text-[12px]" className="max-wide:hidden" />
          <CarButton
            href="/anfrage"
            size="header"
            variant="light"
            className="leading-[normal] max-wide:hidden"
          >
            Termin anfragen
          </CarButton>
          <button
            id={mobile.triggerId}
            type="button"
            aria-expanded={mobile.open}
            aria-controls={MENU_ID}
            onClick={mobile.toggle}
            className="h-11 px-1 text-sm leading-[normal] font-semibold wide:hidden"
          >
            {mobile.open ? "Schließen" : "Menü"}
          </button>
        </div>
      </div>

      <MobileMenu menu={menu} open={mobile.open} pathname={pathname} onNavigate={mobile.close} />
    </header>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 10 6"
      className={cx(
        "h-1.5 w-2.5 transition-transform duration-300 motion-reduce:transition-none",
        open && "rotate-180",
      )}
    >
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * Mega-Menü ab 980px: über die ganze Breite unter dem Header. Links zwei Gruppen mit je drei
 * Leistungen (Name, Preis, Kurztext), rechts das Bild der Leistung unter Maus oder Fokus, Telefon und
 * Öffnungsstatus. Darunter ein abgedunkelter Streifen über der Seite (nur Optik, Klicks gehen durch
 * und schließen das Menü). Die Bilder sind dekorativ (alt=""), der Linktext benennt die Leistung.
 */
function MegaPanel({
  menu,
  open,
  pathname,
  onNavigate,
}: {
  menu: CarMenu;
  open: boolean;
  pathname: string;
  onNavigate: () => void;
}) {
  const all = menu.groups.flatMap((g) => g.items);
  const [active, setActive] = useState(() => all.find((i) => i.href === pathname)?.id ?? all[0].id);
  const current = all.find((i) => i.id === active) ?? all[0];

  return (
    <div
      id={MEGA_ID}
      hidden={!open}
      className="pointer-events-none absolute inset-x-0 top-full transition-opacity duration-300 ease-(--ease-out) motion-reduce:transition-none starting:opacity-0"
    >
      <div className="pointer-events-auto border-b border-car-ink-line bg-car-ink">
        <div className="mx-auto grid max-w-car grid-cols-12 gap-x-[clamp(24px,3vw,56px)] px-car-gutter pt-9 pb-10">
          <div className="col-span-8 grid grid-cols-2 gap-x-[clamp(24px,3vw,56px)]">
            {menu.groups.map((g) => (
              <div key={g.label}>
                <p className={cx(mono, "border-b border-car-ink-line pb-3 text-car-on-ink-muted")}>
                  {g.label}
                </p>
                <ul>
                  {g.items.map((it) => (
                    <li key={it.id}>
                      <Link
                        href={it.href}
                        onClick={onNavigate}
                        onPointerEnter={() => setActive(it.id)}
                        onFocus={() => setActive(it.id)}
                        aria-current={it.href === pathname ? "page" : undefined}
                        className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 border-b border-car-ink-line py-4"
                      >
                        <span className="text-[19px] leading-[1.2] font-semibold tracking-[-0.02em] decoration-1 underline-offset-4 group-hover:underline group-aria-[current=page]:underline">
                          {it.name}
                        </span>
                        <span className={cx(mono, "text-car-on-ink-muted")}>{it.price}</span>
                        <span className="col-span-2 mt-1.5 text-[14px] leading-[1.5] text-car-on-ink-muted">
                          {it.short}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 mt-7">
              <Link
                href={menu.overview.href}
                onClick={onNavigate}
                aria-current={menu.overview.href === pathname ? "page" : undefined}
                className="inline-flex gap-2 border-b border-car-on-ink/40 pb-1 text-[15px] font-semibold transition-colors hover:border-car-on-ink"
              >
                {menu.overview.label}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="col-span-4 flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden bg-car-ba-bg">
              {all.map((it) => (
                <Image
                  key={it.id}
                  src={it.image}
                  alt=""
                  fill
                  sizes="(min-width: 980px) 30vw, 1px"
                  className={cx(
                    "object-cover transition-opacity duration-500 motion-reduce:transition-none",
                    it.id === current.id ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
            </div>
            <p className={cx(mono, "mt-3 flex justify-between gap-4 text-car-on-ink-muted")}>
              <span>{current.name}</span>
              {current.caption && <span>{current.caption}</span>}
            </p>
            <div className="mt-auto border-t border-car-ink-line pt-5">
              <p className="text-[15px] leading-[1.5] text-car-on-ink-soft">
                Kostenlose Begutachtung, Festpreis vor Beginn.
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px]">
                <a
                  href={site.phoneHref}
                  className="font-semibold decoration-1 underline-offset-4 hover:underline"
                >
                  {site.phoneDisplay}
                </a>
                <span className="inline-flex items-center gap-2.5 text-car-on-ink-muted">
                  <OpeningStatus />
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="h-screen bg-car-ink/40" />
    </div>
  );
}

/**
 * Menü unter 980px: Panel unter dem Header mit den Leistungen in zwei Gruppen (Name und Preis),
 * Übersicht, Ablauf, Standort, Aviation, Anfrage und Telefon. Scrollt in sich, wenn es höher als der
 * Bildschirm ist.
 */
function MobileMenu({
  menu,
  open,
  pathname,
  onNavigate,
}: {
  menu: CarMenu;
  open: boolean;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <nav
      id={MENU_ID}
      aria-label="Hauptnavigation"
      hidden={!open}
      data-lenis-prevent
      className="max-h-[calc(100svh-var(--car-header-h))] overflow-y-auto overscroll-contain border-t border-car-ink-line bg-car-ink px-car-gutter pt-3 pb-8 leading-[normal] wide:hidden"
    >
      {menu.groups.map((g) => (
        <div key={g.label} className="mt-6">
          <p className={cx(mono, "border-b border-car-ink-line pb-3 text-car-on-ink-muted")}>
            {g.label}
          </p>
          <ul>
            {g.items.map((it) => (
              <li key={it.id}>
                <Link
                  href={it.href}
                  onClick={onNavigate}
                  aria-current={it.href === pathname ? "page" : undefined}
                  className="flex items-baseline justify-between gap-4 border-b border-car-ink-line py-4"
                >
                  <span className="text-[20px] font-semibold tracking-[-0.02em]">{it.name}</span>
                  <span className={cx(mono, "text-car-on-ink-muted")}>{it.price}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Link
        href={menu.overview.href}
        onClick={onNavigate}
        aria-current={menu.overview.href === pathname ? "page" : undefined}
        className="mt-6 inline-flex gap-2 border-b border-car-on-ink/40 pb-1 text-[15px] font-semibold"
      >
        {menu.overview.label}
        <span aria-hidden="true">→</span>
      </Link>
      <ul className="mt-8 border-t border-car-ink-line">
        {NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block border-b border-car-ink-line py-4 text-[18px] font-semibold"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <CarAviationLink
        tone="onInk"
        size="md"
        onClick={onNavigate}
        arrowClassName="text-[16px]"
        className="gap-1 py-[18px]"
      />
      <div className="mt-4 flex flex-col gap-4">
        <CarButton href="/anfrage" variant="light" size="md" arrow onClick={onNavigate}>
          Termin anfragen
        </CarButton>
        <a href={site.phoneHref} className="text-[15px] font-semibold">
          {site.phoneDisplay}
        </a>
      </div>
    </nav>
  );
}
