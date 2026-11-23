import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { mona, mono, serif } from "./fonts";
import { CarAviationLink } from "@/components/fahrzeug/AviationLink";
import { CarButton } from "@/components/fahrzeug/Button";
import { CarLogo } from "@/components/fahrzeug/Logo";
import { LineLink, Mono } from "@/components/fahrzeug/design/ui";

export const metadata: Metadata = {
  title: "Seite nicht gefunden | PaintFix",
};

/**
 * 404 für beide Root-Layouts im Fahrzeug-Stil, auf Schwarz wie die Seitenköpfe. Liegt außerhalb aller
 * Layouts, deshalb hier eigener Kopf mit Logo und eigene Imports von globals.css und Schriften.
 */
export default function GlobalNotFound() {
  return (
    <html lang="de" className={`${mona.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <div
          data-brand="car"
          className="flex min-h-screen flex-col bg-car-ink font-sans font-normal text-car-on-ink [--focus:var(--car-on-ink)]"
        >
          <header className="border-b border-car-ink-line">
            <div className="mx-auto flex h-car-header max-w-car items-center px-car-gutter">
              <Link href="/" aria-label="PaintFix Startseite" className="leading-[normal]">
                <CarLogo />
              </Link>
            </div>
          </header>
          <main className="flex flex-1 items-end">
            <div className="mx-auto w-full max-w-car px-car-gutter py-[clamp(72px,10vw,144px)]">
              <p className="border-t border-car-ink-line pt-4 text-car-on-ink-muted">
                <Mono>Fehler 404</Mono>
              </p>
              <div className="@container">
                <h1 className="mt-[clamp(32px,5vw,72px)] max-w-[14ch] text-[clamp(44px,9cqi,148px)] leading-[0.9] font-semibold tracking-[-0.045em] text-balance">
                  Diese Seite gibt es nicht.
                </h1>
              </div>
              <div className="mt-[clamp(32px,4vw,56px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-8 border-t border-car-on-ink/20 pt-7">
                <p className="max-w-[480px] text-[17px] leading-[1.6] text-car-on-ink-soft">
                  Vielleicht hat sich die Adresse geändert. Von hier aus geht es weiter:
                </p>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  <CarButton href="/" variant="light" size="cta" arrow>
                    Zur Startseite
                  </CarButton>
                  <LineLink href="/leistungen">Leistungen &amp; Preise</LineLink>
                </div>
              </div>
              <CarAviationLink
                tone="onInk"
                size="md"
                arrowClassName="text-[13px]"
                className="mt-10"
              />
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
