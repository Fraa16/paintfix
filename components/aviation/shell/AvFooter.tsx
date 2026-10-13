import Link from "next/link";
import { AvButton } from "@/components/aviation/Button";
import { aviation, type Locale } from "@/content/aviation";
import { telHref } from "./ui";

const LEGAL_HREFS = ["/impressum", "/datenschutz", "/agb"];

function ColLabel({ children }: { children: string }) {
  return <p className="mb-3 text-[10px] tracking-[0.3em] text-av-gold uppercase">{children}</p>;
}

/**
 * Footer Aviation (README 8.4 Punkt 11, Referenz Zeilen 1045–1077): Navy, Wortmarke (Reveal) mit CTA,
 * vier Spalten (Kontakt, Flughäfen, Adresse, Legal), unten Copyright und Link zur Fahrzeug-Seite.
 */
export function AvFooter({ locale }: { locale: Locale }) {
  const av = aviation[locale];
  return (
    <footer className="bg-av-navy text-av-cream [--focus:var(--av-gold)]">
      <div className="mx-auto max-w-av px-av-gutter pt-[clamp(72px,9vw,128px)] pb-10">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-av-line-on-navy pb-[clamp(48px,6vw,80px)]">
          <p data-rv="0" className="flex flex-col gap-[18px]">
            <span className="font-cinzel text-av-wordmark leading-[0.9] font-normal tracking-[0.095em]">
              PAINTFIX
            </span>
            <span className="text-[clamp(11px,1vw,14px)] tracking-[0.62em]">AVIATION</span>
          </p>
          <AvButton href="#av-contact">{av.cta}</AvButton>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-8 gap-y-10 pt-12 text-sm leading-[1.8] text-av-on-navy">
          <div>
            <ColLabel>{av.direct}</ColLabel>
            <div>
              <a href={telHref(av.opsPhone)} className="transition-colors hover:text-av-cream">
                {av.opsPhone}
              </a>
            </div>
            <div>
              <a href={`mailto:${av.opsMail}`} className="transition-colors hover:text-av-cream">
                {av.opsMail}
              </a>
            </div>
          </div>
          <div>
            <ColLabel>{av.baseLabel}</ColLabel>
            <ul>
              {av.bases.map((b) => (
                <li key={b.i}>
                  {b.n} ({b.i})
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ColLabel>{av.footAddrLabel}</ColLabel>
            <address className="not-italic">
              {av.footAddr.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </address>
          </div>
          <div>
            <ColLabel>Legal</ColLabel>
            <ul>
              {av.legal.map((label, i) => (
                <li key={label}>
                  <Link href={LEGAL_HREFS[i]} className="transition-colors hover:text-av-cream">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-av-line-on-navy pt-6 text-[12px] text-av-on-navy-muted">
          <span>{av.footDiv} © 2026</span>
          <Link
            href="/"
            hrefLang="de"
            className="flex items-center gap-2.5 tracking-[0.16em] text-av-cream uppercase transition-colors hover:text-av-gold"
          >
            {av.footCar} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
