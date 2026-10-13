import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { cinzel, mona } from "../fonts";
import { siteUrl } from "@/lib/site-url";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { Reveals } from "@/components/shared/motion/Reveals";
import { bootScript } from "@/components/shared/motion/boot";
import { Curtain } from "@/components/shared/curtain/Curtain";

/** Root-Layout für alle deutschen Seiten (Fahrzeug und /aviation). */
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "Paintfix · Fahrzeugaufbereitung in Telgte", template: "%s · Paintfix" },
};

export default function GermanRootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="de"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${mona.variable} ${cinzel.variable}`}
    >
      <body>
        {/* Vor dem ersten Paint: Bewegung erlaubt? Curtain-Übergabe? (boot.ts) */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {/* Markenwechsel-Blende vor dem Inhalt: deckt beim Neuladen ab dem ersten Paint (Curtain.tsx) */}
        <Curtain />
        {children}
        <SmoothScroll />
        <Reveals />
      </body>
    </html>
  );
}
