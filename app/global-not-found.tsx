import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { cinzel, mona } from "./fonts";
import { CarButton } from "@/components/fahrzeug/Button";
import { CarLogo } from "@/components/fahrzeug/Logo";
import { CarOverline } from "@/components/fahrzeug/Overline";

export const metadata: Metadata = {
  title: "Seite nicht gefunden · Paintfix",
};

/**
 * 404 für beide Root-Layouts im Fahrzeug-Stil. Liegt außerhalb aller Layouts, deshalb hier eigener
 * Kopf mit Logo und eigene Imports von globals.css und Schriften.
 */
export default function GlobalNotFound() {
  return (
    <html lang="de" className={`${mona.variable} ${cinzel.variable}`}>
      <body>
        <div
          data-brand="car"
          className="flex min-h-screen flex-col bg-car-bg font-sans font-normal text-car-ink"
        >
          <header className="border-b border-car-line-ui">
            <div className="mx-auto flex h-car-header max-w-car items-center px-car-gutter">
              <Link href="/" aria-label="Paintfix Startseite" className="leading-[normal]">
                <CarLogo />
              </Link>
            </div>
          </header>
          <main className="flex flex-1 items-center bg-car-surface">
            <div className="mx-auto w-full max-w-car px-car-gutter py-[clamp(72px,10vw,144px)]">
              <CarOverline>Fehler 404</CarOverline>
              <h1 className="mt-7 max-w-[14ch] text-car-h1 leading-[0.94] font-bold tracking-[-0.0175em] text-balance font-stretch-125%">
                Diese Seite gibt es nicht.
              </h1>
              <p className="mt-7 max-w-[480px] text-lg leading-[1.6] text-car-text">
                Vielleicht hat sich die Adresse geändert. Von hier aus geht es weiter:
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <CarButton href="/" arrow>
                  Zur Startseite
                </CarButton>
                <CarButton href="/leistungen" variant="secondary">
                  Leistungen &amp; Preise
                </CarButton>
              </div>
              <Link
                href="/aviation"
                className="mt-9 flex w-fit items-baseline gap-2 leading-[normal] text-av-navy transition-colors hover:text-car-red"
              >
                <span className="font-cinzel text-[16px] font-normal">Paintfix Aviation</span>
                <span aria-hidden="true" className="text-[13px]">
                  ↗
                </span>
              </Link>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
