"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvButton } from "@/components/aviation/Button";
import { AvLogo } from "@/components/aviation/Logo";
import { useDisclosure } from "@/components/shared/useDisclosure";
import {
  aviationAlternatePath,
  aviationPath,
  aviationSectionIds,
  isAviationHome,
  type Locale,
} from "@/content/aviation-meta";
import { cx } from "@/lib/cx";
import type { AvMenu } from "./av-menu";
import { useAvScroll } from "./AvScrollState";
import { getAvLenis } from "./AvSmoothScroll";
import { avUi } from "./ui";

const locales: Locale[] = ["de", "en"];
const MEGA_ID = "av-mega";
const MENU_ID = "av-menu";
const mono = "font-mono text-[11px] leading-[1.4] tracking-[0.06em] uppercase";

/**
 * Header Aviation (README 8.4 Punkt 0): fixed, 84px. Über dem Hero transparent mit Creme-Text,
 * sobald der Inhalt den Header erreicht --av-header-bg + Blur und Navy-Text, Übergang 0.5s. Mit
 * offenem Menü Navy, damit Header und Panel eine Fläche bilden.
 *
 * Ab 1240px Navigation: „Leistungen“ öffnet das Mega-Menü (drei Bereiche mit ihren Leistungen,
 * Heimatbasis, Ops-Kontakt, Angebot), die übrigen Punkte springen zu den Abschnitten. Darunter öffnet
 * „Menü“ ein Panel mit denselben Inhalten. CTA ab 980px. Auf den Seiten je Bereich (/aviation/…)
 * führen die Abschnittslinks zur Aviation-Startseite und der Sprachumschalter zur selben Seite in der
 * anderen Sprache. #av-contact gibt es auf allen Seiten. Verhalten der Menüs in useDisclosure.
 */
export function AvHeader({
  locale,
  nav,
  cta,
  menu,
}: {
  locale: Locale;
  nav: string[];
  cta: string;
  menu: AvMenu;
}) {
  const { over } = useAvScroll();
  const ui = avUi[locale];
  const pathname = usePathname();
  const base = isAviationHome(pathname) ? "" : aviationPath[locale];
  const mobile = useDisclosure(pathname, { flagRoot: true });
  const mega = useDisclosure(pathname, { hover: true });
  const navy = mega.open || mobile.open;

  return (
    <header
      {...mobile.rootProps}
      className={cx(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-[14px] transition-[background-color,color,border-color] duration-500 ease-[ease]",
        navy
          ? "border-av-cream/16 bg-av-navy text-av-cream [--focus:var(--av-gold)]"
          : over
            ? "border-av-navy/12 bg-av-header-bg text-av-navy"
            : "border-av-cream/16 bg-av-navy/0 text-av-cream [--focus:var(--av-gold)]",
      )}
    >
      <div className="mx-auto flex h-av-header max-w-av items-center justify-between gap-6 px-av-gutter">
        <button
          type="button"
          aria-label={ui.toTop}
          onClick={() => {
            mobile.close();
            // Mit Lenis (ab 980px, Bewegung erlaubt) gleitend, sonst nativ (weich über html[data-smooth]).
            const lenis = getAvLenis();
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0 });
          }}
          className="flex items-center"
        >
          <AvLogo />
        </button>

        <nav aria-label={ui.main} className="max-avnav:hidden">
          <ul className="flex items-center gap-[30px] text-[11px] tracking-[0.22em] uppercase">
            <li {...mega.rootProps}>
              <button
                id={mega.triggerId}
                type="button"
                aria-expanded={mega.open}
                aria-controls={MEGA_ID}
                onClick={mega.toggle}
                className="flex items-center gap-2 py-1.5 uppercase hover:opacity-60"
              >
                {menu.label}
                <Chevron open={mega.open} />
              </button>
              <MegaPanel
                menu={menu}
                cta={cta}
                base={base}
                pathname={pathname}
                open={mega.open}
                onNavigate={mega.close}
              />
            </li>
            {nav.slice(1).map((label, i) => (
              <li key={aviationSectionIds[i + 1]}>
                <Link
                  href={`${base}#${aviationSectionIds[i + 1]}`}
                  className="block py-1.5 hover:opacity-60"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-6">
          <LangSwitch locale={locale} pathname={pathname} className="max-wide:hidden" />
          <AvButton href="#av-contact" variant="header" className="max-wide:hidden">
            {cta}
          </AvButton>
          <button
            id={mobile.triggerId}
            type="button"
            aria-expanded={mobile.open}
            aria-controls={MENU_ID}
            onClick={mobile.toggle}
            className="-mr-3 flex size-11 items-center justify-center avnav:hidden"
          >
            <span className="sr-only">{mobile.open ? menu.close : menu.open}</span>
            <MenuIcon open={mobile.open} />
          </button>
        </div>
      </div>

      <MobileMenu
        locale={locale}
        menu={menu}
        nav={nav}
        cta={cta}
        base={base}
        pathname={pathname}
        label={ui.main}
        open={mobile.open}
        onNavigate={mobile.close}
      />
    </header>
  );
}

/**
 * Sprachumschalter DE / EN: in der Leiste ab 980px, darunter im Menü (dort fehlt in der Leiste
 * neben Logo und Menü-Schaltfläche der Platz).
 */
function LangSwitch({
  locale,
  pathname,
  className,
}: {
  locale: Locale;
  pathname: string;
  className?: string;
}) {
  const ui = avUi[locale];
  return (
    <nav
      aria-label={ui.lang}
      className={cx("flex items-center gap-2 text-[11px] tracking-[0.2em]", className)}
    >
      {locales.map((l, i) => (
        <span key={l} className="contents">
          {i > 0 && (
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
          )}
          <Link
            href={aviationAlternatePath(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-label={ui.langNames[l]}
            aria-current={l === locale ? "page" : undefined}
            className={cx(
              "px-0.5 py-1 tracking-normal",
              // Referenz: 0.5, ergibt nur 3,2:1. 0.85 erreicht mindestens 4,6:1, auch über dem
              // Hero-Bild (transparenter Header beim Laden) und auf Creme (Regel 9).
              l === locale ? "opacity-100" : "opacity-85",
            )}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </nav>
  );
}

/** Zwei Linien, offen ein Kreuz. Der Name der Schaltfläche steht daneben als sr-only-Text. */
function MenuIcon({ open }: { open: boolean }) {
  const line =
    "absolute inset-x-0 h-px bg-current transition-transform duration-300 motion-reduce:transition-none";
  return (
    <span aria-hidden="true" className="relative block h-[9px] w-[22px]">
      <span className={cx(line, "top-0", open && "translate-y-1 rotate-45")} />
      <span className={cx(line, "bottom-0", open && "-translate-y-1 -rotate-45")} />
    </span>
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
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function Contact({ menu }: { menu: AvMenu }) {
  return (
    <div>
      <p className={cx(mono, "text-av-on-navy-muted")}>{menu.direct}</p>
      <a
        href={menu.tel}
        className="mt-1 block py-1 text-[15px] transition-colors hover:text-av-gold"
      >
        {menu.phone}
      </a>
      <a
        href={`mailto:${menu.mail}`}
        className="block py-1 text-[15px] transition-colors hover:text-av-gold"
      >
        {menu.mail}
      </a>
    </div>
  );
}

/**
 * Mega-Menü ab 1240px: Navy über die ganze Breite unter dem Header. Drei Spalten je Bereich
 * (Nummer und Kurzname in Mono, Seitenname in Instrument Serif als Link, enthaltene Leistungen),
 * rechts Heimatbasis, Ops-Kontakt und Angebot. Darunter alle Leistungen und der Musterbericht, dann
 * ein abgedunkelter Streifen über der Seite (nur Optik, Klicks gehen durch und schließen das Menü).
 */
function MegaPanel({
  menu,
  cta,
  base,
  pathname,
  open,
  onNavigate,
}: {
  menu: AvMenu;
  cta: string;
  base: string;
  pathname: string;
  open: boolean;
  onNavigate: () => void;
}) {
  return (
    <div
      id={MEGA_ID}
      hidden={!open}
      className="pointer-events-none absolute inset-x-0 top-full text-[15px] tracking-normal normal-case transition-opacity duration-300 ease-(--ease-out) motion-reduce:transition-none starting:opacity-0"
    >
      <div className="pointer-events-auto border-b border-av-cream/16 bg-av-navy text-av-cream">
        <div className="mx-auto grid max-w-av grid-cols-12 gap-x-[clamp(24px,3vw,56px)] px-av-gutter pt-10 pb-10">
          <ul className="col-span-9 grid grid-cols-3 gap-x-[clamp(24px,3vw,56px)]">
            {menu.areas.map((a) => (
              <li key={a.href} className="border-t border-av-cream/16 pt-5">
                <p className={cx(mono, "text-av-gold")}>
                  {a.no} · {a.tab}
                </p>
                <Link
                  href={a.href}
                  onClick={onNavigate}
                  aria-current={a.href === pathname ? "page" : undefined}
                  className="mt-4 block font-serif text-[clamp(28px,2.4vw,36px)] leading-[1.05] transition-colors hover:text-av-gold aria-[current=page]:text-av-gold"
                >
                  {a.name}
                </Link>
                <ul className="mt-5 space-y-2 text-[14px] leading-[1.5] text-av-on-navy">
                  {a.items.map((t) => (
                    <li key={t} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.75em] h-px w-3 flex-none bg-av-gold/60"
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="col-span-3 flex flex-col gap-7 border-t border-av-cream/16 pt-5">
            <div>
              <p className={cx(mono, "text-av-on-navy-muted")}>{menu.base.label}</p>
              <p className="mt-2 font-serif text-[26px] leading-[1.1]">{menu.base.name}</p>
              <p className={cx(mono, "mt-1.5 text-av-gold")}>{menu.base.icao}</p>
            </div>
            <Contact menu={menu} />
            <AvButton
              href="#av-contact"
              variant="cream"
              size="sm"
              onClick={onNavigate}
              className="self-start"
            >
              {cta}
            </AvButton>
          </div>
          <div className="col-span-12 mt-9 flex flex-wrap gap-x-10 gap-y-3 border-t border-av-cream/16 pt-5 text-[11px] tracking-[0.22em] uppercase">
            <Link href={`${base}#av-services`} onClick={onNavigate} className="hover:text-av-gold">
              {menu.all} <span aria-hidden="true">→</span>
            </Link>
            <Link href={`${base}#av-standards`} onClick={onNavigate} className="hover:text-av-gold">
              {menu.report} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="h-screen bg-av-navy/40" />
    </div>
  );
}

/**
 * Menü unter 1240px: Navy-Panel unter dem Header mit den drei Bereichen, allen Abschnitten,
 * Angebot und Ops-Kontakt. Scrollt in sich (Lenis ausgenommen), wenn es höher als der Bildschirm ist.
 */
function MobileMenu({
  locale,
  menu,
  nav,
  cta,
  base,
  pathname,
  label,
  open,
  onNavigate,
}: {
  locale: Locale;
  menu: AvMenu;
  nav: string[];
  cta: string;
  base: string;
  pathname: string;
  label: string;
  open: boolean;
  onNavigate: () => void;
}) {
  return (
    <nav
      id={MENU_ID}
      aria-label={label}
      hidden={!open}
      data-lenis-prevent
      className="max-h-[calc(100svh-var(--av-header-h))] overflow-y-auto overscroll-contain border-t border-av-cream/16 bg-av-navy px-av-gutter pt-6 pb-10 text-av-cream avnav:hidden"
    >
      <p className={cx(mono, "text-av-on-navy-muted")}>{menu.label}</p>
      <ul className="mt-2">
        {menu.areas.map((a) => (
          <li key={a.href} className="border-b border-av-cream/16">
            <Link
              href={a.href}
              onClick={onNavigate}
              aria-current={a.href === pathname ? "page" : undefined}
              className="block py-5"
            >
              <span className={cx(mono, "block text-av-gold")}>
                {a.no} · {a.tab}
              </span>
              <span className="mt-2 block font-serif text-[30px] leading-[1.05]">{a.name}</span>
              <span className="mt-2 block text-[13px] leading-[1.5] text-av-on-navy">
                {a.items.join(" · ")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="mt-8 border-t border-av-cream/16 text-[11px] tracking-[0.22em] uppercase">
        {nav.map((l, i) => (
          <li key={aviationSectionIds[i]}>
            <Link
              href={`${base}#${aviationSectionIds[i]}`}
              onClick={onNavigate}
              className="block border-b border-av-cream/16 py-4"
            >
              {i === 0 ? menu.all : l}
            </Link>
          </li>
        ))}
      </ul>
      <LangSwitch locale={locale} pathname={pathname} className="mt-6 wide:hidden" />
      <div className="mt-8 flex flex-col gap-7">
        <AvButton href="#av-contact" variant="cream" onClick={onNavigate}>
          {cta}
        </AvButton>
        <Contact menu={menu} />
      </div>
    </nav>
  );
}
