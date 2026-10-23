import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { cinzel, mona } from "../fonts";
import { siteUrl } from "@/lib/site-url";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { Reveals } from "@/components/shared/motion/Reveals";
import { bootScript } from "@/components/shared/motion/boot";
import { earlyRevealScript } from "@/components/shared/motion/early";
import { Curtain } from "@/components/shared/curtain/Curtain";

/** Root-Layout für /en/aviation. Eigenes Layout, damit <html lang="en"> stimmt. */
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "PaintFix Aviation", template: "%s | PaintFix Aviation" },
  openGraph: { siteName: "PaintFix", locale: "en_GB", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
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
        {/* Nach dem Inhalt, vor der Hydration: Reveal-Verzögerungen, sichtbare Reveals starten (early.ts) */}
        <script
          dangerouslySetInnerHTML={{
            __html: earlyRevealScript(process.env.NODE_ENV === "production"),
          }}
        />
        <SmoothScroll />
        <Reveals />
      </body>
    </html>
  );
}
