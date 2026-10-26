"use client";

import Link from "next/link";
import { AvButton } from "@/components/aviation/Button";
import { AvLogo } from "@/components/aviation/Logo";
import { aviationPath, aviationSectionIds, type Locale } from "@/content/aviation-meta";
import { cx } from "@/lib/cx";
import { useAvScroll } from "./AvScrollState";
import { getAvLenis } from "./AvSmoothScroll";
import { avUi } from "./ui";

const locales: Locale[] = ["de", "en"];

/**
 * Header Aviation (README 8.4 Punkt 0, Referenz Zeilen 552–575): fixed, 84px.
 * Über dem Hero transparent mit Creme-Text, sobald der Inhalt den Header erreicht
 * --av-header-bg + Blur und Navy-Text, Übergang 0.5s. Navigation ab 1240px, CTA ab 980px.
 */
export function AvHeader({ locale, nav, cta }: { locale: Locale; nav: string[]; cta: string }) {
  const { over } = useAvScroll();
  const ui = avUi[locale];

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-[14px] transition-[background-color,color,border-color] duration-500 ease-[ease]",
        over
          ? "border-av-navy/12 bg-av-header-bg text-av-navy"
          : "border-av-cream/16 bg-av-navy/0 text-av-cream [--focus:var(--av-gold)]",
      )}
    >
      <div className="mx-auto flex h-av-header max-w-av items-center justify-between gap-6 px-av-gutter">
        <button
          type="button"
          aria-label={ui.toTop}
          onClick={() => {
            // Mit Lenis (ab 980px, Bewegung erlaubt) gleitend, sonst nativ (weich über html[data-smooth]).
            const lenis = getAvLenis();
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0 });
          }}
          className="flex items-center"
        >
          <AvLogo />
        </button>

        <nav aria-label={ui.nav} className="flex items-center gap-[30px] max-avnav:hidden">
          {nav.map((label, i) => (
            <Link
              key={aviationSectionIds[i]}
              href={`#${aviationSectionIds[i]}`}
              className="py-1.5 text-[11px] tracking-[0.22em] uppercase hover:opacity-60"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <nav
            aria-label={ui.lang}
            className="flex items-center gap-2 text-[11px] tracking-[0.2em]"
          >
            {locales.map((l, i) => (
              <span key={l} className="contents">
                {i > 0 && (
                  <span aria-hidden="true" className="opacity-40">
                    /
                  </span>
                )}
                <Link
                  href={aviationPath[l]}
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
          <AvButton href="#av-contact" variant="header" className="max-wide:hidden">
            {cta}
          </AvButton>
        </div>
      </div>
    </header>
  );
}
